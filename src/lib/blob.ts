import { BlobServiceClient } from '@azure/storage-blob'
import { randomUUID } from 'crypto'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_BYTES = 5 * 1024 * 1024 // 5MB

let cachedClient: BlobServiceClient | null = null
function getClient() {
  if (!cachedClient) {
    cachedClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!)
  }
  return cachedClient
}

export class UploadError extends Error {}

/** Uploads a single validated image File to Azure Blob Storage, returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError('Only JPEG, PNG, or WebP images are allowed')
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError('Image must be 5MB or smaller')
  }

  const containerName = process.env.AZURE_STORAGE_CONTAINER ?? 'velli-uploads'
  const container = getClient().getContainerClient(containerName)
  await container.createIfNotExists({ access: 'blob' })

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const blobName = `${randomUUID()}.${ext}`
  const blockBlob = container.getBlockBlobClient(blobName)

  const buffer = Buffer.from(await file.arrayBuffer())
  await blockBlob.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  })

  return blockBlob.url
}
