/**
 * HARWALKART Persistent Image Storage & Upload Utility
 * Handles JPG, JPEG, PNG, and WEBP image uploads to persistent server storage.
 */

export interface UploadImageResult {
  success: boolean;
  url: string;
  storageRef?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  error?: string;
}

export interface UploadOptions {
  role?: 'admin' | 'seller' | 'customer';
  sellerId?: string;
  imageType?: 'main' | 'packaging' | 'additional' | 'banner';
  folder?: string;
  onProgress?: (percent: number) => void;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Format bytes to readable string (e.g. 250 KB, 1.4 MB)
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Convert a File object to a Base64 Data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Upload an image file to the persistent server storage backend
 */
export async function uploadImageFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadImageResult> {
  try {
    // 1. Validate file existence
    if (!file) {
      return { success: false, url: '', error: 'No image file selected.' };
    }

    // 2. Validate file format
    const lowerType = (file.type || '').toLowerCase();
    const isAllowedType =
      ALLOWED_MIME_TYPES.includes(lowerType) ||
      /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isAllowedType) {
      return {
        success: false,
        url: '',
        error: 'File type not supported. Please upload JPG, JPEG, PNG, or WEBP.',
      };
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        url: '',
        error: `File size is too large (${formatFileSize(file.size)}). Maximum allowed size is 10MB.`,
      };
    }

    // 4. Read file content as Base64 Data URL
    const base64Data = await fileToBase64(file);

    // 5. Submit to backend persistent storage API
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data,
        fileName: file.name,
        fileType: file.type || 'image/jpeg',
        role: options.role || 'seller',
        sellerId: options.sellerId,
        imageType: options.imageType || 'main',
        folder: options.folder || 'products',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        url: '',
        error: data.error || `Image upload failed with status ${response.status}.`,
      };
    }

    return {
      success: true,
      url: data.url,
      storageRef: data.storageRef || data.url,
      fileName: data.fileName || file.name,
      fileSize: data.fileSize || file.size,
      mimeType: data.mimeType || file.type,
    };
  } catch (err: any) {
    console.error('Image upload exception:', err);
    return {
      success: false,
      url: '',
      error: err.message || 'Image upload failed. Check network or storage connection.',
    };
  }
}

/**
 * Delete an image from persistent storage
 */
export async function deleteImageFromStorage(
  imageUrl: string,
  role: 'admin' | 'seller' = 'seller'
): Promise<boolean> {
  try {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return true; // External or preset URL, no backend file to delete
    }

    const response = await fetch('/api/upload/image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: imageUrl,
        role: role,
      }),
    });

    const data = await response.json();
    return !!data.success;
  } catch (e) {
    console.error('Error deleting image:', e);
    return false;
  }
}
