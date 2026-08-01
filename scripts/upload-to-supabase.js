/**
 * AHH Brothers — Supabase Storage Upload Script
 * 
 * Uploads media assets to appropriate Supabase Storage buckets:
 *   gallery/      → office photos (off-1 to off-7), project renders (h1, h2)
 *   directors/    → director portraits
 *   projects/     → site layout plans
 *   logos/        → project logos
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://krvxuqbvmpzsnfvqzsvk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JgvclpfbeIAzCABqh6mBRQ_C_wWnZRj';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Define which files go to which bucket and path
const UPLOAD_MAP = [
  // ── GALLERY BUCKET ──────────────────────────────────────────────────────────
  { file: 'off-1.jpeg',  bucket: 'gallery', remotePath: 'office/off-1.jpeg',  contentType: 'image/jpeg' },
  { file: 'off-2.jpeg',  bucket: 'gallery', remotePath: 'office/off-2.jpeg',  contentType: 'image/jpeg' },
  { file: 'off-3.jpeg',  bucket: 'gallery', remotePath: 'office/off-3.jpeg',  contentType: 'image/jpeg' },
  { file: 'off-4.jpeg',  bucket: 'gallery', remotePath: 'office/off-4.jpeg',  contentType: 'image/jpeg' },
  { file: 'off-5.jpeg',  bucket: 'gallery', remotePath: 'office/off-5.jpeg',  contentType: 'image/jpeg' },
  { file: 'off-6.jpeg',  bucket: 'gallery', remotePath: 'office/off-6.jpeg',  contentType: 'image/jpeg' },
  { file: 'off-7.jpeg',  bucket: 'gallery', remotePath: 'office/off-7.jpeg',  contentType: 'image/jpeg' },
  { file: 'h1.jpg',      bucket: 'gallery', remotePath: 'projects/h1.jpg',    contentType: 'image/jpeg' },
  { file: 'h2.jpg',      bucket: 'gallery', remotePath: 'projects/h2.jpg',    contentType: 'image/jpeg' },

  // ── DIRECTORS BUCKET ─────────────────────────────────────────────────────────
  { file: 'abbas-malik.jpeg',   bucket: 'directors', remotePath: 'abbas-malik.jpeg',   contentType: 'image/jpeg' },
  { file: 'haroon-ansari.png',  bucket: 'directors', remotePath: 'haroon-ansari.png',  contentType: 'image/png' },
  { file: 'hassaan-memon.jpeg', bucket: 'directors', remotePath: 'hassaan-memon.jpeg', contentType: 'image/jpeg' },

  // ── PROJECTS BUCKET ──────────────────────────────────────────────────────────
  { file: 'AHH CITY  layout.jpg',       bucket: 'projects', remotePath: 'ahh-city-layout.jpg',          contentType: 'image/jpeg' },
  { file: 'HOORIA LAYOUT.jpeg',         bucket: 'projects', remotePath: 'hooria-layout.jpeg',            contentType: 'image/jpeg' },
  { file: 'Summar Farm Lay out.jpeg',   bucket: 'projects', remotePath: 'summer-farm-layout.jpeg',       contentType: 'image/jpeg' },
  { file: 'hooriya-villa.png',          bucket: 'projects', remotePath: 'hooriya-villa.png',             contentType: 'image/png' },

  // ── LOGOS BUCKET ─────────────────────────────────────────────────────────────
  { file: 'ahh-logo.png',                 bucket: 'logos', remotePath: 'ahh-logo.png',                 contentType: 'image/png' },
  { file: 'ahh-city-logo.jpg',            bucket: 'logos', remotePath: 'ahh-city-logo.jpg',            contentType: 'image/jpeg' },
  { file: 'hooria-villas-logo.jpg',       bucket: 'logos', remotePath: 'hooria-villas-logo.jpg',       contentType: 'image/jpeg' },
  { file: 'labour-city-logo.jpg',         bucket: 'logos', remotePath: 'labour-city-logo.jpg',         contentType: 'image/jpeg' },
  { file: 'summer-farmhouses-logo.jpg',   bucket: 'logos', remotePath: 'summer-farmhouses-logo.jpg',   contentType: 'image/jpeg' },
  // ── POSTERS IN PROJECTS BUCKET ─────────────────────────────────────────────
  { file: 'posters/ahh-city-growth-terms.jpg',      bucket: 'projects', remotePath: 'posters/ahh-city-growth-terms.jpg',      contentType: 'image/jpeg' },
  { file: 'posters/investment-opportunity.jpg',     bucket: 'projects', remotePath: 'posters/investment-opportunity.jpg',     contentType: 'image/jpeg' },
  { file: 'posters/interest-free-growth.jpg',       bucket: 'projects', remotePath: 'posters/interest-free-growth.jpg',       contentType: 'image/jpeg' },
  { file: 'posters/hooria-villas-payment-plan.jpg', bucket: 'projects', remotePath: 'posters/hooria-villas-payment-plan.jpg', contentType: 'image/jpeg' },
  { file: 'posters/labour-city-poster.jpg',         bucket: 'projects', remotePath: 'posters/labour-city-poster.jpg',         contentType: 'image/jpeg' },
  { file: 'posters/labour-city-payment-plan.jpg',   bucket: 'projects', remotePath: 'posters/labour-city-payment-plan.jpg',   contentType: 'image/jpeg' },
];

const BUCKETS_TO_CREATE = [
  { name: 'gallery',   public: true },
  { name: 'directors', public: true },
  { name: 'projects',  public: true },
  { name: 'logos',     public: true },
  { name: 'posters',   public: true },
];

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
  return map[ext] || 'application/octet-stream';
}

async function ensureBucket(name, isPublic) {
  const { data: existing } = await supabase.storage.getBucket(name);
  if (existing) {
    console.log(`  ✓ Bucket "${name}" already exists`);
    return true;
  }
  const { error } = await supabase.storage.createBucket(name, { public: isPublic });
  if (error) {
    // Might already exist from a race condition or RLS
    if (error.message && error.message.includes('already exists')) {
      console.log(`  ✓ Bucket "${name}" already exists (confirmed via error)`);
      return true;
    }
    console.error(`  ✗ Failed to create bucket "${name}":`, error.message);
    return false;
  }
  console.log(`  ✓ Created bucket "${name}" (public: ${isPublic})`);
  return true;
}

async function uploadFile(entry) {
  const localPath = path.join(PUBLIC_DIR, entry.file);
  if (!fs.existsSync(localPath)) {
    console.warn(`  ⚠ File not found, skipping: ${entry.file}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(localPath);
  const contentType = entry.contentType || getMimeType(localPath);

  const { error } = await supabase.storage
    .from(entry.bucket)
    .upload(entry.remotePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`  ✗ ${entry.file} → ${entry.bucket}/${entry.remotePath} : ${error.message}`);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(entry.bucket)
    .getPublicUrl(entry.remotePath);

  console.log(`  ✓ ${entry.file}`);
  console.log(`    → ${publicUrl}`);
  return { ...entry, publicUrl };
}

async function main() {
  console.log('\n🪣  Creating / verifying buckets...\n');
  for (const b of BUCKETS_TO_CREATE) {
    await ensureBucket(b.name, b.public);
  }

  console.log('\n📤  Uploading files...\n');
  const results = [];
  for (const entry of UPLOAD_MAP) {
    const result = await uploadFile(entry);
    if (result) results.push(result);
  }

  console.log('\n✅  Upload complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋  PUBLIC URL REFERENCE — paste these into your .env.local\n');

  const byBucket = {};
  for (const r of results) {
    if (!byBucket[r.bucket]) byBucket[r.bucket] = [];
    byBucket[r.bucket].push(r);
  }

  for (const [bucket, items] of Object.entries(byBucket)) {
    console.log(`\n# ${bucket.toUpperCase()} bucket`);
    for (const item of items) {
      const envKey = `NEXT_PUBLIC_IMG_${item.remotePath.replace(/[^a-z0-9]/gi, '_').replace(/__+/g, '_').toUpperCase().replace(/_$/, '')}`;
      console.log(`${envKey}=${item.publicUrl}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
  console.error('\n❌  Script failed:', err.message);
  process.exit(1);
});
