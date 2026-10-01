import { useEffect, useState, FormEvent } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { supabase, URL_, KEY_ } from '../lib/supabase'

type F = { k: string; l: string; t?: 'text' | 'area' | 'num' | 'bool' | 'lines' | 'image' | 'cat' | 'modality'; req?: boolean }
const CFG: Record<string, { title: string; label: string; fields: F[] }> = {
  courses: { title: 'Cursos', label: 'title', fields: [{ k: 'title', l: 'Título', req: true }, { k: 'slug', l: 'Slug (url)', req: true }, { k: 'category_id', l: 'Categoría', t: 'cat' }, { k: 'modality', l: 'Modalidad', t: 'modality' }, { k: 'level', l: 'Nivel' }, { k: 'short_description', l: 'Descripción corta', t: 'area' }, { k: 'description', l: 'Descripción completa', t: 'area' }, { k: 'image_url', l: 'Imagen principal', t: 'image' }, { k: 'benefits', l: 'Qué aprenderás (una por línea)', t: 'lines' }, { k: 'modules', l: 'Contenido (una por línea)', t: 'lines' }, { k: 'audience', l: '¿Para quién es?', t: 'area' }, { k: 'duration', l: 'Duración' }, { k: 'start_date', l: 'Fecha' }, { k: 'schedule', l: 'Horario' }, { k: 'location', l: 'Ubicación' }, { k: 'instructor', l: 'Instructor' }, { k: 'external_url', l: 'Enlace externo' }, { k: 'seo_title', l: 'SEO título' }, { k: 'seo_description', l: 'SEO descripción', t: 'area' }, { k: 'sort_order', l: 'Orden', t: 'num' }, { k: 'is_featured', l: 'Destacado', t: 'bool' }, { k: 'is_published', l: 'Publicado', t: 'bool' }] },
  programs: { title: 'Programas', label: 'name', fields: [{ k: 'name', l: 'Nombre', req: true }, { k: 'slug', l: 'Slug (url)', req: true }, { k: 'tagline', l: 'Subtítulo' }, { k: 'short_description', l: 'Descripción corta', t: 'area' }, { k: 'description', l: 'Descripción completa', t: 'area' }, { k: 'problem', l: 'Problema que resuelve', t: 'area' }, { k: 'image_url', l: 'Imagen principal', t: 'image' }, { k: 'features', l: 'Funcionalidades (una por línea)', t: 'lines' }, { k: 'benefits', l: 'Beneficios (una por línea)', t: 'lines' }, { k: 'screenshots', l: 'URLs de capturas (una por línea)', t: 'lines' }, { k: 'video_url', l: 'Video/demo URL' }, { k: 'external_url', l: 'URL externa' }, { k: 'seo_title', l: 'SEO título' }, { k: 'seo_description', l: 'SEO descripción', t: 'area' }, { k: 'sort_order', l: 'Orden', t: 'num' }, { k: 'is_featured', l: 'Destacado', t: 'bool' }, { k: 'is_published', l: 'Publicado', t: 'bool' }] },
  categories: { title: 'Categorías', label: 'name', fields: [{ k: 'name', l: 'Nombre', req: true }, { k: 'slug', l: 'Slug', req: true }, { k: 'description', l: 'Descripción', t: 'area' }, { k: 'sort_order', l: 'Orden', t: 'num' }, { k: 'is_active', l: 'Activa', t: 'bool' }] },
}
type Row = Record<string, any>

