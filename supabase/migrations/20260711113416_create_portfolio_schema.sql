/*
# Create portfolio database schema for Khalid Haider Jafri

## Overview
This migration creates the complete database schema for a full-stack developer portfolio.
It supports public read access for all portfolio content and admin-only write access
via Supabase Auth. The admin user is created through Supabase Auth (email/password),
not through a public signup page.

## New Tables

1. **profiles** — Single-row table storing the developer's professional profile.
   - `id` (int2, primary key, default 1) — forced single row
   - `name`, `role`, `secondary_role`, `tagline`, `intro`, `bio`, `philosophy`
   - `resume_url`, `availability_status`, `avatar_url`
   - `created_at`, `updated_at`

2. **experiences** — Work experience entries for the timeline.
   - `id` (uuid, primary key)
   - `role`, `company`, `start_date`, `end_date`, `current`
   - `description`, `focus_areas` (text[]), `is_published`, `display_order`
   - `created_at`, `updated_at`

3. **skill_categories** — Grouped skill categories (e.g., Full-Stack JS, .NET).
   - `id` (uuid, primary key)
   - `name`, `description`, `icon`, `is_published`, `display_order`
   - `created_at`, `updated_at`

4. **skills** — Individual skills belonging to a category.
   - `id` (uuid, primary key)
   - `category_id` (FK → skill_categories)
   - `name`, `is_published`, `display_order`
   - `created_at`, `updated_at`

5. **projects** — Portfolio projects (Coming Soon initially, CRUD-ready).
   - `id` (uuid, primary key)
   - `title`, `slug` (unique), `short_description`, `full_description`
   - `thumbnail_url`, `gallery_urls` (text[])
   - `technologies` (text[]), `github_url`, `live_url`
   - `is_featured`, `is_published`, `status`, `display_order`
   - `case_study` (jsonb)
   - `created_at`, `updated_at`

6. **services** — Freelance service offerings.
   - `id` (uuid, primary key)
   - `title`, `description`, `icon`, `is_published`, `display_order`
   - `created_at`, `updated_at`

7. **social_links** — Social/professional links (configurable from admin).
   - `id` (uuid, primary key)
   - `platform`, `url`, `icon`, `is_published`, `display_order`
   - `created_at`, `updated_at`

8. **contact_messages** — Inquiries from the contact form.
   - `id` (uuid, primary key)
   - `name`, `email`, `company`, `project_type`, `budget_range`, `message`
   - `is_read`, `created_at`

9. **site_settings** — Global site configuration (single row).
   - `id` (int2, default 1, forced single row)
   - `stats` (jsonb) — homepage statistics
   - `resume_url`, `availability_status`
   - `created_at`, `updated_at`

## Security (RLS)
- All content tables: public SELECT (anon + authenticated), admin-only INSERT/UPDATE/DELETE (authenticated).
- contact_messages: public INSERT (anon + authenticated), admin-only SELECT/UPDATE/DELETE.
- Admin write access is scoped to authenticated users. Only the admin account
  (created via Supabase Auth) will have an authenticated session.

## Notes
- The `profiles` and `site_settings` tables are constrained to a single row via CHECK constraint on id = 1.
- All content tables have `is_published` flags and `display_order` for ordering.
- Projects have a unique slug for SEO-friendly URLs.
- Indexes are added on frequently queried columns.
*/

-- ===== PROFILES =====
CREATE TABLE IF NOT EXISTS profiles (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name text NOT NULL DEFAULT 'Khalid Haider Jafri',
  role text NOT NULL DEFAULT 'Full-Stack Software Developer',
  secondary_role text,
  tagline text,
  intro text,
  bio text,
  philosophy text,
  resume_url text,
  availability_status text DEFAULT 'Available for selected freelance projects',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
CREATE POLICY "admin_insert_profiles" ON profiles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
CREATE POLICY "admin_update_profiles" ON profiles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;
CREATE POLICY "admin_delete_profiles" ON profiles FOR DELETE
  TO authenticated USING (true);

-- ===== EXPERIENCES =====
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  start_date text NOT NULL,
  end_date text,
  current boolean DEFAULT false,
  description text,
  focus_areas text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_experiences" ON experiences;
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_experiences" ON experiences;
CREATE POLICY "admin_insert_experiences" ON experiences FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_experiences" ON experiences;
CREATE POLICY "admin_update_experiences" ON experiences FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_experiences" ON experiences;
CREATE POLICY "admin_delete_experiences" ON experiences FOR DELETE
  TO authenticated USING (true);

-- ===== SKILL CATEGORIES =====
CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  is_published boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skill_categories" ON skill_categories;
CREATE POLICY "public_read_skill_categories" ON skill_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_skill_categories" ON skill_categories;
CREATE POLICY "admin_insert_skill_categories" ON skill_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skill_categories" ON skill_categories;
CREATE POLICY "admin_update_skill_categories" ON skill_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skill_categories" ON skill_categories;
CREATE POLICY "admin_delete_skill_categories" ON skill_categories FOR DELETE
  TO authenticated USING (true);

-- ===== SKILLS =====
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_published boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_skills" ON skills;
CREATE POLICY "admin_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skills" ON skills;
CREATE POLICY "admin_update_skills" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skills" ON skills;
CREATE POLICY "admin_delete_skills" ON skills FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_skills_category_id ON skills(category_id);

-- ===== PROJECTS =====
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  full_description text,
  thumbnail_url text,
  gallery_urls text[] DEFAULT '{}',
  technologies text[] DEFAULT '{}',
  github_url text,
  live_url text,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  status text DEFAULT 'coming_soon',
  display_order int DEFAULT 0,
  case_study jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);

-- ===== SERVICES =====
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  is_published boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_services" ON services;
CREATE POLICY "admin_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- ===== SOCIAL LINKS =====
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  is_published boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social_links" ON social_links;
CREATE POLICY "public_read_social_links" ON social_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_social_links" ON social_links;
CREATE POLICY "admin_insert_social_links" ON social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_social_links" ON social_links;
CREATE POLICY "admin_update_social_links" ON social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_social_links" ON social_links;
CREATE POLICY "admin_delete_social_links" ON social_links FOR DELETE
  TO authenticated USING (true);

-- ===== CONTACT MESSAGES =====
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  project_type text,
  budget_range text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert (contact form submissions)
DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Admin-only read/update/delete
DROP POLICY IF EXISTS "admin_read_contact_messages" ON contact_messages;
CREATE POLICY "admin_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- ===== SITE SETTINGS =====
CREATE TABLE IF NOT EXISTS site_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  stats jsonb DEFAULT '[]'::jsonb,
  resume_url text,
  availability_status text DEFAULT 'Available for selected freelance projects',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_site_settings" ON site_settings;
CREATE POLICY "admin_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- ===== UPDATED_AT TRIGGER =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY['profiles','experiences','skill_categories','skills','projects','services','social_links','site_settings'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', tbl);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', tbl);
  END LOOP;
END;
$$;
