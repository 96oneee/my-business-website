import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSiteContent } from '../context/SiteContentContext'

export default function Admin() {
  const navigate = useNavigate()

  const {
    siteContent,
    services,
    projects,
    team,
    values,
    socialLinks,
    loading,
    reloadContent
  } = useSiteContent()

  // =========================================================
  // AUTH
  // =========================================================

  const [session, setSession] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // =========================================================
  // GENERAL
  // =========================================================

  const [activeSection, setActiveSection] = useState('business')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // =========================================================
  // SITE CONTENT
  // =========================================================

  const [siteForm, setSiteForm] = useState({})

  const [heroFile, setHeroFile] = useState(null)
  const [aboutFile, setAboutFile] = useState(null)
  const [backgroundFile, setBackgroundFile] = useState(null)

  const [removeHeroImage, setRemoveHeroImage] = useState(false)
  const [removeAboutImage, setRemoveAboutImage] = useState(false)
  const [removeBackgroundImage, setRemoveBackgroundImage] = useState(false)

  // =========================================================
  // SERVICES
  // =========================================================

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    category: '',
    icon: '',
    image_url: '',
    sort_order: 0
  })

  const [serviceFile, setServiceFile] = useState(null)
  const [removeServiceImage, setRemoveServiceImage] = useState(false)
  const [editingService, setEditingService] = useState(null)

  // =========================================================
  // PROJECTS
  // =========================================================

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    sort_order: 0
  })

  const [projectFile, setProjectFile] = useState(null)
  const [removeProjectImage, setRemoveProjectImage] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  // =========================================================
  // TEAM
  // =========================================================

  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    sort_order: 0
  })

  const [teamFile, setTeamFile] = useState(null)
  const [removeTeamImage, setRemoveTeamImage] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)

  // =========================================================
  // VALUES
  // =========================================================

  const [valueForm, setValueForm] = useState({
    title: '',
    description: '',
    icon: '',
    sort_order: 0
  })

  const [editingValue, setEditingValue] = useState(null)

  // =========================================================
  // SOCIAL LINKS
  // =========================================================

  const [socialForm, setSocialForm] = useState({
    name: '',
    icon: '',
    url: '',
    sort_order: 0
  })

  const [editingSocial, setEditingSocial] = useState(null)

  // =========================================================
  // NAVIGATION
  // =========================================================

  const [navigationItems, setNavigationItems] = useState([])

  const [navigationForm, setNavigationForm] = useState({
    label: '',
    path: '',
    visible: true,
    sort_order: 0
  })

  const [editingNavigation, setEditingNavigation] = useState(null)

  // =========================================================
  // CUSTOM PAGES
  // =========================================================

  const [customPages, setCustomPages] = useState([])
  const [pagesLoading, setPagesLoading] = useState(false)

  // =========================================================
  // PENDING DELETIONS
  // =========================================================

  const [pendingDeletes, setPendingDeletes] = useState({
    services: [],
    projects: [],
    team: [],
    values: [],
    social: [],
    navigation: []
  })

  // =========================================================
  // AUTH CHECK
  // =========================================================

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      const { data } = await supabase.auth.getSession()

      if (mounted) {
        setSession(data.session)
        setCheckingAuth(false)
      }
    }

    checkSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // =========================================================
  // LOAD SITE CONTENT
  // =========================================================

  useEffect(() => {
    if (!siteContent) {
      return
    }

    setSiteForm({
      business_name: siteContent.business_name || '',
      tagline: siteContent.tagline || '',
      email: siteContent.email || '',
      phone: siteContent.phone || '',
      address: siteContent.address || '',

      hero_eyebrow: siteContent.hero_eyebrow || '',
      hero_title: siteContent.hero_title || '',
      hero_description: siteContent.hero_description || '',
      hero_image: siteContent.hero_image || '',

      about_eyebrow: siteContent.about_eyebrow || '',
      about_title: siteContent.about_title || '',
      about_description: siteContent.about_description || '',
      about_story: siteContent.about_story || '',
      about_mission: siteContent.about_mission || '',
      about_quote: siteContent.about_quote || '',
      about_image: siteContent.about_image || '',

      values_eyebrow: siteContent.values_eyebrow || '',
      values_title: siteContent.values_title || '',
      values_description: siteContent.values_description || '',

      services_eyebrow: siteContent.services_eyebrow || '',
      services_title: siteContent.services_title || '',
      services_description: siteContent.services_description || '',
      services_cta_eyebrow: siteContent.services_cta_eyebrow || '',
      services_cta_title: siteContent.services_cta_title || '',
      services_cta_button: siteContent.services_cta_button || '',

      projects_eyebrow: siteContent.projects_eyebrow || '',
      projects_title: siteContent.projects_title || '',
      projects_description: siteContent.projects_description || '',

      team_eyebrow: siteContent.team_eyebrow || '',
      team_title: siteContent.team_title || '',
      team_description: siteContent.team_description || '',

      contact_eyebrow: siteContent.contact_eyebrow || '',
      contact_title: siteContent.contact_title || '',
      contact_description: siteContent.contact_description || '',
      business_hours: siteContent.business_hours || '',

      site_background_image:
        siteContent.site_background_image || ''
    })
  }, [siteContent])

  // =========================================================
  // LOAD NAVIGATION
  // =========================================================

  useEffect(() => {
    loadNavigation()
    loadCustomPages()
  }, [])

  async function loadCustomPages() {
    setPagesLoading(true)

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('sort_order', {
        ascending: true
      })

    if (error) {
      console.error(
        'Could not load custom pages:',
        error
      )

      // The Pages section will simply show the error.
      setCustomPages([])
    } else {
      setCustomPages(data || [])
    }

    setPagesLoading(false)
  }

  async function loadNavigation() {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .order('sort_order', {
        ascending: true
      })

    if (error) {
      console.error(
        'Could not load navigation:',
        error
      )

      setMessage(
        `Could not load navigation: ${error.message}`
      )

      return
    }

    setNavigationItems(data || [])
  }

  // =========================================================
  // LOGIN
  // =========================================================

  async function handleLogin(event) {
    event.preventDefault()

    setLoggingIn(true)
    setLoginError('')

    const { error } =
      await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      })

    if (error) {
      setLoginError(error.message)
    }

    setLoggingIn(false)
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  // =========================================================
  // SITE FIELD CHANGE
  // =========================================================

  function handleSiteChange(event) {
    const { name, value } = event.target

    setSiteForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  // =========================================================
  // FILE SELECTION
  // =========================================================

  function selectHeroFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setHeroFile(file)
    setRemoveHeroImage(false)

    setMessage(
      `Selected hero image: ${file.name}`
    )
  }

  function selectAboutFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setAboutFile(file)
    setRemoveAboutImage(false)

    setMessage(
      `Selected About image: ${file.name}`
    )
  }

  function selectBackgroundFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setBackgroundFile(file)
    setRemoveBackgroundImage(false)

    setMessage(
      `Selected background image: ${file.name}`
    )
  }

  function selectServiceFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setServiceFile(file)
    setRemoveServiceImage(false)

    setMessage(
      `Selected service image: ${file.name}`
    )
  }

  function selectProjectFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setProjectFile(file)
    setRemoveProjectImage(false)

    setMessage(
      `Selected project image: ${file.name}`
    )
  }

  function selectTeamFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setTeamFile(file)
    setRemoveTeamImage(false)

    setMessage(
      `Selected team photo: ${file.name}`
    )
  }

  // =========================================================
  // STORAGE PATH
  // =========================================================

  function getStoragePathFromUrl(url) {
    if (!url) {
      return null
    }

    const marker =
      '/storage/v1/object/public/site-images/'

    if (!url.includes(marker)) {
      return null
    }

    const path = url.split(marker)[1]

    if (!path) {
      return null
    }

    return decodeURIComponent(path)
  }

  // =========================================================
  // DELETE STORAGE IMAGE
  // =========================================================

  async function deleteStorageImage(url) {
    if (!url) {
      return true
    }

    const path =
      getStoragePathFromUrl(url)

    if (!path) {
      console.warn(
        'Could not determine Supabase Storage path from:',
        url
      )

      return false
    }

    const { error } =
      await supabase.storage
        .from('site-images')
        .remove([path])

    if (error) {
      console.error(
        'Could not delete image:',
        error
      )

      throw error
    }

    return true
  }

  // =========================================================
  // UPLOAD IMAGE
  // =========================================================

  async function uploadFile(file, prefix) {
    if (!file) {
      return null
    }

    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase() || 'jpg'

    const safeExtension =
      extension.replace(
        /[^a-z0-9]/g,
        ''
      ) || 'jpg'

    const fileName =
      `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${safeExtension}`

    const filePath =
      `website/${fileName}`

    const { error } =
      await supabase.storage
        .from('site-images')
        .upload(
          filePath,
          file,
          {
            upsert: false,
            contentType:
              file.type ||
              'image/jpeg'
          }
        )

    if (error) {
      throw error
    }

    const { data } =
      supabase.storage
        .from('site-images')
        .getPublicUrl(
          filePath
        )

    return data.publicUrl
  }

  // =========================================================
  // SAVE SITE CONTENT
  // =========================================================

  async function saveSiteContent(event) {
    event.preventDefault()

    if (!siteContent?.id) {
      setMessage(
        'Website content could not be found.'
      )

      return
    }

    setSaving(true)
    setMessage(
      'Saving website changes...'
    )

    try {
      const updatedForm = {
        ...siteForm
      }

      // HERO IMAGE

      if (removeHeroImage) {
        if (siteForm.hero_image) {
          await deleteStorageImage(
            siteForm.hero_image
          )
        }

        updatedForm.hero_image = ''
      }

      if (heroFile) {
        if (
          siteForm.hero_image &&
          !removeHeroImage
        ) {
          await deleteStorageImage(
            siteForm.hero_image
          )
        }

        setMessage(
          'Uploading hero image...'
        )

        updatedForm.hero_image =
          await uploadFile(
            heroFile,
            'hero'
          )
      }

      // ABOUT IMAGE

      if (removeAboutImage) {
        if (siteForm.about_image) {
          await deleteStorageImage(
            siteForm.about_image
          )
        }

        updatedForm.about_image = ''
      }

      if (aboutFile) {
        if (
          siteForm.about_image &&
          !removeAboutImage
        ) {
          await deleteStorageImage(
            siteForm.about_image
          )
        }

        setMessage(
          'Uploading About image...'
        )

        updatedForm.about_image =
          await uploadFile(
            aboutFile,
            'about'
          )
      }

      // BACKGROUND IMAGE

      if (removeBackgroundImage) {
        if (
          siteForm.site_background_image
        ) {
          await deleteStorageImage(
            siteForm.site_background_image
          )
        }

        updatedForm.site_background_image =
          ''
      }

      if (backgroundFile) {
        if (
          siteForm.site_background_image &&
          !removeBackgroundImage
        ) {
          await deleteStorageImage(
            siteForm.site_background_image
          )
        }

        setMessage(
          'Uploading background image...'
        )

        updatedForm.site_background_image =
          await uploadFile(
            backgroundFile,
            'background'
          )
      }

      setMessage(
        'Saving website content...'
      )

      const { error } =
        await supabase
          .from('site_content')
          .update(updatedForm)
          .eq(
            'id',
            siteContent.id
          )

      if (error) {
        throw error
      }

      setSiteForm(updatedForm)

      setHeroFile(null)
      setAboutFile(null)
      setBackgroundFile(null)

      setRemoveHeroImage(false)
      setRemoveAboutImage(false)
      setRemoveBackgroundImage(false)

      await reloadContent()

      setMessage(
        'Website changes saved successfully!'
      )

    } catch (error) {
      console.error(error)

      setMessage(
        `Could not save website changes: ${error.message}`
      )
    }

    setSaving(false)
  }

  // =========================================================
  // PENDING DELETE
  // =========================================================

  function markForDeletion(
    type,
    id
  ) {
    setPendingDeletes(
      (current) => ({
        ...current,
        [type]:
          current[type].includes(id)
            ? current[type]
            : [
                ...current[type],
                id
              ]
      })
    )

    setMessage(
      'Marked for deletion. Click Save All Changes to permanently delete it.'
    )
  }

  function undoDeletion(
    type,
    id
  ) {
    setPendingDeletes(
      (current) => ({
        ...current,
        [type]:
          current[type].filter(
            (itemId) =>
              itemId !== id
          )
      })
    )

    setMessage(
      'Deletion cancelled.'
    )
  }

  // =========================================================
  // COMMIT DELETIONS
  // =========================================================

  async function commitPendingDeletes() {

    // SERVICES

    for (
      const id
      of pendingDeletes.services
    ) {

      const service =
        services.find(
          (item) =>
            item.id === id
        )

      if (service?.image_url) {
        await deleteStorageImage(
          service.image_url
        )
      }

      const { error } =
        await supabase
          .from('services')
          .delete()
          .eq('id', id)

      if (error) {
        throw error
      }
    }

    // PROJECTS

    for (
      const id
      of pendingDeletes.projects
    ) {

      const project =
        projects.find(
          (item) =>
            item.id === id
        )

      if (project?.image_url) {
        await deleteStorageImage(
          project.image_url
        )
      }

      const { error } =
        await supabase
          .from('projects')
          .delete()
          .eq('id', id)

      if (error) {
        throw error
      }
    }

    // TEAM

    for (
      const id
      of pendingDeletes.team
    ) {

      const member =
        team.find(
          (item) =>
            item.id === id
        )

      if (member?.image_url) {
        await deleteStorageImage(
          member.image_url
        )
      }

      const { error } =
        await supabase
          .from('team_members')
          .delete()
          .eq('id', id)

      if (error) {
        throw error
      }
    }

    // VALUES

    for (
      const id
      of pendingDeletes.values
    ) {

      const { error } =
        await supabase
          .from('site_values')
          .delete()
          .eq('id', id)

      if (error) {
        throw error
      }
    }

    // SOCIAL LINKS

    for (
      const id
      of pendingDeletes.social
    ) {

      const { error } =
        await supabase
          .from('social_links')
          .delete()
          .eq('id', id)

      if (error) {
        throw error
      }
    }

    // NAVIGATION

    for (
      const id
      of pendingDeletes.navigation
    ) {

      const { error } =
        await supabase
          .from('navigation_items')
          .delete()
          .eq('id', id)

      if (error) {
        throw error
      }
    }

    setPendingDeletes({
      services: [],
      projects: [],
      team: [],
      values: [],
      social: [],
      navigation: []
    })
  }

  // =========================================================
  // SERVICE FORM
  // =========================================================

  function resetServiceForm() {
    setServiceForm({
      title: '',
      description: '',
      category: '',
      icon: '',
      image_url: '',
      sort_order:
        services.length + 1
    })

    setServiceFile(null)
    setRemoveServiceImage(false)
    setEditingService(null)
  }

  function editService(service) {
    setEditingService(
      service.id
    )

    setServiceForm({
      title:
        service.title || '',
      description:
        service.description || '',
      category:
        service.category || '',
      icon:
        service.icon || '',
      image_url:
        service.image_url || '',
      sort_order:
        service.sort_order || 0
    })

    setServiceFile(null)
    setRemoveServiceImage(false)

    setActiveSection(
      'services'
    )
  }

  async function saveService(event) {
    event.preventDefault()

    setSaving(true)
    setMessage(
      'Saving service...'
    )

    try {
      const dataToSave = {
        ...serviceForm
      }

      if (removeServiceImage) {

        if (
          serviceForm.image_url
        ) {
          await deleteStorageImage(
            serviceForm.image_url
          )
        }

        dataToSave.image_url =
          ''
      }

      if (serviceFile) {

        if (
          serviceForm.image_url &&
          !removeServiceImage
        ) {
          await deleteStorageImage(
            serviceForm.image_url
          )
        }

        setMessage(
          'Uploading service image...'
        )

        dataToSave.image_url =
          await uploadFile(
            serviceFile,
            'service'
          )
      }

      let error

      if (editingService) {

        const result =
          await supabase
            .from('services')
            .update(dataToSave)
            .eq(
              'id',
              editingService
            )

        error = result.error

      } else {

        const result =
          await supabase
            .from('services')
            .insert(
              dataToSave
            )

        error = result.error
      }

      if (error) {
        throw error
      }

      resetServiceForm()

      await reloadContent()

      setMessage(
        'Service saved successfully.'
      )

    } catch (error) {

      console.error(error)

      setMessage(
        `Could not save service: ${error.message}`
      )
    }

    setSaving(false)
  }

  function deleteService(id) {

    if (
      !window.confirm(
        'Mark this service for deletion? It will only be deleted after you click Save All Changes.'
      )
    ) {
      return
    }

    markForDeletion(
      'services',
      id
    )
  }

  // =========================================================
  // PROJECT FORM
  // =========================================================

  function resetProjectForm() {
    setProjectForm({
      title: '',
      description: '',
      category: '',
      image_url: '',
      sort_order:
        projects.length + 1
    })

    setProjectFile(null)
    setRemoveProjectImage(false)
    setEditingProject(null)
  }

  function editProject(project) {

    setEditingProject(
      project.id
    )

    setProjectForm({
      title:
        project.title || '',
      description:
        project.description || '',
      category:
        project.category || '',
      image_url:
        project.image_url || '',
      sort_order:
        project.sort_order || 0
    })

    setProjectFile(null)
    setRemoveProjectImage(false)

    setActiveSection(
      'projects'
    )
  }

  async function saveProject(event) {

    event.preventDefault()

    setSaving(true)
    setMessage(
      'Saving project...'
    )

    try {

      const dataToSave = {
        ...projectForm
      }

      if (removeProjectImage) {

        if (
          projectForm.image_url
        ) {
          await deleteStorageImage(
            projectForm.image_url
          )
        }

        dataToSave.image_url =
          ''
      }

      if (projectFile) {

        if (
          projectForm.image_url &&
          !removeProjectImage
        ) {
          await deleteStorageImage(
            projectForm.image_url
          )
        }

        setMessage(
          'Uploading project image...'
        )

        dataToSave.image_url =
          await uploadFile(
            projectFile,
            'project'
          )
      }

      let error

      if (editingProject) {

        const result =
          await supabase
            .from('projects')
            .update(dataToSave)
            .eq(
              'id',
              editingProject
            )

        error = result.error

      } else {

        const result =
          await supabase
            .from('projects')
            .insert(
              dataToSave
            )

        error = result.error
      }

      if (error) {
        throw error
      }

      resetProjectForm()

      await reloadContent()

      setMessage(
        'Project saved successfully.'
      )

    } catch (error) {

      console.error(error)

      setMessage(
        `Could not save project: ${error.message}`
      )
    }

    setSaving(false)
  }

  function deleteProject(id) {

    if (
      !window.confirm(
        'Mark this project for deletion? It will only be deleted after you click Save All Changes.'
      )
    ) {
      return
    }

    markForDeletion(
      'projects',
      id
    )
  }

  // =========================================================
  // TEAM FORM
  // =========================================================

  function resetTeamForm() {

    setTeamForm({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      sort_order:
        team.length + 1
    })

    setTeamFile(null)
    setRemoveTeamImage(false)
    setEditingTeam(null)
  }

  function editTeam(member) {

    setEditingTeam(
      member.id
    )

    setTeamForm({
      name:
        member.name || '',
      role:
        member.role || '',
      bio:
        member.bio || '',
      image_url:
        member.image_url || '',
      sort_order:
        member.sort_order || 0
    })

    setTeamFile(null)
    setRemoveTeamImage(false)

    setActiveSection(
      'team'
    )
  }

  async function saveTeam(event) {

    event.preventDefault()

    setSaving(true)
    setMessage(
      'Saving team member...'
    )

    try {

      const dataToSave = {
        ...teamForm
      }

      if (removeTeamImage) {

        if (
          teamForm.image_url
        ) {
          await deleteStorageImage(
            teamForm.image_url
          )
        }

        dataToSave.image_url =
          ''
      }

      if (teamFile) {

        if (
          teamForm.image_url &&
          !removeTeamImage
        ) {
          await deleteStorageImage(
            teamForm.image_url
          )
        }

        setMessage(
          'Uploading team photo...'
        )

        dataToSave.image_url =
          await uploadFile(
            teamFile,
            'team'
          )
      }

      let error

      if (editingTeam) {

        const result =
          await supabase
            .from('team_members')
            .update(dataToSave)
            .eq(
              'id',
              editingTeam
            )

        error = result.error

      } else {

        const result =
          await supabase
            .from('team_members')
            .insert(
              dataToSave
            )

        error = result.error
      }

      if (error) {
        throw error
      }

      resetTeamForm()

      await reloadContent()

      setMessage(
        'Team member saved successfully.'
      )

    } catch (error) {

      console.error(error)

      setMessage(
        `Could not save team member: ${error.message}`
      )
    }

    setSaving(false)
  }

  function deleteTeam(id) {

    if (
      !window.confirm(
        'Mark this team member for deletion? It will only be deleted after you click Save All Changes.'
      )
    ) {
      return
    }

    markForDeletion(
      'team',
      id
    )
  }

  // =========================================================
  // VALUES
  // =========================================================

  function resetValueForm() {

    setValueForm({
      title: '',
      description: '',
      icon: '',
      sort_order:
        values.length + 1
    })

    setEditingValue(null)
  }

  function editValue(value) {

    setEditingValue(
      value.id
    )

    setValueForm({
      title:
        value.title || '',
      description:
        value.description || '',
      icon:
        value.icon || '',
      sort_order:
        value.sort_order || 0
    })

    setActiveSection(
      'values'
    )
  }

  async function saveValue(event) {

    event.preventDefault()

    setSaving(true)
    setMessage(
      'Saving value...'
    )

    try {

      let error

      if (editingValue) {

        const result =
          await supabase
            .from('site_values')
            .update(valueForm)
            .eq(
              'id',
              editingValue
            )

        error = result.error

      } else {

        const result =
          await supabase
            .from('site_values')
            .insert(
              valueForm
            )

        error = result.error
      }

      if (error) {
        throw error
      }

      resetValueForm()

      await reloadContent()

      setMessage(
        'Value saved successfully.'
      )

    } catch (error) {

      console.error(error)

      setMessage(
        `Could not save value: ${error.message}`
      )
    }

    setSaving(false)
  }

  function deleteValue(id) {

    if (
      !window.confirm(
        'Mark this value for deletion? It will only be deleted after you click Save All Changes.'
      )
    ) {
      return
    }

    markForDeletion(
      'values',
      id
    )
  }

  // =========================================================
  // SOCIAL
  // =========================================================

  function resetSocialForm() {

    setSocialForm({
      name: '',
      icon: '',
      url: '',
      sort_order:
        socialLinks.length + 1
    })

    setEditingSocial(null)
  }

  function editSocial(social) {

    setEditingSocial(
      social.id
    )

    setSocialForm({
      name:
        social.name || '',
      icon:
        social.icon || '',
      url:
        social.url || '',
      sort_order:
        social.sort_order || 0
    })

    setActiveSection(
      'social'
    )
  }

  async function saveSocial(event) {

    event.preventDefault()

    setSaving(true)
    setMessage(
      'Saving social link...'
    )

    try {

      let error

      if (editingSocial) {

        const result =
          await supabase
            .from('social_links')
            .update(socialForm)
            .eq(
              'id',
              editingSocial
            )

        error = result.error

      } else {

        const result =
          await supabase
            .from('social_links')
            .insert(
              socialForm
            )

        error = result.error
      }

      if (error) {
        throw error
      }

      resetSocialForm()

      await reloadContent()

      setMessage(
        'Social link saved successfully.'
      )

    } catch (error) {

      console.error(error)

      setMessage(
        `Could not save social link: ${error.message}`
      )
    }

    setSaving(false)
  }

  function deleteSocial(id) {

    if (
      !window.confirm(
        'Mark this social link for deletion? It will only be deleted after you click Save All Changes.'
      )
    ) {
      return
    }

    markForDeletion(
      'social',
      id
    )
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  function resetNavigationForm() {

    setNavigationForm({
      label: '',
      path: '',
      visible: true,
      sort_order:
        navigationItems.length + 1
    })

    setEditingNavigation(null)
  }

  function editNavigation(item) {

    setEditingNavigation(
      item.id
    )

    setNavigationForm({
      label:
        item.label || '',
      path:
        item.path || '',
      visible:
        item.visible !== false,
      sort_order:
        item.sort_order || 0
    })

    setActiveSection(
      'navigation'
    )
  }

  async function saveNavigation(event) {

    event.preventDefault()

    setSaving(true)
    setMessage(
      'Saving navigation item...'
    )

    try {

      let error

      if (editingNavigation) {

        const result =
          await supabase
            .from('navigation_items')
            .update(
              navigationForm
            )
            .eq(
              'id',
              editingNavigation
            )

        error = result.error

      } else {

        const result =
          await supabase
            .from('navigation_items')
            .insert(
              navigationForm
            )

        error = result.error
      }

      if (error) {
        throw error
      }

      resetNavigationForm()

      await loadNavigation()

      setMessage(
        'Navigation item saved successfully.'
      )

    } catch (error) {

      console.error(error)

      setMessage(
        `Could not save navigation item: ${error.message}`
      )
    }

    setSaving(false)
  }

  function deleteNavigation(id) {

    if (
      !window.confirm(
        'Mark this navigation item for deletion? It will only be deleted after you click Save All Changes.'
      )
    ) {
      return
    }

    markForDeletion(
      'navigation',
      id
    )
  }

  // =========================================================
  // SAVE EVERYTHING
  // =========================================================

  async function handleSaveAll() {

    setSaving(true)
    setMessage(
      'Saving everything...'
    )

    try {

      // Save website content
      await saveSiteContent({
        preventDefault: () => {}
      })

      // Commit deletions
      await commitPendingDeletes()

      // SERVICE DRAFT

      const hasServiceDraft =
        editingService ||
        serviceForm.title.trim() ||
        serviceForm.description.trim() ||
        serviceForm.category.trim() ||
        serviceForm.icon.trim() ||
        serviceFile ||
        removeServiceImage

      if (hasServiceDraft) {
        await saveService({
          preventDefault: () => {}
        })
      }

      // PROJECT DRAFT

      const hasProjectDraft =
        editingProject ||
        projectForm.title.trim() ||
        projectForm.description.trim() ||
        projectForm.category.trim() ||
        projectFile ||
        removeProjectImage

      if (hasProjectDraft) {
        await saveProject({
          preventDefault: () => {}
        })
      }

      // TEAM DRAFT

      const hasTeamDraft =
        editingTeam ||
        teamForm.name.trim() ||
        teamForm.role.trim() ||
        teamForm.bio.trim() ||
        teamFile ||
        removeTeamImage

      if (hasTeamDraft) {
        await saveTeam({
          preventDefault: () => {}
        })
      }

      // VALUE DRAFT

      const hasValueDraft =
        editingValue ||
        valueForm.title.trim() ||
        valueForm.description.trim() ||
        valueForm.icon.trim()

      if (hasValueDraft) {
        await saveValue({
          preventDefault: () => {}
        })
      }

      // SOCIAL DRAFT

      const hasSocialDraft =
        editingSocial ||
        socialForm.name.trim() ||
        socialForm.icon.trim() ||
        socialForm.url.trim()

      if (hasSocialDraft) {
        await saveSocial({
          preventDefault: () => {}
        })
      }

      // NAVIGATION DRAFT

      const hasNavigationDraft =
        editingNavigation ||
        navigationForm.label.trim() ||
        navigationForm.path.trim()

      if (hasNavigationDraft) {
        await saveNavigation({
          preventDefault: () => {}
        })
      }

      await reloadContent()
      await loadNavigation()
      await loadCustomPages()

      setMessage(
        'Everything was saved successfully!'
      )

    } catch (error) {

      console.error(error)

      setMessage(
        `Could not save everything: ${error.message}`
      )
    }

    setSaving(false)
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (checkingAuth) {
    return (
      <div
        className="container"
        style={{
          padding: '5rem 0'
        }}
      >
        Checking login...
      </div>
    )
  }

  // =========================================================
  // LOGIN
  // =========================================================

  if (!session) {
    return (
      <div
        className="container"
        style={{
          maxWidth: '500px',
          paddingTop: '5rem',
          paddingBottom: '5rem'
        }}
      >

        <h1>
          Website Admin
        </h1>

        <p
          style={{
            marginBottom: '2rem'
          }}
        >
          Sign in to edit your website.
        </p>

        <form
          onSubmit={handleLogin}
        >

          <label
            style={labelStyle}
          >
            Email

            <input
              type="email"
              value={loginEmail}
              onChange={(event) =>
                setLoginEmail(
                  event.target.value
                )
              }
              required
              style={inputStyle}
            />

          </label>

          <label
            style={labelStyle}
          >
            Password

            <input
              type="password"
              value={loginPassword}
              onChange={(event) =>
                setLoginPassword(
                  event.target.value
                )
              }
              required
              style={inputStyle}
            />

          </label>

          {loginError && (
            <p
              style={{
                marginBottom: '1rem'
              }}
            >
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="btn btn-dark"
          >
            {loggingIn
              ? 'Signing in...'
              : 'Sign In'}
          </button>

        </form>

      </div>
    )
  }

  // =========================================================
  // CONTENT LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        className="container"
        style={{
          padding: '5rem 0'
        }}
      >
        Loading website content...
      </div>
    )
  }

  // =========================================================
  // IMAGE MANAGER
  // =========================================================

  function ImageManager({
    currentUrl,
    selectedFile,
    onSelect,
    onRemove,
    label,
    alt
  }) {

    return (
      <div
        style={{
          marginTop: '1rem',
          marginBottom: '1.5rem'
        }}
      >

        <label
          style={{
            display: 'block',
            fontWeight: '600'
          }}
        >

          {label}

          <input
            type="file"
            accept="image/*"
            onChange={onSelect}
            style={{
              display: 'block',
              marginTop: '0.6rem'
            }}
          />

        </label>

        {selectedFile && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem 1rem',
              background: '#f1f1f1',
              borderRadius: '4px'
            }}
          >
            <strong>
              New image:
            </strong>{' '}
            {selectedFile.name}
          </div>
        )}

        {currentUrl && (
          <div
            style={{
              marginTop: '1rem'
            }}
          >

            <img
              src={currentUrl}
              alt={alt}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '500px',
                height: '220px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '0.75rem'
              }}
            />

            <button
              type="button"
              onClick={onRemove}
              style={{
                padding: '0.65rem 1rem',
                border:
                  '1px solid #b00020',
                background: '#fff',
                color: '#b00020',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Remove Image
            </button>

          </div>
        )}

        {!currentUrl &&
          !selectedFile && (
            <p
              style={{
                marginTop: '0.75rem',
                opacity: 0.65
              }}
            >
              No image currently selected.
            </p>
          )}

      </div>
    )
  }

  // =========================================================
  // SIDEBAR
  // =========================================================

  const sidebarItems = [
    ['business', 'Business'],
    ['home', 'Home'],
    ['about', 'About'],
    ['values', 'Values'],
    ['services', 'Services'],
    ['projects', 'Projects'],
    ['team', 'Team'],
    ['contact', 'Contact'],
    ['social', 'Social Links'],
    ['navigation', 'Navigation Menu'],
    ['pages', 'Pages']
  ]

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="container"
      style={{
        paddingTop: '3rem',
        paddingBottom: '5rem'
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}
      >

        <div>

          <p className="eyebrow">
            ADMIN PANEL
          </p>

          <h1>
            Website Editor
          </h1>

          <p>
            Edit your entire website
            from one place.
          </p>

        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >

          <button
            type="button"
            className="btn btn-dark"
            onClick={
              handleSaveAll
            }
            disabled={saving}
          >
            {saving
              ? 'Saving Everything...'
              : 'Save All Changes'}
          </button>

          <button
            type="button"
            className="btn btn-dark"
            onClick={
              handleLogout
            }
          >
            Sign Out
          </button>

        </div>

      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '2rem',
            background: '#f2f2f2',
            borderRadius: '4px'
          }}
        >
          {message}
        </div>
      )}

      {/* =====================================================
          PENDING DELETIONS
      ===================================================== */}

      {Object.values(
        pendingDeletes
      ).some(
        (items) =>
          items.length > 0
      ) && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '2rem',
            border:
              '1px solid #b00020',
            background: '#fff5f6',
            borderRadius: '4px'
          }}
        >

          <strong>
            Pending deletions:
          </strong>{' '}

          Click{' '}
          <strong>
            Save All Changes
          </strong>{' '}
          to permanently delete
          the marked items.

        </div>
      )}

      {/* =====================================================
          ADMIN LAYOUT
      ===================================================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            '220px minmax(0, 1fr)',
          gap: '2rem',
          alignItems: 'start'
        }}
      >

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside
          style={{
            position: 'sticky',
            top: '1rem'
          }}
        >

          {sidebarItems.map(
            ([key, label]) => (

              <button
                key={key}
                type="button"
                onClick={() =>
                  setActiveSection(
                    key
                  )
                }
                style={{
                  display:
                    'block',
                  width: '100%',
                  padding:
                    '0.9rem 1rem',
                  marginBottom:
                    '0.5rem',
                  border: 'none',
                  borderRadius:
                    '4px',
                  textAlign:
                    'left',
                  cursor:
                    'pointer',
                  background:
                    activeSection ===
                    key
                      ? '#111'
                      : '#f1f1f1',
                  color:
                    activeSection ===
                    key
                      ? '#fff'
                      : '#111'
                }}
              >
                {label}
              </button>

            )
          )}

        </aside>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <main>

          {/* =================================================
              CUSTOM PAGES
          ================================================= */}

          {activeSection ===
            'pages' && (

            <section>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <h2>
                    Pages
                  </h2>

                  <p>
                    Create and manage extra pages such as
                    Hello, FAQ, Gallery, Portfolio, or any
                    other page you want to add to the website.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() =>
                    navigate('/admin/pages/new')
                  }
                >
                  + Add New Page
                </button>
              </div>

              {pagesLoading ? (

                <p>
                  Loading pages...
                </p>

              ) : customPages.length === 0 ? (

                <div
                  style={{
                    ...cardStyle,
                    padding: '2rem'
                  }}
                >
                  <h3>
                    No custom pages yet
                  </h3>

                  <p>
                    Click “Add New Page” to create your
                    first custom page.
                  </p>

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() =>
                      window.location.href =
                        '/admin/pages/new'
                    }
                  >
                    Create Your First Page
                  </button>
                </div>

              ) : (

                customPages.map((page) => (

                  <div
                    key={page.id}
                    style={{
                      ...cardStyle,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >

                    <div>

                      <h3
                        style={{
                          marginBottom: '0.4rem'
                        }}
                      >
                        {page.title || 'Untitled Page'}
                      </h3>

                      <p
                        style={{
                          margin: 0
                        }}
                      >
                        /{String(page.slug || '').replace(/^\//, '')}
                      </p>

                      <p
                        style={{
                          marginTop: '0.5rem',
                          marginBottom: 0
                        }}
                      >
                        Order: {page.sort_order ?? 0}
                        {' • '}
                        {page.is_published === false
                          ? 'Hidden'
                          : 'Published'}
                      </p>

                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/pages/${page.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/${String(page.slug || '').replace(/^\//, '')}`)
                        }
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={async () => {

                          const confirmed =
                            window.confirm(
                              `Delete "${page.title || 'this page'}"? This cannot be undone.`
                            )

                          if (!confirmed) {
                            return
                          }

                          setSaving(true)
                          setMessage(
                            'Deleting page...'
                          )

                          const { error } =
                            await supabase
                              .from('pages')
                              .delete()
                              .eq('id', page.id)

                          if (error) {
                            console.error(error)

                            setMessage(
                              `Could not delete page: ${error.message}`
                            )
                          } else {
                            await loadCustomPages()

                            setMessage(
                              'Page deleted successfully.'
                            )
                          }

                          setSaving(false)
                        }}
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))

              )}

            </section>
          )}

          {/* =================================================
              NAVIGATION
          ================================================= */}

          {activeSection ===
            'navigation' && (

            <section>

              <h2>
                Navigation Menu
              </h2>

              <p>
                Add, edit, hide,
                reorder or remove
                items from your
                website navigation.
              </p>

              <form
                onSubmit={
                  saveNavigation
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Menu Label

                  <input
                    value={
                      navigationForm.label
                    }
                    onChange={(
                      event
                    ) =>
                      setNavigationForm(
                        {
                          ...navigationForm,
                          label:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    placeholder="About"
                    required
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Destination

                  <input
                    value={
                      navigationForm.path
                    }
                    onChange={(
                      event
                    ) =>
                      setNavigationForm(
                        {
                          ...navigationForm,
                          path:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    placeholder="/about"
                    required
                    style={
                      inputStyle
                    }
                  />

                  <small
                    style={{
                      display:
                        'block',
                      marginTop:
                        '0.4rem',
                      opacity:
                        0.65
                    }}
                  >
                    Example:
                    /about,
                    /services,
                    /contact
                    or an
                    external
                    URL.
                  </small>

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Display Order

                  <input
                    type="number"
                    value={
                      navigationForm.sort_order
                    }
                    onChange={(
                      event
                    ) =>
                      setNavigationForm(
                        {
                          ...navigationForm,
                          sort_order:
                            Number(
                              event
                                .target
                                .value
                            )
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap: '0.6rem',
                    marginBottom:
                      '1.5rem',
                    cursor:
                      'pointer'
                  }}
                >

                  <input
                    type="checkbox"
                    checked={
                      navigationForm.visible
                    }
                    onChange={(
                      event
                    ) =>
                      setNavigationForm(
                        {
                          ...navigationForm,
                          visible:
                            event
                              .target
                              .checked
                        }
                      )
                    }
                  />

                  Show this item
                  in the
                  navigation
                  menu

                </label>

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={saving}
                >
                  {editingNavigation
                    ? 'Update Navigation Item'
                    : 'Add Navigation Item'}
                </button>

                {editingNavigation && (
                  <button
                    type="button"
                    onClick={
                      resetNavigationForm
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancel
                  </button>
                )}

              </form>

              <hr
                style={{
                  margin:
                    '2rem 0'
                }}
              />

              <h3>
                Current Navigation
              </h3>

              {navigationItems.map(
                (item) => {

                  const markedForDeletion =
                    pendingDeletes
                      .navigation
                      .includes(
                        item.id
                      )

                  return (
                    <div
                      key={
                        item.id
                      }
                      style={{
                        ...cardStyle,
                        opacity:
                          markedForDeletion
                            ? 0.5
                            : 1
                      }}
                    >

                      <div
                        style={{
                          display:
                            'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'center',
                          gap:
                            '1rem',
                          flexWrap:
                            'wrap'
                        }}
                      >

                        <div>

                          <h3
                            style={{
                              marginBottom:
                                '0.4rem'
                            }}
                          >
                            {item.label}
                          </h3>

                          <p
                            style={{
                              margin:
                                0
                            }}
                          >
                            {item.path}
                          </p>

                          <p
                            style={{
                              marginTop:
                                '0.5rem',
                              marginBottom:
                                0
                            }}
                          >
                            Order:{' '}
                            {
                              item.sort_order
                            }
                            {' • '}
                            {item.visible
                              ? 'Visible'
                              : 'Hidden'}
                          </p>

                        </div>

                        <div>

                          <button
                            type="button"
                            disabled={
                              markedForDeletion
                            }
                            onClick={() =>
                              editNavigation(
                                item
                              )
                            }
                          >
                            Edit
                          </button>

                          {markedForDeletion ? (

                            <button
                              type="button"
                              onClick={() =>
                                undoDeletion(
                                  'navigation',
                                  item.id
                                )
                              }
                              style={{
                                marginLeft:
                                  '0.5rem'
                              }}
                            >
                              Undo Delete
                            </button>

                          ) : (

                            <button
                              type="button"
                              onClick={() =>
                                deleteNavigation(
                                  item.id
                                )
                              }
                              style={{
                                marginLeft:
                                  '0.5rem'
                              }}
                            >
                              Delete
                            </button>

                          )}

                        </div>

                      </div>

                    </div>
                  )
                }
              )}

            </section>
          )}

          {/* =================================================
              BUSINESS
          ================================================= */}

          {activeSection ===
            'business' && (

            <section>

              <h2>
                Business Information
              </h2>

              <p>
                This information
                appears throughout
                your website.
              </p>

              <form
                onSubmit={
                  saveSiteContent
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Business Name

                  <input
                    name="business_name"
                    value={
                      siteForm.business_name ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Tagline

                  <input
                    name="tagline"
                    value={
                      siteForm.tagline ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Email

                  <input
                    name="email"
                    type="email"
                    value={
                      siteForm.email ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Phone

                  <input
                    name="phone"
                    value={
                      siteForm.phone ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Address

                  <input
                    name="address"
                    value={
                      siteForm.address ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : 'Save Business Information'}
                </button>

              </form>

            </section>
          )}

          {/* =================================================
              HOME
          ================================================= */}

          {activeSection ===
            'home' && (

            <section>

              <h2>
                Homepage
              </h2>

              <form
                onSubmit={
                  saveSiteContent
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Eyebrow

                  <input
                    name="hero_eyebrow"
                    value={
                      siteForm.hero_eyebrow ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Hero Title

                  <input
                    name="hero_title"
                    value={
                      siteForm.hero_title ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Hero Description

                  <textarea
                    name="hero_description"
                    rows="5"
                    value={
                      siteForm.hero_description ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <ImageManager
                  label="Hero Image"
                  currentUrl={
                    siteForm.hero_image
                  }
                  selectedFile={
                    heroFile
                  }
                  onSelect={
                    selectHeroFile
                  }
                  onRemove={() => {
                    setRemoveHeroImage(
                      true
                    )
                    setHeroFile(
                      null
                    )
                    setMessage(
                      'Hero image marked for removal. Click Save All Changes to confirm.'
                    )
                  }}
                  alt="Hero"
                />

                <ImageManager
                  label="Website Background Image"
                  currentUrl={
                    siteForm.site_background_image
                  }
                  selectedFile={
                    backgroundFile
                  }
                  onSelect={
                    selectBackgroundFile
                  }
                  onRemove={() => {
                    setRemoveBackgroundImage(
                      true
                    )
                    setBackgroundFile(
                      null
                    )
                    setMessage(
                      'Background image marked for removal. Click Save All Changes to confirm.'
                    )
                  }}
                  alt="Website background"
                />

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : 'Save Homepage'}
                </button>

              </form>

            </section>
          )}

          {/* =================================================
              ABOUT
          ================================================= */}

          {activeSection ===
            'about' && (

            <section>

              <h2>
                About Page
              </h2>

              <form
                onSubmit={
                  saveSiteContent
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Eyebrow

                  <input
                    name="about_eyebrow"
                    value={
                      siteForm.about_eyebrow ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Title

                  <input
                    name="about_title"
                    value={
                      siteForm.about_title ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Description

                  <textarea
                    name="about_description"
                    rows="4"
                    value={
                      siteForm.about_description ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Story

                  <textarea
                    name="about_story"
                    rows="6"
                    value={
                      siteForm.about_story ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Mission

                  <textarea
                    name="about_mission"
                    rows="6"
                    value={
                      siteForm.about_mission ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Quote

                  <textarea
                    name="about_quote"
                    rows="3"
                    value={
                      siteForm.about_quote ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <ImageManager
                  label="About Image"
                  currentUrl={
                    siteForm.about_image
                  }
                  selectedFile={
                    aboutFile
                  }
                  onSelect={
                    selectAboutFile
                  }
                  onRemove={() => {
                    setRemoveAboutImage(
                      true
                    )
                    setAboutFile(
                      null
                    )
                    setMessage(
                      'About image marked for removal. Click Save All Changes to confirm.'
                    )
                  }}
                  alt="About"
                />

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : 'Save About Page'}
                </button>

              </form>

            </section>
          )}

          {/* =================================================
              VALUES
          ================================================= */}

          {activeSection ===
            'values' && (

            <section>

              <h2>
                Values
              </h2>

              <form
                onSubmit={
                  saveValue
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Title

                  <input
                    value={
                      valueForm.title
                    }
                    onChange={(
                      event
                    ) =>
                      setValueForm(
                        {
                          ...valueForm,
                          title:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Description

                  <textarea
                    rows="4"
                    value={
                      valueForm.description
                    }
                    onChange={(
                      event
                    ) =>
                      setValueForm(
                        {
                          ...valueForm,
                          description:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Font Awesome Icon

                  <input
                    value={
                      valueForm.icon
                    }
                    onChange={(
                      event
                    ) =>
                      setValueForm(
                        {
                          ...valueForm,
                          icon:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    placeholder="fa-solid fa-star"
                    style={
                      inputStyle
                    }
                  />

                </label>

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={saving}
                >
                  {editingValue
                    ? 'Update Value'
                    : 'Add Value'}
                </button>

                {editingValue && (
                  <button
                    type="button"
                    onClick={
                      resetValueForm
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancel
                  </button>
                )}

              </form>

              <hr
                style={{
                  margin:
                    '2rem 0'
                }}
              />

              {values.map(
                (value) => (

                  <div
                    key={
                      value.id
                    }
                    style={
                      cardStyle
                    }
                  >

                    <h3>
                      {value.title}
                    </h3>

                    <p>
                      {
                        value.description
                      }
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        editValue(
                          value
                        )
                      }
                    >
                      Edit
                    </button>

                    {pendingDeletes.values.includes(
                      value.id
                    ) ? (

                      <button
                        type="button"
                        onClick={() =>
                          undoDeletion(
                            'values',
                            value.id
                          )
                        }
                        style={{
                          marginLeft:
                            '0.5rem'
                        }}
                      >
                        Undo Delete
                      </button>

                    ) : (

                      <button
                        type="button"
                        onClick={() =>
                          deleteValue(
                            value.id
                          )
                        }
                        style={{
                          marginLeft:
                            '0.5rem'
                        }}
                      >
                        Delete
                      </button>

                    )}

                  </div>

                )
              )}

            </section>
          )}

          {/* =================================================
              SERVICES
          ================================================= */}

          {activeSection ===
            'services' && (

            <section>

              <h2>
                Services
              </h2>

              <form
                onSubmit={
                  saveService
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Title

                  <input
                    value={
                      serviceForm.title
                    }
                    onChange={(
                      event
                    ) =>
                      setServiceForm(
                        {
                          ...serviceForm,
                          title:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Category

                  <input
                    value={
                      serviceForm.category
                    }
                    onChange={(
                      event
                    ) =>
                      setServiceForm(
                        {
                          ...serviceForm,
                          category:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Description

                  <textarea
                    rows="5"
                    value={
                      serviceForm.description
                    }
                    onChange={(
                      event
                    ) =>
                      setServiceForm(
                        {
                          ...serviceForm,
                          description:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Icon

                  <input
                    value={
                      serviceForm.icon
                    }
                    onChange={(
                      event
                    ) =>
                      setServiceForm(
                        {
                          ...serviceForm,
                          icon:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    placeholder="fa-solid fa-star"
                    style={
                      inputStyle
                    }
                  />

                </label>

                <ImageManager
                  label="Service Image"
                  currentUrl={
                    serviceForm.image_url
                  }
                  selectedFile={
                    serviceFile
                  }
                  onSelect={
                    selectServiceFile
                  }
                  onRemove={() => {
                    setRemoveServiceImage(
                      true
                    )
                    setServiceFile(
                      null
                    )
                    setMessage(
                      'Service image marked for removal. Click Save All Changes to confirm.'
                    )
                  }}
                  alt="Service"
                />

                <label
                  style={
                    labelStyle
                  }
                >
                  Display Order

                  <input
                    type="number"
                    value={
                      serviceForm.sort_order
                    }
                    onChange={(
                      event
                    ) =>
                      setServiceForm(
                        {
                          ...serviceForm,
                          sort_order:
                            Number(
                              event
                                .target
                                .value
                            )
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={saving}
                >
                  {editingService
                    ? 'Update Service'
                    : 'Add Service'}
                </button>

                {editingService && (
                  <button
                    type="button"
                    onClick={
                      resetServiceForm
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancel
                  </button>
                )}

              </form>

              <hr
                style={{
                  margin:
                    '2rem 0'
                }}
              />

              {services.map(
                (service) => {

                  const marked =
                    pendingDeletes
                      .services
                      .includes(
                        service.id
                      )

                  return (
                    <div
                      key={
                        service.id
                      }
                      style={{
                        ...cardStyle,
                        opacity:
                          marked
                            ? 0.5
                            : 1
                      }}
                    >

                      <h3>
                        {
                          service.title
                        }
                      </h3>

                      <p>
                        {
                          service.category
                        }
                      </p>

                      <p>
                        {
                          service.description
                        }
                      </p>

                      {service.image_url && (
                        <img
                          src={
                            service.image_url
                          }
                          alt={
                            service.title
                          }
                          style={{
                            width:
                              '150px',
                            height:
                              '100px',
                            objectFit:
                              'cover',
                            marginBottom:
                              '1rem'
                          }}
                        />
                      )}

                      <br />

                      <button
                        type="button"
                        onClick={() =>
                          editService(
                            service
                          )
                        }
                        disabled={
                          marked
                        }
                      >
                        Edit
                      </button>

                      {marked ? (

                        <button
                          type="button"
                          onClick={() =>
                            undoDeletion(
                              'services',
                              service.id
                            )
                          }
                          style={{
                            marginLeft:
                              '0.5rem'
                          }}
                        >
                          Undo Delete
                        </button>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            deleteService(
                              service.id
                            )
                          }
                          style={{
                            marginLeft:
                              '0.5rem'
                          }}
                        >
                          Delete
                        </button>

                      )}

                    </div>
                  )
                }
              )}

            </section>
          )}

          {/* =================================================
              PROJECTS
          ================================================= */}

          {activeSection ===
            'projects' && (

            <section>

              <h2>
                Projects
              </h2>

              <form
                onSubmit={
                  saveProject
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Title

                  <input
                    value={
                      projectForm.title
                    }
                    onChange={(
                      event
                    ) =>
                      setProjectForm(
                        {
                          ...projectForm,
                          title:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Category

                  <input
                    value={
                      projectForm.category
                    }
                    onChange={(
                      event
                    ) =>
                      setProjectForm(
                        {
                          ...projectForm,
                          category:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Description

                  <textarea
                    rows="5"
                    value={
                      projectForm.description
                    }
                    onChange={(
                      event
                    ) =>
                      setProjectForm(
                        {
                          ...projectForm,
                          description:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <ImageManager
                  label="Project Image"
                  currentUrl={
                    projectForm.image_url
                  }
                  selectedFile={
                    projectFile
                  }
                  onSelect={
                    selectProjectFile
                  }
                  onRemove={() => {
                    setRemoveProjectImage(
                      true
                    )
                    setProjectFile(
                      null
                    )
                    setMessage(
                      'Project image marked for removal. Click Save All Changes to confirm.'
                    )
                  }}
                  alt="Project"
                />

                <label
                  style={
                    labelStyle
                  }
                >
                  Display Order

                  <input
                    type="number"
                    value={
                      projectForm.sort_order
                    }
                    onChange={(
                      event
                    ) =>
                      setProjectForm(
                        {
                          ...projectForm,
                          sort_order:
                            Number(
                              event
                                .target
                                .value
                            )
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={saving}
                >
                  {editingProject
                    ? 'Update Project'
                    : 'Add Project'}
                </button>

                {editingProject && (
                  <button
                    type="button"
                    onClick={
                      resetProjectForm
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancel
                  </button>
                )}

              </form>

              <hr
                style={{
                  margin:
                    '2rem 0'
                }}
              />

              {projects.map(
                (project) => {

                  const marked =
                    pendingDeletes
                      .projects
                      .includes(
                        project.id
                      )

                  return (
                    <div
                      key={
                        project.id
                      }
                      style={{
                        ...cardStyle,
                        opacity:
                          marked
                            ? 0.5
                            : 1
                      }}
                    >

                      <h3>
                        {
                          project.title
                        }
                      </h3>

                      <p>
                        {
                          project.category
                        }
                      </p>

                      <p>
                        {
                          project.description
                        }
                      </p>

                      {project.image_url && (
                        <img
                          src={
                            project.image_url
                          }
                          alt={
                            project.title
                          }
                          style={{
                            width:
                              '150px',
                            height:
                              '100px',
                            objectFit:
                              'cover',
                            marginBottom:
                              '1rem'
                          }}
                        />
                      )}

                      <br />

                      <button
                        type="button"
                        onClick={() =>
                          editProject(
                            project
                          )
                        }
                        disabled={
                          marked
                        }
                      >
                        Edit
                      </button>

                      {marked ? (

                        <button
                          type="button"
                          onClick={() =>
                            undoDeletion(
                              'projects',
                              project.id
                            )
                          }
                          style={{
                            marginLeft:
                              '0.5rem'
                          }}
                        >
                          Undo Delete
                        </button>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            deleteProject(
                              project.id
                            )
                          }
                          style={{
                            marginLeft:
                              '0.5rem'
                          }}
                        >
                          Delete
                        </button>

                      )}

                    </div>
                  )
                }
              )}

            </section>
          )}

          {/* =================================================
              TEAM
          ================================================= */}

          {activeSection ===
            'team' && (

            <section>

              <h2>
                Team
              </h2>

              <form
                onSubmit={
                  saveTeam
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Name

                  <input
                    value={
                      teamForm.name
                    }
                    onChange={(
                      event
                    ) =>
                      setTeamForm(
                        {
                          ...teamForm,
                          name:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Role

                  <input
                    value={
                      teamForm.role
                    }
                    onChange={(
                      event
                    ) =>
                      setTeamForm(
                        {
                          ...teamForm,
                          role:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Biography

                  <textarea
                    rows="6"
                    value={
                      teamForm.bio
                    }
                    onChange={(
                      event
                    ) =>
                      setTeamForm(
                        {
                          ...teamForm,
                          bio:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <ImageManager
                  label="Team Photo"
                  currentUrl={
                    teamForm.image_url
                  }
                  selectedFile={
                    teamFile
                  }
                  onSelect={
                    selectTeamFile
                  }
                  onRemove={() => {
                    setRemoveTeamImage(
                      true
                    )
                    setTeamFile(
                      null
                    )
                    setMessage(
                      'Team photo marked for removal. Click Save All Changes to confirm.'
                    )
                  }}
                  alt="Team member"
                />

                <label
                  style={
                    labelStyle
                  }
                >
                  Display Order

                  <input
                    type="number"
                    value={
                      teamForm.sort_order
                    }
                    onChange={(
                      event
                    ) =>
                      setTeamForm(
                        {
                          ...teamForm,
                          sort_order:
                            Number(
                              event
                                .target
                                .value
                            )
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={saving}
                >
                  {editingTeam
                    ? 'Update Team Member'
                    : 'Add Team Member'}
                </button>

                {editingTeam && (
                  <button
                    type="button"
                    onClick={
                      resetTeamForm
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancel
                  </button>
                )}

              </form>

              <hr
                style={{
                  margin:
                    '2rem 0'
                }}
              />

              {team.map(
                (member) => {

                  const marked =
                    pendingDeletes
                      .team
                      .includes(
                        member.id
                      )

                  return (
                    <div
                      key={
                        member.id
                      }
                      style={{
                        ...cardStyle,
                        opacity:
                          marked
                            ? 0.5
                            : 1
                      }}
                    >

                      <h3>
                        {
                          member.name
                        }
                      </h3>

                      <p>
                        {
                          member.role
                        }
                      </p>

                      <p>
                        {
                          member.bio
                        }
                      </p>

                      {member.image_url && (
                        <img
                          src={
                            member.image_url
                          }
                          alt={
                            member.name
                          }
                          style={{
                            width:
                              '100px',
                            height:
                              '100px',
                            objectFit:
                              'cover',
                            marginBottom:
                              '1rem'
                          }}
                        />
                      )}

                      <br />

                      <button
                        type="button"
                        onClick={() =>
                          editTeam(
                            member
                          )
                        }
                        disabled={
                          marked
                        }
                      >
                        Edit
                      </button>

                      {marked ? (

                        <button
                          type="button"
                          onClick={() =>
                            undoDeletion(
                              'team',
                              member.id
                            )
                          }
                          style={{
                            marginLeft:
                              '0.5rem'
                          }}
                        >
                          Undo Delete
                        </button>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            deleteTeam(
                              member.id
                            )
                          }
                          style={{
                            marginLeft:
                              '0.5rem'
                          }}
                        >
                          Delete
                        </button>

                      )}

                    </div>
                  )
                }
              )}

            </section>
          )}

          {/* =================================================
              CONTACT
          ================================================= */}

          {activeSection ===
            'contact' && (

            <section>

              <h2>
                Contact Page
              </h2>

              <form
                onSubmit={
                  saveSiteContent
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Eyebrow

                  <input
                    name="contact_eyebrow"
                    value={
                      siteForm.contact_eyebrow ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Title

                  <input
                    name="contact_title"
                    value={
                      siteForm.contact_title ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Description

                  <textarea
                    name="contact_description"
                    rows="4"
                    value={
                      siteForm.contact_description ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Business Hours

                  <textarea
                    name="business_hours"
                    rows="4"
                    value={
                      siteForm.business_hours ||
                      ''
                    }
                    onChange={
                      handleSiteChange
                    }
                    style={
                      textareaStyle
                    }
                  />

                </label>

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : 'Save Contact Page'}
                </button>

              </form>

            </section>
          )}

          {/* =================================================
              SOCIAL
          ================================================= */}

          {activeSection ===
            'social' && (

            <section>

              <h2>
                Social Media
              </h2>

              <form
                onSubmit={
                  saveSocial
                }
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Platform Name

                  <input
                    value={
                      socialForm.name
                    }
                    onChange={(
                      event
                    ) =>
                      setSocialForm(
                        {
                          ...socialForm,
                          name:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  Icon

                  <input
                    value={
                      socialForm.icon
                    }
                    onChange={(
                      event
                    ) =>
                      setSocialForm(
                        {
                          ...socialForm,
                          icon:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    placeholder="fa-brands fa-instagram"
                    style={
                      inputStyle
                    }
                  />

                </label>

                <label
                  style={
                    labelStyle
                  }
                >
                  URL

                  <input
                    value={
                      socialForm.url
                    }
                    onChange={(
                      event
                    ) =>
                      setSocialForm(
                        {
                          ...socialForm,
                          url:
                            event
                              .target
                              .value
                        }
                      )
                    }
                    placeholder="https://instagram.com/..."
                    style={
                      inputStyle
                    }
                  />

                </label>

                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={saving}
                >
                  {editingSocial
                    ? 'Update Social Link'
                    : 'Add Social Link'}
                </button>

                {editingSocial && (
                  <button
                    type="button"
                    onClick={
                      resetSocialForm
                    }
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Cancel
                  </button>
                )}

              </form>

              <hr
                style={{
                  margin:
                    '2rem 0'
                }}
              />

              {socialLinks.map(
                (social) => {

                  const marked =
                    pendingDeletes
                      .social
                      .includes(
                        social.id
                      )

                  return (
                    <div
                      key={
                        social.id
                      }
                      style={{
                        ...cardStyle,
                        opacity:
                          marked
                            ? 0.5
                            : 1
                      }}
                    >

                      <h3>
                        {
                          social.name
                        }
                      </h3>

                      <p>
                        {
                          social.url
                        }
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          editSocial(
                            social
                          )
                        }
                        disabled={
                          marked
                        }
                      >
                        Edit
                      </button>

                      {marked ? (

                        <button
                          type="button"
                          onClick={() =>
                            undoDeletion(
                              'social',
                              social.id
                            )
                          }
                          style={{
                            marginLeft:
                              '0.5rem'
                          }}
                        >
                          Undo Delete
                        </button>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            deleteSocial(
                              social.id
                            )
                          }
                          style={{
                            marginLeft:
                              '0.5rem'
                          }}
                        >
                          Delete
                        </button>

                      )}

                    </div>
                  )
                }
              )}

            </section>
          )}

        </main>

      </div>

    </div>
  )
}

// =========================================================
// SHARED STYLES
// =========================================================

const labelStyle = {
  display: 'block',
  marginBottom: '1.25rem',
  fontWeight: '500'
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.8rem',
  marginTop: '0.4rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
  background: '#fff'
}

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical'
}

const secondaryButtonStyle = {
  marginLeft: '1rem',
  padding: '0.65rem 1rem',
  border: '1px solid #ccc',
  background: '#fff',
  borderRadius: '4px',
  cursor: 'pointer'
}

const cardStyle = {
  padding: '1rem',
  border: '1px solid #ddd',
  marginBottom: '1rem',
  borderRadius: '4px'
}