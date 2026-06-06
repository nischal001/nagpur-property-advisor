
CREATE OR REPLACE FUNCTION public.get_property_submitter(_property_id uuid)
RETURNS TABLE(submitter_name text, submitter_phone text, submitter_email text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.submitter_name, p.submitter_phone, p.submitter_email
  FROM public.properties p
  WHERE p.id = _property_id
    AND (
      public.has_role(auth.uid(), 'admin')
      OR p.seller_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.get_property_submitter(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_property_submitter(uuid) TO authenticated;
