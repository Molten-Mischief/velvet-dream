# Velvet Dream — Project Guide

## What this is
A single-file PWA. The entire app is one HTML file. It calls an
external model API (via OpenRouter) and has its own memory system.
Built around configurable user-name and AI-name fields — the use
case depends on the user; nothing is hardcoded to a persona.
Deployed via GitHub Pages, synced through Supabase.

## Deploy structure (CURRENT — revisit at test/prod split)
- Served file is velvet_dream.html. This is the live app.
- index.html is currently a permanent redirect to velvet_dream.html.
  Do not modify without an explicit decision to change deploy
  structure. A testing + user-facing split is planned; when it
  happens, index.html's role changes deliberately. Flag it, don't
  silently edit it.
- manifest.json start_url is ./velvet_dream.html
- Deploy is a git push to Molten-Mischief/velvet-dream.

## Hard rules
- Never rename the served file. Always velvet_dream.html.
- Service worker (sw.js) removed at wave 30c, source of past pain.
  Do not reintroduce or modify without explicit discussion.
- Update the version label in the header div every wave, including
  patches. Only visible proof a push landed.
- Never suggest "clear/wipe site data." MECHANISM: app has uploaded
  full state to Supabase as a single chunk; on login, sync can treat
  local state as final truth and push it wholesale. Wiping local
  first risks uploading empty state as authoritative and destroying
  cloud data. Not confirmed fixed — treat as live. Safe cache fix:
  Ctrl+Shift+R.

## Architecture facts
- Thread summaries are append-only. Never rewrite or condense.
- Stack: OpenRouter, Supabase + pgvector, embeddings via OpenRouter
  to OpenAI text-embedding-3-small.
- Wave 37 is a planned episodic thread architecture overhaul.

## How to work with me
- Explain what a change does and why before making it.
- Show complete code in context, not fragments.
- Concise. One change at a time, confirm before applying.
- When corrected, adjust without re-litigating.# Velvet Dream — Project Guide

## What this is
A single-file PWA. The entire app is one HTML file. It calls an
external model API (via OpenRouter) and has its own memory system.
Built around configurable user-name and AI-name fields — the use
case depends on the user; nothing is hardcoded to a persona.
Deployed via GitHub Pages, synced through Supabase.

## Deploy structure (CURRENT — revisit at test/prod split)
- Served file is velvet_dream.html. This is the live app.
- index.html is currently a permanent redirect to velvet_dream.html.
  Do not modify without an explicit decision to change deploy
  structure. A testing + user-facing split is planned; when it
  happens, index.html's role changes deliberately. Flag it, don't
  silently edit it.
- manifest.json start_url is ./velvet_dream.html
- Deploy is a git push to Molten-Mischief/velvet-dream.

## Hard rules
- Never rename the served file. Always velvet_dream.html.
- Service worker (sw.js) removed at wave 30c, source of past pain.
  Do not reintroduce or modify without explicit discussion.
- Update the version label in the header div every wave, including
  patches. Only visible proof a push landed.
- Never suggest "clear/wipe site data." MECHANISM: app has uploaded
  full state to Supabase as a single chunk; on login, sync can treat
  local state as final truth and push it wholesale. Wiping local
  first risks uploading empty state as authoritative and destroying
  cloud data. Not confirmed fixed — treat as live. Safe cache fix:
  Ctrl+Shift+R.

## Architecture facts
- Thread summaries are append-only. Never rewrite or condense.
- Stack: OpenRouter, Supabase + pgvector, embeddings via OpenRouter
  to OpenAI text-embedding-3-small.
- Wave 37 is a planned episodic thread architecture overhaul.

## How to work with me
- Explain what a change does and why before making it.
- Show complete code in context, not fragments.
- Concise. One change at a time, confirm before applying.
- When corrected, adjust without re-litigating.
