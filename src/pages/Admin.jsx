import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CORE = [
  { slug: 'home', name: 'Home', title: 'Home page', path: '/' },
  { slug: 'about', name: 'About', title: 'About page', path: '/about' },
  { slug: 'services', name: 'Services', title: 'Services page', path: '/services' },
  { slug: 'projects', name: 'Projects', title: 'Projects page', path: '/projects' },
  { slug: 'team', name: 'Team', title: 'Team page', path: '/team' },
  { slug: 'contact', name: 'Contact', title: 'Contact page', path: '/contact' }
]

export default function Admin() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [navItems, setNavItems] = useState([])
  const [navLoading, setNavLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user || null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user) { loadPages(); loadNavigation() }
    else setLoading(false)
  }, [user])

  async function loadPages() {
    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.from('pages').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    if (error) {
      setMessage(`Could not load pages: ${error.message}`)
      setPages([])
    } else {
      setPages(data || [])
    }
    setLoading(false)
  }

  async function loadNavigation() { setNavLoading(true); const {data,error}=await supabase.from('navigation_items').select('*').order('sort_order',{ascending:true}); if(!error)setNavItems(data||[]); else setMessage(`Could not load navigation: ${error.message}`); setNavLoading(false) }
  async function saveNavigation(items) { setNavItems(items); const rows=items.map((x,i)=>({...x,sort_order:i})); for(const row of rows){ const {id,...payload}=row; const {error}=await supabase.from('navigation_items').upsert({id,payload:undefined,...payload}); if(error){setMessage(`Navigation save failed: ${error.message}`); return} } setMessage('Navigation saved ✓') }
  async function addNavigation(){ const row={id:crypto.randomUUID(),label:'New link',path:'/',visible:true,sort_order:navItems.length}; const {error}=await supabase.from('navigation_items').insert(row); if(error)setMessage(`Could not add navigation item: ${error.message}`); else loadNavigation() }
  async function updateNavigation(id,patch){const next=navItems.map(x=>x.id===id?{...x,...patch}:x);setNavItems(next);const {error}=await supabase.from('navigation_items').update(patch).eq('id',id);if(error)setMessage(`Navigation update failed: ${error.message}`)}
  async function deleteNavigation(id){if(!window.confirm('Remove this navigation item?'))return;const {error}=await supabase.from('navigation_items').delete().eq('id',id);if(error)setMessage(`Could not remove navigation item: ${error.message}`);else loadNavigation()}

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function createCorePages() {
    setBusy(true)
    setMessage('')
    const existing = new Set(pages.map(p => p.slug))
    const missing = CORE.filter(p => !existing.has(p.slug))
    if (!missing.length) {
      setMessage('All core pages already exist.')
      setBusy(false)
      return
    }
    const rows = missing.map((p, i) => ({
      id: crypto.randomUUID(),
      name: p.name,
      slug: p.slug,
      title: p.title,
      description: '',
      background_image: '',
      background_color: '',
      is_published: true,
      show_in_navigation: p.slug !== 'home',
      sort_order: CORE.findIndex(x => x.slug === p.slug) >= 0 ? CORE.findIndex(x => x.slug === p.slug) : 100 + i
    }))
    const { error } = await supabase.from('pages').insert(rows)
    if (error) setMessage(`Could not create pages: ${error.message}`)
    else {
      setMessage(`${missing.length} core page${missing.length > 1 ? 's' : ''} added. Open each one and Save once to initialize its sections.`)
      await loadPages()
    }
    setBusy(false)
  }

  async function deletePage(page) {
    if (CORE.some(p => p.slug === page.slug)) {
      setMessage('Core pages are protected here. Use the Advanced Content Manager for database-level changes.')
      return
    }
    if (!window.confirm(`Delete “${page.name}”?`)) return
    setBusy(true)
    const { error } = await supabase.from('pages').delete().eq('id', page.id)
    if (error) setMessage(`Could not delete page: ${error.message}`)
    else await loadPages()
    setBusy(false)
  }

  const corePages = useMemo(() => CORE.map(c => pages.find(p => p.slug === c.slug) || { ...c, missing: true }), [pages])
  const customPages = pages.filter(p => !CORE.some(c => c.slug === p.slug))

  if (!user) {
    return <Login />
  }

  return (
    <div className="visual-admin-shell">
      <header className="visual-admin-topbar">
        <div>
          <div className="visual-admin-kicker">SITE EDITOR</div>
          <h1>Pages</h1>
        </div>
        <div className="visual-admin-actions">
          <button className="va-btn va-btn-secondary" onClick={() => navigate('/')}>View site</button>
          <button className="va-btn va-btn-secondary" onClick={() => navigate('/admin/legacy')}>Advanced content</button>
          <button className="va-btn va-btn-dark" onClick={() => navigate('/admin/pages/new')}>＋ Create page</button>
          <button className="va-btn va-btn-ghost" onClick={signOut}>Log out</button>
        </div>
      </header>

      <main className="visual-admin-content">
        <div className="va-intro">
          <div>
            <h2>Choose a page to edit</h2>
            <p>Edit your website visually with sections and blocks, without touching code.</p>
          </div>
          <button className="va-btn va-btn-secondary" disabled={busy} onClick={createCorePages}>Initialize core pages</button>
        </div>
        {message && <div className="va-message">{message}</div>}

        <section className="va-section">
          <div className="va-section-title"><span>CORE PAGES</span><small>Built-in website pages</small></div>
          <div className="va-page-grid">
            {corePages.map(page => (
              <PageCard key={page.slug} page={page} core onOpen={() => page.missing ? createCorePages() : navigate(`/admin/pages/${page.id}`)} />
            ))}
          </div>
        </section>

        <section className="va-section"><div className="va-section-title"><span>NAVIGATION</span><small>Menu links shown on the public site</small><button className="va-btn va-btn-secondary" onClick={addNavigation}>＋ Add link</button></div>{navLoading?<div className="va-empty">Loading navigation…</div>:<div className="va-nav-editor">{navItems.map((item,i)=><div className="va-nav-row" key={item.id}><span className="va-drag">⋮⋮</span><input value={item.label||''} onChange={e=>updateNavigation(item.id,{label:e.target.value})}/><input value={item.path||''} onChange={e=>updateNavigation(item.id,{path:e.target.value})} placeholder="/page or https://…"/><label><input type="checkbox" checked={item.visible!==false} onChange={e=>updateNavigation(item.id,{visible:e.target.checked})}/> Visible</label><button onClick={()=>deleteNavigation(item.id)}>Delete</button></div>)}</div>}</section>

        <section className="va-section">
          <div className="va-section-title"><span>CUSTOM PAGES</span><small>{customPages.length} page{customPages.length === 1 ? '' : 's'}</small></div>
          {loading ? <div className="va-empty">Loading pages…</div> : customPages.length === 0 ? (
            <div className="va-empty"><strong>No custom pages yet.</strong><span>Create one and build it visually.</span></div>
          ) : (
            <div className="va-page-grid">
              {customPages.map(page => <PageCard key={page.id} page={page} onOpen={() => navigate(`/admin/pages/${page.id}`)} onDelete={() => deletePage(page)} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function PageCard({ page, core, onOpen, onDelete }) {
  return (
    <article className="va-page-card" onClick={onOpen}>
      <div className="va-page-preview">
        <div className="va-browser"><span/><span/><span/></div>
        <div className="va-preview-lines"><i/><b/><em/><em/></div>
      </div>
      <div className="va-page-card-body">
        <div>
          <h3>{page.name}</h3>
          <p>{core ? page.path : `/${page.slug}`}</p>
        </div>
        <div className="va-card-actions" onClick={e => e.stopPropagation()}>
          <button className="va-icon-btn" onClick={onOpen} title="Edit">Edit</button>
          {!core && onDelete && <button className="va-icon-btn danger" onClick={onDelete} title="Delete">Delete</button>}
        </div>
      </div>
      <div className="va-status-row"><span className={page.is_published === false ? 'draft-dot' : 'live-dot'} />{page.is_published === false ? 'Draft' : 'Published'}</div>
    </article>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }
  return <div className="va-login"><form onSubmit={submit} className="va-login-card"><div className="visual-admin-kicker">SITE EDITOR</div><h1>Sign in</h1><p>Use your admin account to edit the website.</p><label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{error && <div className="va-error">{error}</div>}<button className="va-btn va-btn-dark" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form></div>
}
