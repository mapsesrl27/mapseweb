import { useState, FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { wa, students } from './lib/supabase'
import { cfg, pairs } from './lib/settings'
import { useRows, MOD, Cat, Course, Program, Service, Faq as FaqT, Testimonial } from './lib/data'
import { Seo, Photo, Kanban, FlowQ, ChatPhone, Faq, Head, Cta, State } from './ui'

const FP = ['50% 70%', '50% 35%', '50% 55%']
const Shot = () => <div className="shot"><img src={cfg('crm_image')} alt="Captura de MAPSE CRM24/7" loading="lazy" /></div>
const Dif = () => <div className="dif">{pairs('dif_items').map(([t, d]) => <div key={t}><h3 style={{ fontSize: 24 }}>{t}</h3><p>{d}</p></div>)}</div>
const PVisual = ({ p }: { p: Program }) => p.image_url ? <div className="shot"><img src={p.image_url} alt={p.name} loading="lazy" /></div> : p.slug.includes('crm') ? <Shot /> : <FlowQ />

const SCard = ({ x }: { x: Service }) => <Link className="cc" to={'/servicios/' + x.slug}><div className="im" style={x.image_url ? { backgroundImage: `url(${x.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>{!x.image_url && x.tagline}</div>
  <div className="bd">{x.price && <div className="mt">{x.price}</div>}<h3>{x.name}</h3><p>{x.short_description}</p></div></Link>
const Testimonials = () => { const t = useRows<Testimonial>('testimonials'); if (!t.d.length) return null
  return <section className="p1"><div className="w"><h2 style={{ marginBottom: 40, maxWidth: 820 }}>{cfg('testimonials_title')}</h2><div className="tg">{t.d.map(x => <figure className="tq" key={x.id}><blockquote>{x.text}</blockquote>
    <figcaption>{x.photo_url ? <img src={x.photo_url} alt="" loading="lazy" /> : <span>{x.name.charAt(0)}</span>}<div><b>{x.name}</b>{x.role && <small>{x.role}</small>}</div></figcaption></figure>)}</div></div></section> }
const FaqBlock = () => { const f = useRows<FaqT>('faqs'); if (!f.d.length) return null
  return <section className="p1" style={{ background: 'var(--mist)' }}><div className="w"><div className="g"><div className="c4"><h2>Preguntas frecuentes</h2></div><div className="c8"><Faq items={f.d.map(x => [x.question, x.answer] as [string, string])} /></div></div></div></section> }

export function Home() {
  const cats = useRows<Cat>('categories'); const feat = useRows<Course>('courses', q => q.eq('is_featured', true).limit(3), 'f'); const serv = useRows<Service>('services', q => q.eq('is_featured', true).limit(3), 'f')
  const FB = [cfg('course_img1'), cfg('course_img2'), cfg('course_img3')]
  const cn = (id: string) => cats.d.find(c => c.id === id)?.name || ''; const hov = [cfg('photo_side1'), cfg('photo_side2'), cfg('course_img1')]
  const tile = (c: Course, i: number, h: number) => <Link key={c.id} to={'/cursos/' + c.slug} style={{ display: 'block' }}><Photo h={h} src={c.image_url || FB[i]} pos={FP[i]} alt={c.title}><small>{cn(c.category_id)} · {MOD(c.modality)}</small><div className="cap"><h3>{c.title}</h3>{i === 0 && <p>Ver curso →</p>}</div></Photo></Link>
  return <><Seo t="Capacitación + tecnología" d="Cursos prácticos y aplicaciones web para negocios. MAPSE SRL." />
    <section className="dk hero"><div className="w"><div className="g"><div className="c7 rise"><h1>{cfg('hero_title')}</h1>
      <p className="lead">{cfg('hero_text')}</p>
      <div className="btns"><Link className="btn" to="/cursos">Ver cursos</Link><Link className="btn out" to="/programas">Conocer programas</Link></div></div>
      {cfg('hero_image') ? <div className="c5 rise" style={{ animationDelay: '.25s' }}><Photo h={520} src={cfg('hero_image')} alt={cfg('hero_title')} /></div> : <div className="c5 stagev"><div className="rise" style={{ animationDelay: '.25s' }}><ChatPhone /></div><div className="pan rise" style={{ animationDelay: '.55s' }}><b style={{ color: '#001D44' }}>Oportunidades</b><div style={{ height: 8 }} /><Kanban /></div></div>}</div></div></section>
    <section className="p2" style={{ background: 'var(--mist)' }}><div className="w"><div className="stop">Conocimiento</div><h2 className="big" style={{ maxWidth: 1000 }}>{cfg('big_title')}</h2></div></section>
    <section className="p1"><div className="w"><h2 style={{ maxWidth: 720 }}>{cfg('practice_title')}</h2><p className="lead" style={{ marginBottom: 40 }}>{cfg('practice_text')}</p>
      <div className="g"><div className="c7"><Photo h={520} src={cfg('photo_main')} pos="50% 62%" alt={cfg('photo_main_title')}><div className="cap"><h3>{cfg('photo_main_title')}</h3><p>{cfg('photo_main_caption')}</p></div></Photo></div>
        <div className="c5" style={{ display: 'grid', gap: 24 }}><Photo h={248} src={cfg('photo_side1')} pos="50% 55%" alt="Clase MAPSE" /><Photo h={248} src={cfg('photo_side2')} pos="50% 45%" alt="Clase MAPSE" /></div></div></div></section>
    <section className="p1"><div className="w">{cats.d.map((c, i) => <Link className="row" key={c.id} to={'/cursos?cat=' + c.slug}><h3>{c.name}</h3><p>{c.description}</p><span className="ar">→</span><span className="pv" style={{ backgroundImage: `url(${c.image_url || hov[i % 3]})` }} /></Link>)}</div></section>
    <section className="p1" style={{ paddingTop: 0 }}><div className="w"><h2 style={{ marginBottom: 40 }}>{cfg('courses_title')}</h2>
      {feat.l ? <p>Cargando…</p> : !feat.d.length ? <div style={{ border: '1px dashed #9FC3D9', borderRadius: 16, padding: 40 }}><p>No hay cursos destacados actualmente.</p><a className="btn wa" href={wa('Hola MAPSE, quiero información sobre los cursos.')}>Consultar por WhatsApp</a></div> :
        <div className="g"><div className="c7">{tile(feat.d[0], 0, 440)}</div><div className="c5" style={{ display: 'grid', gap: 24 }}>{feat.d.slice(1, 3).map((c, i) => tile(c, i + 1, 208))}</div></div>}
      <div className="btns"><Link className="btn out" to="/cursos">Ver todos los cursos</Link></div></div></section>
    {serv.d.length > 0 && <section className="p1" style={{ background: 'var(--mist)' }}><div className="w"><div className="g" style={{ alignItems: 'end' }}><div className="c7"><h2>{cfg('services_title')}</h2></div><div className="c5"><p className="lead" style={{ margin: 0 }}>{cfg('services_text')}</p></div></div>
      <div className="cg">{serv.d.map(x => <SCard key={x.id} x={x} />)}</div><div className="btns"><Link className="btn out" to="/servicios">Ver todos los servicios</Link></div></div></section>}
    <section className="dk p2"><div className="w"><div className="g"><div className="c6 stick"><div className="stop">Aplicación</div><h2>{cfg('flow_title')}</h2><p className="lead">{cfg('flow_text')}</p><div className="btns"><Link className="btn" to={cfg('flow_link')}>Conocer MAPSE FLOW</Link></div></div><div className="c6">{cfg('flow_image') ? <div className="shot"><img src={cfg('flow_image')} alt="MAPSE FLOW" loading="lazy" /></div> : <FlowQ />}</div></div></div></section>
    <section className="p2" style={{ background: 'var(--ice)' }}><div className="w"><div className="g" style={{ alignItems: 'end' }}><div className="c7"><h2>{cfg('crm_title')}</h2></div><div className="c5"><p className="lead" style={{ margin: 0 }}>{cfg('crm_text')}</p></div></div>
      <div style={{ marginTop: 48 }}><Shot /></div>
      <div className="dif" style={{ marginTop: 24 }}>{pairs('crm_features').map(([t, d]) => <div key={t}><h3 style={{ fontSize: 22 }}>{t}</h3><p>{d}</p></div>)}</div>
      <div className="btns"><Link className="btn" to={cfg('crm_link')}>Conocer MAPSE CRM24/7</Link></div></div></section>
    <section className="p1"><div className="w"><h2 style={{ marginBottom: 40 }}>{cfg('dif_title')}</h2><Dif /></div></section>
    <Testimonials />
    <FaqBlock />
    <section className="dk p2"><div className="w"><div className="stop">Resultados</div><h2>{cfg('cta_title')}</h2><p className="big" style={{ margin: '40px 0', color: '#fff', fontFamily: "'Bricolage Grotesque'", fontWeight: 600 }}>{cfg('whatsapp_display')}</p>
      <div className="btns" style={{ marginTop: 0 }}><a className="btn wa" href={wa('Hola MAPSE, quiero información.')}>Hablar por WhatsApp</a><Link className="btn out" to="/cursos">Ver cursos</Link></div></div></section></>
}

export function Courses({ mode }: { mode?: 'presencial' | 'online' }) {
  const cats = useRows<Cat>('categories'); const { d, l, e } = useRows<Course>('courses', q => (mode ? q.eq('modality', mode) : q), mode || 'all')
  const [sp] = useSearchParams(); const [F, setF] = useState(sp.get('cat') || ''); const [M, setM] = useState('')
  const list = d.filter(c => (!F || cats.d.find(x => x.id === c.category_id)?.slug === F) && (!M || c.modality === M))
  const t = mode === 'presencial' ? 'Cursos presenciales' : mode === 'online' ? 'Cursos online' : 'Cursos'
  const p = mode === 'presencial' ? 'Aprendizaje práctico en experiencias de formación diseñadas para aplicar desde el primer momento.' : mode === 'online' ? 'Aprende desde donde estés con formación digital enfocada en habilidades prácticas.' : 'Marketing Digital, Habilidades Digitales y Negocios Digitales, en modalidad presencial y online.'
  const chips = (items: [string, string][], cur: string, set: (v: string) => void) => <div className="chips">{items.map(([v, n]) => <button key={v} className={'chip' + (cur === v ? ' on' : '')} onClick={() => set(v)}>{n}</button>)}</div>
  return <><Seo t={t} d={p} /><Head st="Conocimiento" t={t} p={p} />
    <section className="p1"><div className="w">{chips([['', 'Todos'], ...cats.d.map(c => [c.slug, c.name] as [string, string])], F, setF)}{!mode && chips([['', 'Todas las modalidades'], ['presencial', 'Presencial'], ['online', 'Online']], M, setM)}
      <State l={l} e={e} n={!list.length} msg="No hay cursos publicados con ese filtro." />
      <div className="cg">{list.map(c => <Link className="cc" key={c.id} to={'/cursos/' + c.slug}><div className="im" style={c.image_url ? { backgroundImage: `url(${c.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>{!c.image_url && cats.d.find(x => x.id === c.category_id)?.name}</div>
        <div className="bd"><div className="mt">{MOD(c.modality)}{c.level ? ' · ' + c.level : ''}</div><h3>{c.title}</h3><p>{c.short_description}</p></div></Link>)}</div></div></section>
    <Cta t="¿No sabes por dónde empezar?" /></>
}

export function CourseDetail() {
  const { slug } = useParams(); const { d, l, e } = useRows<Course>('courses', q => q.eq('slug', slug), slug || ''); const cats = useRows<Cat>('categories'); const c = d[0]
  if (!c) return <><Head st="Cursos" t={l ? 'Cargando…' : 'Curso no encontrado'} /><section className="p1"><div className="w"><State l={false} e={e} n={!l} msg="Este curso no está disponible." /><div className="btns"><Link className="btn" to="/cursos">Ver cursos</Link></div></div></section></>
  const info = ([['Inversión', c.price], ['Duración', c.duration], ['Fecha', c.start_date], ['Horario', c.schedule], ['Ubicación', c.location], ['Instructor', c.instructor]] as [string, string][]).filter(x => x[1])
  const L = (t: string, a?: string[]) => a?.length ? <><h2 style={{ margin: '48px 0 24px' }}>{t}</h2><ul className="ul">{a.map((b, k) => <li key={k}><b>{String(k + 1).padStart(2, '0')}</b>{b}</li>)}</ul></> : null
  return <><Seo t={c.seo_title || c.title} d={c.seo_description || c.short_description} />
    <Head st={(cats.d.find(x => x.id === c.category_id)?.name || 'Curso') + ' · ' + MOD(c.modality)} t={c.title} p={c.short_description} />
    <section className="p1"><div className="w"><div className="g"><div className="c7">{c.image_url && <Photo h={360} src={c.image_url} alt={c.title} />}{c.description && <p style={{ whiteSpace: 'pre-line', marginTop: 32 }}>{c.description}</p>}{L('Qué aprenderás', c.benefits)}{L('Temario', c.modules)}{c.audience && <><h2 style={{ margin: '48px 0 16px' }}>¿Para quién es?</h2><p>{c.audience}</p></>}</div>
      <div className="c5"><div className="stick box"><div className="mt">{MOD(c.modality)}{c.level ? ' · ' + c.level : ''}</div><h3>{c.title}</h3>{info.map(([k, v]) => <p key={k} style={{ margin: '8px 0', fontSize: 16 }}><b>{k}:</b> {v}</p>)}
        <div className="btns" style={{ marginTop: 20 }}><a className="btn wa" href={wa(`Hola MAPSE, quiero información sobre el curso ${c.title}.`)} target="_blank" rel="noreferrer">Quiero información</a>{c.modality === 'online' && <a className="btn out" href={students()}>Acceder a plataforma</a>}</div>
        <p style={{ fontSize: 14, marginTop: 16 }}><Link to="/cursos" style={{ color: 'var(--ink1)' }}>← Ver todos los cursos</Link></p></div></div></div></div></section><Cta t="¿Te interesa este curso?" /></>
}

export function Programs() {
  const { d, l, e } = useRows<Program>('programs')
  return <><Seo t="Programas" d="Aplicaciones web para comunicar y vender por WhatsApp." /><Head st="Aplicación" t="Programas" p="Aplicaciones web enfocadas en ventas, comunicación y gestión comercial." />
    <section className="p1"><div className="w"><State l={l} e={e} n={!d.length} msg="No hay programas disponibles actualmente." />
      {d.map((p, i) => <div className={'alt' + (i % 2 ? ' r' : '')} key={p.id}><div><h2>{p.name}</h2><p className="lead">{p.short_description || p.tagline}</p><div className="btns"><Link className="btn" to={'/programas/' + p.slug}>Conocer {p.name}</Link></div></div><div><PVisual p={p} /></div></div>)}</div></section><Cta t="¿Quieres ver un programa en acción?" /></>
}

export function ProgramDetail() {
  const { slug } = useParams(); const { d, l, e } = useRows<Program>('programs', q => q.eq('slug', slug), slug || ''); const p = d[0]
  if (!p) return <><Head st="Aplicación" t={l ? 'Cargando…' : 'Programa no encontrado'} /><section className="p1"><div className="w"><State l={false} e={e} n={!l} msg="Este programa no está disponible." /><div className="btns"><Link className="btn" to="/programas">Ver programas</Link></div></div></section></>
  const L = (t: string, a?: string[]) => a?.length ? <><h2 style={{ margin: '40px 0 20px' }}>{t}</h2><ul className="ul">{a.map((b, k) => <li key={k}><b>{String(k + 1).padStart(2, '0')}</b>{b}</li>)}</ul></> : null
  return <><Seo t={p.seo_title || p.name} d={p.seo_description || p.short_description} /><Head st="Aplicación" t={p.name} p={p.tagline} />
    <section className="p1"><div className="w"><div className="g" style={{ alignItems: 'start' }}><div className="c6"><PVisual p={p} />{p.screenshots?.map((s, i) => <img key={i} src={s} alt={`${p.name} captura ${i + 1}`} loading="lazy" style={{ width: '100%', borderRadius: 16, marginTop: 16 }} />)}</div>
      <div className="c6">{p.short_description && <p className="lead" style={{ marginTop: 0 }}>{p.short_description}</p>}{p.problem && <><h2 style={{ margin: '32px 0 12px' }}>El problema</h2><p>{p.problem}</p></>}{p.description && <p style={{ whiteSpace: 'pre-line' }}>{p.description}</p>}{L('Funciones', p.features)}{L('Beneficios', p.benefits)}
        <div className="btns"><a className="btn wa" href={wa(`Hola MAPSE, quiero información sobre ${p.name}.`)} target="_blank" rel="noreferrer">Solicitar información</a><Link className="btn out" to="/programas">Ver programas</Link></div></div></div></div></section><Cta t="¿Hablamos de tu proceso comercial?" /></>
}

export const About = () => <><Seo t="Nosotros" d={cfg('about_lead')} /><Head st="Conocimiento" t={cfg('about_title')} p={cfg('about_lead')} />
  <section className="p1"><div className="w"><div className="g"><div className="c5"><h2>{cfg('about_heading')}</h2></div><div className="c7"><p className="lead" style={{ maxWidth: 'none', marginTop: 0, whiteSpace: 'pre-line' }}>{cfg('about_text')}</p></div></div>
    {cfg('about_image') && <div style={{ marginTop: 48 }}><Photo h={480} src={cfg('about_image')} alt={cfg('about_heading')} /></div>}</div></section>
  <section className="p1" style={{ background: 'var(--mist)' }}><div className="w"><Dif /></div></section><Testimonials /><Cta t="Conversemos sobre lo que quieres desarrollar." /></>

export function Services() {
  const { d, l, e } = useRows<Service>('services')
  return <><Seo t="Servicios" d={cfg('services_text')} /><Head st="Servicios" t="Servicios" p={cfg('services_text')} />
    <section className="p1"><div className="w"><State l={l} e={e} n={!d.length} msg="Pronto publicaremos nuestros servicios. Escríbenos por WhatsApp para consultar." />
      <div className="cg">{d.map(x => <SCard key={x.id} x={x} />)}</div></div></section><Cta t="¿Necesitas una solución a la medida?" /></>
}

export function ServiceDetail() {
  const { slug } = useParams(); const { d, l, e } = useRows<Service>('services', q => q.eq('slug', slug), slug || ''); const x = d[0]
  if (!x) return <><Head st="Servicios" t={l ? 'Cargando…' : 'Servicio no encontrado'} /><section className="p1"><div className="w"><State l={false} e={e} n={!l} msg="Este servicio no está disponible." /><div className="btns"><Link className="btn" to="/servicios">Ver servicios</Link></div></div></section></>
  return <><Seo t={x.seo_title || x.name} d={x.seo_description || x.short_description} /><Head st="Servicios" t={x.name} p={x.tagline || x.short_description} />
    <section className="p1"><div className="w"><div className="g"><div className="c7">{x.image_url && <Photo h={360} src={x.image_url} alt={x.name} />}{x.description && <p style={{ whiteSpace: 'pre-line', marginTop: 32 }}>{x.description}</p>}
      {x.features?.length > 0 && <><h2 style={{ margin: '48px 0 24px' }}>Qué incluye</h2><ul className="ul">{x.features.map((b, k) => <li key={k}><b>{String(k + 1).padStart(2, '0')}</b>{b}</li>)}</ul></>}</div>
      <div className="c5"><div className="stick box"><h3>{x.name}</h3>{x.short_description && <p style={{ fontSize: 16 }}>{x.short_description}</p>}{x.price && <p style={{ margin: '8px 0', fontSize: 16 }}><b>Inversión:</b> {x.price}</p>}
        <div className="btns" style={{ marginTop: 20 }}><a className="btn wa" href={wa(x.whatsapp_message || `Hola MAPSE, quiero información sobre el servicio ${x.name}.`)} target="_blank" rel="noreferrer">Quiero información</a></div>
        <p style={{ fontSize: 14, marginTop: 16 }}><Link to="/servicios" style={{ color: 'var(--ink1)' }}>← Ver todos los servicios</Link></p></div></div></div></div></section><Cta t="¿Te interesa este servicio?" /></>
}

export function Contact() {
  const [n, setN] = useState(''); const [i, setI] = useState('Cursos'); const [t, setT] = useState('')
  const sv = useRows<Service>('services'); const pg = useRows<Program>('programs')
  const social = ([['Facebook', cfg('facebook_url'), cfg('facebook_label')], ['Instagram', cfg('instagram_url'), cfg('instagram_label')], ['TikTok', cfg('tiktok_url'), cfg('tiktok_label')]] as string[][]).filter(x => x[1])
  const go = (ev: FormEvent) => { ev.preventDefault(); window.open(wa(`Hola MAPSE, soy ${n}. Me interesa: ${i}. ${t}`), '_blank') }
  return <><Seo t="Contacto" d="Escríbenos por WhatsApp." /><Head st="Resultados" t="Contacto" p="Escríbenos y te respondemos por WhatsApp." />
    <section className="p1"><div className="w"><div className="g"><div className="c6"><form className="fm" onSubmit={go}><label htmlFor="n">Nombre</label><input id="n" required value={n} onChange={e => setN(e.target.value)} />
      <label htmlFor="i">Me interesa</label><select id="i" value={i} onChange={e => setI(e.target.value)}><option>Cursos</option>{sv.d.map(x => <option key={x.id}>{x.name}</option>)}{pg.d.map(x => <option key={x.id}>{x.name}</option>)}<option>Otro</option></select>
      <label htmlFor="t">Mensaje</label><textarea id="t" rows={4} value={t} onChange={e => setT(e.target.value)} /><div className="btns"><button className="btn wa" type="submit" style={{ cursor: 'pointer' }}>Enviar por WhatsApp</button></div></form></div>
      <div className="c6 ch"><a href={wa('Hola MAPSE')}>WhatsApp <span>{cfg('whatsapp_display')}</span></a>{social.map(([nm, u, lb]) => <a key={nm} href={u} target="_blank" rel="noreferrer">{nm} <span>{lb}</span></a>)}<a href={students()}>Acceso estudiantes <span>→</span></a><p style={{ color: 'var(--ink2)' }}>{cfg('city')}</p></div></div></div></section></>
}
export const NotFound = () => <section className="dk" style={{ padding: '170px 0 96px' }}><div className="w"><div className="e404">404</div><h2 style={{ marginTop: 32 }}>Esta página no existe.</h2><div className="btns"><Link className="btn" to="/">Volver al inicio</Link><Link className="btn out" to="/cursos">Ver cursos</Link></div></div></section>
export function Access() { const u = students(); window.location.href = u; return <section className="p1"><div className="w"><p>Redirigiendo a <a href={u}>{u}</a>…</p></div></section> }
