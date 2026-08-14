// src/lib/db.js
// Database service client — AHH City Booking Portal
// Transparently switches between browser LocalStorage and cloud PostgreSQL (Supabase) if API keys are configured.

import { createClient } from '@supabase/supabase-js';
// In the browser we import the shared singleton so only ONE GoTrueClient ever
// exists per page, eliminating the "Multiple GoTrueClient instances" warning.
import { createClient as getBrowserClient } from '@/utils/supabase/client';

// Read credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  // Browser: reuse the shared singleton from utils/supabase/client.ts
  if (typeof window !== 'undefined') {
    return getBrowserClient();
  }
  // Server: create a plain client (no shared auth state, no conflict)
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabaseClient();

console.log(isSupabaseConfigured
  ? '⚡ Supabase cloud database client connected.'
  : '💾 Supabase credentials not found. Defaulting to LocalStorage mode.'
);

/*
========================================================================
⚡ SQL SCHEMA SETUP FOR SUPABASE (Execute this in Supabase SQL Editor):
========================================================================

-- Create Plots Coordinates Table
CREATE TABLE IF NOT EXISTS ahh_city_plots (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    coords JSONB NOT NULL,
    raw_coords TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS ahh_city_bookings (
    plot_id TEXT PRIMARY KEY REFERENCES ahh_city_plots(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    relative_name TEXT,
    cnic TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    block TEXT,
    payment_mode TEXT DEFAULT 'Cash',
    bank_name TEXT,
    plot_type TEXT NOT NULL,
    status TEXT NOT NULL,
    total_price NUMERIC NOT NULL,
    paid_amount NUMERIC NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table already exists, run these ALTER statements to add all missing columns:
ALTER TABLE ahh_city_bookings ADD COLUMN IF NOT EXISTS relative_name TEXT;
ALTER TABLE ahh_city_bookings ADD COLUMN IF NOT EXISTS cnic TEXT;
ALTER TABLE ahh_city_bookings ADD COLUMN IF NOT EXISTS payment_mode TEXT DEFAULT 'Cash';
ALTER TABLE ahh_city_bookings ADD COLUMN IF NOT EXISTS block TEXT;
ALTER TABLE ahh_city_bookings ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE ahh_city_bookings ADD COLUMN IF NOT EXISTS token_expiry_date TEXT;

-- Enable Row Level Security (RLS) or disable for easy access
ALTER TABLE ahh_city_plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ahh_city_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON ahh_city_plots FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON ahh_city_plots FOR ALL USING (true);

CREATE POLICY "Allow public read bookings" ON ahh_city_bookings FOR SELECT USING (true);
CREATE POLICY "Allow public write bookings" ON ahh_city_bookings FOR ALL USING (true);
========================================================================
*/

// --- PLOTS OPERATIONS ---

export async function fetchPlots() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ahh_city_plots')
        .select('*')
        .order('id');
      if (error) throw error;

      // Map database schema to app model
      return data.map(item => ({
        id: item.id,
        type: item.type,
        coords: item.coords,
        rawCoords: item.raw_coords
      }));
    } catch (err) {
      console.error('Error fetching plots from Supabase:', err);
    }
  }

  // LocalStorage Fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('ahh_city_plots_layout');
    return local ? JSON.parse(local) : [];
  }
  return [];
}

export async function savePlotToDb(plot) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('ahh_city_plots')
        .upsert({
          id: plot.id,
          type: plot.type,
          coords: plot.coords,
          raw_coords: plot.rawCoords
        });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error saving plot to Supabase:', err);
    }
  }

  // LocalStorage Fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('ahh_city_plots_layout');
    const plotsList = local ? JSON.parse(local) : [];
    const idx = plotsList.findIndex(p => p.id === plot.id);
    if (idx > -1) plotsList[idx] = plot;
    else plotsList.push(plot);
    localStorage.setItem('ahh_city_plots_layout', JSON.stringify(plotsList));
    return true;
  }
  return false;
}

