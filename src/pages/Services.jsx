import React from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'

export default function Services() {
  const {
    siteContent,
    services,
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
            {siteContent.services_eyebrow || 'SERVICES'}
          </p>

          <h1>
            {siteContent.services_title ||
              'Expertise shaped around what you need.'}
          </h1>

          {siteContent.services_description && (
            <p>
              {siteContent.services_description}
            </p>
          )}

        </div>


        {/* SERVICES */}
        <div className="service-grid service-grid-large">

          {services.map((service, index) => (

            <article
              className="service-card"
              key={service.id}
            >

              <span className="large-number">
                {String(index + 1).padStart(2, '0')}
              </span>


              {service.image_url ? (

                <div
                  className="service-image"
                  style={{
                    marginBottom: '1.5rem',
                    width: '100%',
                    height: '180px',
                    overflow: 'hidden'
                  }}
                >

                  <img
                    src={service.image_url}
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                </div>

              ) : (

                <i className={service.icon} />

              )}


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


        {/* EMPTY STATE */}
        {services.length === 0 && (
          <div
            style={{
              padding: '3rem 0',
              textAlign: 'center'
            }}
          >
            <p>
              No services have been added yet.
            </p>
          </div>
        )}


        {/* CTA */}
        <div className="cta-block">

          <p className="eyebrow">
            {siteContent.services_cta_eyebrow ||
              'START A CONVERSATION'}
          </p>

          <h2>
            {siteContent.services_cta_title ||
              'Have a project in mind?'}
          </h2>

          <Link
            to="/contact"
            className="btn btn-dark"
          >
            {siteContent.services_cta_button ||
              'Contact us'}
          </Link>

        </div>

      </div>

    </div>
  )
}