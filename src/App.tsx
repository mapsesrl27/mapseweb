import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Admin from './admin/Admin'
import { Home, Courses, CourseDetail, Programs, ProgramDetail, Services, ServiceDetail, About, Contact, NotFound, Access } from './pages'
export default function App() {
  return <Routes>
    <Route path="/admin/*" element={<div className="admin-root"><Admin /></div>} />
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} /><Route path="/cursos" element={<Courses />} /><Route path="/cursos/presenciales" element={<Courses mode="presencial" />} /><Route path="/cursos/online" element={<Courses mode="online" />} /><Route path="/cursos/:slug" element={<CourseDetail />} />
      <Route path="/servicios" element={<Services />} /><Route path="/servicios/:slug" element={<ServiceDetail />} />
      <Route path="/programas" element={<Programs />} /><Route path="/programas/:slug" element={<ProgramDetail />} /><Route path="/nosotros" element={<About />} /><Route path="/contacto" element={<Contact />} />
      <Route path="/acceso" element={<Access />} /><Route path="/acceso-estudiantes" element={<Access />} /><Route path="*" element={<NotFound />} />
    </Route></Routes>
}
