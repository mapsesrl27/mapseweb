import { createClient } from '@supabase/supabase-js'
import { cfg } from './settings'
export const URL_ = import.meta.env.VITE_SUPABASE_URL as string
export const KEY_ = import.meta.env.VITE_SUPABASE_ANON_KEY as string
export const supabase = createClient(URL_, KEY_)
export const wa = (msg: string) => `https://wa.me/${cfg('whatsapp').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`
export const students = () => cfg('students_url')
