import React from 'react'
import small from '../assets/logo_yellow.png'

function ResponsiveLogo() {
  return (
    <img
      className="default__logo"
      src={small}
      srcSet={`${small} 300w, ${small} 768w, ${small} 1280w`}
      alt="Logo"
    />
  )
}

export default ResponsiveLogo
