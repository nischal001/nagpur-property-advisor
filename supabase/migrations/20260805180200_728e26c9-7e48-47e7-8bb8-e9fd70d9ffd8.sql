DROP POLICY IF EXISTS "Owners and admins can view properties" ON public.properties;
CREATE POLICY "Owners and admins can view properties"
ON public.properties
FOR SELECT
TO authenticated
USING ((seller_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role));