export async function deletePlotFromDb(plotId) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('ahh_city_plots')
        .delete()
        .eq('id', plotId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting plot from Supabase:', err);
    }
  }

  // LocalStorage Fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('ahh_city_plots_layout');
    if (local) {
      const plotsList = JSON.parse(local);
      const filtered = plotsList.filter(p => p.id !== plotId);
      localStorage.setItem('ahh_city_plots_layout', JSON.stringify(filtered));
      return true;
    }
  }
  return false;
}

export async function clearAllPlotsFromDb() {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('ahh_city_plots')
        .delete()
        .neq('id', 'SYSTEM_DUMMY_UNUSED'); // Delete everything
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error clearing plots from Supabase:', err);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('ahh_city_plots_layout');
    return true;
  }
  return false;
}

// --- BOOKINGS OPERATIONS ---

export async function fetchBookings() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ahh_city_bookings')
        .select('*');
      if (error) throw error;

      // Map database schema to app model
      return data.map(item => ({
        plotId: item.plot_id,
        clientName: item.client_name,
        relativeName: item.relative_name || '',
        cnic: item.cnic || '',
        phone: item.phone,
        email: item.email,
        block: item.block || '',
        paymentMode: item.payment_mode || 'Cash',
        bankName: item.bank_name || '',
        plotType: item.plot_type,
        status: item.status,
        totalPrice: parseFloat(item.total_price),
        paidAmount: parseFloat(item.paid_amount),
        costOfLand: parseFloat(item.cost_of_land) || 0,
        extraCharges: parseFloat(item.extra_charges) || 0,
        processingCharges: parseFloat(item.processing_charges) || 0,
        date: item.date,
        tokenExpiryDate: item.token_expiry_date || item.tokenExpiryDate || '',
        amountInWords: item.amount_in_words || item.amountInWords || '',
        installmentMonth: item.installment_month || item.installmentMonth || '',
        installments: item.installments || []
      }));
    } catch (err) {
      console.error('Error fetching bookings from Supabase:', err);
    }
  }

  // LocalStorage Fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('ahh_city_bookings_data');
    return local ? JSON.parse(local) : [];
  }
  return [];
}

export async function saveBookingToDb(booking) {
  // Always update LocalStorage so data is saved locally immediately
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('ahh_city_bookings_data');
    const bookingsList = local ? JSON.parse(local) : [];
    const idx = bookingsList.findIndex(b => b.plotId === booking.plotId);
    if (idx > -1) bookingsList[idx] = booking;
    else bookingsList.push(booking);
    localStorage.setItem('ahh_city_bookings_data', JSON.stringify(bookingsList));
  }

  if (supabase) {
    try {
      const fullPayload = {
        plot_id: booking.plotId,
        client_name: booking.clientName,
        relative_name: booking.relativeName || null,
        cnic: booking.cnic || null,
        phone: booking.phone,
        email: booking.email || null,
        block: booking.block || null,
        payment_mode: booking.paymentMode || 'Cash',
        bank_name: booking.bankName || null,
        plot_type: booking.plotType,
        status: booking.status,
        total_price: booking.totalPrice,
        paid_amount: booking.paidAmount,
        cost_of_land: booking.costOfLand || null,
        extra_charges: booking.extraCharges || null,
        processing_charges: booking.processingCharges || null,
        date: booking.date,
        token_expiry_date: booking.tokenExpiryDate || null,
        amount_in_words: booking.amountInWords || null,
        installment_month: booking.installmentMonth || null,
        installments: booking.installments || []
      };

      const { error } = await supabase
        .from('ahh_city_bookings')
        .upsert(fullPayload);

      if (error) {
        // Fallback for Supabase tables missing the new columns (PGRST204)
        if (error.code === 'PGRST204' || error.message?.includes('schema cache')) {
          console.warn('Supabase missing new columns. Saving basic fields to cloud (full details saved locally):', error.message);
          const basicPayload = {
            plot_id: booking.plotId,
            client_name: booking.clientName,
            phone: booking.phone,
            email: booking.email || null,
            plot_type: booking.plotType,
            status: booking.status,
            total_price: booking.totalPrice,
            paid_amount: booking.paidAmount,
            date: booking.date
          };
          const { error: basicErr } = await supabase
            .from('ahh_city_bookings')
            .upsert(basicPayload);
          if (basicErr) console.error('Basic payload save error:', basicErr);
        } else {
          console.error('Error saving booking to Supabase:', error);
        }
      }
      // Sync to master_bookings table
      await syncBookingToMaster(booking);
      return true;
    } catch (err) {
      console.error('Error saving booking to Supabase:', err);
    }
  }

  return true;
}

