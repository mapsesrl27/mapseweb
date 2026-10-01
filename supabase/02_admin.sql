-- PASO 2: primero crea el usuario en Supabase > Authentication > Users > Add user (marca "Auto Confirm").
-- Luego cambia el correo de abajo por el MISMO correo y pulsa Run.
insert into profiles(id,email,role) select id,email,'admin' from auth.users where email='mapsesrl27@gmail.com'
on conflict(id) do update set role='admin';
