import React, { useState } from 'react'
import { useSiteContent } from '../context/SiteContentContext'

export default function Contact() {
  const {
    siteContent,
    loading
  } = useSiteContent()

  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    setSent(true)

    event.currentTarget.reset()
  }

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
            {siteContent.contact_eyebrow ||
              'CONTACT'}
          </p>

          <h1>
            {siteContent.contact_title ||
              "Let's start a conversation."}
          </h1>

          <p>
            {siteContent.contact_description ||
              'We would love to hear from you.'}
          </p>

        </div>


        {/* CONTACT CONTENT */}

        <div className="contact-layout">

          {/* CONTACT DETAILS */}

          <div className="contact-details">

            <div>

              <p className="eyebrow">
                GET IN TOUCH
              </p>

              {siteContent.email && (
                <a
                  href={`mailto:${siteContent.email}`}
                  className="contact-line"
                >
                  {siteContent.email}
                </a>
              )}

              {siteContent.phone && (
                <a
                  href={`tel:${siteContent.phone}`}
                  className="contact-line"
                >
                  {siteContent.phone}
                </a>
              )}

              {siteContent.address && (
                <p className="contact-line">
                  {siteContent.address}
                </p>
              )}

            </div>


            {/* BUSINESS HOURS */}

            <div className="contact-note">

              <p className="eyebrow">
                BUSINESS HOURS
              </p>

              <p
                style={{
                  whiteSpace: 'pre-line'
                }}
              >
                {siteContent.business_hours ||
                  'Monday - Friday\n9:00 AM - 6:00 PM'}
              </p>

            </div>

          </div>


          {/* CONTACT FORM */}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <label>
              Name

              <input
                name="name"
                type="text"
                required
              />
            </label>


            <label>
              Email

              <input
                name="email"
                type="email"
                required
              />
            </label>


            <label>
              Subject

              <input
                name="subject"
                type="text"
              />
            </label>


            <label>
              Message

              <textarea
                name="message"
                rows="6"
                required
              />
            </label>


            <button
              type="submit"
              className="btn btn-dark"
            >
              Send message
            </button>


            {sent && (
              <p className="form-success">
                Thank you. Your message has been received.
              </p>
            )}

          </form>

        </div>

      </div>

    </div>
  )
}
