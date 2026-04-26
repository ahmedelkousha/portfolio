import { Helmet } from "react-helmet-async";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useEffect, useState } from "react";
import { portfolioService } from "@/services/portfolioService";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = "/og-image.png", 
  url = typeof window !== "undefined" ? window.location.origin : "https://ahmedmaher-web.vercel.app" 
}: SEOProps) => {
  const [info, setInfo] = useState<any>(null);
  
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await portfolioService.getPersonalInfo();
        if (data) setInfo(data);
      } catch (error) {
        console.error("SEO data fetch error:", error);
      }
    };
    fetchInfo();
  }, []);
  
  const siteTitle = title || `${info?.name || "Ahmed Maher"} | Full-Stack Developer & SEO Specialist`;
  const siteDescription = description || info?.bio || "Professional portfolio showcasing web development projects, technical skills, and client testimonials.";
  const siteKeywords = keywords || "Full-Stack Developer, React, TypeScript, SEO, Web Development, Portfolio";
  
  // Ensure absolute URL for social images
  const absoluteImage = image.startsWith("http") ? image : `${url}${image}`;

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": info?.name || "Ahmed Maher",
    "url": url,
    "jobTitle": "Full-Stack Developer & SEO Specialist",
    "description": siteDescription,
    "sameAs": [
      info?.linkedin || "#",
      info?.github || "#"
    ]
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content={info?.name || "Ahmed Maher"} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
