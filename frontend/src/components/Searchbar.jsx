// src/components/SearchBar.jsx
import React from 'react'

const SearchBar = ({ value, onChange, placeholder = 'Search…' }) => {
  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <span style={{
        position: 'absolute', left: '14px', top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '16px', color: 'rgba(4,42,78,0.4)',
        pointerEvents: 'none',
      }}>
        🔍
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '10px 16px 10px 40px',
          fontSize: '14px', fontFamily: 'inherit',
          border: '1.5px solid rgba(4,42,78,0.15)',
          borderRadius: '8px', outline: 'none',
          background: '#fff', color: '#042a4e',
          boxShadow: '0 2px 8px rgba(4,42,78,0.06)',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = '#042a4e')}
        onBlur={e => (e.target.style.borderColor = 'rgba(4,42,78,0.15)')}
      />
    </div>
  )
}

export default SearchBar