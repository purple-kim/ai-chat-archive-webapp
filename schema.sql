-- Supabase SQL Editor에서 그대로 실행하세요.

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  main text not null check (main in ('claude', 'chatgpt')),
  sub text not null check (sub in ('chat', 'cowork', 'claude-code', 'codex')),
  topic text not null check (topic in ('uxui', 'research', 'data', 'planning', 'dev', 'ai', 'collab', 'workflow', 'cli', 'vibe', 'etc')),
  title text not null,
  content text not null,
  entry_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists entries_entry_date_idx on entries (entry_date desc);

alter table entries enable row level security;

-- 지금은 비밀번호 보호 없이 진행하기로 했으므로, anon 키로 전체 CRUD를 허용합니다.
-- 나중에 접근 제어를 추가하면 이 정책을 더 좁혀야 합니다.
create policy "anon full access" on entries
  for all
  using (true)
  with check (true);
