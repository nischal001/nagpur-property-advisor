-- Allow guest (unauthenticated) property submissions
DROP POLICY IF EXISTS "Sellers can insert their own properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON public.properties;

CREATE POLICY "Anyone can submit properties"
  ON public.properties FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND seller_id IS NULL)
    OR (auth.uid() = seller_id)
  );

-- Allow guest document uploads tied to their submitted property
DROP POLICY IF EXISTS "Sellers can insert documents for their properties" ON public.documents;
DROP POLICY IF EXISTS "Users can insert documents" ON public.documents;

CREATE POLICY "Anyone can insert property documents"
  ON public.documents FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND uploaded_by IS NULL)
    OR (auth.uid() = uploaded_by)
  );

-- Allow guest uploads to property-documents storage bucket
DROP POLICY IF EXISTS "Authenticated users can upload property documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload property documents" ON storage.objects;

CREATE POLICY "Anyone can upload property documents"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'property-documents');
