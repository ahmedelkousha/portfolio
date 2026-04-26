import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Image as ImageIcon } from "lucide-react";

interface ProjectPreviewProps {
  url: string;
  title: string;
  image?: string;
}

export const ProjectPreview = ({ url, title, image }: ProjectPreviewProps) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isValidUrl = url && url !== "#";
  
  // Determine initial image source
  // If image is provided, use it. Otherwise, if url is valid, try microlink screenshot.
  const [imgSrc, setImgSrc] = useState<string>(
    image || (isValidUrl ? `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url` : "")
  );

  useEffect(() => {
    // Update imgSrc if image or url changes
    if (image) {
      setImgSrc(image);
    } else if (isValidUrl) {
      setImgSrc(`https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`);
    } else {
      setHasError(true);
    }
  }, [image, url, isValidUrl]);

  if (hasError || (!image && !isValidUrl)) {
    return (
      <div className="absolute inset-0 bg-muted flex items-center justify-center p-6 text-center">
        <div className="space-y-2 opacity-50">
          <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-xs font-mono uppercase tracking-widest">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-muted overflow-hidden">
      {/* Loading indicator (Skeleton) */}
      {!isReady && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      {/* Main Image (Custom or Auto-Screenshot) */}
      <img
        src={imgSrc}
        alt={`${title} preview`}
        onLoad={() => setIsReady(true)}
        onError={() => {
          // Fallback logic if the primary image fails
          if (imgSrc === image && isValidUrl) {
            // If the custom image failed, try microlink
            setImgSrc(`https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`);
          } else {
            setHasError(true);
          }
        }}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isReady ? "opacity-100 scale-100" : "opacity-0 scale-105"
        } group-hover:scale-105`}
      />
      
      {/* Subtle overlay for better text readability if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
};
