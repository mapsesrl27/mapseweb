import { useEffect, useState, FormEvent } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { supabase, URL_, KEY_ } from '../lib/supabase'
import { GROUPS, DEF, cfg, loadSettings } from '../lib/settings'

type T = 'text' | 'area' | 'num' | 'bool' | 'lines' | 'image' | 'images' | 'cat' | 'modality'
type F = { k: string; l: string; t?: T; req?: boolean; help?: string }
const SEO: F[] = [{ k: 'seo_title', l: 'SEO título' }, { k: 'seo_description', l: 'SEO descripción', t: 'area' }]
const END: F[] = [{ k: 'sort_order', l: 'Orden (menor = primero)', t: 'num' }, { k: 'is_featured', l: 'Destacado en inicio', t: 'bool' }, { k: 'is_published', l: 'Publicado', t: 'bool' }]
const SLUG: F = { k: 'slug', l: 'Slug (url)', help: 'Si lo dejas vacío se genera solo a partir del nombre.' }
const CFG: Record<string, { title: string; label: string; toggle: string; fields: F[]; blank: Record<string, any> }> = {
  courses: { title: 'Cursos', label: 'title', toggle: 'is_published', blank: { is_published: false, modality: 'online', benefits: [], modules: [] }, fields: [{ k: 'title', l: 'Título', req: true }, SLUG, { k: 'category_id', l: 'Categoría', t: 'cat' }, { k: 'modality', l: 'Modalidad', t: 'modality' }, { k: 'level', l: 'Nivel' }, { k: 'price', l: 'Precio / inversión (ej.: Bs 350)' }, { k: 'short_description', l: 'Descripción corta', t: 'area' }, { k: 'description', l: 'Descripción completa', t: 'area' }, { k: 'image_url', l: 'Imagen principal', t: 'image' }, { k: 'benefits', l: 'Qué aprenderás (una por línea)', t: 'lines' }, { k: 'modules', l: 'Temario (una por línea)', t: 'lines' }, { k: 'audience', l: '¿Para quién es?', t: 'area' }, { k: 'duration', l: 'Duración' }, { k: 'start_date', l: 'Fecha' }, { k: 'schedule', l: 'Horario' }, { k: 'location', l: 'Ubicación' }, { k: 'instructor', l: 'Instructor' }, { k: 'external_url', l: 'Enlace externo' }, ...SEO, ...END] },
  services: { title: 'Servicios', label: 'name', toggle: 'is_published', blank: { is_published: true, features: [] }, fields: [{ k: 'name', l: 'Nombre', req: true }, SLUG, { k: 'tagline', l: 'Subtítulo' }, { k: 'short_description', l: 'Descripción corta', t: 'area' }, { k: 'description', l: 'Descripción completa', t: 'area' }, { k: 'image_url', l: 'Imagen', t: 'image' }, { k: 'features', l: 'Qué incluye (una por línea)', t: 'lines' }, { k: 'price', l: 'Precio / desde (opcional)' }, { k: 'whatsapp_message', l: 'Mensaje de WhatsApp (opcional)', t: 'area' }, ...SEO, ...END] },
  programs: { title: 'Programas', label: 'name', toggle: 'is_published', blank: { is_published: true, features: [], benefits: [], screenshots: [] }, fields: [{ k: 'name', l: 'Nombre', req: true }, SLUG, { k: 'tagline', l: 'Subtítulo' }, { k: 'short_description', l: 'Descripción corta', t: 'area' }, { k: 'description', l: 'Descripción completa', t: 'area' }, { k: 'problem', l: 'Problema que resuelve', t: 'area' }, { k: 'image_url', l: 'Imagen principal', t: 'image' }, { k: 'screenshots', l: 'Capturas de pantalla', t: 'images' }, { k: 'features', l: 'Funciones (una por línea)', t: 'lines' }, { k: 'benefits', l: 'Beneficios (una por línea)', t: 'lines' }, { k: 'video_url', l: 'Video/demo URL' }, { k: 'external_url', l: 'URL externa' }, ...SEO, ...END] },
  categories: { title: 'Categorías', label: 'name', toggle: 'is_active', blank: { is_active: true }, fields: [{ k: 'name', l: 'Nombre', req: true }, SLUG, { k: 'description', l: 'Descripción', t: 'area' }, { k: 'image_url', l: 'Imagen al pasar el mouse (inicio)', t: 'image' }, { k: 'sort_order', l: 'Orden', t: 'num' }, { k: 'is_active', l: 'Activa', t: 'bool' }] },
  testimonials: { title: 'Testimonios', label: 'name', toggle: 'is_published', blank: { is_published: true }, fields: [{ k: 'name', l: 'Nombre', req: true }, { k: 'role', l: 'Cargo, empresa o curso' }, { k: 'text', l: 'Testimonio', t: 'area', req: true }, { k: 'photo_url', l: 'Foto (opcional)', t: 'image' }, { k: 'sort_order', l: 'Orden', t: 'num' }, { k: 'is_published', l: 'Publicado', t: 'bool' }] },
  faqs: { title: 'Preguntas frecuentes', label: 'question', toggle: 'is_published', blank: { is_published: true }, fields: [{ k: 'question', l: 'Pregunta', req: true }, { k: 'answer', l: 'Respuesta', t: 'area', req: true }, { k: 'sort_order', l: 'Orden', t: 'num' }, { k: 'is_published', l: 'Publicada', t: 'bool' }] },
}
type Row = Record<string, any>
const slugify = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function uploadFile(folder: string, f: File) {
  const path = `${folder}/${Date.now()}-${f.name.replace(/[^\w.]/g, '_')}`
  const { error } = await supabase.storage.from('media').upload(path, f, { upsert: false })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}

