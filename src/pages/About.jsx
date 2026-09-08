import React from 'react'
import { useSiteContent } from '../context/SiteContentContext'

export default function About() {
  const {
    siteContent,
    values,
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

        {/* PAGE HEADING */}
        <div className="page-heading">

          <p className="eyebrow">
            {siteContent.about_eyebrow || 'ABOUT US'}
          </p>

          <h1>
            {siteContent.about_title ||
              'Purpose, perspective, and a clear direction.'}
          </h1>

          {siteContent.about_description && (
            <p>
              {siteContent.about_description}
            </p>
          )}

        </div>


        {/* ABOUT CONTENT */}
        <div className="about-layout">

          <div className="about-image">

            {siteContent.about_image ? (

              <img
                src={siteContent.about_image}
                alt={`${siteContent.business_name || 'Business'} about`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

            ) : (

              <div className="placeholder-visual" aria-label="About image not configured" />

            )}

          </div>


          <div className="about-copy">

            <p>
              {siteContent.about_story}
            </p>

            <p>
              {siteContent.about_mission}
            </p>

            {siteContent.about_quote && (
              <blockquote>
                {siteContent.about_quote}
              </blockquote>
            )}

          </div>

        </div>


        {/* VALUES */}
        <div className="section">

          <div className="section-intro">

            <p className="eyebrow">
              {siteContent.values_eyebrow || 'OUR VALUES'}
            </p>

            <h2>
              {siteContent.values_title ||
                'What guides the way we work.'}
            </h2>

            {siteContent.values_description && (
              <p>
                {siteContent.values_description}
              </p>
            )}

          </div>


          <div className="value-grid">

            {values.map((value) => (

              <article
                className="value-card"
                key={value.id}
              >

                <i className={value.icon} />

                <h3>
                  {value.title}
                </h3>

                <p>
                  {value.description}
                </p>

              </article>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}