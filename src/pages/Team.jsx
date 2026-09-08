import React from 'react'
import { useSiteContent } from '../context/SiteContentContext'

export default function Team() {
  const {
    siteContent,
    team,
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
            {siteContent.team_eyebrow || 'TEAM'}
          </p>

          <h1>
            {siteContent.team_title ||
              'The people behind the work.'}
          </h1>

          {siteContent.team_description && (
            <p>
              {siteContent.team_description}
            </p>
          )}

        </div>


        {/* TEAM */}

        <div className="team-grid">

          {team.map((member, index) => (

            <article
              className="team-card"
              key={member.id}
            >

              <div className="team-image">

                {member.image_url ? (

                  <img
                    src={member.image_url}
                    alt={member.name}
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


              <p className="team-role">
                {member.role}
              </p>

              <h3>
                {member.name}
              </h3>

              <p>
                {member.bio}
              </p>

            </article>

          ))}

        </div>


        {/* EMPTY STATE */}

        {team.length === 0 && (

          <div
            style={{
              padding: '3rem 0',
              textAlign: 'center'
            }}
          >

            <p>
              No team members have been added yet.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}
