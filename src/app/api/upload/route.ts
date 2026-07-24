import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { uploadImage, UploadError } from '@/lib/blob'

// Shared upload endpoint for both the page-builder photo and the reveal
// gallery photos — Azure Blob does the storing, we just validate + relay.
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const url = await uploadImage(file)
    return NextResponse.json({ url })
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 })
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
