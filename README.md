# MAPSE — puesta en marcha
1. Supabase: crea un proyecto. SQL Editor > pega supabase/01_schema.sql > Run (tablas, seguridad, bucket "media", categorías y programas). Se puede ejecutar más de una vez.
2. Authentication > Users > Add user (tu correo y contraseña, marca Auto Confirm). En Providers > Email desactiva "Confirm email".
3. SQL Editor > pega supabase/02_admin.sql, cambia el correo por el tuyo > Run.
4. (Opcional) supabase/03_cursos_ejemplo.sql: crea 6 cursos de ejemplo como borrador.
5. SQL Editor > pega supabase/04_autoadministrable.sql > Run (servicios, testimonios, preguntas frecuentes, precio de cursos e imagen de categorías).
6. Project Settings > API: copia Project URL y la clave anon/publishable.
7. Netlify: sube el proyecto a GitHub > Add new site > Import. Build: npm run build. Publish: dist. Variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_WHATSAPP=59161329819.
8. Entra en /admin.

## Qué se administra desde /admin
- Contenido del sitio: logo, nombre, WhatsApp, redes sociales, textos e imágenes de la portada, fotos de clases, secciones MAPSE FLOW y CRM24/7, diferenciales, Nosotros. Si un campo queda vacío se usa el contenido original.
- Cursos (con precio), Categorías (con imagen), Servicios, Programas (con galería de capturas), Testimonios y Preguntas frecuentes.
- Usuarios del panel (Administrador / Editor).

Las imágenes se suben al bucket "media" de Supabase. Las fotos de public/fotos quedan como imágenes por defecto.
