// src/app/api/upload-map/route.js
// Server-side Route Handler: saves uploaded site plan image per project to public/ folder.
// POST /api/upload-map?projectId=... — accepts multipart/form-data with "file" and optional "projectId"
// DELETE /api/upload-map?projectId=... — removes the saved map image for that project
// GET /api/upload-map?projectId=... — checks if map image exists for that project

import { writeFile, unlink, access } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

// Where to save — always inside the public/ directory at project root
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Allowed image MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function getSanitizedProjectId(rawId) {
  if (!rawId || typeof rawId !== 'string') return 'ahh-city';
  const sanitized = rawId.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
  return sanitized || 'ahh-city';
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const rawProjectId = formData.get('projectId') || request.nextUrl?.searchParams?.get('projectId');
    const projectId = getSanitizedProjectId(rawProjectId);

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
    const filename = `${projectId}_map${ext}`;
    const savePath = path.join(PUBLIC_DIR, filename);

    // Convert the file to a Buffer and write it
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(savePath, buffer);

    // Return the public URL
    return NextResponse.json({
      success: true,
      url: `/${filename}`,
      filename,
      projectId,
      sizeKB: Math.round(buffer.byteLength / 1024),
    });

  } catch (err) {
    console.error('[upload-map] Error saving file:', err);
    return NextResponse.json({ error: 'Server error saving file.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const rawProjectId = request.nextUrl?.searchParams?.get('projectId');
  const projectId = getSanitizedProjectId(rawProjectId);
  const extensions = ['.jpg', '.png', '.webp', '.gif'];
  let deleted = false;

  for (const ext of extensions) {
    const filePath = path.join(PUBLIC_DIR, `${projectId}_map${ext}`);
    try {
      await access(filePath);
      await unlink(filePath);
      deleted = true;
    } catch {
      // File doesn't exist with this extension — try next
    }
  }

  if (deleted) {
    return NextResponse.json({ success: true, message: `Map image for ${projectId} deleted.` });
  } else {
    return NextResponse.json({ error: `No map image found for ${projectId}.` }, { status: 404 });
  }
}

export async function GET(request) {
  const rawProjectId = request.nextUrl?.searchParams?.get('projectId');
  const projectId = getSanitizedProjectId(rawProjectId);
  const extensions = ['.jpg', '.png', '.webp', '.gif'];

  for (const ext of extensions) {
    const filename = `${projectId}_map${ext}`;
    const filePath = path.join(PUBLIC_DIR, filename);
    try {
      await access(filePath);
      return NextResponse.json({ exists: true, url: `/${filename}`, projectId });
    } catch {
      // continue
    }
  }

  return NextResponse.json({ exists: false, url: null, projectId });
}
