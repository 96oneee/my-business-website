import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SiteContentContext = createContext(null)

export function SiteContentProvider({ children }) {
  const [siteContent, setSiteContent] = useState(null)
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [team, setTeam] = useState([])
  const [values, setValues] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadContent() {
    setLoading(true)
    setError(null)

    const [
      siteResult,
      servicesResult,
      projectsResult,
      teamResult,
      valuesResult,
      socialsResult
    ] = await Promise.all([
      supabase
        .from('site_content')
        .select('*')
        .limit(1)
        .maybeSingle(),

      supabase
        .from('services')
        .select('*')
        .order('sort_order'),

      supabase
        .from('projects')
        .select('*')
        .order('sort_order'),

      supabase
        .from('team_members')
        .select('*')
        .order('sort_order'),

      supabase
        .from('site_values')
        .select('*')
        .order('sort_order'),

      supabase
        .from('social_links')
        .select('*')
        .order('sort_order')
    ])

    const results = [
      siteResult,
      servicesResult,
      projectsResult,
      teamResult,
      valuesResult,
      socialsResult
    ]

    const firstError = results.find(
      (result) => result.error
    )

    if (firstError) {
      console.error(firstError.error)
      setError(firstError.error)
    }

    setSiteContent(siteResult.data || null)
    setServices(servicesResult.data || [])
    setProjects(projectsResult.data || [])
    setTeam(teamResult.data || [])
    setValues(valuesResult.data || [])
    setSocialLinks(socialsResult.data || [])

    setLoading(false)
  }

  useEffect(() => {
    loadContent()
  }, [])

  return (
    <SiteContentContext.Provider
      value={{
        siteContent,
        services,
        projects,
        team,
        values,
        socialLinks,
        loading,
        error,
        reloadContent: loadContent
      }}
    >
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}