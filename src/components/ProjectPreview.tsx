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

  // Use provided image or null
  const [imgSrc, setImgSrc] = useState<string | null>(image || null);

  useEffect(() => {
    if (image) {
      setImgSrc(image);
      setHasError(false);
    } else {
      setImgSrc(null);
      setHasError(true);
    }
  }, [image]);

  if (hasError || !imgSrc) {
    return (
      <div className="absolute inset-0 bg-muted flex items-center justify-center p-6 text-center">
        <div className="space-y-2 opacity-30">
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

      {/* Main Image (Uploaded only) */}
      <img
        src={imgSrc}
        alt={`${title} preview`}
        onLoad={() => setIsReady(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ${isReady ? "opacity-100 scale-100" : "opacity-0 scale-105"
          } group-hover:scale-105`}
      />

      {/* Subtle overlay for better text readability if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
};
