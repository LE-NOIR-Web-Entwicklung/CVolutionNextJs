-- Migration Part 2: Migrate existing language data to new CEFR values
-- Run this AFTER the first migration has been committed

-- Migrate existing data from old values to new CEFR values
UPDATE languages SET proficiency = 'a2' WHERE proficiency = 'beginner';
UPDATE languages SET proficiency = 'b1' WHERE proficiency = 'intermediate';
UPDATE languages SET proficiency = 'b2' WHERE proficiency = 'advanced';
UPDATE languages SET proficiency = 'c1' WHERE proficiency = 'expert';
-- 'native' remains as is

-- Note: The old enum values (beginner, intermediate, advanced, expert) will remain in the enum
-- but are no longer used. They cannot be removed without recreating the enum type.