// Selector de imagen: subir archivo, pegar URL, vista previa y quitar.
function ImageField({ id, folder, value, onChange, fallback }: { id: string; folder: string; value: string; onChange: (v: string) => void; fallback?: string }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const up = async (f?: File | null) => { if (!f) return; setBusy(true); setErr(''); try { onChange(await uploadFile(folder, f)) } catch (e: any) { setErr('No se pudo subir: ' + e.message) } setBusy(false) }
  const shown = value || fallback
  return <div className="imgf">{shown ? <img src={shown} alt="" /> : <div className="ph">Sin imagen</div>}
    <div><input id={id} type="file" accept="image/*" onChange={e => up(e.target.files?.[0])} disabled={busy} />
      <input placeholder="…o pega la URL de una imagen" value={value || ''} onChange={e => onChange(e.target.value)} />
      <div className="arow" style={{ marginTop: 8 }}>{busy && <small>Subiendo…</small>}{value && <button type="button" className="chip" onClick={() => onChange('')}>{fallback ? 'Volver a la imagen original' : 'Quitar imagen'}</button>}</div>
      {!value && fallback && <small className="hint">Mostrando la imagen original del sitio.</small>}{err && <p className="msg err">{err}</p>}</div></div>
}
function ImagesField({ id, folder, value, onChange }: { id: string; folder: string; value: string[]; onChange: (v: string[]) => void }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const up = async (fs: FileList | null) => { if (!fs?.length) return; setBusy(true); setErr(''); try { const out = [...value]; for (const f of Array.from(fs)) out.push(await uploadFile(folder, f)); onChange(out) } catch (e: any) { setErr('No se pudo subir: ' + e.message) } setBusy(false) }
  const move = (i: number, d: number) => { const a = [...value]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a) }
  return <div><div className="gal">{value.map((u, i) => <div key={u + i}><img src={u} alt="" /><div><button type="button" className="chip" onClick={() => move(i, -1)} aria-label="Mover a la izquierda">←</button><button type="button" className="chip" onClick={() => move(i, 1)} aria-label="Mover a la derecha">→</button><button type="button" className="chip" onClick={() => onChange(value.filter((_, k) => k !== i))}>Quitar</button></div></div>)}</div>
    <input id={id} type="file" accept="image/*" multiple onChange={e => up(e.target.files)} disabled={busy} />{busy && <small>Subiendo…</small>}{err && <p className="msg err">{err}</p>}</div>
}

