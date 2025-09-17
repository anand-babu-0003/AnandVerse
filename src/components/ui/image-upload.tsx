'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
  showPreview?: boolean;
}

// All supported image formats
const DEFAULT_ACCEPTED_FORMATS = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'image/ico'
];

const DEFAULT_MAX_SIZE = 10; // 10MB

export function ImageUpload({
  value = '',
  onChange,
  placeholder = 'https://example.com/image.jpg',
  label = 'Image URL',
  maxSize = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className = '',
  showPreview = true
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setIsUploading(true);

    try {
      const file = acceptedFiles[0];
      
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB. Current file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      }

      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        throw new Error(`File type ${file.type} is not supported. Supported formats: ${acceptedFormats.join(', ')}`);
      }

      // Convert file to data URL for preview and storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  }, [maxSize, acceptedFormats, onChange]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: 1,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => {
      setDragActive(false);
      setError('File type not supported or file too large');
    }
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    onChange(e.target.value);
  };

  const clearImage = () => {
    onChange('');
    setError(null);
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|tiff|ico)(\?.*)?$/i.test(url) || 
           url.startsWith('data:image/');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="image-url">{label}</Label>
        <div className="flex gap-2">
          <Input
            id="image-url"
            type="url"
            value={value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className="flex-1"
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearImage}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-sm text-muted-foreground">
            {isUploading ? 'Uploading...' : 'Drag & drop an image here, or click to select'}
          </div>
          <div className="text-xs text-muted-foreground">
            Supports: JPG, PNG, WebP, AVIF, GIF, SVG, BMP, TIFF, ICO
          </div>
          <div className="text-xs text-muted-foreground">
            Max size: {maxSize}MB
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview */}
      {showPreview && value && isImageUrl(value) && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {value.startsWith('data:') ? 'Uploaded file' : 'External URL'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Multi-image upload component
interface MultiImageUploadProps {
  value?: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  maxSize?: number;
  acceptedFormats?: string[];
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className = ''
}: MultiImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setIsUploading(true);

    try {
      if (value.length + acceptedFiles.length > maxImages) {
        throw new Error(`Maximum ${maxImages} images allowed`);
      }

      const newImages: string[] = [];

      for (const file of acceptedFiles) {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Max size: ${maxSize}MB. Current file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        }

        // Validate file type
        if (!acceptedFormats.includes(file.type)) {
          throw new Error(`File type ${file.type} is not supported`);
        }

        // Convert file to data URL
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        newImages.push(dataUrl);
      }

      onChange([...value, ...newImages]);
      setIsUploading(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  }, [value, maxImages, maxSize, acceptedFormats, onChange]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxImages - value.length,
    multiple: true,
    onDropRejected: () => {
      setError('File type not supported or file too large');
    }
  });

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|tiff|ico)(\?.*)?$/i.test(url) || 
           url.startsWith('data:image/');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragReject ? 'border-destructive bg-destructive/5' : 'border-muted-foreground/25'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
          ${value.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-sm text-muted-foreground">
            {value.length >= maxImages 
              ? `Maximum ${maxImages} images reached`
              : isUploading 
                ? 'Uploading...' 
                : 'Drag & drop images here, or click to select'
            }
          </div>
          <div className="text-xs text-muted-foreground">
            {value.length}/{maxImages} images • Max size: {maxSize}MB each
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                  {isImageUrl(image) && (
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
