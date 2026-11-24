create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

revoke all on table public.contact_messages from public, anon, authenticated;
grant insert on table public.contact_messages to anon;

drop policy if exists "Allow anonymous contact message inserts" on public.contact_messages;
drop policy if exists "Allow public contact message inserts" on public.contact_messages;
create policy "Allow anonymous contact message inserts"
  on public.contact_messages
  for insert
  to anon
  with check (
    char_length(trim(name)) > 0
    and char_length(trim(email)) > 0
    and char_length(trim(subject)) > 0
    and char_length(trim(message)) >= 10
  );
