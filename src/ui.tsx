import { useEffect, useState, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { wa } from './lib/supabase'
export const Logo = () => <span className="lg"><svg width="32" height="32" viewBox="0 0 34 34" aria-hidden><rect width="34" height="34" rx="9" fill="#001D44" stroke="#308CA2" /><path d="M7 26V10l10 10 10-10v16" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" /><circle cx="17" cy="8" r="2.6" fill="#308CA2" /></svg>MAPSE</span>
export function Seo({ t, d }: { t: string; d?: string }) { useEffect(() => { document.title = t + ' | MAPSE'; if (d) document.querySelector('meta[name=description]')?.setAttribute('content', d) }, [t, d]); return null }
export const Photo = ({ src, alt, pos = '50% 50%', h, children }: { src: string; alt: string; pos?: string; h?: number; children?: ReactNode }) =>
  <div className="ph3" style={{ height: h }}><img src={src} alt={alt} style={{ objectPosition: pos }} loading="lazy" />{children}</div>
export const Kanban = () => <div className="kan">{([['Nuevo', 3], ['Seguimiento', 2], ['Cierre', 1]] as [string, number][]).map(([c, n]) => <div key={c}><small>{c}</small>{Array.from({ length: n }).map((_, k) => <div className="kc" key={k}><i /><i /></div>)}</div>)}</div>
export const FlowQ = () => <div className="ph" style={{ position: 'relative', right: 'auto', margin: 'auto' }}><div className="scr"><div className="hdr">MAPSE FLOW<small>Cola de envíos · ejemplo</small></div>
  {([['Lista A', 'Enviado', 'a'], ['Lista B', 'Pendiente', 'b2'], ['Lista C', 'Respondido', 'c'], ['Lista D', 'Pendiente', 'b2']] as string[][]).map(([n, s, c]) => <div className="q" key={n}><b>{n}</b><span className={'pl ' + c}>{s}</span></div>)}</div></div>
export const ChatPhone = () => <div className="ph"><div className="scr"><div className="hdr">Conversación<small>Mensajes de ejemplo</small></div>
  <div className="b i">Hola, ¿tienen información?</div><div className="b o">Claro, te comparto el detalle.</div><div className="b i">Perfecto, gracias.</div><div className="tag">Seguimiento programado</div><div className="b o">Te escribo mañana con la propuesta.</div></div></div>
export function Faq({ items }: { items: [string, string][] }) {
  const [o, setO] = useState(0)
  return <div className="faq">{items.map(([q, a], i) => <div key={q}><button aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}>{q}<span>{o === i ? '−' : '+'}</span></button>{o === i && <p>{a}</p>}</div>)}</div>
}
export const Head = ({ st, t, p }: { st: string; t: string; p?: string }) => <section className="dk ph0"><div className="w rise"><div className="stop">{st}</div><h1>{t}</h1>{p && <p className="lead">{p}</p>}</div></section>
export const Cta = ({ t }: { t: string }) => <section className="dk p1"><div className="w"><div className="stop">Resultados</div><h2>{t}</h2>
  <div className="btns"><a className="btn wa" href={wa('Hola MAPSE, quiero información.')} target="_blank" rel="noreferrer">Hablar por WhatsApp</a><Link className="btn out" to="/cursos">Ver cursos</Link></div></div></section>
export const State = ({ l, e, n, msg }: { l: boolean; e: string; n: boolean; msg: string }) => l ? <p>Cargando…</p> : e ? <p>No se pudo cargar el contenido. Intenta de nuevo más tarde.</p> : n ? <p>{msg}</p> : null
