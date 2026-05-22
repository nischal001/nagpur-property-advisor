import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
}

const SITE_URL = 'https://nagpurpropertyadvisor.com';
const DEFAULT_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/Wx7NrZVcROPc8bgdgUi0TPa1OMD3/social-images/social-1775927416704-NP.webp';

const SEO = ({ title, description, canonical, image = DEFAULT_IMAGE, type = 'website', jsonLd, noindex }: SEOProps) => {
  const url = canonical ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`) : SITE_URL;
  const fullTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
  const desc = description.length > 160 ? description.slice(0, 157) + '...' : description;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Nagpur Property Advisor" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;

export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Nagpur Property Advisor',
  url: SITE_URL,
  logo: `${SITE_URL}/placeholder.svg`,
  description: 'Premium, trust-first real estate consultancy in Nagpur with verified properties, V-Audit™ legal checks, and 2% managed brokerage.',
  telephone: '+91-80106-15388',
  areaServed: { '@type': 'City', name: 'Nagpur' },
  address: { '@type': 'PostalAddress', addressLocality: 'Nagpur', addressRegion: 'Maharashtra', addressCountry: 'IN' },
};
