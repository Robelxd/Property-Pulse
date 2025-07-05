
-- First, let's check what the constraint allows
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.properties'::regclass 
AND contype = 'c';

-- Also check if there are any existing properties to see what values work
SELECT DISTINCT property_type FROM public.properties;
