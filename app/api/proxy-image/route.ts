import { NextRequest, NextResponse } from 'next/server';
import { validateFetchUrl } from '@/lib/validate-fetch-url';
import { logger } from '@/lib/logger';

// Maximum proxied image size: 10 MB (OWASP A04 - Insecure Design)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
]);

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  const validationError = validateFetchUrl(url);
  if (validationError) {
    return new NextResponse(validationError, { status: 403 });
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || '';
    const mimeType = contentType.split(';')[0].trim().toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
      return new NextResponse('URL does not point to a valid image', { status: 400 });
    }

    // Check Content-Length before downloading (OWASP A04)
    const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);
    if (contentLength > MAX_IMAGE_SIZE) {
      return new NextResponse('Image too large', { status: 413 });
    }

    const arrayBuffer = await response.arrayBuffer();

    // Double-check actual size after download
    if (arrayBuffer.byteLength > MAX_IMAGE_SIZE) {
      return new NextResponse('Image too large', { status: 413 });
    }

    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ success: true, dataUrl }, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL ||
          (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://draftdeckai.com'),
      },
    });

  } catch (error: any) {
    logger.error({ route: 'proxy-image' }, 'Error proxying image:', error);

    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return new NextResponse('Request timed out', { status: 408 });
    }

    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}