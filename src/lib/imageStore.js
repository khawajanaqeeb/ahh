// src/lib/imageStore.js
// Client-side IndexedDB store to save uploaded site plan images.
// Unlike LocalStorage (5MB limit), IndexedDB can store large high-res images (up to 250MB+).

const DB_NAME = 'ahh_city_assets_db';
const STORE_NAME = 'site_plan_store';
const MAP_KEY = 'current_site_map';

// Initialize IndexedDB database
function getDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is browser-only'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (e) => {
      resolve(e.target.result);
    };

    request.onerror = (e) => {
      reject(request.error);
    };
  });
}

// Save image as base64 string to IndexedDB
export async function saveImageToStore(base64Data) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(base64Data, MAP_KEY);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error saving image to IndexedDB:', err);
    return false;
  }
}

// Load image from IndexedDB
export async function loadImageFromStore() {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(MAP_KEY);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error loading image from IndexedDB:', err);
    return null;
  }
}

// Clear image from IndexedDB
export async function clearImageFromStore() {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(MAP_KEY);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error deleting image from IndexedDB:', err);
    return false;
  }
}
