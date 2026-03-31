// src/components/PageHeader.jsx
import React from 'react'
import './Pageheader.css'

const PageHeader = ({ tag, title, subtitle }) => {
  return (
    <div className="page-header">
      <span className="page-header__tag">
        {tag}
      </span>
      <h1 className="page-header__title">
        {title}
      </h1>
      {subtitle && (
        <p className="page-header__subtitle">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default PageHeader