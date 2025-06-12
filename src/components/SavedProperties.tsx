
import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MapPin, Bed, Bath, Square, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Property {
  id: string
  title: string
  price: number
  property_type: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  address: string
  city: string
  state: string
  status: string
  property_images: {
    image_url: string
    is_primary: boolean
  }[]
}

interface SavedProperty {
  id: string
  property_id: string
  created_at: string
  properties: Property
}

const SavedProperties = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchSavedProperties()
    }
  }, [user])

  const fetchSavedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          property_id,
          created_at,
          properties (
            id,
            title,
            price,
            property_type,
            bedrooms,
            bathrooms,
            square_feet,
            address,
            city,
            state,
            status,
            property_images (
              image_url,
              is_primary
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Map the data to match our interface structure
      const mappedData = data?.map(item => ({
        id: item.id,
        property_id: item.property_id,
        created_at: item.created_at,
        properties: Array.isArray(item.properties) ? item.properties[0] : item.properties
      })) || []

      setSavedProperties(mappedData)
    } catch (error: any) {
      console.error('Error fetching saved properties:', error)
      toast({
        title: 'Error',
        description: 'Failed to load saved properties',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const removeSavedProperty = async (savedPropertyId: string) => {
    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('id', savedPropertyId)
        .eq('user_id', user?.id)

      if (error) throw error

      setSavedProperties(prev => 
        prev.filter(item => item.id !== savedPropertyId)
      )

      toast({
        title: 'Success',
        description: 'Property removed from favorites'
      })
    } catch (error: any) {
      console.error('Error removing saved property:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove property from favorites',
        variant: 'destructive'
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPrimaryImage = (images: Property['property_images']) => {
    const primaryImage = images?.find(img => img.is_primary)
    return primaryImage?.image_url || images?.[0]?.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Saved Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (savedProperties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Saved Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No saved properties yet</h3>
            <p className="text-muted-foreground">
              Start browsing properties and save your favorites to see them here.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Saved Properties ({savedProperties.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((savedProperty) => {
            const property = savedProperty.properties
            if (!property) return null

            return (
              <Card key={savedProperty.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={getPrimaryImage(property.property_images)}
                    alt={property.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      {property.property_type}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => removeSavedProperty(savedProperty.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </span>
                    <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                      {property.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.square_feet?.toLocaleString()} sq ft</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default SavedProperties
