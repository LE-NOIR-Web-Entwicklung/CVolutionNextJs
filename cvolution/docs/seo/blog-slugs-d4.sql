-- SEO-Plan D4: rename blog slugs, titles and excerpts by search intent.
-- Alternative to editing the seven posts in the admin panel by hand.
-- Safe to run before or after deploying the redirects in src/lib/blog-redirects.ts:
-- /blog/[slug] only redirects once the new slug exists.
-- Excerpts are also the meta description (first 155 characters).
-- The article bodies still address readers with "du"; switch them to "Sie" in the admin panel.

begin;

update blog_posts set
  slug = 'bewerbung-kmu-tipps',
  title = 'Bewerbung bei KMU: Was Unternehmer wirklich wollen',
  excerpt = 'Ein Unternehmer erzählt, worauf er bei Bewerbungen achtet – und wie Sie bei KMU in der Schweiz punkten. Mit Tipps für Dossier und Gespräch.'
where slug = 'wie-du-als-kandidat-bei-einem-unternehmer-punkten-kannst-interview-mit-patrick-mollet';

update blog_posts set
  slug = 'braucht-es-noch-ein-motivationsschreiben',
  title = 'Braucht es noch ein Motivationsschreiben?',
  excerpt = 'Viele Firmen verzichten aufs Motivationsschreiben – andere lesen es zuerst. Wann es sich lohnt und wie es in 2026 aussehen sollte.'
where slug = 'motivationsschreiben-ein-relikt-vergangener-tage-oder-ein-gamechanger';

update blog_posts set
  slug = 'bewerbungsstrategie',
  title = 'Bewerbungsstrategie: Weniger bewerben, mehr Zusagen',
  excerpt = 'Warum Massenbewerbungen scheitern und wie Sie mit einer klaren Strategie weniger Bewerbungen schreiben und mehr Einladungen erhalten.'
where slug = 'bewirb-dich-nicht-jetzt-die-richtige-bewerbungsstrategie';

update blog_posts set
  slug = 'absage-trotz-qualifikation',
  title = 'Absage trotz Qualifikation: Gründe und was hilft',
  excerpt = 'Sie passen perfekt und erhalten trotzdem Absagen? Die häufigsten Gründe aus Sicht von Recruitern – und wie Sie sie beheben.'
where slug = 'warum-gute-kandidaten-trotzdem-absagen-erhalten';

update blog_posts set
  slug = 'lohn-nach-beruf-schweiz',
  title = 'Wie viel verdient man als …? Löhne nach Beruf',
  excerpt = 'Lohnspannen für häufige Berufe in der Schweiz – und warum Ihr persönlicher Marktwert davon abweichen kann.'
where slug = 'wie-viel-verdient-man-als';

update blog_posts set
  slug = 'lohntransparenz-schweiz',
  title = 'Lohntransparenz Schweiz: Was gilt, was kommt',
  excerpt = 'Was das Gleichstellungsgesetz verlangt, was die EU-Lohntransparenzrichtlinie für Schweizer Firmen bedeutet und wie Sie davon profitieren.'
where slug = 'die-reise-der-lohntransparenz';

update blog_posts set
  slug = 'nebenjob-schweiz',
  title = 'Nebenjob Schweiz: Regeln, Steuern und gute Ideen',
  excerpt = 'Was Sie beim Nebenjob in der Schweiz beachten müssen: Arbeitsvertrag, AHV, Steuern und Konkurrenzverbot – plus Ideen für Studierende.'
where slug = 'der-perfekte-nebenjob';

commit;
