
-- Make the public view safe (caller-privileges) again
ALTER VIEW public.properties_public SET (security_invoker = true);

-- Recreate the public SELECT policy on properties (column-level grants will hide submitter_*)
CREATE POLICY "Public can view approved visible properties"
ON public.properties
FOR SELECT
TO anon, authenticated
USING (status = 'approved' AND visible = true);

-- Revoke broad SELECT and re-grant only non-sensitive columns to anon/authenticated
REVOKE SELECT ON public.properties FROM anon, authenticated;

GRANT SELECT (
  id, title, description, price, location, property_type, area, area_unit,
  approval_type, images, status, visible, sold_out, verified, risk_level,
  possession_verified, title_verified, rera_registered, seller_id,
  created_at, updated_at
) ON public.properties TO anon, authenticated;

-- service_role keeps full access (edge functions / admin paths)
GRANT ALL ON public.properties TO service_role;
