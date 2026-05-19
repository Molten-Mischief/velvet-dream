-- ===============================================================
-- Velvet Dream — Semantic Memory Retrieval Setup
-- Run this once in Supabase SQL Editor.
-- ===============================================================

-- 1. Enable the pgvector extension (semantic similarity search)
create extension if not exists vector;

-- 2. Create the memory_embeddings table
--    One row per memory card. Embedding vector stored alongside.
create table if not exists public.memory_embeddings (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  embedding vector(1536) not null,    -- text-embedding-3-small = 1536 dimensions
  content_hash text not null,          -- to detect when card content changed
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

-- 3. Row Level Security: same as user_data
alter table public.memory_embeddings enable row level security;

create policy "Users can read own embeddings"
  on public.memory_embeddings for select
  using (auth.uid() = user_id);

create policy "Users can insert own embeddings"
  on public.memory_embeddings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own embeddings"
  on public.memory_embeddings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own embeddings"
  on public.memory_embeddings for delete
  using (auth.uid() = user_id);

-- 4. Helper function for semantic similarity search
--    Takes a query embedding and returns the top N most similar cards
--    above the threshold, for the authenticated user.
create or replace function match_memories(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  card_id text,
  similarity float
)
language sql stable
as $$
  select
    card_id,
    1 - (embedding <=> query_embedding) as similarity
  from public.memory_embeddings
  where user_id = auth.uid()
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
