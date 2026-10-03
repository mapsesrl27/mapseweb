import { ReactNode, useEffect, useState } from 'react'
import { supabase } from './supabase'

// Valores por defecto: si un campo no está guardado en site_settings, se usa este.
export const DEF: Record<string, string> = {
  logo_url: '/logo-mapse.png', site_name: 'MAPSE',
  whatsapp: (import.meta.env.VITE_WHATSAPP as string) || '59161329819', whatsapp_display: '+591 61329819',
  facebook_url: 'https://facebook.com/mapsesoluciones', facebook_label: '@mapsesoluciones',
  tiktok_url: 'https://tiktok.com/@srlmapse', tiktok_label: '@srlmapse', instagram_url: '', instagram_label: '',
  students_url: 'https://cursos.mapse.club', city: 'Santa Cruz de la Sierra, Bolivia.',
  footer_text: 'Marketing, Publicidad y Soluciones Empresariales.',
  hero_title: 'Impulsa tu negocio con habilidades digitales y tecnología.',
  hero_text: 'Formación práctica y soluciones digitales para emprendedores, profesionales y empresas que quieren avanzar.',
  hero_image: '',
  big_title: 'Conocimiento que se convierte en acción.',
  practice_title: 'Se aprende haciendo.', practice_text: 'Clases prácticas donde cada participante trabaja con su propio equipo.',
  photo_main: '/fotos/clase-ventana.jpg', photo_main_title: 'Formación práctica', photo_main_caption: 'Clases presenciales MAPSE',
  photo_side1: '/fotos/clase-laptops.jpg', photo_side2: '/fotos/clase-mesa.jpg',
  course_img1: '/fotos/clase-trading.jpg', course_img2: '/fotos/clase-andromeda.jpg', course_img3: '/fotos/clase-mesa.jpg',
  courses_title: 'Formación para el mundo digital.',
  services_title: 'Servicios para hacer crecer tu negocio.', services_text: 'Te acompañamos con publicidad, tecnología y soluciones a la medida.',
  flow_title: 'Convierte tus envíos de WhatsApp en un proceso organizado.',
  flow_text: 'MAPSE FLOW es una solución diseñada para gestionar y facilitar el envío de comunicaciones comerciales por WhatsApp.',
  flow_link: '/programas/mapse-flow', flow_image: '',
  crm_title: 'Organiza tus ventas desde WhatsApp.',
  crm_text: 'MAPSE CRM24/7 es un CRM enfocado en equipos comerciales que utilizan WhatsApp como canal de ventas.',
  crm_link: '/programas/mapse-crm24-7', crm_image: '/fotos/crm-captura.jpg',
  crm_features: 'Bandeja de chats | Conversaciones abiertas y resueltas, con búsqueda y filtro por línea.\nEtiquetas y seguimiento | Clasifica a cada cliente y conserva sus datos junto a la conversación.\nRespuestas rápidas y automáticas | Mensajes listos para responder más rápido a tus clientes.\nAgenda, reportes y usuarios | Organiza tareas, revisa resultados y gestiona a tu equipo.',
  dif_title: 'Formación práctica. Tecnología útil.',
  dif_items: 'Contenido actualizado | Información y herramientas alineadas con el entorno digital actual.\n100% práctico | Aprendizaje enfocado en aplicar, experimentar y resolver.\nNivel intermedio y avanzado | Contenido pensado para avanzar más allá de lo básico.\nTecnología orientada a negocios | Soluciones digitales creadas para necesidades reales.',
  testimonials_title: 'Lo que dicen nuestros alumnos y clientes.',
  cta_title: '¿Qué quieres desarrollar hoy?',
  about_title: 'Formación y tecnología para negocios digitales.',
  about_lead: 'MAPSE SRL · Marketing, Publicidad y Soluciones Empresariales. Santa Cruz de la Sierra, Bolivia.',
  about_heading: 'Dos líneas, un mismo objetivo.',
  about_text: 'Ofrecemos cursos presenciales y online en marketing, habilidades y negocios digitales, y desarrollamos aplicaciones web para equipos que venden y comunican por WhatsApp.',
  about_image: '',
}