function Crud({ table }: { table: string }) {
  const c = CFG[table]; const [rows, setRows] = useState<Row[]>([]); const [cats, setCats] = useState<Row[]>([]); const [ed, setEd] = useState<Row | null>(null); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)
  const load = () => { supabase.from(table).select('*').order('sort_order').then(r => { if (r.error) setMsg('Error: ' + r.error.message + ' — ¿ejecutaste supabase/04_autoadministrable.sql?'); setRows(r.data || []) }); supabase.from('categories').select('id,name').order('sort_order').then(r => setCats(r.data || [])) }
  useEffect(() => { setEd(null); setMsg(''); load() }, [table])
  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!ed) return; setBusy(true); setMsg('')
    const { id, created_at, ...body } = ed; body.updated_at = new Date().toISOString(); if (body.category_id === '') body.category_id = null
    if (c.fields.some(f => f.k === 'slug') && !body.slug) body.slug = slugify(body[c.label] || '')
    const r = id ? await supabase.from(table).update(body).eq('id', id) : await supabase.from(table).insert(body)
    setBusy(false); if (r.error) setMsg('Error: ' + (r.error.code === '23505' ? 'ese slug ya existe, usa otro.' : r.error.message)); else { setMsg('Guardado'); setEd(null); load() }
  }
  const del = async (r: Row) => { if (confirm('¿Eliminar "' + r[c.label] + '"? No se puede deshacer.')) { const x = await supabase.from(table).delete().eq('id', r.id); setMsg(x.error ? 'Error: ' + x.error.message : 'Eliminado'); load() } }
  const toggle = async (r: Row) => { await supabase.from(table).update({ [c.toggle]: !r[c.toggle] }).eq('id', r.id); load() }
  if (ed) return <form onSubmit={save} style={{ maxWidth: 720 }}><h2>{ed.id ? 'Editar' : 'Nuevo'} — {c.title}</h2>
    {c.fields.map(f => { const v = ed[f.k]; const set = (x: any) => setEd(o => ({ ...o!, [f.k]: x })); return <div key={f.k}><label htmlFor={f.k}>{f.l}{f.req && ' *'}</label>
      {f.t === 'area' ? <textarea id={f.k} rows={4} required={f.req} value={v || ''} onChange={e => set(e.target.value)} /> :
        f.t === 'bool' ? <input id={f.k} type="checkbox" checked={!!v} onChange={e => set(e.target.checked)} /> :
        f.t === 'num' ? <input id={f.k} type="number" value={v ?? 0} onChange={e => set(+e.target.value)} /> :
        f.t === 'lines' ? <textarea id={f.k} rows={5} value={(v || []).join('\n')} onChange={e => set(e.target.value.split('\n'))} onBlur={e => set(e.target.value.split('\n').map(x => x.trim()).filter(Boolean))} /> :
        f.t === 'cat' ? <select id={f.k} value={v || ''} onChange={e => set(e.target.value)}><option value="">— elegir —</option>{cats.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select> :
        f.t === 'modality' ? <select id={f.k} value={v || 'online'} onChange={e => set(e.target.value)}><option value="online">Online</option><option value="presencial">Presencial</option></select> :
        f.t === 'image' ? <ImageField id={f.k} folder={table} value={v || ''} onChange={set} /> :
        f.t === 'images' ? <ImagesField id={f.k} folder={table} value={v || []} onChange={set} /> :
        <input id={f.k} required={f.req} value={v || ''} onChange={e => set(e.target.value)} />}{f.help && <small className="hint">{f.help}</small>}</div> })}
    {msg && <p className="msg">{msg}</p>}<div className="arow"><button className="btn" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button><button type="button" className="btn sec2" onClick={() => setEd(null)}>Cancelar</button></div></form>
  return <div><h2>{c.title}</h2>{msg && <p className="msg">{msg}</p>}<button className="btn" onClick={() => setEd({ sort_order: rows.length + 1, ...c.blank })}>Crear nuevo</button>
    <table style={{ marginTop: 16 }}><thead><tr><th></th><th>Nombre</th><th>Estado</th><th></th></tr></thead><tbody>{rows.map(r => { const im = r.image_url || r.photo_url; return <tr key={r.id}><td style={{ width: 64 }}>{im && <img src={im} alt="" className="thumb" />}</td><td>{r[c.label]}{r.is_featured && <small className="tagd">Destacado</small>}</td><td>{r[c.toggle] ? 'Publicado' : 'Oculto'}</td>
      <td style={{ whiteSpace: 'nowrap' }}><button className="chip" onClick={() => setEd(r)}>Editar</button> <button className="chip" onClick={() => toggle(r)}>{r[c.toggle] ? 'Ocultar' : 'Publicar'}</button> <button className="chip" onClick={() => del(r)}>Eliminar</button></td></tr> })}</tbody></table>{!rows.length && <p className="msg">Todavía no hay registros. Pulsa «Crear nuevo».</p>}</div>
}

