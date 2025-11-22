-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for greetings
create table greetings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  label text not null,
  text text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table greetings enable row level security;

create policy "Users can view own greetings." on greetings
  for select using (auth.uid() = user_id);

create policy "Users can insert own greetings." on greetings
  for insert with check (auth.uid() = user_id);

create policy "Users can update own greetings." on greetings
  for update using (auth.uid() = user_id);

create policy "Users can delete own greetings." on greetings
  for delete using (auth.uid() = user_id);

-- Create a table for connections (scan history)
create table connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  scanned_username text not null,
  scanned_at timestamp with time zone default timezone('utc'::text, now()),
  greeting_used_id uuid references greetings(id),
  note text
);

alter table connections enable row level security;

create policy "Users can view own connections." on connections
  for select using (auth.uid() = user_id);

create policy "Users can insert own connections." on connections
  for insert with check (auth.uid() = user_id);

-- Trigger to create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
