
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User, Home, Building, LayoutDashboard } from 'lucide-react'

const Navigation = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 
              className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => navigate('/')}
            >
              PropertyPulse
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/properties')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Building className="h-4 w-4 mr-2" />
                  My Properties
                </Button>
                <div className="flex items-center text-gray-700">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
