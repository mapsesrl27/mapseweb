-- MAPSE: pega TODO esto en Supabase > SQL Editor > Run (una sola vez)
create table if not exists profiles(id uuid primary key references auth.users(id) on delete cascade,email text,role text not null default 'user',created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists categories(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,description text,is_active boolean default true,sort_order int default 0,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists courses(id uuid primary key default gen_random_uuid(),title text not null,slug text unique not null,category_id uuid references categories(id),modality text default 'online',level text,short_description text,description text,image_url text,duration text,start_date text,schedule text,location text,instructor text,audience text,benefits text[] default '{}',modules text[] default '{}',external_url text,seo_title text,seo_description text,is_published boolean default false,is_featured boolean default false,sort_order int default 0,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists programs(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,tagline text,short_description text,description text,problem text,image_url text,video_url text,external_url text,features text[] default '{}',benefits text[] default '{}',screenshots text[] default '{}',seo_title text,seo_description text,is_published boolean default true,is_featured boolean default false,sort_order int default 0,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists site_settings(key text primary key,value text,updated_at timestamptz default now());

create or replace function is_admin() returns boolean language sql security definer set search_path=public stable as $$ select exists(select 1 from profiles where id=auth.uid() and role in('admin','super_admin','editor')) $$;
create or replace function is_super() returns boolean language sql security definer set search_path=public stable as $$ select exists(select 1 from profiles where id=auth.uid() and role in('admin','super_admin')) $$;
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into profiles(id,email) values(new.id,new.email) on conflict do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security; alter table categories enable row level security; alter table courses enable row level security; alter table programs enable row level security; alter table site_settings enable row level security;
drop policy if exists "ver propio perfil" on profiles;
create policy "ver propio perfil" on profiles for select using(id=auth.uid() or is_super());
drop policy if exists "admin gestiona perfiles" on profiles;
create policy "admin gestiona perfiles" on profiles for all using(is_super()) with check(is_super());
drop policy if exists "publico categorias" on categories;
create policy "publico categorias" on categories for select using(is_active or is_admin());
drop policy if exists "admin categorias" on categories;
create policy "admin categorias" on categories for all using(is_admin()) with check(is_admin());
drop policy if exists "publico cursos" on courses;
create policy "publico cursos" on courses for select using(is_published or is_admin());
drop policy if exists "admin cursos" on courses;
create policy "admin cursos" on courses for all using(is_admin()) with check(is_admin());
drop policy if exists "publico programas" on programs;
create policy "publico programas" on programs for select using(is_published or is_admin());
drop policy if exists "admin programas" on programs;
create policy "admin programas" on programs for all using(is_admin()) with check(is_admin());
drop policy if exists "publico settings" on site_settings;
create policy "publico settings" on site_settings for select using(true);
drop policy if exists "admin settings" on site_settings;
create policy "admin settings" on site_settings for all using(is_admin()) with check(is_admin());

insert into storage.buckets(id,name,public) values('media','media',true) on conflict do nothing;
drop policy if exists "media lectura" on storage.objects;
create policy "media lectura" on storage.objects for select using(bucket_id='media');
drop policy if exists "media admin sube" on storage.objects;
create policy "media admin sube" on storage.objects for insert with check(bucket_id='media' and is_admin());
drop policy if exists "media admin edita" on storage.objects;
create policy "media admin edita" on storage.objects for update using(bucket_id='media' and is_admin());
drop policy if exists "media admin borra" on storage.objects;
create policy "media admin borra" on storage.objects for delete using(bucket_id='media' and is_admin());

insert into categories(name,slug,description,sort_order) values
('Marketing Digital','marketing-digital','Estrategias, publicidad y herramientas para crecer en entornos digitales.',1),
('Habilidades Digitales','habilidades-digitales','Tecnología, inteligencia artificial y herramientas digitales para trabajar mejor.',2),
('Negocios Digitales','negocios-digitales','Estrategias y conocimientos para crear, desarrollar y hacer crecer negocios digitales.',3) on conflict do nothing;
insert into programs(name,slug,tagline,short_description,is_featured,sort_order) values
('MAPSE FLOW','mapse-flow','Sistema de Envíos por WhatsApp','Organiza y simplifica tus comunicaciones comerciales.',true,1),
('MAPSE CRM24/7','mapse-crm24-7','CRM para Ventas por WhatsApp','Centraliza el seguimiento comercial y organiza tus oportunidades de venta.',true,2) on conflict do nothing;
