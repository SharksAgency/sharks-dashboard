-- SharksAgency public content platform.
-- The public API is deliberately read-only for published content. Editorial
-- writes are restricted to authenticated users explicitly listed in profiles.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z0-9_]+$'),
  value jsonb not null,
  is_public boolean not null default false,
  description text,
  updated_at timestamptz not null default now(),
  constraint site_settings_value_is_object check (jsonb_typeof(value) in ('object', 'array', 'string', 'number', 'boolean'))
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  number text not null,
  title_ar text not null,
  title_en text,
  tags text[] not null default '{}',
  description_ar text not null,
  description_en text,
  image_url text not null,
  image_alt_ar text not null,
  image_alt_en text,
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  number text not null,
  scenario_label text not null,
  title_ar text not null,
  title_en text,
  focus text not null,
  keywords text[] not null default '{}',
  description_ar text not null,
  description_en text,
  cover_image_url text not null,
  cover_alt_ar text not null,
  cover_alt_en text,
  intro_ar text not null,
  intro_en text,
  hero_keywords text[] not null default '{}',
  situation_ar jsonb not null default '{}'::jsonb,
  situation_en jsonb not null default '{}'::jsonb,
  what_we_look_for jsonb not null default '{}'::jsonb,
  possible_outputs jsonb not null default '{}'::jsonb,
  philosophy_ar jsonb not null default '{}'::jsonb,
  cta_ar jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scenarios_situation_ar_is_object check (jsonb_typeof(situation_ar) = 'object'),
  constraint scenarios_what_we_look_for_is_object check (jsonb_typeof(what_we_look_for) = 'object'),
  constraint scenarios_possible_outputs_is_object check (jsonb_typeof(possible_outputs) = 'object')
);

create table public.scenario_steps (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references public.scenarios (id) on delete cascade,
  step_number text not null,
  title_ar text not null,
  title_en text,
  description_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (scenario_id, sort_order)
);

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_ar text not null,
  name_en text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title_ar text not null,
  title_en text,
  excerpt_ar text not null,
  excerpt_en text,
  deck_ar text not null,
  deck_en text,
  cover_image_url text not null,
  cover_alt_ar text not null,
  cover_alt_en text,
  category_id uuid references public.blog_categories (id) on delete set null,
  author_id uuid references public.profiles (id) on delete set null,
  author_name text not null default 'Sharks Studio',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean not null default false,
  published_at timestamptz,
  reading_time smallint not null default 1 check (reading_time between 1 and 120),
  content jsonb not null default '{"type":"doc","blocks":[]}'::jsonb,
  related_slugs text[] not null default '{}',
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_content_is_object check (jsonb_typeof(content) = 'object'),
  constraint blog_posts_publication_date check (status <> 'published' or published_at is not null)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title_ar text not null,
  title_en text,
  client_name text,
  year smallint check (year is null or year between 1900 and 2200),
  category text,
  services text[] not null default '{}',
  short_description_ar text not null,
  short_description_en text,
  challenge_ar text,
  approach_ar text,
  execution_ar text,
  result_ar text,
  cover_image_url text not null,
  thumbnail_image_url text,
  cover_alt_ar text not null,
  cover_alt_en text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_gallery (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  image_url text not null,
  alt_text_ar text not null,
  alt_text_en text,
  caption_ar text,
  caption_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (project_id, sort_order)
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  type text not null default 'partner' check (type in ('partner', 'client', 'collaborator')),
  logo_url text,
  website_url text,
  is_active boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_ar text not null,
  role_en text,
  bio_ar text,
  bio_en text,
  photo_url text,
  social_links jsonb not null default '[]'::jsonb,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_members_social_links_is_array check (jsonb_typeof(social_links) = 'array')
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'website-media',
  path text not null,
  filename text not null,
  mime_type text,
  size bigint check (size is null or size >= 0),
  alt_text_ar text not null default '',
  alt_text_en text,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create index blog_posts_category_id_idx on public.blog_posts (category_id);
create index blog_posts_author_id_idx on public.blog_posts (author_id);
create index media_assets_uploaded_by_idx on public.media_assets (uploaded_by);
create index services_active_sort_idx on public.services (sort_order) where is_active;
create index scenarios_published_sort_idx on public.scenarios (sort_order) where is_published;
create index scenarios_featured_sort_idx on public.scenarios (sort_order) where is_featured and is_published;
create index blog_posts_published_at_idx on public.blog_posts (published_at desc) where status = 'published';
create index blog_posts_featured_idx on public.blog_posts (published_at desc) where is_featured and status = 'published';
create index projects_published_sort_idx on public.projects (sort_order) where is_published;
create index projects_featured_sort_idx on public.projects (sort_order) where is_featured and is_published;
create index partners_active_sort_idx on public.partners (sort_order) where is_active;
create index partners_featured_sort_idx on public.partners (sort_order) where is_featured and is_active;
create index team_members_active_sort_idx on public.team_members (sort_order) where is_active;

create or replace function private.is_content_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'editor')
  );
