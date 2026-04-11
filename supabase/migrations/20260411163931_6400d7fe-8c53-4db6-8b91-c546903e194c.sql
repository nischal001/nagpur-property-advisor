ALTER TABLE public.properties ADD COLUMN visible boolean NOT NULL DEFAULT true;

DROP POLICY "Approved properties are viewable by everyone" ON public.properties;

CREATE POLICY "Approved visible properties are viewable by everyone"
  ON public.properties FOR SELECT
  USING (
    (status = 'approved' AND visible = true)
    OR seller_id = auth.uid()
    OR has_role(auth.uid(), 'admin'::app_role)
  );