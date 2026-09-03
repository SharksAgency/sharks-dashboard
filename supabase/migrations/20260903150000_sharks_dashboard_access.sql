-- Sharks Dashboard private access layer.
-- Additive and backward compatible with the existing public content platform.

create table if not exists public.dashboard_access (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null check (role in ('owner', 'admin', 'editor')),
  is_active boolean not null default true,
  invited_by uuid references auth.users (id) on delete set null,
  registered_user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dashboard_access_email_normalized check (email = lower(trim(email)))
);

create unique index if not exists dashboard_access_email_lower_idx
on public.dashboard_access (lower(email));

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists is_active boolean not null default true;
alter table public.profiles add column if not exists preferred_language text
  check (preferred_language is null or preferred_language in ('ar', 'en'));

-- Optional bilingual fields requested by the dashboard. The public website can
-- continue selecting its original columns unchanged.
alter table public.scenario_steps add column if not exists description_en text;
alter table public.scenarios add column if not exists what_we_look_for_en jsonb not null default '{}'::jsonb;
alter table public.scenarios add column if not exists possible_outputs_en jsonb not null default '{}'::jsonb;
alter table public.scenarios add column if not exists philosophy_en jsonb not null default '{}'::jsonb;
alter table public.scenarios add column if not exists cta_en jsonb not null default '{}'::jsonb;
alter table public.projects add column if not exists challenge_en text;
alter table public.projects add column if not exists approach_en text;
alter table public.projects add column if not exists execution_en text;
alter table public.projects add column if not exists result_en text;

update public.profiles as profile
set email = lower(users.email), is_active = true
from auth.users as users
where users.id = profile.id and profile.email is null;

insert into public.dashboard_access (email, role, is_active, registered_user_id)
select lower(users.email), profile.role, true, profile.id
from public.profiles as profile
join auth.users as users on users.id = profile.id
where users.email is not null
on conflict (lower(email)) do update
set registered_user_id = coalesce(public.dashboard_access.registered_user_id, excluded.registered_user_id);

insert into public.dashboard_access (email, role, is_active, registered_user_id)
values (
  'naderas109@gmail.com',
  'owner',
  true,
  (select id from auth.users where lower(email) = 'naderas109@gmail.com' limit 1)
)
on conflict (lower(email)) do update
set role = 'owner', is_active = true,
  registered_user_id = coalesce(public.dashboard_access.registered_user_id, excluded.registered_user_id);

create or replace function private.dashboard_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select access.role
  from public.dashboard_access as access
  where access.is_active
    and (
      access.registered_user_id = (select auth.uid())
      or (
        access.registered_user_id is null
        and access.email = lower(coalesce((select auth.jwt()->>'email'), ''))
      )
    )
  limit 1;
$$;

revoke all on function private.dashboard_role() from public;
grant execute on function private.dashboard_role() to authenticated;

create or replace function private.is_content_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = (select auth.uid())
      and profile.is_active
      and (select private.dashboard_role()) in ('owner', 'admin', 'editor')
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select private.dashboard_role()) in ('owner', 'admin');
$$;

create or replace function public.can_register_dashboard_user(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.dashboard_access
    where email = lower(trim(p_email))
      and is_active
      and registered_user_id is null
  );
$$;

revoke all on function public.can_register_dashboard_user(text) from public;
grant execute on function public.can_register_dashboard_user(text) to anon, authenticated;

create or replace function public.handle_dashboard_user_registration()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed public.dashboard_access%rowtype;
  profile_role text;
begin
  select * into allowed
  from public.dashboard_access
  where email = lower(trim(new.email)) and is_active
  for update;

  if not found then
    return new;
  end if;

  profile_role := case when allowed.role in ('owner', 'admin') then 'admin' else 'editor' end;

  insert into public.profiles (id, full_name, avatar_url, role, email, is_active)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    profile_role,
    lower(new.email),
    true
  )
  on conflict (id) do update set
    email = excluded.email,
    role = excluded.role,
    is_active = true,
    updated_at = now();

  update public.dashboard_access
  set registered_user_id = new.id, updated_at = now()
  where id = allowed.id;

  return new;
end;
$$;

revoke all on function public.handle_dashboard_user_registration() from public, anon, authenticated;

drop trigger if exists on_dashboard_auth_user_created on auth.users;
create trigger on_dashboard_auth_user_created
after insert on auth.users
for each row execute function public.handle_dashboard_user_registration();

create or replace function public.sync_dashboard_access_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  matched_user_id uuid;
  matched_full_name text;
  profile_role text;
begin
  matched_user_id := new.registered_user_id;
  if matched_user_id is null then
    select users.id, coalesce(
      nullif(users.raw_user_meta_data->>'full_name', ''),
      split_part(users.email, '@', 1)
    )
    into matched_user_id, matched_full_name
    from auth.users as users
    where lower(users.email) = new.email
    limit 1;
    new.registered_user_id := matched_user_id;
  else
    select coalesce(
      nullif(users.raw_user_meta_data->>'full_name', ''),
      split_part(users.email, '@', 1)
    )
    into matched_full_name
    from auth.users as users
    where users.id = matched_user_id;
  end if;

  if matched_user_id is not null then
    profile_role := case when new.role in ('owner', 'admin') then 'admin' else 'editor' end;
    insert into public.profiles (id, full_name, role, email, is_active)
    values (
      matched_user_id,
      coalesce(nullif(matched_full_name, ''), split_part(new.email, '@', 1)),
      profile_role,
      new.email,
      new.is_active
    )
    on conflict (id) do update set
      role = excluded.role,
      email = excluded.email,
      is_active = excluded.is_active,
      updated_at = now();
  end if;
  return new;
