# Flik + Supabase Integration

This document explains how to integrate Flik, a tech blog built with Next.js and Supabase, to manage posts, categories, and comments in real time.

## Requirements

- Free account in Supabase  
- Project created in Supabase  
- Node.js 18+  
- Next.js 15+  
- Environment variables:  
  - NEXT_PUBLIC_SUPABASE_URL  
  - NEXT_PUBLIC_SUPABASE_ANON_KEY  

## Installation

npm install @supabase/supabase-js

## Client configuration

Create a file called lib/supabaseClient.ts:

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

## Database schema (basic example)

-- Posts table
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  category_id uuid references categories(id),
  image text,
  date timestamp with time zone default now()
);

-- Categories table
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null
);

-- Comments table
create table comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id),
  email text,
  content text,
  created_at timestamp with time zone default now()
);

## Reading data

Example function to fetch posts:

import { supabase } from '@/lib/supabaseClient'

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('title, slug, category_id, date')
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

## Real-time comments

Example subscription to listen to new comments:

supabase
  .channel('comments')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'comments' },
    (payload) => {
      console.log('New comment:', payload.new)
    }
  )
  .subscribe()

## Example in production

- Flik uses Supabase to store and serve dynamic content.  
- Categories, posts, and comments are fully managed in Supabase.  

## Additional resources

- Supabase documentation  
- Next.js documentation  

---