// Campos que se editan desde /admin/sitio
export type SF = { k: string; l: string; t?: 'text' | 'area' | 'image' | 'pairs' }
export const GROUPS: { g: string; f: SF[] }[] = [
  { g: 'Marca y contacto', f: [{ k: 'logo_url', l: 'Logo (PNG con fondo transparente)', t: 'image' }, { k: 'site_name', l: 'Nombre junto al logo' }, { k: 'whatsapp', l: 'WhatsApp (solo números, con 591)' }, { k: 'whatsapp_display', l: 'WhatsApp como se muestra' }, { k: 'facebook_url', l: 'Facebook URL' }, { k: 'facebook_label', l: 'Facebook texto' }, { k: 'tiktok_url', l: 'TikTok URL' }, { k: 'tiktok_label', l: 'TikTok texto' }, { k: 'instagram_url', l: 'Instagram URL (vacío = oculto)' }, { k: 'instagram_label', l: 'Instagram texto' }, { k: 'students_url', l: 'URL acceso estudiantes' }, { k: 'city', l: 'Ciudad' }, { k: 'footer_text', l: 'Texto del pie de página', t: 'area' }] },
  { g: 'Inicio — portada', f: [{ k: 'hero_title', l: 'Título principal', t: 'area' }, { k: 'hero_text', l: 'Texto bajo el título', t: 'area' }, { k: 'hero_image', l: 'Imagen de portada (opcional: reemplaza la animación del teléfono)', t: 'image' }, { k: 'big_title', l: 'Frase grande' }] },
  { g: 'Inicio — fotos de clases', f: [{ k: 'practice_title', l: 'Título' }, { k: 'practice_text', l: 'Texto', t: 'area' }, { k: 'photo_main', l: 'Foto grande', t: 'image' }, { k: 'photo_main_title', l: 'Título sobre la foto grande' }, { k: 'photo_main_caption', l: 'Subtítulo sobre la foto grande' }, { k: 'photo_side1', l: 'Foto lateral 1', t: 'image' }, { k: 'photo_side2', l: 'Foto lateral 2', t: 'image' }] },
  { g: 'Inicio — cursos destacados', f: [{ k: 'courses_title', l: 'Título' }, { k: 'course_img1', l: 'Imagen de respaldo 1 (curso sin imagen)', t: 'image' }, { k: 'course_img2', l: 'Imagen de respaldo 2', t: 'image' }, { k: 'course_img3', l: 'Imagen de respaldo 3', t: 'image' }] },
  { g: 'Inicio — servicios', f: [{ k: 'services_title', l: 'Título' }, { k: 'services_text', l: 'Texto', t: 'area' }] },
  { g: 'Inicio — MAPSE FLOW', f: [{ k: 'flow_title', l: 'Título', t: 'area' }, { k: 'flow_text', l: 'Texto', t: 'area' }, { k: 'flow_link', l: 'Enlace del botón' }, { k: 'flow_image', l: 'Imagen (opcional: reemplaza la animación)', t: 'image' }] },
  { g: 'Inicio — MAPSE CRM24/7', f: [{ k: 'crm_title', l: 'Título' }, { k: 'crm_text', l: 'Texto', t: 'area' }, { k: 'crm_link', l: 'Enlace del botón' }, { k: 'crm_image', l: 'Captura de pantalla', t: 'image' }, { k: 'crm_features', l: 'Funciones (una por línea: Título | descripción)', t: 'pairs' }] },
  { g: 'Inicio — diferenciales y cierre', f: [{ k: 'dif_title', l: 'Título diferenciales' }, { k: 'dif_items', l: 'Diferenciales (una por línea: Título | descripción)', t: 'pairs' }, { k: 'testimonials_title', l: 'Título testimonios' }, { k: 'cta_title', l: 'Título del cierre' }] },
  { g: 'Nosotros', f: [{ k: 'about_title', l: 'Título', t: 'area' }, { k: 'about_lead', l: 'Subtítulo', t: 'area' }, { k: 'about_heading', l: 'Encabezado' }, { k: 'about_text', l: 'Texto', t: 'area' }, { k: 'about_image', l: 'Imagen (opcional)', t: 'image' }] },
]

let S: Record<string, string> = {}
export const cfg = (k: string) => (S[k] !== undefined && S[k] !== null && S[k] !== '' ? S[k] : DEF[k] ?? '')
export const pairs = (k: string) => cfg(k).split('\n').map(l => l.split('|').map(x => x.trim())).filter(p => p[0]) as [string, string][]
export async function loadSettings() {
  const { data } = await supabase.from('site_settings').select('key,value')
  S = Object.fromEntries((data || []).map((r: any) => [r.key, r.value ?? '']))
  const ic = document.querySelector<HTMLLinkElement>('link[rel=icon]'); if (ic && S.logo_url) ic.href = S.logo_url
}

// Espera la configuración antes de pintar el sitio (máx. 3 s) para que no "parpadee" el contenido anterior.
export function SettingsGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOk(true), 3000); loadSettings().finally(() => { clearTimeout(t); setOk(true) }) }, [])
  return ok ? <>{children}</> : <div style={{ minHeight: '100vh', background: '#001D44' }} />
}
