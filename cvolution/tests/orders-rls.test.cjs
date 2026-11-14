/* eslint-disable @typescript-eslint/no-require-imports -- Replays the order migrations in a disposable local PostgreSQL cluster. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { test, before, after } = require('node:test');

const port = '55440';
const migration = (name) => fs.readFileSync(path.join(__dirname, '../supabase/migrations', name), 'utf8');
const binary = (name) => execFileSync('which', [name], { encoding: 'utf8' }).trim();
let directory, pgctl, psql, started = false;
function sql(source) {
  return execFileSync(psql, ['-h', directory, '-p', port, '-U', 'postgres', '-d', 'postgres', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1'], { input: source, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}
const as = (role, query) => sql(`BEGIN; SET LOCAL ROLE ${role}; ${query}; COMMIT;`);

before(() => {
  directory = fs.mkdtempSync('/tmp/cvolution-orders-db-');
  pgctl = binary('pg_ctl');
  psql = binary('psql');
  execFileSync(binary('initdb'), ['-D', path.join(directory, 'data'), '-U', 'postgres', '-A', 'trust', '--no-locale', '-E', 'UTF8'], { stdio: 'pipe' });
  execFileSync(pgctl, ['-D', path.join(directory, 'data'), '-l', path.join(directory, 'postgres.log'), '-o', `-F -h '' -k ${directory} -p ${port}`, '-w', 'start'], { stdio: 'pipe' });
  started = true;
  sql(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
    GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
    CREATE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN RETURN NEW; END $$;
    ${migration('20260130_create_orders_table.sql')}
    ${migration('20260430_create_coupons_and_order_pricing.sql')}
    ${migration('20261106_create_service_downloads.sql')}
    -- Supabase grants every API role full table and function privileges by default.
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
    INSERT INTO public.orders (email, service_type, service_label, salary_file_base64) VALUES ('kunde@example.ch', 'service-salary', 'Lohnanalyse', 'cGF5c2xpcA==');
    INSERT INTO public.coupons (code, discount_type, discount_value, applicable_services, starts_at, ends_at)
      VALUES ('TEST10', 'percent', 10, ARRAY['service-cv'], now() - interval '1 day', now() + interval '1 day');`);
});
after(() => {
  if (started) execFileSync(pgctl, ['-D', path.join(directory, 'data'), '-m', 'fast', '-w', 'stop'], { stdio: 'pipe' });
  if (directory) fs.rmSync(directory, { recursive: true, force: true });
});

test('the original order policies expose every order to the anon key', () => {
  assert.equal(as('anon', 'SELECT count(*) FROM public.orders WHERE salary_file_base64 IS NOT NULL'), '1');
  assert.equal(as('anon', "UPDATE public.orders SET status = 'paid' RETURNING status"), 'paid');
  sql("UPDATE public.orders SET status = 'pending'");
});

test('the lockdown migration removes all browser access to orders and server-only data', () => {
  sql(migration('20261114_lock_down_orders.sql'));
  const couponId = sql("SELECT id FROM public.coupons WHERE code = 'TEST10'");
  for (const role of ['anon', 'authenticated']) {
    assert.throws(() => as(role, 'SELECT * FROM public.orders'), /permission denied/, role);
    assert.throws(() => as(role, "UPDATE public.orders SET status = 'paid'"), /permission denied/, role);
    assert.throws(() => as(role, "INSERT INTO public.orders (email, service_type, service_label) VALUES ('x@example.ch', 'service-cv', 'CV')"), /permission denied/, role);
    assert.throws(() => as(role, 'SELECT * FROM public.coupons'), /permission denied/, role);
    assert.throws(() => as(role, 'SELECT * FROM public.service_download_grants'), /permission denied/, role);
    assert.throws(() => as(role, 'SELECT * FROM public.service_download_items'), /permission denied/, role);
    assert.throws(() => as(role, `SELECT public.redeem_coupon('${couponId}')`), /permission denied/, role);
    assert.throws(() => as(role, 'SELECT public.handle_new_user()'), /permission denied/, role);
  }
  assert.equal(sql("SELECT status FROM public.orders"), 'pending');
});

test('the server (service role) keeps full order and coupon access', () => {
  const couponId = sql("SELECT id FROM public.coupons WHERE code = 'TEST10'");
  assert.equal(as('service_role', "INSERT INTO public.orders (email, service_type, service_label) VALUES ('neu@example.ch', 'service-cv', 'CV') RETURNING email"), 'neu@example.ch');
  assert.equal(as('service_role', "UPDATE public.orders SET status = 'paid' WHERE email = 'neu@example.ch' RETURNING status"), 'paid');
  assert.equal(as('service_role', 'SELECT count(*) FROM public.orders'), '2');
  assert.equal(as('service_role', `SELECT public.redeem_coupon('${couponId}')`), 't');
  assert.equal(sql("SELECT redemption_count FROM public.coupons WHERE code = 'TEST10'"), '1');
});
