import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Admin from './pages/Admin'
import AdminLegacy from './pages/AdminLegacy'
import PageBuilder from './pages/PageBuilder'
import DynamicPage from './pages/DynamicPage'

export default function App(){
  return <div className="app"><Routes>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="/admin/legacy" element={<AdminLegacy/>}/>
    <Route path="/admin/pages/new" element={<PageBuilder/>}/>
    <Route path="/admin/pages/:id" element={<PageBuilder/>}/>
    <Route path="/*" element={<><Navbar/><main><Routes><Route path="/" element={<Core slug="home"/>}/><Route path="/about" element={<Core slug="about"/>}/><Route path="/services" element={<Core slug="services"/>}/><Route path="/projects" element={<Core slug="projects"/>}/><Route path="/team" element={<Core slug="team"/>}/><Route path="/contact" element={<Core slug="contact"/>}/><Route path="/:slug" element={<DynamicPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main><Footer/></>}/>
  </Routes></div>
}
function Core({slug}){return <DynamicPage key={slug} slugOverride={slug}/>} 
