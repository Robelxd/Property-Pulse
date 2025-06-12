
import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Heart, MapPin, Bed, Bath, Square, Trash2 } from 'lucide-react'

interface SavedProperty {
  id: string
  property_id: string
  created_at: string
  properties: {
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
    property_images: Array<{
      image_url: string
      is_primary: boolean
    }>
  }
}

const SavedProperties = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSavedProperties()
    }
  }, [user])

  const loadSavedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          property_id,
          created_at,
          properties:property_id (
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

      setSavedProperties(data || [])
    } catch (error: any) {
      toast({
        title: 'Error loading saved properties',
        description: error.message,
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

      if (error) throw error

      setSavedProperties(prev => 
        prev.filter(item => item.id !== savedPropertyId)
      )

      toast({
        title: 'Property removed',
        description: 'The property has been removed from your saved list.'
      })
    } catch (error: any) {
      toast({
        title: 'Error removing property',
        description: error.message,
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

  const getPrimaryImage = (images: Array<{ image_url: string; is_primary: boolean }>) => {
    const primaryImage = images.find(img => img.is_primary)
    return primaryImage?.image_url || images[0]?.image_url || '/placeholder.svg'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          <CardDescription>
            Properties you've saved for later viewing.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
          <p className="text-gray-600">
            Start exploring properties and save your favorites to view them here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Saved Properties ({savedProperties.length})
          </CardTitle>
          <CardDescription>
            Properties you've saved for later viewing.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedProperties.map((saved) => (
          <Card key={saved.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={getPrimaryImage(saved.properties.property_images)}
                alt={saved.properties.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge 
                className="absolute top-2 left-2 bg-white text-gray-900"
              >
                {saved.properties.property_type}
              </Badge>
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeSavedProperty(saved.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {saved.properties.title}
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(saved.properties.price)}
                </p>
              </div>

              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">
                  {saved.properties.address}, {saved.properties.city}, {saved.properties.state}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{saved.properties.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{saved.properties.bathrooms}</span>
                </div>
                {saved.properties.square_feet && (
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span>{saved.properties.square_feet.toLocaleString()} sq ft</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500">
                  Saved on {new Date(saved.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SavedProperties
