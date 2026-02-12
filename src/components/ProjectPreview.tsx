import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectPreviewProps {
  url: string;
  title: string;
}

export const ProjectPreview = ({ url, title }: ProjectPreviewProps) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isValidUrl = url && url !== "#";

  useEffect(() => {
    if (!isValidUrl) {
      setHasError(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [url, isValidUrl]);

  if (hasError || !isValidUrl) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-cyan-blue opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold gradient-text opacity-50">
            {title
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Loading state */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">Loading preview...</span>
            </div>
          </div>
        </div>
      )}

      {/* Live iframe preview */}
      <iframe
        src={url}
        title={`${title} website preview`}
        className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-700 pointer-events-none ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: "scale(0.5)",
          transformOrigin: "top left",
          width: "200%",
          height: "200%",
        }}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </>
  );
};
