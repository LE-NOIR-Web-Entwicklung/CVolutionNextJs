-- Migration Part 1: Add new CEFR enum values to proficiency_level
-- This must be run first and committed before Part 2

-- Add new enum values
ALTER TYPE proficiency_level ADD VALUE IF NOT EXISTS 'a1';
ALTER TYPE proficiency_level ADD VALUE IF NOT EXISTS 'a2';
ALTER TYPE proficiency_level ADD VALUE IF NOT EXISTS 'b1';
ALTER TYPE proficiency_level ADD VALUE IF NOT EXISTS 'b2';
ALTER TYPE proficiency_level ADD VALUE IF NOT EXISTS 'c1';
ALTER TYPE proficiency_level ADD VALUE IF NOT EXISTS 'c2';

-- Note: After running this, you MUST run the second migration file to update existing data
