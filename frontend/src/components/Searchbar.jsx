// src/components/SearchBar.jsx
import React from 'react'
import './Searchbar.css'

const SearchBar = ({ value, onChange, placeholder = 'Search…' }) => {
  return (
    <div className="searchbar">
      <span className="searchbar__icon">
        🔍
      </span>
      <input
        className="searchbar__input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

export default SearchBar