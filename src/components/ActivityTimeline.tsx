
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Heart, 
  Search, 
  Eye, 
  MessageSquare, 
  Calendar, 
  Home,
  Clock
} from 'lucide-react'

interface Activity {
  id: string
  type: 'favorite' | 'search' | 'view' | 'contact' | 'schedule' | 'listing'
  title: string
  description: string
  timestamp: string
  propertyId?: string
  propertyTitle?: string
  metadata?: Record<string, any>
}

const ActivityTimeline = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'favorite',
      title: 'Saved Property',
      description: 'Added to favorites',
      timestamp: '2024-01-21T10:30:00Z',
      propertyId: '123',
      propertyTitle: 'Modern Downtown Condo'
    },
    {
      id: '2',
      type: 'search',
      title: 'New Search',
      description: 'Searched for "luxury homes in marina district"',
      timestamp: '2024-01-21T09:15:00Z',
      metadata: { resultsCount: 12 }
    },
    {
      id: '3',
      type: 'view',
      title: 'Viewed Property',
      description: 'Viewed property details',
      timestamp: '2024-01-20T16:45:00Z',
      propertyId: '124',
      propertyTitle: 'Waterfront Villa'
    },
    {
      id: '4',
      type: 'contact',
      title: 'Contacted Agent',
      description: 'Sent message to listing agent',
      timestamp: '2024-01-20T14:20:00Z',
      propertyId: '125',
      propertyTitle: 'Family Home in Suburbs'
    },
    {
      id: '5',
      type: 'schedule',
      title: 'Scheduled Viewing',
      description: 'Booked property viewing for Jan 25, 2:00 PM',
      timestamp: '2024-01-19T11:00:00Z',
      propertyId: '126',
      propertyTitle: 'Cozy Starter Home'
    },
    {
      id: '6',
      type: 'listing',
      title: 'New Listing Alert',
      description: 'New property matching your saved search',
      timestamp: '2024-01-19T08:30:00Z',
      propertyId: '127',
      propertyTitle: 'Penthouse Suite'
    },
    {
      id: '7',
      type: 'search',
      title: 'Saved Search Run',
      description: 'Automatically ran "Downtown Condos" search',
      timestamp: '2024-01-18T18:00:00Z',
      metadata: { resultsCount: 15, newResults: 2 }
    }
  ]

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'favorite':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'search':
        return <Search className="h-4 w-4 text-blue-500" />
      case 'view':
        return <Eye className="h-4 w-4 text-green-500" />
      case 'contact':
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'schedule':
        return <Calendar className="h-4 w-4 text-orange-500" />
      case 'listing':
        return <Home className="h-4 w-4 text-indigo-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'favorite':
        return 'bg-red-50 border-red-200'
      case 'search':
        return 'bg-blue-50 border-blue-200'
      case 'view':
        return 'bg-green-50 border-green-200'
      case 'contact':
        return 'bg-purple-50 border-purple-200'
      case 'schedule':
        return 'bg-orange-50 border-orange-200'
      case 'listing':
        return 'bg-indigo-50 border-indigo-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Activity Timeline</h2>
        <p className="text-muted-foreground">Your recent property browsing activity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Track your property searches, views, and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Avatar className={`h-10 w-10 ${getActivityColor(activity.type)}`}>
                    <AvatarFallback className="bg-transparent">
                      {getActivityIcon(activity.type)}
                    </AvatarFallback>
                  </Avatar>
                  {index < activities.length - 1 && (
                    <div className="w-px h-8 bg-border mt-2" />
                  )}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  
                  {activity.propertyTitle && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.propertyTitle}
                      </Badge>
                    </div>
                  )}
                  
                  {activity.metadata && (
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      {activity.metadata.resultsCount && (
                        <span>{activity.metadata.resultsCount} results</span>
                      )}
                      {activity.metadata.newResults && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.metadata.newResults} new
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityTimeline
