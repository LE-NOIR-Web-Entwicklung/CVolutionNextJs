/* eslint-disable @typescript-eslint/no-require-imports -- Runs the actual migration in a disposable local PostgreSQL cluster. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { test, before, beforeEach, after } = require('node:test');

const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const binary = (name) => execFileSync('which', [name], { encoding: 'utf8' }).trim();
let directory, pgctl, psql, started = false;
function sql(source) {
  return execFileSync(psql, ['-h', directory, '-p', '55439', '-U', 'postgres', '-d', 'postgres', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1'], { input: source, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}
const literal = (value) => `'${value.replace(/'/g, "''")}'`;
const form = () => ({ applicationType: 'reactive', jobTitle: 'Beratung', company: 'Muster AG', companyStreet: '', companyPostalCode: '', companyCity: '', recipient: '', jobAd: '', jobAdUrl: '', language: 'de-CH' });
const insert = (user = owner, changes = {}) => `INSERT INTO public.applications (user_id, company, job_title, motivation_form) VALUES ('${user}', 'Muster AG', 'Beratung', ${literal(JSON.stringify({ ...form(), ...changes }))}::jsonb)`;
const asUser = (query, user = owner) => `BEGIN; SET LOCAL ROLE authenticated; SET LOCAL "request.jwt.claim.sub" = '${user}'; ${query}; COMMIT;`;

before(() => {
  directory = fs.mkdtempSync('/tmp/cvolution-applications-db-');
  pgctl = binary('pg_ctl');
  psql = binary('psql');
  execFileSync(binary('initdb'), ['-D', path.join(directory, 'data'), '-U', 'postgres', '-A', 'trust', '--no-locale', '-E', 'UTF8'], { stdio: 'pipe' });
  execFileSync(pgctl, ['-D', path.join(directory, 'data'), '-l', path.join(directory, 'postgres.log'), '-o', `-F -h '' -k ${directory} -p 55439`, '-w', 'start'], { stdio: 'pipe' });
  started = true;
  sql(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY);
    INSERT INTO auth.users VALUES ('${owner}'), ('${other}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    GRANT USAGE ON SCHEMA public, auth TO authenticated, anon, service_role;
    GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;
    ${fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261103_create_applications.sql'), 'utf8')}
    ${fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261106_add_application_interview_dates.sql'), 'utf8')}`);
});
beforeEach(() => sql('TRUNCATE public.applications;'));
after(() => {
  if (started) execFileSync(pgctl, ['-D', path.join(directory, 'data'), '-m', 'fast', '-w', 'stop'], { stdio: 'pipe' });
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
});

test('RLS permits owner CRUD and hides every other user', () => {
  sql(`${insert(owner)}; ${insert(other)};`);
  assert.equal(sql(asUser('SELECT count(*) FROM public.applications')), '1');
  assert.equal(sql(asUser("UPDATE public.applications SET notes = 'own note' RETURNING notes")), 'own note');
  assert.equal(sql(asUser(`UPDATE public.applications SET notes = 'attack' WHERE user_id = '${other}' RETURNING id`)), '');
  assert.equal(sql(asUser(`DELETE FROM public.applications WHERE user_id = '${other}' RETURNING id`)), '');
  assert.equal(sql(asUser('DELETE FROM public.applications RETURNING company')), 'Muster AG');
  assert.equal(sql('SELECT count(*) FROM public.applications'), '1');
});

test('anonymous access and spoofed ownership are blocked by PostgreSQL', () => {
  sql(`${insert()};`);
  assert.throws(() => sql('SET ROLE anon; SELECT * FROM public.applications;'));
  assert.equal(sql('SET ROLE authenticated; SELECT count(*) FROM public.applications;'), '0');
  assert.throws(() => sql(asUser(insert(other))));
});

test('identities and creation dates are immutable and updates support optimistic concurrency', () => {
  sql(`${insert()};`);
  const original = sql('SELECT updated_at FROM public.applications');
  const creation = sql('SELECT created_at FROM public.applications');
  assert.equal(sql(asUser(`UPDATE public.applications SET user_id = '${other}', created_at = '2000-01-01', notes = 'first' WHERE updated_at = '${original}' RETURNING user_id`)), owner);
  assert.equal(sql('SELECT created_at FROM public.applications'), creation);
  assert.notEqual(sql('SELECT updated_at FROM public.applications'), original);
  assert.equal(sql(asUser(`UPDATE public.applications SET notes = 'stale overwrite' WHERE updated_at = '${original}' RETURNING notes`)), '');
  assert.equal(sql('SELECT notes FROM public.applications'), 'first');
});

test('database constraints reject malformed forms, unsafe links and mismatched data', () => {
  for (const change of [{ language: 'xx' }, { jobAdUrl: 'javascript:alert(1)' }, { company: 'Mismatch' }, { recipient: [] }, { extra: 'unknown' }, { jobAd: 'x'.repeat(9001) }]) {
    assert.throws(() => sql(`${insert(owner, change)};`));
  }
  sql(`${insert()};`);
  assert.throws(() => sql("UPDATE public.applications SET status = 'admin';"));
  assert.throws(() => sql("UPDATE public.applications SET motivation_form = '{}'::jsonb;"));
  assert.throws(() => sql("UPDATE public.applications SET motivation_form = 'null'::jsonb;"));
  assert.throws(() => sql("UPDATE public.applications SET company = '';"));
});

test('account deletion cascades to its applications and preserves other accounts', () => {
  sql(`${insert(owner)}; ${insert(other)};`);
  assert.equal(sql(`BEGIN; DELETE FROM auth.users WHERE id = '${owner}'; SELECT user_id FROM public.applications; ROLLBACK;`), other);
});

test('the migration can be rolled back transactionally', () => {
  assert.equal(sql("BEGIN; DROP TABLE public.applications; DROP FUNCTION public.set_applications_updated_at(); DROP FUNCTION public.valid_application_motivation_form(jsonb); ROLLBACK; SELECT count(*) FROM public.applications;"), '0');
});

test('subscription migration blocks direct writes while keeping owner reads and deletion', () => {
  sql(`${insert(owner)}; ${insert(other)};`);
  sql(fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261103_require_subscription_for_application_writes.sql'), 'utf8'));
  assert.throws(() => sql(asUser(insert(owner))));
  assert.throws(() => sql(asUser("UPDATE public.applications SET notes = 'bypass'")));
  assert.equal(sql(asUser('SELECT count(*) FROM public.applications')), '1');
  assert.equal(sql(asUser('DELETE FROM public.applications RETURNING company')), 'Muster AG');
  assert.equal(sql('SELECT count(*) FROM public.applications'), '1');
  sql(`SET ROLE service_role; ${insert(owner)}; UPDATE public.applications SET notes = 'server API';`);
  assert.equal(sql("SELECT count(*) FROM public.applications WHERE notes = 'server API'"), '2');
  assert.throws(() => sql(asUser(`SELECT public.claim_application_import('${owner}')`)));
  assert.throws(() => sql(asUser('SELECT * FROM public.application_import_limits')));
  assert.equal(sql(`SET ROLE service_role; SELECT public.claim_application_import('${owner}'); SELECT public.claim_application_import('${owner}'); SELECT public.claim_application_import('${other}');`), 't\nf\nt');
  sql(`UPDATE public.application_import_limits SET requested_at = clock_timestamp() - interval '11 seconds' WHERE user_id = '${owner}';`);
  assert.equal(sql(`SET ROLE service_role; SELECT public.claim_application_import('${owner}');`), 't');
  assert.equal(sql(`BEGIN; DELETE FROM auth.users WHERE id = '${owner}'; SELECT count(*) FROM public.application_import_limits WHERE user_id = '${owner}'; ROLLBACK;`), '0');
});
