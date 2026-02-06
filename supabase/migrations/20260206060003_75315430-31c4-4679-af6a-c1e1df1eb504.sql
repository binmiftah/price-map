-- Create pending location suggestions table for user-submitted markets
CREATE TABLE public.pending_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'market',
  parent_id UUID REFERENCES public.locations(id),
  suggested_by_ip TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verification_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.pending_locations ENABLE ROW LEVEL SECURITY;

-- Anyone can suggest a location
CREATE POLICY "Anyone can suggest locations"
ON public.pending_locations
FOR INSERT
WITH CHECK (true);

-- Anyone can view pending locations
CREATE POLICY "Anyone can view pending locations"
ON public.pending_locations
FOR SELECT
USING (true);

-- Add market type to locations for Nigerian markets
-- Update type check to include 'market' as valid type
COMMENT ON COLUMN public.locations.type IS 'Location type: country, state, city, lga, or market';

-- Allow anyone to insert locations (for seeding)
CREATE POLICY "Allow location inserts"
ON public.locations
FOR INSERT
WITH CHECK (true);