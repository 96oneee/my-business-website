import React from 'react'
import { useSiteContent } from '../context/SiteContentContext'

export default function Projects() {
  const {
    siteContent,
    projects,
    loading
  } = useSiteContent()

  if (loading) {
    return (
      <div className="container">
        Loading...
      </div>
    )
  }

  if (!siteContent) {
    return (
      <div className="container">
        Website content could not be loaded.
      </div>
    )
  }

  return (
    <div className="page">

      <div className="container">

        {/* PAGE HEADER */}
        <div className="page-heading">

          <p className="eyebrow">
            {siteContent.projects_eyebrow || 'PROJECTS'}
          </p>

          <h1>
            {siteContent.projects_title ||
              'Selected work and ideas.'}
          </h1>

          {siteContent.projects_description && (
            <p>
              {siteContent.projects_description}
            </p>
          )}

        </div>


        {/* PROJECTS */}
        <div className="project-grid project-grid-large">

          {projects.map((project, index) => (

            <article
              className="project-card"
              key={project.id}
            >

              <div className="project-image">

                {project.image_url ? (

                  <img
                    src={project.image_url}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                ) : (

                  <div className="placeholder-visual">
                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                )}

              </div>


              <p className="project-category">
                {project.category}
              </p>

              <h3>
                {project.title}
              </h3>

              <p>
                {project.description}
              </p>

            </article>

          ))}

        </div>


        {/* EMPTY STATE */}
        {projects.length === 0 && (

          <div
            style={{
              padding: '3rem 0',
              textAlign: 'center'
            }}
          >
            <p>
              No projects have been added yet.
            </p>
          </div>

        )}

      </div>

    </div>
  )
}
