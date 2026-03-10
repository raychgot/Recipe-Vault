-- Create recipes table
create table public.recipes (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users(id) on delete cascade not null,
  title       text        not null,
  ingredients text[]      not null,
  instructions text       not null,
  cook_time   integer     not null,
  category    text        not null,
  created_at  timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.recipes enable row level security;

-- Policies: users can only access their own recipes
create policy "select own recipes"
  on public.recipes for select
  using (auth.uid() = user_id);

create policy "insert own recipes"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "update own recipes"
  on public.recipes for update
  using (auth.uid() = user_id);

create policy "delete own recipes"
  on public.recipes for delete
  using (auth.uid() = user_id);
