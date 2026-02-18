
# Taraweeh Finder

A production-ready, mobile-first web app to find mosques in India where Taraweeh is ending and sweets are distributed. Built with Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui, Supabase, and Leaflet.js.

## 🌙 Features

- Auto location detection
- Nearest mosques, sort by distance
- Filter by state & city
- Map view (dark theme) + list view
- Upvote (one per device), view mosque details
- Public mosque submission (no login)
- Admin panel: secure login, dashboard, moderation, analytics, CRUD
- Premium dark mode only (glass cards, soft glow, modern UI)
- Ramadan day counter in navbar
- Demo data for Delhi, Mumbai, Hyderabad, Lucknow, Srinagar

## 🛠 Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (PostgreSQL)
- Leaflet.js (OpenStreetMap dark tiles)

## 🚀 Quick Start

1. **Clone the repo:**
	```sh
	git clone <your-repo-url>
	cd taraweeh-finder
	```
2. **Install dependencies:**
	```sh
	npm install
	```
3. **Set up Supabase:**
	- Create a project at [supabase.com](https://supabase.com/)
	- Run the SQL in `src/db/schema.sql` in the Supabase SQL editor
	- Copy your Supabase keys into `.env.local` (see `.env.example`)
4. **Run locally:**
	```sh
	npm run dev
	```
5. **Deploy:**
	- Deploy to Vercel and add your environment variables
	- See `DEPLOYMENT_GUIDE.md` for step-by-step instructions

## 🧪 Demo Data
Demo mosques for Delhi, Mumbai, Hyderabad, Lucknow, Srinagar are included in the SQL schema.

## 🔐 Admin Login
Set `ADMIN_PASSWORD` in your environment variables. Only admins can access `/admin` routes.

## 📁 Project Structure
- `src/app` – App routes (public, admin, submit, etc.)
- `src/components` – UI and feature components
- `src/lib` – Supabase client, constants
- `src/db` – SQL schema
- `src/styles` – Tailwind and custom styles

## 💡 Customization
- All colors and UI are set for premium dark mode.
- To change Ramadan start date, edit `src/components/RamadanCounter.tsx`.

## 📝 License
MIT
