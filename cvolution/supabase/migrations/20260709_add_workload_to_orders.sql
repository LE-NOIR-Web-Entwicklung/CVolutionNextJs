-- Pensum (Arbeitspensum in %) fuer Lohnanalyse-Bestellungen
ALTER TABLE orders ADD COLUMN IF NOT EXISTS workload TEXT;
