// src/lib/db.js
// Database service client — AHH City Booking Portal
// Transparently switches between browser LocalStorage and cloud PostgreSQL (Supabase) if API keys are configured.

import { createClient } from '@supabase/supabase-js';

// Read credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton Supabase client instance (prevents duplicate GoTrueClient warnings on Next.js hot-reload)
const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (typeof window !== 'undefined') {
    if (!window._supabaseInstance) {
      window._supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
    return window._supabaseInstance;
  }
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
      return true;
    } catch (err) {
      console.error('Error saving booking to Supabase:', err);
    }
  }

  return true;
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
  }

  if (supabase) {
    try {
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
