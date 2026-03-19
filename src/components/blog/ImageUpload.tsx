'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string, file: File) => void;
  onError?: (error: string) => void;
  maxSize?: number; // in MB
}

export default function ImageUpload({
  onUpload,
  onError,
  maxSize = 10,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validation
    if (!file.type.startsWith('image/')) {
      const err = 'Please select an image file (jpg, png, webp, etc.)';
      setError(err);
      onError?.(err);
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      const err = `File size must be less than ${maxSize}MB`;
      setError(err);
      onError?.(err);
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'posts-images');

      // Simulate progress (real progress would come from fetch events)
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 100);

      // Upload to API
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch {
          // Server returned non-JSON response (e.g. HTML error page)
          errorMessage = `Upload failed (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setProgress(100);

      // Simulate complete with delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUploadedUrl(data.url);
      onUpload(data.url, file);

      // Auto-clear after 3 seconds
      setTimeout(() => {
        setUploadedUrl(null);
        setProgress(0);
        setIsUploading(false);
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    const file = files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-foreground bg-muted/40'
            : 'border-border/60 hover:border-foreground/40 bg-muted/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <>
              <div className="w-12 h-12 rounded-full border-4 border-border/40 border-t-foreground animate-spin" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Uploading... {progress}%
                </p>
                <div className="mt-2 w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          ) : uploadedUrl ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Upload successful!
              </p>
              <p className="text-xs text-muted-foreground break-all">
                {uploadedUrl}
              </p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drag and drop your image here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to select (max {maxSize}MB)
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 bg-foreground text-background text-sm rounded-lg transition-colors hover:bg-foreground/90"
              >
                Select Image
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-destructive/30 bg-destructive/5">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
            <p className="text-xs text-destructive/70 mt-1">
              Please try again or contact support if the problem persists.
            </p>
          </div>
          <button
            onClick={() => setError(null)}
            className="flex-shrink-0 text-destructive hover:text-destructive/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Copy URL button (when upload is complete) */}
      {uploadedUrl && !isUploading && (
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(uploadedUrl);
          }}
          className="w-full px-4 py-2 text-sm bg-muted hover:bg-muted/70 rounded-lg font-medium text-foreground transition-colors"
        >
          Copy URL to Clipboard
        </button>
      )}
    </div>
  );
}