// --- MASTER BOOKINGS UNIFIED SERVICE ---

export function formatCNIC(raw) {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 13) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  }
  return raw;
}

export const PROJECT_NAME_MAP = {
  'ahh-city': 'AHH City',
  'labour-city': 'Labour City',
  'hooria-villas': 'Hooria Villas',
  'summer-farm-houses': 'Summer Farmhouses',
  'AHH City': 'AHH City',
  'Labour City': 'Labour City',
  'Hooria Villas': 'Hooria Villas',
  'Summer Farmhouses': 'Summer Farmhouses'
};

export async function syncBookingToMaster(booking) {
  const formattedCnic = formatCNIC(booking.cnic);
  const projName = PROJECT_NAME_MAP[booking.projectId] || booking.projectName || 'AHH City';

  const payload = {
    project_name: projName,
    client_name: booking.clientName || '',
    cnic: formattedCnic,
    phone: booking.phone || '',
    plot_no: booking.plotId || booking.plot_no || '',
    block: booking.block || '',
    nominee: booking.relativeName || booking.nominee || '',
    booking_date: booking.date || booking.booking_date || new Date().toISOString().split('T')[0]
  };

  // LocalStorage master sync
  if (typeof window !== 'undefined') {
    const localMaster = localStorage.getItem('ahh_master_bookings_data');
    const masterList = localMaster ? JSON.parse(localMaster) : [];
    const idx = masterList.findIndex(m => m.plot_no === payload.plot_no && m.project_name === payload.project_name);
    if (idx > -1) masterList[idx] = { ...masterList[idx], ...payload };
    else masterList.push({ id: `master-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, ...payload, created_at: new Date().toISOString() });
    localStorage.setItem('ahh_master_bookings_data', JSON.stringify(masterList));
  }

  if (supabase) {
    try {
      await supabase.from('master_bookings').upsert(payload, { onConflict: 'project_name,plot_no' });
    } catch (err) {
      console.warn('Supabase master_bookings sync notice:', err);
    }
  }
}

/**
 * Fetch consolidated master bookings from Supabase & LocalStorage with CNIC search support.
 * @param {string | null} [cnicSearch]
 */
export async function fetchMasterBookings(cnicSearch = null) {
  let combinedRecords = [];
  const recordMap = new Map(); // key: `project_name|plot_no`

  // Helper to add or update deduplicated record
  const addRecord = (item) => {
    const proj = PROJECT_NAME_MAP[item.projectId || item.project_name] || item.project_name || 'AHH City';
    const plot = item.plot_no || item.plotId || item.plot_id || '';
    const key = `${proj.toLowerCase()}|${plot.toLowerCase()}`;

    if (!plot) return;

    const formattedCnic = formatCNIC(item.cnic);

    const record = {
      id: item.id || `rec-${key}`,
      project_name: proj,
      client_name: item.client_name || item.clientName || '',
      cnic: formattedCnic,
      phone: item.phone || '',
      plot_no: plot,
      block: item.block || 'Main',
      nominee: item.nominee || item.relative_name || item.relativeName || '',
      booking_date: item.booking_date || item.date || (item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
      status: item.status || 'Booked',
      total_price: item.total_price || item.totalPrice || 0,
      paid_amount: item.paid_amount || item.paidAmount || 0,
      created_at: item.created_at || new Date().toISOString()
    };

    if (!recordMap.has(key)) {
      recordMap.set(key, record);
    } else {
      // Merge extra details if available
      const existing = recordMap.get(key);
      recordMap.set(key, { ...existing, ...record, cnic: record.cnic || existing.cnic });
    }
  };

  // 1. Fetch from Supabase master_bookings
  if (supabase) {
    try {
      const { data: masterData, error: masterErr } = await supabase
        .from('master_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!masterErr && masterData) {
        masterData.forEach(addRecord);
      }
    } catch (err) {
      console.warn('Supabase fetch master_bookings notice:', err);
    }

    // 2. Fetch from Supabase ahh_city_bookings
    try {
      const { data: cityData, error: cityErr } = await supabase
        .from('ahh_city_bookings')
        .select('*');

      if (!cityErr && cityData) {
        cityData.forEach(item => {
          addRecord({
            ...item,
            plot_no: item.plot_id,
            project_name: PROJECT_NAME_MAP[item.project_id] || 'AHH City'
          });
        });
      }
    } catch (err) {
      console.warn('Supabase fetch ahh_city_bookings notice:', err);
    }
  }

  // 3. Combine with LocalStorage fallback records
  if (typeof window !== 'undefined') {
    const localMaster = localStorage.getItem('ahh_master_bookings_data');
    if (localMaster) {
      try { JSON.parse(localMaster).forEach(addRecord); } catch (e) {}
    }

    const localCity = localStorage.getItem('ahh_city_bookings_data');
    if (localCity) {
      try {
        JSON.parse(localCity).forEach(b => {
          addRecord({
            ...b,
            plot_no: b.plotId,
            project_name: PROJECT_NAME_MAP[b.projectId] || 'AHH City'
          });
        });
      } catch (e) {}
    }
  }

  combinedRecords = Array.from(recordMap.values());

  // 4. Apply CNIC search filter if provided
  if (cnicSearch && cnicSearch.trim()) {
    const searchFormatted = formatCNIC(cnicSearch);
    const searchRaw = cnicSearch.replace(/\D/g, '');

    combinedRecords = combinedRecords.filter(r => {
      if (!r.cnic) return false;
      const recFormatted = formatCNIC(r.cnic);
      const recRaw = r.cnic.replace(/\D/g, '');
      return recFormatted === searchFormatted || recRaw.includes(searchRaw) || r.cnic.includes(cnicSearch.trim());
    });
  }

  return combinedRecords;
}

/**
 * Utility to backfill & sync all local and database records to Supabase.
 */
export async function syncAllBookingsToSupabase() {
  if (typeof window === 'undefined') return { success: false, synced: 0 };

  const masterList = await fetchMasterBookings();
  let count = 0;

  for (const record of masterList) {
    await syncBookingToMaster({
      projectId: record.project_name,
      clientName: record.client_name,
      cnic: record.cnic,
      phone: record.phone,
      plotId: record.plot_no,
      block: record.block,
      relativeName: record.nominee,
      date: record.booking_date
    });
    count++;
  }

  return { success: true, synced: count };
}

export async function deleteBookingFromDb(plotId) {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('ahh_city_bookings_data');
    if (local) {
      const bookingsList = JSON.parse(local);
      const filtered = bookingsList.filter(b => b.plotId !== plotId);
      localStorage.setItem('ahh_city_bookings_data', JSON.stringify(filtered));
    }
  }

  if (supabase) {
    try {
      const { error } = await supabase
        .from('ahh_city_bookings')
        .delete()
        .eq('plot_id', plotId);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting booking from Supabase:', err);
    }
  }

  return true;
}

export async function clearAllBookingsFromDb() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ahh_city_bookings_data');
    localStorage.removeItem('ahh_master_bookings_data');
  }

  if (supabase) {
    try {
      await supabase.from('master_bookings').delete().neq('project_name', 'SYSTEM_DUMMY_UNUSED');
      const { error } = await supabase
        .from('ahh_city_bookings')
        .delete()
        .neq('plot_id', 'SYSTEM_DUMMY_UNUSED');
      if (error) throw error;
    } catch (err) {
      console.error('Error clearing bookings from Supabase:', err);
    }
  }

  return true;
}


