-- MAPSE · PASO 4 (actualización autoadministrable)
-- Pega TODO esto en Supabase > SQL Editor > Run. Se puede ejecutar más de una vez sin dañar datos.
-- Requiere haber ejecutado antes 01_schema.sql (usa las funciones is_admin() e is_super()).

-- 1) Columnas nuevas en tablas existentes
alter table categories add column if not exists image_url text;
alter table courses    add column if not exists price text;

-- 2) Servicios
create table if not exists services(
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text unique not null, tagline text,
  short_description text, description text, image_url text,
  features text[] default '{}', price text, whatsapp_message text,
  seo_title text, seo_description text,
  is_published boolean default true, is_featured boolean default false, sort_order int default 0,
  created_at timestamptz default now(), updated_at timestamptz default now());

-- 3) Testimonios
create table if not exists testimonials(
  id uuid primary key default gen_random_uuid(),
  name text not null, role text, text text not null, photo_url text,
  is_published boolean default true, sort_order int default 0,
  created_at timestamptz default now(), updated_at timestamptz default now());

-- 4) Preguntas frecuentes
create table if not exists faqs(
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null,
  is_published boolean default true, sort_order int default 0,
  created_at timestamptz default now(), updated_at timestamptz default now());

-- 5) Seguridad: el público solo ve lo publicado; solo admin/editor escribe
alter table services enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
drop policy if exists "publico servicios" on services;
create policy "publico servicios" on services for select using(is_published or is_admin());
drop policy if exists "admin servicios" on services;
create policy "admin servicios" on services for all using(is_admin()) with check(is_admin());
drop policy if exists "publico testimonios" on testimonials;
create policy "publico testimonios" on testimonials for select using(is_published or is_admin());
drop policy if exists "admin testimonios" on testimonials;
create policy "admin testimonios" on testimonials for all using(is_admin()) with check(is_admin());
drop policy if exists "publico faqs" on faqs;
create policy "publico faqs" on faqs for select using(is_published or is_admin());
drop policy if exists "admin faqs" on faqs;
create policy "admin faqs" on faqs for all using(is_admin()) with check(is_admin());

-- 6) Preguntas frecuentes actuales del sitio (solo si la tabla está vacía)
insert into faqs(question,answer,sort_order)
select * from (values
 ('¿Qué modalidades de cursos existen?','Presenciales y online, en tres categorías: Marketing Digital, Habilidades Digitales y Negocios Digitales.',1),
 ('¿Cómo accedo a mis cursos online?','Desde “Acceso estudiantes” ingresas a cursos.mapse.club.',2),
 ('¿Cómo pido información?','Por WhatsApp al +591 61329819. Cada curso, servicio y programa abre un mensaje ya preparado.',3)
) v(q,a,o) where not exists (select 1 from faqs);

-- 7) Servicios de ejemplo como BORRADOR (no se ven en la web hasta que pulses "Publicar" en /admin/services)
insert into services(name,slug,tagline,short_description,features,is_published,is_featured,sort_order) values
 ('Publicidad en Facebook e Instagram','publicidad-meta-ads','Campañas en Meta Ads','Creamos y gestionamos campañas para que tu negocio reciba mensajes y clientes por WhatsApp.','{"Estrategia y segmentación","Textos e imágenes para anuncios","Seguimiento de resultados"}',false,true,1),
 ('Desarrollo de aplicaciones web','desarrollo-aplicaciones-web','Sistemas a la medida','Inventarios, punto de venta, reservas, CRM y tiendas online adaptados a tu negocio.','{"Análisis de tu proceso","Aplicación web publicada en internet","Panel administrable"}',false,true,2),
 ('Automatización de WhatsApp y CRM','automatizacion-whatsapp-crm','Ventas organizadas','Centraliza las conversaciones de tu equipo y da seguimiento a cada oportunidad de venta.','{"Bandeja multiagente","Etiquetas y seguimiento","Respuestas rápidas"}',false,true,3)
on conflict (slug) do nothing;
