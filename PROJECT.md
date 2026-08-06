# AHH Brothers — Builders & Developers
## Project Documentation

> **Website for AHH Brothers Builders & Developers** — a premium real estate company based in Karachi, Pakistan. Founded in 2018, the company delivers residential and commercial projects including Hooria Villas, Summer Farm Houses, Labour City, and AHH-City.

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
|-------------|------------------------------------------|
| Framework    | Next.js v16 (App Router) |
| Language     | TypeScript + JavaScript                 |
| Styling      | Tailwind CSS v4                         |
| Database     | Supabase (PostgreSQL) with LocalStorage fallback |
| Icons        | Lucide React                            |
| Fonts        | Playfair Display, Inter, Outfit (Google Fonts) |
| Node Version | >=20 <25                                |

---

## 📁 Project Structure

```
ahh/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage (main landing page)
│   │   ├── layout.tsx          # Root layout (Header, Navbar, Footer, WhatsApp btn)
│   │   ├── globals.css         # Global styles
│   │   ├── about/              # About Us page
│   │   ├── blogs/              # Blog listing & posts
│   │   ├── booking/            # Plot booking portal
│   │   ├── calculator/         # Payment/installment calculator
│   │   ├── construction-updates/  # Construction progress updates
│   │   ├── contact/            # Contact page
│   │   ├── current-projects/   # Ongoing projects
│   │   ├── delivered-projects/ # Completed projects showcase
│   │   ├── events/             # Company events
│   │   ├── gallery/            # Media gallery
│   │   ├── legal-compliance/   # Legal & compliance information
│   │   ├── overseas-investors/ # Info for overseas Pakistani investors
│   │   ├── projects/           # All projects listing
│   │   └── site-visit/         # Site visit scheduling
│   │
│   ├── components/             # Shared React components
│   │   ├── Header.tsx          # Top bar (contact info, social links)
│   │   ├── Navbar.tsx          # Sticky navigation bar
│   │   ├── Footer.tsx          # Site footer
│   │   ├── WhatsAppButton.tsx  # Floating WhatsApp CTA button
│   │   ├── AdminLeftSidebar.js # Admin panel sidebar
│   │   └── booking/            # Booking-specific sub-components
│   │
│   └── lib/                    # Utilities & data layer
│       ├── db.js               # Database service (Supabase + LocalStorage)
│       ├── projectsData.js     # Static projects data
│       ├── sitePlanData.js     # AHH-City site plan plot data
│       ├── labourCitySitePlanData.js  # Labour City plot data
│       ├── imageStore.js       # Image asset references
│       ├── media.ts            # Media utility helpers
│       ├── dateUtils.js        # Date formatting helpers
│       └── numberToWords.js    # Number-to-words converter (for receipts)
│
├── public/                     # Static assets (images, icons)
├── scripts/                    # Utility/build scripts
├── .env.local                  # Local environment variables (not committed)
├── .env.development            # Development environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config / postcss   # Tailwind + PostCSS setup
└── package.json
```

---

## 🏠 Key Pages & Features

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, featured projects, company highlights |
| Projects | `/projects` | All real estate projects |
| Current Projects | `/current-projects` | Ongoing under-construction projects |
| Delivered Projects | `/delivered-projects` | Completed handover projects |
| Booking Portal | `/booking` | Interactive plot map + booking form |
| Calculator | `/calculator` | Plot price & installment calculator |
| Construction Updates | `/construction-updates` | Progress photos & milestone updates |
| Gallery | `/gallery` | Photo gallery |
| Events | `/events` | Company events & announcements |
| Blogs | `/blogs` | Articles & news |
| About | `/about` | Company history & team |
| Contact | `/contact` | Contact form & office info |
| Legal & Compliance | `/legal-compliance` | Legal documents & NOC info |
| Overseas Investors | `/overseas-investors` | Guide for international buyers |
| Site Visit | `/site-visit` | Schedule a site visit |

### Admin Features
- **Admin Left Sidebar** — accessible to authorized users for managing data
- **Booking Portal** — plot selection on interactive map, client registration, payment tracking

---

## 🗄️ Database Layer (`src/lib/db.js`)

The app uses a **dual-mode database strategy**:

- **Primary**: Supabase (PostgreSQL cloud) — used when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured.
- **Fallback**: Browser `localStorage` — used when Supabase credentials are absent (useful for local dev without cloud setup).

### Supabase Tables

#### `ahh_city_plots`
Stores the interactive site plan plot coordinates for AHH-City.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Unique plot identifier |
| `type` | TEXT | Plot type (e.g., residential, commercial) |
| `coords` | JSONB | Polygon coordinates |
| `raw_coords` | TEXT | Raw coordinate string |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

#### `ahh_city_bookings`
Stores client booking records.

| Column | Type | Description |
|--------|------|-------------|
| `plot_id` | TEXT (PK → FK) | References `ahh_city_plots.id` |
| `client_name` | TEXT | Buyer's full name |
| `relative_name` | TEXT | Next of kin / relative name |
| `cnic` | TEXT | National ID number |
| `phone` | TEXT | Contact number |
| `email` | TEXT | Email address |
| `block` | TEXT | Block identifier |
| `payment_mode` | TEXT | `Cash`, `Cheque`, `Bank Transfer`, etc. |
| `bank_name` | TEXT | Bank name (if applicable) |
| `plot_type` | TEXT | Type of plot booked |
| `status` | TEXT | `Available`, `Token`, `Booked`, `Transferred` |
| `total_price` | NUMERIC | Full plot price |
| `paid_amount` | NUMERIC | Amount paid so far |
| `date` | TEXT | Booking date |
| `token_expiry_date` | TEXT | Token validity expiry |
| `installments` | JSONB | Installment schedule array |

### Exported DB Functions

```js
fetchPlots()           // Get all plots
savePlotToDb(plot)     // Create or update a plot
deletePlotFromDb(id)   // Remove a plot
clearAllPlotsFromDb()  // Wipe all plots

fetchBookings()            // Get all bookings
saveBookingToDb(booking)   // Create or update a booking
deleteBookingFromDb(id)    // Remove a booking
clearAllBookingsFromDb()   // Wipe all bookings
```

---

## 🌍 Environment Variables

Create a `.env.local` file in the root with:

```env
# Supabase (optional — falls back to localStorage if not set)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🚀 Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

---

## 🏗️ Real Estate Projects

| Project | Type | Location |
|---------|------|----------|
| **Hooria Villas** | Residential Villas | Karachi |
| **Summer Farm Houses** | Farm Houses | Near Karachi |
| **Labour City** | Affordable Housing Township | Karachi |
| **AHH-City** | Mixed-use Township | Karachi |

---

## 📋 Company Info

- **Company**: AHH Brothers Builders & Developers
- **Founded**: 2018
- **Location**: Karachi, Pakistan (Gulshan-e-Maymar area)
- **Focus**: Premium residential plots, villas, farm houses, and township projects
- **Target Market**: Local buyers + Overseas Pakistani investors

---

*Last updated: August 2026*
