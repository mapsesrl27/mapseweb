import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { wa, STUDENTS } from './lib/supabase'
import { Logo } from './ui'
export default function Layout() {
  const [s, setS] = useState(false); const [p, setP] = useState(0); const [open, setOpen] = useState(false); const loc = useLocation()
  useEffect(() => { const f = () => { setS(scrollY > 40); const m = document.documentElement.scrollHeight - innerHeight; setP(m > 0 ? Math.min(1, scrollY / m) : 0) }
    f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [loc.pathname])
  useEffect(() => { setOpen(false); scrollTo(0, 0) }, [loc.pathname])
  const on = (r: string) => (loc.pathname.startsWith('/' + r) ? 'on' : '')
  const msg = wa('Hola MAPSE, quiero información.')
  return <div className="v">
    <div className="thread" aria-hidden><i style={{ ['--p' as any]: p }} /></div>
    <header className={'hd' + (s || open ? ' s' : '')}><div className="w"><Link to="/" aria-label="MAPSE, inicio"><Logo /></Link>
      <nav className="nv" aria-label="Principal"><Link to="/">Inicio</Link><Link className={on('cursos')} to="/cursos">Cursos</Link><Link className={on('programas')} to="/programas">Programas</Link><Link className={on('nosotros')} to="/nosotros">Nosotros</Link><Link className={on('contacto')} to="/contacto">Contacto</Link>
        <a className="sec2" href={STUDENTS}>Acceso estudiantes</a><a className="btn wa" style={{ minHeight: 42 }} href={msg} target="_blank" rel="noreferrer">WhatsApp</a></nav>
      <button className="bg" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button></div></header>
    {open && <div className="mm"><Link to="/">Inicio</Link><Link to="/cursos">Cursos</Link><Link to="/cursos/presenciales">Presenciales</Link><Link to="/cursos/online">Online</Link><Link to="/programas">Programas</Link><Link to="/nosotros">Nosotros</Link><Link to="/contacto">Contacto</Link><a href={STUDENTS}>Acceso estudiantes</a><a className="btn wa" href={msg}>Hablar por WhatsApp</a></div>}
    <main><Outlet /></main>
    <footer className="ft"><div className="w"><div className="g"><div className="c4"><b style={{ color: '#fff', font: "600 22px 'Bricolage Grotesque'" }}>MAPSE</b><p>Marketing, Publicidad y Soluciones Empresariales.<br />Santa Cruz de la Sierra, Bolivia.</p></div>
      <div className="c4"><h4>Explorar</h4><Link to="/cursos">Cursos</Link><Link to="/programas">Programas</Link><Link to="/nosotros">Nosotros</Link><a href={STUDENTS}>Acceso estudiantes</a></div>
      <div className="c4"><h4>Contacto</h4><a href={msg}>WhatsApp +591 61329819</a><a href="https://facebook.com/mapsesoluciones">Facebook @mapsesoluciones</a><a href="https://tiktok.com/@srlmapse">TikTok @srlmapse</a></div></div>
      <p style={{ marginTop: 32 }}>© MAPSE SRL — Todos los derechos reservados.</p><div className="wm" aria-hidden>MAPSE</div></div></footer>
    <a className={'fw' + (s ? ' on' : '')} href={msg} target="_blank" rel="noreferrer">WhatsApp</a></div>
}
