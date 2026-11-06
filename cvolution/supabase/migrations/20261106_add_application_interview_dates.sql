-- Second interview as its own status, plus one date per application step.
-- Additive only: existing rows stay valid and older clients keep working.
ALTER TABLE public.applications
  DROP CONSTRAINT applications_status_check,
  ADD CONSTRAINT applications_status_check CHECK (status IN ('draft', 'sent', 'interview', 'interview2', 'offer', 'rejected', 'withdrawn')),
  ADD COLUMN interview1_at date,
  ADD COLUMN interview2_at date,
  ADD COLUMN decision_at date;
