import React from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'

export default function Footer() {
  const {
    siteContent,
    socialLinks,
    loading
  } = useSiteContent()

  if (loading) {
    return null
  }

  return (
    <footer className="footer">

      <div className="container footer-grid">

        {/* BUSINESS */}

        <div>

          <div className="footer-logo">
            {siteContent?.business_name ||
              'Your Business Name'}
          </div>

          <p className="footer-description">
            {siteContent?.tagline || ''}
          </p>


          {/* SOCIAL LINKS */}

          <div className="socials">

            {socialLinks.map((social) => (

              <a
                key={social.id}
                href={social.url || '#'}
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={social.icon} />
              </a>

            ))}

          </div>

        </div>


        {/* NAVIGATION */}

        <div>

          <h4>
            Explore
          </h4>

          <div className="footer-links">

            <Link to="/about">
              About
            </Link>

            <Link to="/services">
              Services
            </Link>

            <Link to="/projects">
              Projects
            </Link>

            <Link to="/team">
              Team
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>

        </div>


        {/* CONTACT */}

        <div>

          <h4>
            Contact
          </h4>

          <div className="footer-links">

            {siteContent?.email && (
              <a
                href={`mailto:${siteContent.email}`}
              >
                {siteContent.email}
              </a>
            )}

            {siteContent?.phone && (
              <a
                href={`tel:${siteContent.phone}`}
              >
                {siteContent.phone}
              </a>
            )}

            {siteContent?.address && (
              <span>
                {siteContent.address}
              </span>
            )}

          </div>

        </div>

      </div>


      {/* BOTTOM */}

      <div className="container footer-bottom">

        <span>
          &copy; {new Date().getFullYear()}{' '}
          {siteContent?.business_name ||
            'Your Business Name'}. All rights reserved.
        </span>

        <span>
          {siteContent?.tagline ||
            'Designed with intention.'}
        </span>

      </div>

    </footer>
  )
}
