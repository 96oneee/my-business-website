import React from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'

export default function Home() {
  const {
    siteContent,
    services,
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
    <div>

      {/* HERO */}
      <section className="hero container">

        <div className="hero-copy">

          <p className="eyebrow">
            {siteContent.hero_eyebrow}
          </p>

          <h1>
            {siteContent.hero_title}
          </h1>

          <p className="hero-description">
            {siteContent.hero_description}
          </p>

          <div className="btn-group">

            <Link
              to="/about"
              className="btn btn-dark"
            >
              Discover more
            </Link>

            <Link
              to="/contact"
              className="text-link"
            >
              Get in touch <span>↗</span>
            </Link>

          </div>

        </div>

        <div className="hero-visual">

          {siteContent.hero_image ? (

            <img
              src={siteContent.hero_image}
              alt={siteContent.business_name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

          ) : (

            <div className="placeholder-visual" aria-label="Hero image not configured" />

          )}

        </div>

      </section>


      {/* SERVICES */}
      <section className="section container">

        <div className="section-intro">

          <p className="eyebrow">
            WHAT WE DO
          </p>

          <h2>
            Thoughtful work, built around your goals.
          </h2>

        </div>


        <div className="service-grid">

          {services.slice(0, 3).map((service) => (

            <article
              className="service-card"
              key={service.id}
            >

              <i className={service.icon} />

              <p className="card-number">
                {service.category}
              </p>

              <h3>
                {service.title}
              </h3>

              <p>
                {service.description}
              </p>

            </article>

          ))}

        </div>


        <div className="section-action">

          <Link
            to="/services"
            className="text-link"
          >
            View all services <span>↗</span>
          </Link>

        </div>

      </section>


      {/* PROJECTS */}
      <section className="section section-soft">

        <div className="container">

          <div className="section-intro">

            <p className="eyebrow">
              SELECTED WORK
            </p>

            <h2>
              A few examples of what we create.
            </h2>

          </div>


          <div className="project-grid">

            {projects.slice(0, 3).map((project, index) => (

              <article
                className="project-card"
                key={project.id}
              >

                <div className="project-image placeholder-visual">

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

                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>

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


          <div className="section-action">

            <Link
              to="/projects"
              className="text-link"
            >
              See all projects <span>↗</span>
            </Link>

          </div>

        </div>

      </section>

    </div>
  )
}