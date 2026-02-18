# Taraweeh Finder – Deployment Guide

This guide will help you deploy Taraweeh Finder from scratch. No coding required!

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com/](https://supabase.com/) and sign up.
2. Click **New Project**.
3. Set a name, password, and region (choose closest to India).
4. Wait for your project to be created.

## 2. Set Up the Database

1. In Supabase, go to **SQL Editor**.
2. Copy everything from `src/db/schema.sql` in this project.
3. Paste and run it in the SQL Editor to create the tables and demo data.

## 3. Get Your Supabase Keys

1. In Supabase, go to **Project Settings > API**.
2. Copy the following:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## 4. Set Environment Variables

1. In your project, copy `.env.example` to `.env.local`.
2. Paste your Supabase values from above.
3. Set a strong password for `ADMIN_PASSWORD` (for admin login).

## 5. Deploy to Vercel

1. Go to [https://vercel.com/](https://vercel.com/) and sign up.
2. Click **New Project** and import your GitHub repo (or upload the code).
3. In **Environment Variables**, add all from `.env.example` (with your values).
4. Click **Deploy**.

---

## That’s it! Your Taraweeh Finder app will be live and ready for Ramadan.

If you need help, check the README or ask your developer.
