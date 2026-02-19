# 🚀 Taraweeh Finder - Quick Deployment Guide

## Instant Setup (5 minutes)

### 1. Prepare Supabase

```bash
# Go to https://supabase.com and create new project
# Copy these credentials:
NEXT_PUBLIC_SUPABASE_URL=https://your-xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### 2. Create Database Tables

Go to **SQL Editor** in Supabase and run:

```sql
-- Approved Mosques
CREATE TABLE approved_mosques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  sweet_type text,
  distribution_time text,
  crowd_level text,
  upvotes integer DEFAULT 0,
  views integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  approved_at timestamp
);

-- Mosque Submissions
CREATE TABLE mosque_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  sweet_type text,
  distribution_time text,
  crowd_level text,
  status text DEFAULT 'pending',
  created_at timestamp DEFAULT now()
);

-- Taraweeh Sessions
CREATE TABLE taraweeh_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id uuid NOT NULL REFERENCES approved_mosques(id) ON DELETE CASCADE,
  taraweeh_end_date date NOT NULL,
  session_number integer NOT NULL,
  created_at timestamp DEFAULT now()
);
```

### 3. Set Environment Variables

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Admin Auth
NEXT_PUBLIC_ADMIN_PASSWORD=choose-secure-password-here
```

### 4. Test Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial Taraweeh Finder"

# Push to GitHub (create repo first at github.com)
git remote add origin https://github.com/your-username/taraweeh-finder.git
git branch -M main
git push -u origin main
```

Then:
1. Go to **vercel.com**
2. Click "New Project"
3. Import your GitHub repo
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
5. Click **Deploy**

Done! ✨

---

## 📋 Testing Checklist

After deployment:

- [ ] Home page loads ✓
- [ ] Map shows with markers ✓
- [ ] Can filter by state ✓
- [ ] Upvote button works ✓
- [ ] Detail panel opens ✓
- [ ] Admin login works ✓
- [ ] Can approve/reject submissions ✓
- [ ] Can view all mosques ✓
- [ ] Responsive on mobile ✓

---

## 🔐 Admin Access

- URL: `yourapp.vercel.app/admin/login`
- Password: The one you set in `NEXT_PUBLIC_ADMIN_PASSWORD`
- Dashboard: View stats and submissions
- Moderation: Approve/reject new mosques

---

## 💡 Key Features

✅ **Public Side**
- Full-bleed interactive map
- Premium list view with filters
- Location-based sorting
- Mosque detail panels
- Upvote functionality
- Responsive design

✅ **Admin Side**
- Dashboard with stats
- Moderation queue
- Mosque management
- Search and filters
- Delete functionality
- Session tracking

✅ **Design**
- Premium dark theme
- Glass morphism
- Custom green markers
- Smooth animations
- SaaS-quality UI
- Consistent spacing

---

## 🆘 Troubleshooting

**Map not showing?**
- Check Supabase connection
- Verify markers have valid coordinates

**Admin not working?**
- Clear browser cookies
- Verify admin password is correct

**Styling looks off?**
- Run `npm run build` locally
- Check `.next` folder is not in git

**Database errors?**
- Verify tables exist in Supabase
- Check RLS policies allow public read

---

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments, edge functions
- **Supabase Dashboard**: Monitor database, view logs
- **Google Analytics** (Optional): Add to track users

---

## Next Steps

1. Add sample data (mosques) to test
2. Configure custom domain
3. Add email notifications
4. Create mobile app (React Native)
5. Add advanced analytics

---

**Built with:** Next.js 14, TypeScript, Tailwind, Supabase, Leaflet

**Deployed on:** Vercel (serverless)

**Database:** Supabase PostgreSQL

Happy deploying! 🕌

