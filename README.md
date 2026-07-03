# SmartQueue – Smart Digital Queue Management System

SmartQueue is an industry-grade, real-time digital queue management system designed for modern SaaS operations. It streamlines customer flow, minimizes physical waiting room congestion, and provides staff and administrators with rich analytics and queue controls.

---

## Tech Stack

- **Frontend**: HTML5, Advanced Tailwind CSS v4, Vanilla JavaScript (ES6+ Modules), Vite
- **Animations**: GSAP (GreenSock Animation Platform)
- **Charts & Analytics**: Chart.js
- **QR Generation**: QRCode.js (via `qrcode` npm package)
- **Backend & Real-Time**: Supabase (PostgreSQL, Supabase Auth, Supabase Realtime)

---

## Features

### 👤 Customer Features
- **Register / Login**: Secure email-based authentication.
- **Join Queue**: Select branch, service, and priority (Normal, Senior, VIP, Emergency).
- **AI Wait Predictor**: Real-time waiting time preview *before* joining, based on active counters, historical averages, and queue density.
- **Live Queue Tracking**: Dynamic position and wait time tracker that updates instantly using Supabase Realtime when staff call their token.
- **Token QR Code**: Generates a custom QR code for contactless check-in/scanning at counters.
- **Queue History & Ratings**: View past visits and submit 1-5 star reviews with comments.
- **Theme Toggle**: Floating switch for Light and Dark mode.
- **PWA Support**: Fully installable as a Progressive Web App with offline caching support.

### 🧑‍💼 Staff Features
- **Counter Session Management**: Select branch and counter to start/close serving sessions.
- **Queue Controls**: Call Next (prioritized), Complete Service, Skip Customer, Recall Token (with simulated voice announcement), and Transfer Customer to another service.
- **Real-Time Stats**: Live counters for waiting, served, and skipped customers in the branch.

### 🔑 Admin Features
- **Overview Analytics**: Real-time traffic line charts and service distribution doughnut charts powered by Chart.js.
- **User Management**: Promote customers to staff or admin roles.
- **Branch, Service & Counter Setups**: Add/configure branches, counters, and services (with custom token prefixes and average times).
- **Audit Reports & CSV Export**: Detailed audit log of all generated tokens with one-click CSV export.

---

## Project Structure

```text
d:\smart line\
├── index.html                  # Main entry HTML
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration with Tailwind v4 plugin
├── public\
│   ├── favicon.svg             # App logo / icon
│   ├── manifest.json           # Web App Manifest for PWA installation
│   └── sw.js                   # Service Worker (Network-First caching strategy)
├── src\
│   ├── main.js                 # App bootstrapper, theme manager, SW registration
│   ├── router.js               # Vanilla JS hash-based router with role-based guards
│   ├── style.css               # Tailwind CSS v4 imports, theme, and utility classes
│   ├── assets\
│   ├── components\
│   │   ├── toast.js            # Premium animated toast notifications (GSAP)
│   │   ├── modal.js            # Animated action confirmation dialogs (GSAP)
│   │   ├── sidebar.js          # Responsive navigation sidebar based on user roles
│   │   └── skeletons.js        # Loading skeleton placeholders (cards, lists, tables)
│   ├── services\
│   │   ├── supabase.js         # Supabase client initialization
│   │   ├── auth.js             # Supabase Authentication and user profile sync
│   │   ├── queue.js            # Database queue operations (RPC triggers)
│   │   └── aiPredictor.js      # AI wait time prediction algorithm
│   └── pages\
│       ├── landing.js          # SaaS Landing Page
│       ├── auth.js             # Login / Register / Forgot Password forms
│       ├── customer.js         # Customer Dashboard, Join Queue, Live Tracking
│       ├── staff.js            # Staff Counter Board & controls
│       └── admin.js            # Admin panels, Chart.js analytics, and CSV exports
└── supabase\
    ├── migrations\
    │   └── 20260629000000_schema.sql  # Database tables, RLS policies, indexes, RPCs
    └── seed.sql                       # Seed data (branches, services, counters, test users)
```

---

## Setup & Installation

### 1. Clone & Install Dependencies
Navigate to the project directory and install the packages:
```bash
npm install
```

### 2. Configure Supabase Database
1. Create a new project on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase Dashboard.
3. Copy and run the contents of the schema migration file:
   [supabase/migrations/20260629000000_schema.sql](file:///d:/smart%20line/supabase/migrations/20260629000000_schema.sql)
4. Copy and run the contents of the seed data file to populate branches, services, counters, and test accounts:
   [supabase/seed.sql](file:///d:/smart%20line/supabase/seed.sql)

### 3. Set Up Environment Variables
1. Rename `.env.example` to `.env`.
2. Fill in your Supabase credentials (found under Project Settings -> API in your Supabase Dashboard):
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run the Development Server
Start Vite's local development server:
```bash
npm run dev
```
Open the printed URL (usually `http://localhost:5173`) in your browser.

---

## Testing Credentials

The database seed script creates three accounts for instant testing. The password for all three accounts is **`Password123`**:

1. **Admin Account**:
   - **Email**: `admin@smartqueue.com`
   - **Access**: Full settings, user role management, branch/service creation, reports.
2. **Staff Account**:
   - **Email**: `staff@smartqueue.com`
   - **Access**: Open Counter 1 at Downtown Branch, call next tokens, complete/skip/transfer.
3. **Customer Account**:
   - **Email**: `customer@smartqueue.com`
   - **Access**: Join queue, preview AI waiting times, live track tokens, submit feedback.

*Note: You can also register a new account from the Register screen and select your role directly from the dropdown for quick testing.*
