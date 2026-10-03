import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { wa, students } from './lib/supabase'
import { cfg } from './lib/settings'
import { Logo } from './ui'
export default function Layout() {
  const [s, setS] = useState(false); const [p, setP] = useState(0); const [open, setOpen] = useState(false); const loc = useLocation()
  useEffect(() => { const f = () => { setS(scrollY > 40); const m = document.documentElement.scrollHeight - innerHeight; setP(m > 0 ? Math.min(1, scrollY / m) : 0) }
    f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [loc.pathname])
  useEffect(() => { setOpen(false); scrollTo(0, 0) }, [loc.pathname])
  const on = (r: string) => (loc.pathname.startsWith('/' + r) ? 'on' : '')
  const msg = wa('Hola MAPSE, quiero información.'); const ST = students()
  const social = ([['Facebook', cfg('facebook_url'), cfg('facebook_label')], ['Instagram', cfg('instagram_url'), cfg('instagram_label')], ['TikTok', cfg('tiktok_url'), cfg('tiktok_label')]] as string[][]).filter(x => x[1])
  return <div className="v">
    <div className="thread" aria-hidden><i style={{ ['--p' as any]: p }} /></div>
    <header className={'hd' + (s || open ? ' s' : '')}><div className="w"><Link to="/" aria-label="MAPSE, inicio"><Logo /></Link>
      <nav className="nv" aria-label="Principal"><Link to="/">Inicio</Link><Link className={on('cursos')} to="/cursos">Cursos</Link><Link className={on('servicios')} to="/servicios">Servicios</Link><Link className={on('programas')} to="/programas">Programas</Link><Link className={on('nosotros')} to="/nosotros">Nosotros</Link><Link className={on('contacto')} to="/contacto">Contacto</Link>
        <a className="sec2" href={ST}>Acceso estudiantes</a><a className="btn wa" style={{ minHeight: 42 }} href={msg} target="_blank" rel="noreferrer">WhatsApp</a></nav>
      <button className="bg" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button></div></header>
    {open && <div className="mm"><Link to="/">Inicio</Link><Link to="/cursos">Cursos</Link><Link to="/cursos/presenciales">Presenciales</Link><Link to="/cursos/online">Online</Link><Link to="/servicios">Servicios</Link><Link to="/programas">Programas</Link><Link to="/nosotros">Nosotros</Link><Link to="/contacto">Contacto</Link><a href={ST}>Acceso estudiantes</a><a className="btn wa" href={msg}>Hablar por WhatsApp</a></div>}
    <main><Outlet /></main>
    <footer className="ft"><div className="w"><div className="g"><div className="c4"><span className="lg" style={{ color: '#fff' }}><img src={cfg('logo_url')} alt="" width={34} height={34} />{cfg('site_name')}</span><p style={{ whiteSpace: 'pre-line' }}>{cfg('footer_text')}<br />{cfg('city')}</p></div>
      <div className="c4"><h4>Explorar</h4><Link to="/cursos">Cursos</Link><Link to="/servicios">Servicios</Link><Link to="/programas">Programas</Link><Link to="/nosotros">Nosotros</Link><a href={ST}>Acceso estudiantes</a></div>
      <div className="c4"><h4>Contacto</h4><a href={msg}>WhatsApp {cfg('whatsapp_display')}</a>{social.map(([n, u, l]) => <a key={n} href={u} target="_blank" rel="noreferrer">{n} {l}</a>)}</div></div>
      <p style={{ marginTop: 32 }}>© MAPSE SRL — Todos los derechos reservados.</p><div className="wm" aria-hidden>{cfg('site_name')}</div></div></footer>
    <a className={'fw' + (s ? ' on' : '')} href={msg} target="_blank" rel="noreferrer">WhatsApp</a></div>
}
