-- Drop the existing check constraint and add a new one that includes 'market'
ALTER TABLE public.locations DROP CONSTRAINT IF EXISTS locations_type_check;

-- Add new check constraint that includes 'market' type
ALTER TABLE public.locations ADD CONSTRAINT locations_type_check 
CHECK (type IN ('country', 'state', 'city', 'area', 'lga', 'market'));