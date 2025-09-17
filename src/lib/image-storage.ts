/**
 * Image storage utilities for handling large image uploads
 * Since Firestore has a 1MB limit per field, we need to store images differently
 */

import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload image to Firebase Storage and return the download URL
 */
export async function uploadImageToStorage(
  file: File,
  path: string = 'images'
): Promise<ImageUploadResult> {
  try {
    console.log('Uploading image to storage:', { fileName: file.name, fileSize: file.size, path });
    
    if (!storage) {
      console.error('Firebase Storage not initialized');
      return {
        success: false,
        error: 'Firebase Storage not initialized'
      };
    }

    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL
    };
  } catch (error) {
    console.error('Error uploading image to storage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Upload multiple images to Firebase Storage
 */
export async function uploadMultipleImagesToStorage(
  files: File[],
  path: string = 'images'
): Promise<ImageUploadResult[]> {
  const uploadPromises = files.map(file => uploadImageToStorage(file, path));
  return Promise.all(uploadPromises);
}

/**
 * Delete image from Firebase Storage
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  try {
    if (!storage) {
      return false;
    }

    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch) {
      console.error('Could not extract path from image URL:', imageUrl);
      return false;
    }

    const filePath = decodeURIComponent(pathMatch[1]);
    const imageRef = ref(storage, filePath);
    
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    return false;
  }
}

/**
 * Check if a string is a base64 data URL
 */
export function isBase64DataUrl(str: string): boolean {
  return str.startsWith('data:image/');
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Process image input - if it's a base64 data URL, upload to storage
 * If it's already a URL, return as-is
 */
export async function processImageInput(
  imageInput: string,
  path: string = 'images'
): Promise<ImageUploadResult> {
  // If it's already a URL, return it
  if (isValidUrl(imageInput) && !isBase64DataUrl(imageInput)) {
    return {
      success: true,
      url: imageInput
    };
  }

  // If it's a base64 data URL, we need to convert it to a File and upload
  if (isBase64DataUrl(imageInput)) {
    try {
      // Convert base64 to File
      const response = await fetch(imageInput);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      
      // Upload to storage
      return await uploadImageToStorage(file, path);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process base64 image'
      };
    }
  }

  return {
    success: false,
    error: 'Invalid image input format'
  };
}
