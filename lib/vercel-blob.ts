import { put, del } from '@vercel/blob';

export async function uploadFileToVercelBlob(
  file: File,
  projectId: string,
  fileName: string
): Promise<{ url: string; pathname: string }> {
  try {
    const blob = await put(`projects/${projectId}/${fileName}`, file, {
      access: 'public',
    });

    return {
      url: blob.url,
      pathname: blob.pathname
    };
  } catch (error) {
    console.error('Vercel Blob upload error:', error);
    throw new Error('Failed to upload file to blob storage');
  }
}

export async function deleteFileFromVercelBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Vercel Blob delete error:', error);
    throw new Error('Failed to delete file from blob storage');
  }
}