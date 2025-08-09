import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: any[];
  tags?: string[];
  overwrite?: boolean;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
  file: string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  try {
    const defaultOptions = {
      folder: 'events',
      resource_type: 'auto' as const,
      overwrite: false,
      ...options,
    };

    const result = await cloudinary.uploader.upload(file, defaultOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<{ result: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  try {
    const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;
    
    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      format,
      secure: true,
    });
  } catch (error) {
    console.error('Error generating optimized URL:', error);
    return '';
  }
}

/**
 * Get image details from Cloudinary
 */
export async function getImageDetails(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error fetching image details:', error);
    throw new Error('Failed to fetch image details from Cloudinary');
  }
}

/**
 * List images in a folder
 */
export async function listImages(folder: string = 'events', maxResults: number = 50) {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: maxResults,
      resource_type: 'image',
    });
    
    return result.resources;
  } catch (error) {
    console.error('Error listing images:', error);
    throw new Error('Failed to list images from Cloudinary');
  }
}

/**
 * Generate a signed upload URL for client-side uploads
 */
export function generateSignedUploadUrl(options: CloudinaryUploadOptions = {}) {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      folder: options.folder || 'events',
      ...options,
    };

    const signature = cloudinary.utils.api_sign_request({ ...params, timestamp }, process.env.CLOUDINARY_API_SECRET!);
    
    return {
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      ...params,
    };
  } catch (error) {
    console.error('Error generating signed upload URL:', error);
    throw new Error('Failed to generate signed upload URL');
  }
}

/**
 * Transform image URL for different use cases
 */
export const imageTransformations = {
  thumbnail: (publicId: string) => getOptimizedImageUrl(publicId, { 
    width: 150, 
    height: 150, 
    crop: 'fill',
    quality: 80 
  }),
  
  eventCard: (publicId: string) => getOptimizedImageUrl(publicId, { 
    width: 400, 
    height: 300, 
    crop: 'fill',
    quality: 85 
  }),
  
  eventHero: (publicId: string) => getOptimizedImageUrl(publicId, { 
    width: 1200, 
    height: 600, 
    crop: 'fill',
    quality: 90 
  }),
  
  responsive: (publicId: string, width: number) => getOptimizedImageUrl(publicId, { 
    width, 
    crop: 'scale',
    quality: 'auto',
    format: 'auto'
  }),
};

export default cloudinary;
