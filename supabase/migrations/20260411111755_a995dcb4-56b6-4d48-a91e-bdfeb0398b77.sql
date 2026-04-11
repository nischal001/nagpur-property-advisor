
DROP POLICY "Anyone can create inquiries" ON public.inquiries;
CREATE POLICY "Authenticated users can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
