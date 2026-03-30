// src/components/PageHeader.jsx
import React from 'react'

const PageHeader = ({ tag, title, subtitle }) => {
  return (
    <div style={{
      background: '#042a4e',
      padding: '48px 0 36px',
      textAlign: 'center',
    }}>
      <span style={{
        fontSize: '12px', fontWeight: 700, letterSpacing: '2.5px',
        textTransform: 'uppercase', color: '#fff613',
        background: 'rgba(255,246,19,0.12)', padding: '4px 14px',
        borderRadius: '4px', display: 'inline-block', marginBottom: '14px',
      }}>
        {tag}
      </span>
      <h1 style={{
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: '2.8rem', color: '#ffffff', lineHeight: 1.15,
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: '10px', fontSize: '15px' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default PageHeader