// Textos, imágenes, logo y datos de contacto del sitio (tabla site_settings)
function SiteContent() {
  const [v, setV] = useState<Record<string, string>>({}); const [dirty, setDirty] = useState<Set<string>>(new Set()); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false); const [open, setOpen] = useState(0)
  const load = () => supabase.from('site_settings').select('key,value').then(r => setV(Object.fromEntries((r.data || []).map((x: any) => [x.key, x.value ?? '']))))
  useEffect(() => { load() }, [])
  const set = (k: string, x: string) => { setV(o => ({ ...o, [k]: x })); setDirty(d => new Set(d).add(k)) }
  const save = async () => {
    if (!dirty.size) return setMsg('No hay cambios para guardar.')
    setBusy(true); setMsg('')
    const rows = Array.from(dirty).map(key => ({ key, value: v[key] ?? '', updated_at: new Date().toISOString() }))
    const r = await supabase.from('site_settings').upsert(rows)
    setBusy(false); if (r.error) return setMsg('Error: ' + r.error.message)
    setDirty(new Set()); await loadSettings(); setMsg('Cambios guardados. Ya se ven en el sitio.')
  }
  return <div style={{ maxWidth: 820 }}><h2>Contenido del sitio</h2><p className="hint" style={{ marginTop: 0 }}>Si un campo queda vacío, el sitio muestra el texto o la imagen original.</p>
    {GROUPS.map((g, gi) => <div className="acc" key={g.g}><button type="button" aria-expanded={open === gi} onClick={() => setOpen(open === gi ? -1 : gi)}>{g.g}<span>{open === gi ? '−' : '+'}</span></button>
      {open === gi && <div className="accb">{g.f.map(f => <div key={f.k}><label htmlFor={'s_' + f.k}>{f.l}</label>
        {f.t === 'image' ? <ImageField id={'s_' + f.k} folder="settings" value={v[f.k] || ''} onChange={x => set(f.k, x)} fallback={DEF[f.k] || undefined} /> :
          f.t === 'area' || f.t === 'pairs' ? <textarea id={'s_' + f.k} rows={f.t === 'pairs' ? 6 : 3} placeholder={DEF[f.k]} value={v[f.k] || ''} onChange={e => set(f.k, e.target.value)} /> :
          <input id={'s_' + f.k} placeholder={DEF[f.k]} value={v[f.k] || ''} onChange={e => set(f.k, e.target.value)} />}
        {f.t === 'pairs' && !v[f.k] && <small className="hint">Vacío = se usan los textos originales (en gris). Copia y edita ese formato.</small>}</div>)}</div>}</div>)}
    <div className="savebar">{msg && <span className="msg" style={{ margin: 0 }}>{msg}</span>}<button className="btn" onClick={save} disabled={busy}>{busy ? 'Guardando…' : dirty.size ? `Guardar cambios (${dirty.size})` : 'Guardar cambios'}</button></div></div>
}

