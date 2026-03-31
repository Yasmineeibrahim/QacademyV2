// src/components/how.jsx
import React from 'react'   
import './How.css'

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how">
      <div className="container how__inner">

        {/* Header */}
        <div className="how__header">
          <span className="how__badge">Guide</span>
          <h2 className="how__title">How It Works</h2>
          <p className="how__subtitle">
            Watch this short video to learn how to browse, enroll, and start your courses in minutes.
          </p>
        </div>

        {/* Frame */}
        <div className="how__frame">
          {/* Inner bezel accent */}
          <div className="how__bezel">
            <iframe
              className="how__video"
              width="720"
              height="405"
              src="https://www.youtube.com/embed/_Usidw434ck?si=nrO-qmaTUSPDuUZz"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default HowItWorks