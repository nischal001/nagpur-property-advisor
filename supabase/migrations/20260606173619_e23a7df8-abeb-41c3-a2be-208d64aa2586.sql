
DROP POLICY IF EXISTS "Public can view approved visible properties (via view)" ON public.properties;
ALTER VIEW public.properties_public SET (security_invoker = false);
GRANT SELECT ON public.properties_public TO anon, authenticated;
