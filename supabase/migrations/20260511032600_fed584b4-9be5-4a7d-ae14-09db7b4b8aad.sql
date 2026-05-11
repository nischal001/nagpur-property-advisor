ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS sold_out boolean NOT NULL DEFAULT false;

-- Allow anon + authenticated users to upload property images (public bucket already)
DO $$ BEGIN
  CREATE POLICY "Anyone can upload property images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'property-images');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
