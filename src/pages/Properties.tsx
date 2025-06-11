
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import PropertyDashboard from '@/components/PropertyDashboard'

const Properties = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20">
          <PropertyDashboard />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Properties
