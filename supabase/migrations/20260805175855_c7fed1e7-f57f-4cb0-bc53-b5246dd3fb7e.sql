REVOKE SELECT ON TABLE public.properties FROM anon, authenticated;
GRANT SELECT (id, title, description, price, location, property_type, area, area_unit, approval_type, status, verified, rera_registered, title_verified, possession_verified, risk_level, seller_id, images, created_at, updated_at, visible, sold_out) ON TABLE public.properties TO anon, authenticated;
GRANT INSERT ON TABLE public.properties TO anon, authenticated;
GRANT UPDATE, DELETE ON TABLE public.properties TO authenticated;
GRANT ALL ON TABLE public.properties TO service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;