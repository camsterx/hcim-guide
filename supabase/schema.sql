-- HCIM Guide only. Never run this in CADVYN.
create table if not exists public.step_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  step_id text not null check (length(step_id) between 1 and 80),
  is_completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, step_id)
);
create table if not exists public.hcim_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rsn text not null default '' check (char_length(rsn) <= 30),
  total_level integer check (total_level between 1 and 2376),
  firemaking_level integer check (firemaking_level between 1 and 99),
  herblore_level integer check (herblore_level between 1 and 99),
  updated_at timestamptz not null default now()
);
alter table public.step_progress enable row level security;
alter table public.hcim_profiles enable row level security;
create policy "read own step progress" on public.step_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "add own step progress" on public.step_progress for insert to authenticated with check ((select auth.uid())=user_id);
create policy "update own step progress" on public.step_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "delete own step progress" on public.step_progress for delete to authenticated using ((select auth.uid())=user_id);
create policy "read own profile" on public.hcim_profiles for select to authenticated using ((select auth.uid())=user_id);
create policy "add own profile" on public.hcim_profiles for insert to authenticated with check ((select auth.uid())=user_id);
create policy "update own profile" on public.hcim_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "delete own profile" on public.hcim_profiles for delete to authenticated using ((select auth.uid())=user_id);
revoke all on public.step_progress from anon;
revoke all on public.hcim_profiles from anon;
grant select,insert,update,delete on public.step_progress to authenticated;
grant select,insert,update,delete on public.hcim_profiles to authenticated;
