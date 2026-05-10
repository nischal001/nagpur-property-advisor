ALTER TABLE public.properties 
  ADD COLUMN IF NOT EXISTS submitter_name text,
  ADD COLUMN IF NOT EXISTS submitter_phone text,
  ADD COLUMN IF NOT EXISTS submitter_email text;