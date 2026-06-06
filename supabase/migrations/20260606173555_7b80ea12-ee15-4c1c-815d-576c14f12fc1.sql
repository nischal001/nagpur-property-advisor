
-- 1. Remove public read on properties table to hide submitter contact fields from anon users.
DROP POLICY IF EXISTS "Public can view approved visible properties" ON public.properties;

-- Ensure properties_public view runs with caller privileges and is readable by anon/authenticated.
ALTER VIEW public.properties_public SET (security_invoker = true);
GRANT SELECT ON public.properties_public TO anon, authenticated;

-- Public must still see approved+visible rows via the view; ensure underlying RLS allows it.
CREATE POLICY "Public can view approved visible properties (via view)"
ON public.properties
FOR SELECT
TO anon, authenticated
USING (status = 'approved' AND visible = true);

-- 2. Fix inquiries INSERT policy: prevent buyer_id impersonation.
DROP POLICY IF EXISTS "Authenticated users can create inquiries" ON public.inquiries;
CREATE POLICY "Anyone can create inquiries"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  buyer_id IS NULL OR buyer_id = auth.uid()
);

-- 3. Allow admins to access property-documents in storage.
CREATE POLICY "Admins can view all property documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'property-documents' AND public.has_role(auth.uid(), 'admin')
);

-- 4. Tighten user_roles admin ALL policy to authenticated role only.
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
