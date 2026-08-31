import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  Eye,
  FileText,
} from 'lucide-react';
import { uploadImageFile, formatFileSize, deleteImageFromStorage } from '../../utils/imageUpload';

interface ImageUploadFieldProps {
  id?: string;
  label: string;
  sublabel?: string;
  value: string;
  onChange: (url: string) => void;
  role?: 'admin' | 'seller' | 'customer';
  sellerId?: string;
  imageType?: 'main' | 'packaging' | 'additional' | 'banner';
  folder?: string;
  required?: boolean;
  aspectRatio?: 'square' | 'wide' | 'banner';
  helpNote?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  id,
  label,
  sublabel,
  value,
  onChange,
  role = 'seller',
  sellerId,
  imageType = 'main',
  folder = 'products',
  required = false,
  aspectRatio = 'square',
  helpNote,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);
    setFileInfo({ name: file.name, size: file.size });

    const result = await uploadImageFile(file, {
      role: role as 'admin' | 'seller' | 'customer',
      sellerId,
      imageType: imageType as 'main' | 'packaging' | 'additional' | 'banner',
      folder,
    });

    setIsUploading(false);

    if (result.success && result.url) {
      onChange(result.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    } else {
      setUploadError(result.error || 'Failed to upload image. Please try again.');
    }

    // Reset file input so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!value) return;
    const oldUrl = value;
    onChange('');
    setFileInfo(null);
    setUploadError(null);
    setUploadSuccess(false);

    if (oldUrl.startsWith('/uploads/')) {
      await deleteImageFromStorage(oldUrl, role === 'admin' ? 'admin' : 'seller');
    }
  };

  const handleTriggerPicker = () => {
    fileInputRef.current?.click();
  };

  const aspectClass =
    aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/9]'
      : 'aspect-square';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            {imageType === 'packaging' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
          {sublabel && <p className="text-[11px] text-slate-500">{sublabel}</p>}
        </div>

        {value && !isUploading && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Saved to Storage
          </span>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        id={id || `img-input-${imageType}-${Math.random().toString(36).substring(2, 6)}`}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Box / Image Display */}
      {value ? (
        <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2.5 space-y-2.5">
          <div className="flex items-center gap-3">
            {/* Image Preview Thumbnail */}
            <div
              className={`relative ${aspectClass} w-24 shrink-0 rounded-xl overflow-hidden bg-slate-900/5 border border-slate-200 shadow-2xs flex items-center justify-center`}
            >
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {imageType === 'packaging' && (
                <span className="absolute bottom-1 left-1 right-1 text-center text-[8px] font-black uppercase bg-slate-950/80 text-amber-400 px-1 py-0.5 rounded backdrop-blur-xs">
                  Transparent
                </span>
              )}
            </div>

            {/* Image Meta & Controls */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{fileInfo?.name || value.split('/').pop() || 'Product Image'}</span>
              </div>

              {fileInfo?.size ? (
                <p className="text-[11px] text-slate-500 font-medium">
                  Size: <strong>{formatFileSize(fileInfo.size)}</strong> • Format: JPG/PNG/WEBP
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 font-mono truncate text-xs">
                  {value.startsWith('/uploads/') ? 'Persistent Server Storage' : 'Cloud CDN URL'}
                </p>
              )}

              {/* Status indicator */}
              {isUploading ? (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to permanent storage...</span>
                </div>
              ) : uploadSuccess ? (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ Image Uploaded</span>
                </div>
              ) : null}

              {/* Action Buttons: Replace & Delete */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerPicker}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer transition disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded-lg cursor-pointer transition disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Trigger Card */
        <div
          onClick={handleTriggerPicker}
          className={`border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/40 rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isUploading ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
              <span className="text-xs font-bold text-slate-800">
                Uploading {fileInfo?.name ? `"${fileInfo.name}"` : 'Image'}...
              </span>
              <span className="text-[10px] text-slate-500">Writing to permanent storage</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center shadow-2xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  Select {label} from Gallery / Mobile
                </p>
                <p className="text-[11px] text-slate-500">
                  Supports JPG, JPEG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Upload Failed</p>
            <p className="text-[11px] text-rose-700">{uploadError}</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-500 hover:text-rose-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Help Note */}
      {helpNote && <p className="text-[11px] text-slate-400 italic">{helpNote}</p>}
    </div>
  );
};