function Users() {
  const [u, setU] = useState<Row[]>([]); const [f, setF] = useState({ email: '', password: '', role: 'editor' }); const [msg, setMsg] = useState('')
  const load = () => supabase.from('profiles').select('*').then(r => setU(r.data || [])); useEffect(() => { load() }, [])
  const add = async (e: FormEvent) => {
    e.preventDefault(); setMsg('')
    const tmp = createClient(URL_, KEY_, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await tmp.auth.signUp({ email: f.email, password: f.password })
    if (error || !data.user) return setMsg('Error: ' + (error?.message || 'no se pudo crear'))
    const r = await supabase.from('profiles').upsert({ id: data.user.id, email: f.email, role: f.role })
    setMsg(r.error ? 'Error: ' + r.error.message : 'Usuario creado'); setF({ email: '', password: '', role: 'editor' }); load()
  }
  const setRole = async (id: string, role: string) => { await supabase.from('profiles').update({ role }).eq('id', id); load() }
  return <div style={{ maxWidth: 640 }}><h2>Usuarios</h2><form onSubmit={add}><label htmlFor="ue">Correo</label><input id="ue" type="email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
    <label htmlFor="up">Contraseña (mín. 6)</label><input id="up" type="password" minLength={6} required value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
    <label htmlFor="ur">Rol</label><select id="ur" value={f.role} onChange={e => setF({ ...f, role: e.target.value })}><option value="editor">Editor</option><option value="admin">Administrador</option></select>
    {msg && <p className="msg">{msg}</p>}<div className="arow"><button className="btn">Crear usuario</button></div></form>
    <table style={{ marginTop: 20 }}><tbody>{u.map(x => <tr key={x.id}><td>{x.email}</td><td><select value={x.role} onChange={e => setRole(x.id, e.target.value)}><option value="user">Sin acceso</option><option value="editor">Editor</option><option value="admin">Administrador</option></select></td></tr>)}</tbody></table></div>
}
function Dashboard() {
  const [n, setN] = useState<Record<string, number>>({})
  useEffect(() => { (async () => { const q = async (t: string, col?: string, val?: boolean) => { let s = supabase.from(t).select('id', { count: 'exact', head: true }); if (col) s = s.eq(col, val!); return (await s).count || 0 }
    setN({ pub: await q('courses', 'is_published', true), draft: await q('courses', 'is_published', false), serv: await q('services', 'is_published', true), prog: await q('programs', 'is_published', true), test: await q('testimonials', 'is_published', true), faq: await q('faqs', 'is_published', true) }) })() }, [])
  return <div><h2>Dashboard</h2><div className="grid">{[['Cursos publicados', n.pub], ['Cursos en borrador', n.draft], ['Servicios publicados', n.serv], ['Programas activos', n.prog], ['Testimonios', n.test], ['Preguntas frecuentes', n.faq]].map(([l, v]) => <div className="panel" key={l as string}><h3>{v ?? '…'}</h3>{l}</div>)}</div>
    <p className="hint" style={{ marginTop: 24 }}>Para cambiar el logo, las fotos y los textos de la página de inicio entra en «Contenido del sitio».</p></div>
}
export default function Admin() {
  const [ok, setOk] = useState<boolean | null>(null); const [err, setErr] = useState(''); const nav = useNavigate()
  const check = async () => { const { data } = await supabase.auth.getSession(); if (!data.session) return setOk(false)
    const p = await supabase.from('profiles').select('role').eq('id', data.session.user.id).maybeSingle(); if (['admin', 'super_admin', 'editor'].includes(p.data?.role)) setOk(true); else { setOk(false); setErr('Esta cuenta no tiene acceso al panel.') } }
  useEffect(() => { check() }, [])
  const login = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const d = new FormData(e.currentTarget); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email: d.get('e') as string, password: d.get('p') as string }); if (error) setErr('Correo o contraseña incorrectos.'); else check() }
  if (ok === null) return <p style={{ padding: 30 }}>Cargando…</p>
  if (!ok) return <form onSubmit={login} style={{ maxWidth: 380, margin: '80px auto', padding: 22 }}><img src={cfg('logo_url')} alt="MAPSE" style={{ height: 64, marginBottom: 12 }} /><h2>Panel MAPSE</h2><label htmlFor="e">Correo</label><input id="e" name="e" type="email" required /><label htmlFor="p">Contraseña</label><input id="p" name="p" type="password" required />
    {err && <p className="msg err">{err}</p>}<div className="arow"><button className="btn">Ingresar</button></div></form>
  const L = (to: string, t: string) => <NavLink to={to} end={to === '/admin'}>{t}</NavLink>
  return <div className="adm"><aside className="side"><div className="logo"><img src={cfg('logo_url')} alt="" />{cfg('site_name')}</div>
    {L('/admin', 'Dashboard')}{L('/admin/sitio', 'Contenido del sitio')}{L('/admin/courses', 'Cursos')}{L('/admin/categories', 'Categorías')}{L('/admin/services', 'Servicios')}{L('/admin/programs', 'Programas')}{L('/admin/testimonials', 'Testimonios')}{L('/admin/faqs', 'Preguntas frecuentes')}{L('/admin/users', 'Usuarios')}
    <a href="/" target="_blank" rel="noreferrer">Ver sitio ↗</a>
    <a href="#" onClick={async e => { e.preventDefault(); await supabase.auth.signOut(); setOk(false); nav('/admin') }}>Salir</a></aside>
    <div style={{ padding: 30, minWidth: 0 }}><Routes><Route index element={<Dashboard />} /><Route path="sitio" element={<SiteContent />} />
      {Object.keys(CFG).map(t => <Route key={t} path={t} element={<Crud table={t} />} />)}<Route path="users" element={<Users />} /></Routes></div></div>
}
