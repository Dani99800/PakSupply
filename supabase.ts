
import { createClient } from '@supabase/supabase-js';

// Access environment variables using process.env as per platform guidelines.
// We provide placeholder strings to prevent the 'supabaseUrl is required' initialization error.
const supabaseUrl = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * DATABASE SCHEMA INFO:
 * 
 * -- Manufacturers
 * create table manufacturers (
 *   id text primary key,
 *   email text,
 *   phone text,
 *   company_name text,
 *   owner_name text,
 *   owner_phone text,
 *   manager_phone text,
 *   address text,
 *   city text,
 *   status text,
 *   plan text,
 *   is_israel_free_claim boolean,
 *   government_doc_url text,
 *   rating numeric default 0,
 *   rating_count int default 0,
 *   signup_date timestamp with time zone default now()
 * );
 * 
 * -- Products
 * create table products (
 *   id text primary key,
 *   manufacturer_id text references manufacturers(id),
 *   manufacturer_name text,
 *   name text,
 *   brand text,
 *   category text,
 *   price numeric,
 *   description text,
 *   image_url text,
 *   is_israel_free boolean,
 *   is_israel_free_approved boolean,
 *   status text
 * );
 */
