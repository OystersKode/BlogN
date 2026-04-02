import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'blogs',
      resource_type: 'image',
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
