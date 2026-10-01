import { createClient } from '@supabase/supabase-js'
export const URL_ = import.meta.env.VITE_SUPABASE_URL as string
export const KEY_ = import.meta.env.VITE_SUPABASE_ANON_KEY as string
export const supabase = createClient(URL_, KEY_)
export const WA = (import.meta.env.VITE_WHATSAPP as string) || '59161329819'
export const wa = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
export const STUDENTS = 'https://cursos.mapse.club'