function Crud({ table }: { table: string }) {
  const c = CFG[table]; const [rows, setRows] = useState<Row[]>([]); const [cats, setCats] = useState<Row[]>([]); const [ed, setEd] = useState<Row | null>(null); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)
  const load = () => { supabase.from(table).select('*').order('sort_order').then(r => setRows(r.data || [])); supabase.from('categories').select('id,name').then(r => setCats(r.data || [])) }
  useEffect(() => { setEd(null); load() }, [table])
  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!ed) return; setBusy(true); setMsg('')
    const { id, created_at, ...body } = ed; body.updated_at = new Date().toISOString(); if (body.category_id === '') body.category_id = null
    const r = id ? await supabase.from(table).update(body).eq('id', id) : await supabase.from(table).insert(body)
    setBusy(false); if (r.error) setMsg('Error: ' + r.error.message); else { setMsg('Guardado'); setEd(null); load() }
  }
  const del = async (r: Row) => { if (confirm('¿Eliminar "' + r[c.label] + '"?')) { const x = await supabase.from(table).delete().eq('id', r.id); if (x.error) setMsg(x.error.message); load() } }
  const toggle = async (r: Row) => { const k = table === 'categories' ? 'is_active' : 'is_published'; await supabase.from(table).update({ [k]: !r[k] }).eq('id', r.id); load() }
  const upload = async (k: string, f?: File | null) => {
    if (!f) return; const path = `${table}/${Date.now()}-${f.name.replace(/[^\w.]/g, '_')}`
    const { error } = await supabase.storage.from('media').upload(path, f); if (error) return setMsg('Error: ' + error.message)
    setEd(x => ({ ...x!, [k]: supabase.storage.from('media').getPublicUrl(path).data.publicUrl }))
  }
  if (ed) return <form onSubmit={save} style={{ maxWidth: 640 }}><h2>{ed.id ? 'Editar' : 'Nuevo'} — {c.title}</h2>
    {c.fields.map(f => { const v = ed[f.k]; const set = (x: any) => setEd({ ...ed, [f.k]: x }); return <div key={f.k}><label htmlFor={f.k}>{f.l}</label>
      {f.t === 'area' ? <textarea id={f.k} rows={4} value={v || ''} onChange={e => set(e.target.value)} /> :
        f.t === 'bool' ? <input id={f.k} type="checkbox" checked={!!v} onChange={e => set(e.target.checked)} /> :
        f.t === 'num' ? <input id={f.k} type="number" value={v ?? 0} onChange={e => set(+e.target.value)} /> :
        f.t === 'lines' ? <textarea id={f.k} rows={4} value={(v || []).join('\n')} onChange={e => set(e.target.value.split('\n').filter(Boolean))} /> :
        f.t === 'cat' ? <select id={f.k} value={v || ''} onChange={e => set(e.target.value)}><option value="">— elegir —</option>{cats.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select> :
        f.t === 'modality' ? <select id={f.k} value={v || 'online'} onChange={e => set(e.target.value)}><option value="online">Online</option><option value="presencial">Presencial</option></select> :
        f.t === 'image' ? <><input id={f.k} type="file" accept="image/*" onChange={e => upload(f.k, e.target.files?.[0])} />{v && <img src={v} alt="" style={{ height: 80, marginTop: 6 }} />}</> :
        <input id={f.k} required={f.req} value={v || ''} onChange={e => set(e.target.value)} />}</div> })}
    {msg && <p className="msg">{msg}</p>}<div className="arow"><button className="btn" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button><button type="button" className="btn sec2" onClick={() => setEd(null)}>Cancelar</button></div></form>
  return <div><h2>{c.title}</h2>{msg && <p className="msg">{msg}</p>}<button className="btn" onClick={() => setEd(table === 'categories' ? { is_active: true, sort_order: 0 } : { is_published: table === 'programs', sort_order: 0, modality: 'online', benefits: [], modules: [], features: [], screenshots: [] })}>Crear nuevo</button>
    <table style={{ marginTop: 16 }}><thead><tr><th>Nombre</th><th>Estado</th><th></th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td>{r[c.label]}</td><td>{(table === 'categories' ? r.is_active : r.is_published) ? 'Activo' : 'Borrador'}</td>
      <td><button className="chip" onClick={() => setEd(r)}>Editar</button> <button className="chip" onClick={() => toggle(r)}>Publicar/ocultar</button> <button className="chip" onClick={() => del(r)}>Eliminar</button></td></tr>)}</tbody></table>{!rows.length && <p className="msg">Todavía no hay registros.</p>}</div>
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
    setN({ pub: await q('courses', 'is_published', true), draft: await q('courses', 'is_published', false), prog: await q('programs', 'is_published', true), cat: await q('categories') }) })() }, [])
  return <div><h2>Dashboard</h2><div className="grid">{[['Cursos publicados', n.pub], ['Cursos en borrador', n.draft], ['Programas activos', n.prog], ['Categorías', n.cat]].map(([l, v]) => <div className="panel" key={l as string}><h3>{v ?? '…'}</h3>{l}</div>)}</div></div>
}
export default function Admin() {
  const [ok, setOk] = useState<boolean | null>(null); const [err, setErr] = useState(''); const nav = useNavigate()
  const check = async () => { const { data } = await supabase.auth.getSession(); if (!data.session) return setOk(false)
    const p = await supabase.from('profiles').select('role').eq('id', data.session.user.id).maybeSingle(); if (['admin', 'super_admin', 'editor'].includes(p.data?.role)) setOk(true); else { setOk(false); setErr('Esta cuenta no tiene acceso al panel.') } }
  useEffect(() => { check() }, [])
  const login = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const d = new FormData(e.currentTarget); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email: d.get('e') as string, password: d.get('p') as string }); if (error) setErr('Correo o contraseña incorrectos.'); else check() }
  if (ok === null) return <p style={{ padding: 30 }}>Cargando…</p>
  if (!ok) return <form onSubmit={login} style={{ maxWidth: 380, margin: '80px auto', padding: 22 }}><h2>Panel MAPSE</h2><label htmlFor="e">Correo</label><input id="e" name="e" type="email" required /><label htmlFor="p">Contraseña</label><input id="p" name="p" type="password" required />
    {err && <p className="msg err">{err}</p>}<div className="arow"><button className="btn">Ingresar</button></div></form>
  return <div className="adm"><aside className="side"><div className="logo" style={{ color: '#fff', marginBottom: 20 }}>MAP<b>SE</b></div>
    <Link to="/admin">Dashboard</Link><Link to="/admin/courses">Cursos</Link><Link to="/admin/categories">Categorías</Link><Link to="/admin/programs">Programas</Link><Link to="/admin/users">Usuarios</Link><Link to="/">Ver sitio</Link>
    <a href="#" onClick={async e => { e.preventDefault(); await supabase.auth.signOut(); setOk(false); nav('/admin') }}>Salir</a></aside>
    <div style={{ padding: 30 }}><Routes><Route index element={<Dashboard />} /><Route path="courses" element={<Crud table="courses" />} /><Route path="categories" element={<Crud table="categories" />} /><Route path="programs" element={<Crud table="programs" />} /><Route path="users" element={<Users />} /></Routes></div></div>
}
