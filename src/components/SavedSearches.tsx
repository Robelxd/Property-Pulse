
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Trash2, Bell, Search, Edit, Plus } from 'lucide-react'

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: {
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    propertyType?: string
    location?: string
  }
  notifications: boolean
  resultsCount: number
  createdAt: string
  lastRun: string
}

const SavedSearches = () => {
  const [searches, setSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      name: 'Downtown Condos',
      query: 'downtown condos under 1M',
      filters: {
        maxPrice: 1000000,
        bedrooms: 2,
        propertyType: 'condo',
        location: 'Downtown'
      },
      notifications: true,
      resultsCount: 15,
      createdAt: '2024-01-15',
      lastRun: '2024-01-20'
    },
    {
      id: '2',
      name: 'Family Homes',
      query: 'family homes 3+ bedrooms',
      filters: {
        minPrice: 800000,
        maxPrice: 1500000,
        bedrooms: 3,
        propertyType: 'house'
      },
      notifications: false,
      resultsCount: 8,
      createdAt: '2024-01-10',
      lastRun: '2024-01-19'
    },
    {
      id: '3',
      name: 'Investment Properties',
      query: 'investment properties under 750k',
      filters: {
        maxPrice: 750000,
        propertyType: 'apartment'
      },
      notifications: true,
      resultsCount: 22,
      createdAt: '2024-01-05',
      lastRun: '2024-01-21'
    }
  ])

  const toggleNotifications = (id: string) => {
    setSearches(searches.map(search => 
      search.id === id 
        ? { ...search, notifications: !search.notifications }
        : search
    ))
  }

  const deleteSearch = (id: string) => {
    setSearches(searches.filter(search => search.id !== id))
  }

  const runSearch = (id: string) => {
    console.log(`Running search ${id}`)
    // Update last run date
    setSearches(searches.map(search => 
      search.id === id 
        ? { ...search, lastRun: new Date().toISOString().split('T')[0] }
        : search
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Saved Searches</h2>
          <p className="text-muted-foreground">Manage and track your property searches</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Search
        </Button>
      </div>

      <div className="grid gap-4">
        {searches.map((search) => (
          <Card key={search.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{search.name}</CardTitle>
                  <CardDescription className="mt-1">{search.query}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={search.notifications}
                    onCheckedChange={() => toggleNotifications(search.id)}
                  />
                  <Bell className={`h-4 w-4 ${search.notifications ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {search.filters.location && (
                    <Badge variant="secondary">📍 {search.filters.location}</Badge>
                  )}
                  {search.filters.propertyType && (
                    <Badge variant="secondary">🏠 {search.filters.propertyType}</Badge>
                  )}
                  {search.filters.bedrooms && (
                    <Badge variant="secondary">🛏️ {search.filters.bedrooms}+ beds</Badge>
                  )}
                  {search.filters.minPrice && (
                    <Badge variant="secondary">💰 ${search.filters.minPrice.toLocaleString()}+</Badge>
                  )}
                  {search.filters.maxPrice && (
                    <Badge variant="secondary">💰 Under ${search.filters.maxPrice.toLocaleString()}</Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="space-x-4">
                    <span>Results: {search.resultsCount}</span>
                    <span>Created: {search.createdAt}</span>
                    <span>Last run: {search.lastRun}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runSearch(search.id)}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteSearch(search.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SavedSearches
