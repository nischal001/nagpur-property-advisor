
-- 1. PROFILES: restrict to authenticated users
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- 2. PROPERTIES: split seller vs admin update, lock admin-only fields
DROP POLICY IF EXISTS "Sellers can update their own properties" ON public.properties;

CREATE POLICY "Sellers can update their own properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id AND NOT has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (
    auth.uid() = seller_id
    AND status = (SELECT p.status FROM public.properties p WHERE p.id = properties.id)
    AND verified IS NOT DISTINCT FROM (SELECT p.verified FROM public.properties p WHERE p.id = properties.id)
    AND risk_level IS NOT DISTINCT FROM (SELECT p.risk_level FROM public.properties p WHERE p.id = properties.id)
    AND rera_registered IS NOT DISTINCT FROM (SELECT p.rera_registered FROM public.properties p WHERE p.id = properties.id)
    AND title_verified IS NOT DISTINCT FROM (SELECT p.title_verified FROM public.properties p WHERE p.id = properties.id)
    AND possession_verified IS NOT DISTINCT FROM (SELECT p.possession_verified FROM public.properties p WHERE p.id = properties.id)
    AND visible IS NOT DISTINCT FROM (SELECT p.visible FROM public.properties p WHERE p.id = properties.id)
  );

CREATE POLICY "Admins can update all properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. INQUIRIES: restrict seller access to inquiries on their own properties
DROP POLICY IF EXISTS "Buyers can view their own inquiries" ON public.inquiries;

CREATE POLICY "Users can view relevant inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (
    buyer_id = auth.uid()
    OR has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = inquiries.property_id
        AND p.seller_id = auth.uid()
    )
  );

-- 4. USER_ROLES: explicit restrictive INSERT/UPDATE/DELETE policies (only admins)
-- The existing "Admins can manage all roles" ALL policy lacks WITH CHECK; add explicit ones.
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. STORAGE: property-images uploads must reference a property owned by the uploader
-- Expected path convention: {property_id}/filename.ext
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload property images" ON storage.objects;

CREATE POLICY "Sellers can upload images for their own properties"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id::text = (storage.foldername(name))[1]
        AND p.seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can update their own property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id::text = (storage.foldername(name))[1]
        AND p.seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete their own property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id::text = (storage.foldername(name))[1]
        AND p.seller_id = auth.uid()
    )
  );
