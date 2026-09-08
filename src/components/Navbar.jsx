import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSiteContent } from '../context/SiteContentContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [links, setLinks] = useState([])
  const [headerStyle, setHeaderStyle] = useState({background:'#fff',textColor:'#222',borderColor:'#e5e5e5',sticky:false,logoSize:18})

  const {
    siteContent,
    loading
  } = useSiteContent()

  useEffect(() => { loadNavigation(); try { setHeaderStyle({...headerStyle,...JSON.parse(localStorage.getItem('site_header_settings')||'{}')}) } catch {} }, [])

  async function loadNavigation() {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('visible', true)
      .order('sort_order', {
        ascending: true
      })

    if (error) {
      console.error(
        'Could not load navigation:',
        error
      )

      // Fallback navigation if database
      // cannot be reached.
      setLinks([
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/services', label: 'Services' },
        { path: '/projects', label: 'Projects' },
        { path: '/team', label: 'Team' },
        { path: '/contact', label: 'Contact' }
      ])

      return
    }

    setLinks(data || [])
  }

  if (loading) {
    return null
  }

  const businessName =
    siteContent?.business_name ||
    'Your Business Name'

  return (
    <header className="navbar" style={{background:headerStyle.background,color:headerStyle.textColor,borderBottomColor:headerStyle.borderColor,position:headerStyle.sticky?'sticky':undefined,top:headerStyle.sticky?0:undefined,zIndex:headerStyle.sticky?50:undefined}}>

      <div className="nav-inner">

        {/* LOGO / BUSINESS NAME */}

        <Link
          to="/"
          className="logo"
          style={{fontSize:`${Number(headerStyle.logoSize)||18}px`,color:headerStyle.textColor}}
          onClick={() => setOpen(false)}
        >
          {businessName}
        </Link>


        {/* MOBILE MENU BUTTON */}

        <button
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <i
            className={
              open
                ? 'fa-solid fa-xmark'
                : 'fa-solid fa-bars'
            }
          />
        </button>


        {/* NAVIGATION */}

        <nav
          className={`nav-links ${
            open ? 'open' : ''
          }`}
        >

          {links.map((item) => (

            item.path && (/^https?:\/\//i.test(item.path) || item.path.startsWith('mailto:') || item.path.startsWith('tel:') || item.path.startsWith('whatsapp:')) ? (
              <a key={item.id} href={item.path} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>{item.label}</a>
            ) : (
              <NavLink key={item.id} to={item.path || '/'} end={(item.path || '/') === '/'} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>{item.label}</NavLink>
            )

          ))}

        </nav>

      </div>

    </header>
  )
}
