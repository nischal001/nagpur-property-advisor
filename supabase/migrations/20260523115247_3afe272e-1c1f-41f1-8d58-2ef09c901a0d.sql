
-- 1. Properties: hide submitter PII from public, expose via view
DROP POLICY IF EXISTS "Approved visible properties are viewable by everyone" ON public.properties;

CREATE POLICY "Owners and admins can view properties"
  ON public.properties FOR SELECT
  USING (
    (seller_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE OR REPLACE VIEW public.properties_public
WITH (security_invoker = on) AS
SELECT
  id, title, description, price, location, property_type,
  area, area_unit, approval_type, images, status, visible,
  sold_out, verified, risk_level, possession_verified,
  title_verified, rera_registered, seller_id,
  created_at, updated_at
FROM public.properties
WHERE status = 'approved' AND visible = true;

GRANT SELECT ON public.properties_public TO anon, authenticated;

-- Allow the view's underlying SELECT (security_invoker) to read approved+visible rows
CREATE POLICY "Public can view approved visible properties"
  ON public.properties FOR SELECT
  USING (status = 'approved' AND visible = true);

-- NOTE: The above re-opens base table SELECT including submitter_*.
-- To truly hide PII we must drop that and rely on the view + a definer function.
-- Simpler safe approach: revoke direct column access on submitter_* via a stricter policy
-- using column privileges.
DROP POLICY IF EXISTS "Public can view approved visible properties" ON public.properties;

-- Revoke direct table SELECT from anon and grant only column-level SELECT excluding PII
REVOKE SELECT ON public.properties FROM anon;
REVOKE SELECT ON public.properties FROM authenticated;

GRANT SELECT
  (id, title, description, price, location, property_type,
   area, area_unit, approval_type, images, status, visible,
   sold_out, verified, risk_level, possession_verified,
   title_verified, rera_registered, seller_id,
   created_at, updated_at)
  ON public.properties TO anon, authenticated;

-- Re-add public SELECT policy for non-PII columns on approved+visible rows
CREATE POLICY "Public can view approved visible properties"
  ON public.properties FOR SELECT
  USING (status = 'approved' AND visible = true);

-- 2. Profiles: restrict to self + admin
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Documents: drop anon insert, add delete policy
DROP POLICY IF EXISTS "Anyone can insert property documents" ON public.documents;

CREATE POLICY "Owners and admins can delete documents"
  ON public.documents FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- 4. Storage: tighten policies
DROP POLICY IF EXISTS "Anyone can upload property documents" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can upload property images" ON storage.objects;
CREATE POLICY "Anon can upload only to submissions folder"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = 'submissions'
  );

-- 5. Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
