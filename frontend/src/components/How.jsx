// src/components/how.jsx
import React from 'react'   

const HowItWorks = () => {
  return (
    <section id="how-it-works" style={{
      width: '100%',
      padding: '80px 0',
      background: '#EDF2F4',
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <span style={{
            fontSize: '12px', fontWeight: 700, letterSpacing: '2.5px',
            textTransform: 'uppercase', color: '#fff613',
            background: '#042a4e', padding: '4px 14px',
            borderRadius: '4px', display: 'inline-block', marginBottom: '14px'
          }}>Guide</span>
          <h2 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: '2.4rem',
            color: '#042a4e',
            lineHeight: 1.15,
          }}>How It Works</h2>
          <p style={{
            color: 'rgba(4,42,78,0.55)',
            marginTop: '10px',
            fontSize: '15px',
            maxWidth: '480px',
          }}>
            Watch this short video to learn how to browse, enroll, and start your courses in minutes.
          </p>
        </div>

        {/* Frame */}
        <div style={{
          background: '#042a4e',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 12px 48px rgba(4,42,78,0.25)',
        }}>
          {/* Inner bezel accent */}
          <div style={{
            background: 'rgba(255,246,19,0.08)',
            border: '1.5px solid rgba(255,246,19,0.2)',
            borderRadius: '10px',
            overflow: 'hidden',
            lineHeight: 0,
          }}>
            <iframe
              width="720"
              height="405"
              src="https://www.youtube.com/embed/_Usidw434ck?si=nrO-qmaTUSPDuUZz"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ display: 'block', width: '720px', height: '405px' }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default HowItWorks