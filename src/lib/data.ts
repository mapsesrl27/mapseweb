import { useEffect, useState } from 'react'
import { supabase } from './supabase'
export type Cat = { id: string; name: string; slug: string; description: string }
export type Course = { id: string; title: string; slug: string; category_id: string; modality: string; level: string; short_description: string; description: string; image_url: string; duration: string; start_date: string; schedule: string; location: string; instructor: string; audience: string; benefits: string[]; modules: string[]; external_url: string; seo_title: string; seo_description: string }
export type Program = { id: string; name: string; slug: string; tagline: string; short_description: string; description: string; problem: string; image_url: string; video_url: string; features: string[]; benefits: string[]; screenshots: string[]; seo_title: string; seo_description: string }
export const MOD = (m: string) => (m === 'presencial' ? 'Presencial' : 'Online')
export function useRows<T>(table: string, f?: (q: any) => any, key = '') {
  const [d, setD] = useState<T[]>([]); const [l, setL] = useState(true); const [e, setE] = useState('')
  useEffect(() => {
    setL(true); let q: any = supabase.from(table).select('*')
    if (table === 'courses' || table === 'programs') q = q.eq('is_published', true)
    if (table === 'categories') q = q.eq('is_active', true)
    if (f) q = f(q)
    q.order('sort_order').then(({ data, error }: any) => { if (error) setE(error.message); else setD(data || []); setL(false) })
  }, [table, key])
  return { d, l, e }
}
