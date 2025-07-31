import { Metadata } from "next";

// Base URL for the site
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://yourportfolio.com";

// Default SEO configuration
export const DEFAULT_SEO = {
  title: "Developer Portfolio | High-Converting Web Development",
  description:
    "Professional web developer specializing in React, Next.js, and high-converting digital experiences. Building exceptional web applications that drive results.",
  keywords:
    "web developer, React developer, Next.js, frontend developer, full-stack developer, e-commerce development, SaaS development",
  author: "Professional Web Developer",
  siteName: "Developer Portfolio",
  locale: "en_US",
  type: "website",
};

// Generate Open Graph image URL
export const generateOGImageUrl = (
  title: string,
  description?: string
): string => {
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
  });
  return `${BASE_URL}/api/og?${params.toString()}`;
};

// Generate structured data for Person/Developer
export const generatePersonStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Professional Web Developer",
  jobTitle: "Full-Stack Web Developer",
  description:
    "Professional full-stack developer specializing in React, Next.js, and high-converting digital experiences.",
  url: BASE_URL,
  image: `${BASE_URL}/images/profile.jpg`,
  sameAs: [
    "https://github.com/developer",
    "https://linkedin.com/in/developer",
    "https://twitter.com/developer",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Web Development",
    "Frontend Development",
    "Full-Stack Development",
    "E-commerce Development",
    "SaaS Development",
    "Performance Optimization",
    "SEO",
    "Accessibility",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Web Developer",
    occupationLocation: {
      "@type": "Place",
      name: "San Francisco, CA",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Francisco",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    estimatedSalary: {
      "@type": "MonetaryAmountDistribution",
      name: "base",
      currency: "USD",
      duration: "P1Y",
      minValue: 80000,
      maxValue: 150000,
    },
  },
  offers: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Web Development Services",
      description:
        "Custom web development, React applications, e-commerce platforms, and SaaS solutions",
      serviceType: "Web Development",
      areaServed: "Worldwide",
    },
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-0123",
    contactType: "customer service",
    email: "hello@yourportfolio.com",
    availableLanguage: "English",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
      validFrom: "2025-01-01",
      validThrough: "2025-12-31",
    },
  },
});

// Generate structured data for Organization/Business
export const generateOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Developer Portfolio",
  alternateName: "Professional Web Development Services",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  image: `${BASE_URL}/images/og-home.jpg`,
  description:
    "Professional web development services specializing in React, Next.js, and high-converting digital experiences.",
  foundingDate: "2023",
  founder: {
    "@type": "Person",
    name: "Professional Web Developer",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-0123",
    contactType: "customer service",
    email: "hello@yourportfolio.com",
    availableLanguage: "English",
  },
  sameAs: [
    "https://github.com/developer",
    "https://linkedin.com/in/developer",
    "https://twitter.com/developer",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Web Development Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "React Application Development",
          description:
            "Custom React applications with modern features and optimal performance",
        },
        priceRange: "$2,500 - $15,000",
        availability: "InStock",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "E-commerce Platform Development",
          description:
            "High-converting online stores with payment integration and inventory management",
        },
        priceRange: "$5,000 - $25,000",
        availability: "InStock",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SaaS Platform Development",
          description:
            "Scalable software-as-a-service platforms with user management and analytics",
        },
        priceRange: "$10,000 - $50,000",
        availability: "InStock",
      },
    ],
  },
});

// Generate structured data for WebSite
export const generateWebSiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Developer Portfolio",
  alternateName: "Professional Web Development Services",
  url: BASE_URL,
  description:
    "Professional web developer portfolio showcasing React, Next.js, and high-converting digital experiences.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  creator: {
    "@type": "Person",
    name: "Professional Web Developer",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

// Generate structured data for BreadcrumbList
export const generateBreadcrumbStructuredData = (
  breadcrumbs: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((breadcrumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: breadcrumb.name,
    item: `${BASE_URL}${breadcrumb.url}`,
  })),
});

// Generate metadata for pages
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export const generateMetadata = (config: SEOConfig): Metadata => {
  const {
    title,
    description,
    keywords,
    path,
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
  } = config;

  const fullTitle = title.includes("Developer Portfolio")
    ? title
    : `${title} | Developer Portfolio`;
  const url = `${BASE_URL}${path}`;
  const ogImage = image || generateOGImageUrl(title, description);

  return {
    title: fullTitle,
    description,
    keywords: keywords || DEFAULT_SEO.keywords,
    authors: [{ name: author || DEFAULT_SEO.author }],
    creator: author || DEFAULT_SEO.author,
    publisher: DEFAULT_SEO.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: DEFAULT_SEO.siteName,
      locale: DEFAULT_SEO.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@developer", // Update with actual Twitter handle
      site: "@developer", // Update with actual Twitter handle
    },
    alternates: {
      canonical: url,
    },
    other: {
      "theme-color": "#000000",
      "color-scheme": "light dark",
      "format-detection": "telephone=no",
    },
  };
};

// Generate FAQ structured data
export const generateFAQStructuredData = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Generate Service structured data
export const generateServiceStructuredData = (service: {
  name: string;
  description: string;
  priceRange?: string;
  serviceType: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  serviceType: service.serviceType,
  provider: {
    "@type": "Person",
    name: "Professional Web Developer",
    url: BASE_URL,
  },
  areaServed: "Worldwide",
  ...(service.priceRange && { priceRange: service.priceRange }),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: service.name,
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
        ...(service.priceRange && { priceRange: service.priceRange }),
        availability: "InStock",
      },
    ],
  },
});

// Generate Review/Rating structured data
export const generateReviewStructuredData = (
  reviews: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>
) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Developer Portfolio",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue:
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  },
  review: reviews.map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  })),
});
