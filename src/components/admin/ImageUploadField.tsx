"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: "square" | "video" | "banner";
  helperText?: string;
  required?: boolean;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  aspectRatio = "video",
  helperText = "PNG, JPG, WebP or SVG up to 5MB",
  required = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    square: "aspect-square max-w-[120px]",
    video: "aspect-[16/9] max-w-[340px]",
    banner: "aspect-[21/9] max-w-[420px]",
  }[aspectRatio];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size check
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File exceeds 5MB size limit.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Image upload failed");
      }

      onChange(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    onChange("");
    setUploadError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-text-subtle uppercase block">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-mono text-accent hover:underline focus:outline-none"
        >
          {showUrlInput ? "Use File Upload" : "Enter External URL"}
        </button>
      </div>

      {showUrlInput ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setUploadError(null);
            }}
            placeholder="https://images.example.com/photo.jpg"
            className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text placeholder:text-text-subtle focus:outline-none focus:border-accent"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            <div className="relative group rounded-lg overflow-hidden border border-border bg-surface-2">
              <div className={`w-full ${aspectClass} overflow-hidden bg-black/20 flex items-center justify-center`}>
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-cover"
                  onError={() => setUploadError("Failed to render preview. Check image URL.")}
                />
              </div>

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-md bg-surface-1 border border-border px-3 py-1.5 text-xs font-mono font-medium text-text hover:bg-surface-3 transition-colors flex items-center gap-1.5 shadow"
                >
                  <Upload className="w-3.5 h-3.5 text-accent" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-md bg-danger/20 border border-danger/40 px-3 py-1.5 text-xs font-mono font-medium text-danger hover:bg-danger/30 transition-colors flex items-center gap-1.5 shadow"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`rounded-lg border-2 border-dashed border-border hover:border-accent/60 bg-surface-2/40 hover:bg-surface-2 p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${aspectClass} text-center`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                  <span className="text-xs font-mono text-text-muted">Uploading securely...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 rounded-full bg-surface-3 text-text-subtle">
                    <Upload className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-xs font-medium text-text">
                    Click to browse or drop image
                  </div>
                  <div className="text-[11px] text-text-muted font-mono">
                    {helperText}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-danger font-mono mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {value && !uploadError && (
        <div className="flex items-center gap-1 text-[11px] font-mono text-text-subtle truncate">
          <CheckCircle2 className="w-3 h-3 text-accent shrink-0" />
          <span className="truncate">{value}</span>
        </div>
      )}
    </div>
  );
}
