
import React from 'react'
import Navigation from '@/components/Navigation'
import SavedProperties from '@/components/SavedProperties'

const Favorites = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 container mx-auto px-4 py-8">
        <SavedProperties />
      </div>
    </div>
  )
}

export default Favorites
