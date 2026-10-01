# MAPSE — puesta en marcha
1. Supabase: crea un proyecto. SQL Editor > pega supabase/01_schema.sql > Run (tablas, seguridad, bucket "media", categorías y programas). Se puede ejecutar más de una vez.
2. Authentication > Users > Add user (tu correo y contraseña, marca Auto Confirm). En Providers > Email desactiva "Confirm email".
3. SQL Editor > pega supabase/02_admin.sql, cambia el correo por el tuyo > Run.
4. (Opcional) supabase/03_cursos_ejemplo.sql: crea 6 cursos de ejemplo como borrador.
5. Project Settings > API: copia Project URL y la clave anon/publishable.
6. Netlify: sube el proyecto a GitHub > Add new site > Import. Build: npm run build. Publish: dist. Variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_WHATSAPP=59161329819.
7. Entra en /admin. Publica tus cursos con "Publicar/ocultar". Usuarios nuevos: /admin/users.
Fotos en public/fotos (reemplázalas manteniendo el nombre o cambia las rutas en src/pages.tsx). Imágenes de cursos y programas se suben desde el CMS.