$$;

revoke all on function private.is_content_editor() from public;
grant execute on function private.is_content_editor() to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services
for each row execute function public.set_updated_at();
create trigger scenarios_set_updated_at before update on public.scenarios
for each row execute function public.set_updated_at();
create trigger blog_categories_set_updated_at before update on public.blog_categories
for each row execute function public.set_updated_at();
create trigger blog_posts_set_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger partners_set_updated_at before update on public.partners
for each row execute function public.set_updated_at();
create trigger team_members_set_updated_at before update on public.team_members
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.scenarios enable row level security;
alter table public.scenario_steps enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.projects enable row level security;
alter table public.project_gallery enable row level security;
alter table public.partners enable row level security;
alter table public.team_members enable row level security;
alter table public.media_assets enable row level security;

create policy "Public can read public site settings"
on public.site_settings for select to anon, authenticated
using (is_public);
create policy "Editors manage site settings"
on public.site_settings for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read published services"
on public.services for select to anon, authenticated
using (is_active);
create policy "Editors manage services"
on public.services for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read published scenarios"
on public.scenarios for select to anon, authenticated
using (is_published);
create policy "Editors manage scenarios"
on public.scenarios for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read steps for published scenarios"
on public.scenario_steps for select to anon, authenticated
using (exists (
  select 1 from public.scenarios
  where scenarios.id = scenario_steps.scenario_id and scenarios.is_published
));
create policy "Editors manage scenario steps"
on public.scenario_steps for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read active blog categories"
on public.blog_categories for select to anon, authenticated
using (is_active);
create policy "Editors manage blog categories"
on public.blog_categories for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read published blog posts"
on public.blog_posts for select to anon, authenticated
using (status = 'published' and published_at <= now());
create policy "Editors manage blog posts"
on public.blog_posts for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read published projects"
on public.projects for select to anon, authenticated
using (is_published);
create policy "Editors manage projects"
on public.projects for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read gallery for published projects"
on public.project_gallery for select to anon, authenticated
using (exists (
  select 1 from public.projects
  where projects.id = project_gallery.project_id
    and projects.is_published
));
create policy "Editors manage project gallery"
on public.project_gallery for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read active partners"
on public.partners for select to anon, authenticated
using (is_active);
create policy "Editors manage partners"
on public.partners for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read active team members"
on public.team_members for select to anon, authenticated
using (is_active);
create policy "Editors manage team members"
on public.team_members for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Public can read media metadata"
on public.media_assets for select to anon, authenticated
using (true);
create policy "Editors manage media metadata"
on public.media_assets for all to authenticated
using ((select private.is_content_editor()))
with check ((select private.is_content_editor()));

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "Admins manage profiles"
on public.profiles for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.services, public.scenarios,
  public.scenario_steps, public.blog_categories, public.blog_posts,
  public.projects, public.project_gallery, public.partners,
  public.team_members, public.media_assets to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.site_settings,
  public.services, public.scenarios, public.scenario_steps,
  public.blog_categories, public.blog_posts, public.projects,
  public.project_gallery, public.partners, public.team_members,
  public.media_assets to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view website media"
on storage.objects for select to anon, authenticated
using (bucket_id = 'website-media');

create policy "Editors can upload website media"
on storage.objects for insert to authenticated
with check (bucket_id = 'website-media' and (select private.is_content_editor()));

create policy "Editors can update website media"
on storage.objects for update to authenticated
using (bucket_id = 'website-media' and (select private.is_content_editor()))
with check (bucket_id = 'website-media' and (select private.is_content_editor()));

create policy "Editors can delete website media"
on storage.objects for delete to authenticated
using (bucket_id = 'website-media' and (select private.is_content_editor()));

comment on table public.scenarios is 'Capability and approach scenarios; never client case studies.';
comment on table public.projects is 'Real portfolio projects only. Empty until verified work is published.';
