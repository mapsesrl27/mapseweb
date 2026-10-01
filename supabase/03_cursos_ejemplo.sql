-- OPCIONAL: 6 cursos de ejemplo como BORRADOR. Edítalos o elimínalos desde /admin/courses y pulsa "Publicar/ocultar" cuando sean reales.
insert into courses(title,slug,category_id,modality,short_description,is_published,is_featured,sort_order)
select v.t,v.s,(select id from categories where slug=v.c),v.m,v.d,false,v.f,v.o from (values
('Trading desde cero: fundamentos y gestión del riesgo','trading-desde-cero','negocios-digitales','presencial','Conceptos y gestión del riesgo.',true,1),
('Publicidad digital: estrategia y campañas que venden','publicidad-digital','marketing-digital','presencial','Campañas, segmentación y medición.',true,2),
('Inteligencia Artificial aplicada al trabajo diario','inteligencia-artificial-aplicada','habilidades-digitales','presencial','IA como herramienta de trabajo diario.',true,3),
('Estrategia de contenidos','estrategia-de-contenidos','marketing-digital','online','Planifica y produce contenido con objetivo.',false,4),
('Herramientas digitales para equipos','herramientas-digitales-equipos','habilidades-digitales','presencial','Organiza y automatiza tareas.',false,5),
('Crea tu negocio digital','crea-tu-negocio-digital','negocios-digitales','online','De la idea a una operación en marcha.',false,6)
) as v(t,s,c,m,d,f,o) on conflict (slug) do nothing;
