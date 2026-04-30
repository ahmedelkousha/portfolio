import React, { useState, useRef } from "react";
import { storage, BUCKET_ID, PROJECT_ID } from "@/lib/appwrite";
import { ID } from "appwrite";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export const ImageUpload = ({ value, onChange, folder = "uploads" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Appwrite Storage upload
      const response = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );

      // Manually construct the URL for better reliability
      const fileId = response.$id;
      const baseUrl = import.meta.env.PPV_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
      const fileUrl = `${baseUrl}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
      
      onChange(fileUrl);
      setProgress(100);
    } catch (error: any) {
      console.error("Appwrite Upload Error Detail:", error);
      alert(`Upload failed: ${error.message || "Unknown error"}. Check console for details.`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Project Image
        </label>
        {value && (
          <button
            onClick={handleRemove}
            className="text-[10px] flex items-center text-destructive hover:underline font-bold uppercase tracking-tighter"
          >
            <X size={12} className="mr-1" /> Remove
          </button>
        )}
      </div>

      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative aspect-video w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
          ${value ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}
          ${uploading ? "cursor-wait opacity-80" : ""}
        `}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
        />

        {value ? (
          <div className="group relative w-full h-full">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                Change Image
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            {uploading ? (
              <>
                <div className="relative">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {Math.round(progress)}%
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <div className="p-4 bg-muted rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">Click to upload</p>
                  <p className="text-[10px] uppercase tracking-widest mt-1">PNG, JPG or WEBP</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
