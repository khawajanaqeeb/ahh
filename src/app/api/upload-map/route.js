// src/app/api/upload-map/route.js
// Server-side Route Handler: saves uploaded site plan image to the public/ folder.
// POST /api/upload-map  — accepts multipart/form-data with a "file" field
// DELETE /api/upload-map — removes the saved map image from public/
// GET /api/upload-map   — checks if map image currently exists

import { writeFile, unlink, access } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

// Where to save — always inside the public/ directory at project root
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Fixed filename so the app always knows the path
const MAP_FILENAME = 'ahh_city_map';

// Allowed image MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPG, PNG, WEBP, GIF.` },
        { status: 415 }
      );
    }

    // Determine extension from MIME type
    const extMap = {
      'image/jpeg': '.jpg',
      'image/png':  '.png',
      'image/webp': '.webp',
      'image/gif':  '.gif',
    };
    const ext = extMap[file.type] || '.jpg';
    const filename = `${MAP_FILENAME}${ext}`;
    const savePath = path.join(PUBLIC_DIR, filename);

    // Convert the file to a Buffer and write it
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(savePath, buffer);

    // Return the public URL (relative, served by Next.js static file server)
    return NextResponse.json({
      success: true,
      url: `/${filename}`,
      filename,
      sizeKB: Math.round(buffer.byteLength / 1024),
    });

  } catch (err) {
    console.error('[upload-map] Error saving file:', err);
    return NextResponse.json({ error: 'Server error saving file.' }, { status: 500 });
  }
}

export async function DELETE() {
  // Try to delete all supported extensions
  const extensions = ['.jpg', '.png', '.webp', '.gif'];
  let deleted = false;

  for (const ext of extensions) {
    const filePath = path.join(PUBLIC_DIR, `${MAP_FILENAME}${ext}`);
    try {
      await access(filePath);
      await unlink(filePath);
      deleted = true;
    } catch {
      // File doesn't exist with this extension — try next
    }
  }

  if (deleted) {
    return NextResponse.json({ success: true, message: 'Map image deleted.' });
  } else {
    return NextResponse.json({ error: 'No map image found to delete.' }, { status: 404 });
  }
}

export async function GET() {
  // Check which map image (if any) currently exists in public/
  const extensions = ['.jpg', '.png', '.webp', '.gif'];

  for (const ext of extensions) {
    const filePath = path.join(PUBLIC_DIR, `${MAP_FILENAME}${ext}`);
    try {
      await access(filePath);
      return NextResponse.json({ exists: true, url: `/${MAP_FILENAME}${ext}` });
    } catch {
      // continue
    }
  }

  return NextResponse.json({ exists: false, url: null });
}