end;
$$;

revoke all on function public.sync_dashboard_access_profile() from public, anon, authenticated;

drop trigger if exists dashboard_access_sync_auth on public.dashboard_access;
create trigger dashboard_access_sync_auth
before insert or update of email, role, is_active, registered_user_id
on public.dashboard_access
for each row execute function public.sync_dashboard_access_profile();

-- Ensure access rows seeded before the trigger also have a compatible profile.
insert into public.profiles (id, full_name, role, email, is_active)
select
  users.id,
  coalesce(nullif(users.raw_user_meta_data->>'full_name', ''), split_part(users.email, '@', 1)),
  case when access.role in ('owner', 'admin') then 'admin' else 'editor' end,
  access.email,
  access.is_active
from public.dashboard_access as access
join auth.users as users on users.id = access.registered_user_id
on conflict (id) do update set
  role = excluded.role,
  email = excluded.email,
  is_active = excluded.is_active,
  updated_at = now();

drop trigger if exists dashboard_access_set_updated_at on public.dashboard_access;
create trigger dashboard_access_set_updated_at
before update on public.dashboard_access
for each row execute function public.set_updated_at();

alter table public.dashboard_access enable row level security;

drop policy if exists "Dashboard users read their access" on public.dashboard_access;
create policy "Dashboard users read their access"
on public.dashboard_access for select to authenticated
using (
  registered_user_id = (select auth.uid())
  or (select private.dashboard_role()) in ('owner', 'admin')
);

drop policy if exists "Owners and admins add access" on public.dashboard_access;
create policy "Owners and admins add access"
on public.dashboard_access for insert to authenticated
with check (
  (select private.dashboard_role()) = 'owner'
  or ((select private.dashboard_role()) = 'admin' and role = 'editor')
);

drop policy if exists "Owners and admins update access" on public.dashboard_access;
create policy "Owners and admins update access"
on public.dashboard_access for update to authenticated
using (
  (select private.dashboard_role()) = 'owner'
  or ((select private.dashboard_role()) = 'admin' and role = 'editor')
)
with check (
  (
    (select private.dashboard_role()) = 'owner'
    and (
      registered_user_id is distinct from (select auth.uid())
      or (role = 'owner' and is_active)
    )
  )
  or ((select private.dashboard_role()) = 'admin' and role = 'editor')
);

drop policy if exists "Owners and admins remove access" on public.dashboard_access;
create policy "Owners and admins remove access"
on public.dashboard_access for delete to authenticated
using (
  registered_user_id is distinct from (select auth.uid())
  and (
    (select private.dashboard_role()) = 'owner'
    or ((select private.dashboard_role()) = 'admin' and role = 'editor')
  )
);

grant select, insert, update, delete on public.dashboard_access to authenticated;

drop policy if exists "Admins manage profiles" on public.profiles;

drop policy if exists "Owners manage profiles" on public.profiles;
create policy "Owners manage profiles"
on public.profiles for all to authenticated
using ((select private.dashboard_role()) = 'owner')
with check ((select private.dashboard_role()) = 'owner');

drop policy if exists "Admins manage non-owner profiles" on public.profiles;
create policy "Admins manage non-owner profiles"
on public.profiles for all to authenticated
using (
  (select private.dashboard_role()) = 'admin'
  and not exists (
    select 1 from public.dashboard_access as access
    where access.registered_user_id = profiles.id and access.role = 'owner'
  )
)
with check (
  (select private.dashboard_role()) = 'admin'
  and not exists (
    select 1 from public.dashboard_access as access
    where access.registered_user_id = profiles.id and access.role = 'owner'
  )
);

create table if not exists public.dashboard_activity (
  id bigint generated by default as identity primary key,
  actor_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists dashboard_activity_created_at_idx
on public.dashboard_activity (created_at desc);

alter table public.dashboard_activity enable row level security;

drop policy if exists "Dashboard users read activity" on public.dashboard_activity;
create policy "Dashboard users read activity"
on public.dashboard_activity for select to authenticated
using ((select private.dashboard_role()) in ('owner', 'admin', 'editor'));

drop policy if exists "Dashboard users record their activity" on public.dashboard_activity;
create policy "Dashboard users record their activity"
on public.dashboard_activity for insert to authenticated
with check (
  actor_id = (select auth.uid())
  and (select private.dashboard_role()) in ('owner', 'admin', 'editor')
);

grant select, insert on public.dashboard_activity to authenticated;

create or replace function public.update_dashboard_profile(
  p_full_name text,
  p_avatar_url text default null,
  p_preferred_language text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce((select private.dashboard_role()) in ('owner', 'admin', 'editor'), false) is not true then
    raise exception 'Dashboard access required';
  end if;
  if trim(coalesce(p_full_name, '')) = '' then
    raise exception 'Full name is required';
  end if;
  if p_preferred_language is not null and p_preferred_language not in ('ar', 'en') then
    raise exception 'Invalid language';
  end if;
  update public.profiles
  set full_name = trim(p_full_name),
      avatar_url = nullif(trim(coalesce(p_avatar_url, '')), ''),
      preferred_language = p_preferred_language,
      updated_at = now()
  where id = (select auth.uid());
end;
$$;

revoke all on function public.update_dashboard_profile(text, text, text) from public;
grant execute on function public.update_dashboard_profile(text, text, text) to authenticated;

comment on table public.dashboard_access is 'Private allowlist and role source for Sharks Dashboard registration and authorization.';
comment on table public.dashboard_activity is 'Lightweight operational audit trail for dashboard content actions.';
