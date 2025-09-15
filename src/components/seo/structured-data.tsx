"use client";

import Script from 'next/script';

interface StructuredDataProps {
  data: any;
  id?: string;
}

export function StructuredData({ data, id }: StructuredDataProps) {
  return (
    <Script
      id={id || 'structured-data'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

// Website structured data
export function WebsiteStructuredData({
  name,
  description,
  url,
  logo,
  sameAs,
  contactPoint,
}: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
    ...(logo && { logo }),
    ...(sameAs && { sameAs }),
    ...(contactPoint && { contactPoint }),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData data={data} id="website-structured-data" />;
}

// Organization structured data
export function OrganizationStructuredData({
  name,
  description,
  url,
  logo,
  address,
  contactPoint,
  sameAs,
  foundingDate,
}: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
  sameAs?: string[];
  foundingDate?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description,
    url,
    ...(logo && { logo }),
    ...(address && { address }),
    ...(contactPoint && { contactPoint }),
    ...(sameAs && { sameAs }),
    ...(foundingDate && { foundingDate }),
  };

  return <StructuredData data={data} id="organization-structured-data" />;
}

// Person structured data
export function PersonStructuredData({
  name,
  description,
  url,
  image,
  jobTitle,
  worksFor,
  sameAs,
  address,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  jobTitle?: string;
  worksFor?: string;
  sameAs?: string[];
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description,
    url,
    ...(image && { image }),
    ...(jobTitle && { jobTitle }),
    ...(worksFor && { worksFor }),
    ...(sameAs && { sameAs }),
    ...(address && { address }),
  };

  return <StructuredData data={data} id="person-structured-data" />;
}

// Article structured data
export function ArticleStructuredData({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
  url,
  mainEntityOfPage,
  articleSection,
  keywords,
}: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
  url: string;
  mainEntityOfPage?: string;
  articleSection?: string;
  keywords?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    ...(image && { image }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.logo && { logo: publisher.logo }),
    },
    url,
    ...(mainEntityOfPage && { mainEntityOfPage }),
    ...(articleSection && { articleSection }),
    ...(keywords && { keywords }),
  };

  return <StructuredData data={data} id="article-structured-data" />;
}

// Portfolio/Project structured data
export function PortfolioStructuredData({
  name,
  description,
  image,
  url,
  creator,
  dateCreated,
  dateModified,
  keywords,
  genre,
  inLanguage,
}: {
  name: string;
  description: string;
  image?: string;
  url: string;
  creator: {
    name: string;
    url?: string;
  };
  dateCreated?: string;
  dateModified?: string;
  keywords?: string;
  genre?: string;
  inLanguage?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    ...(image && { image }),
    url,
    creator: {
      '@type': 'Person',
      name: creator.name,
      ...(creator.url && { url: creator.url }),
    },
    ...(dateCreated && { dateCreated }),
    ...(dateModified && { dateModified }),
    ...(keywords && { keywords }),
    ...(genre && { genre }),
    ...(inLanguage && { inLanguage }),
  };

  return <StructuredData data={data} id="portfolio-structured-data" />;
}

// Breadcrumb structured data
export function BreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={data} id="breadcrumb-structured-data" />;
}

// FAQ structured data
export function FAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <StructuredData data={data} id="faq-structured-data" />;
}

// Local Business structured data
export function LocalBusinessStructuredData({
  name,
  description,
  url,
  telephone,
  email,
  address,
  openingHours,
  priceRange,
  image,
  sameAs,
}: {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  email?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  sameAs?: string[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    ...(telephone && { telephone }),
    ...(email && { email }),
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    ...(openingHours && { openingHours }),
    ...(priceRange && { priceRange }),
    ...(image && { image }),
    ...(sameAs && { sameAs }),
  };

  return <StructuredData data={data} id="local-business-structured-data" />;
}
