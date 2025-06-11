
import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, MapPin, Home, Bath, Bed } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PropertyListProps {
  onEditProperty: (property: any) => void
}

const PropertyList = ({ onEditProperty }: PropertyListProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProperties()
    }
  }, [user])

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_primary)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (error: any) {
      toast({
        title: 'Error loading properties',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error

      toast({
        title: 'Property deleted',
        description: 'Your property has been deleted successfully.'
      })

      loadProperties()
    } catch (error: any) {
      toast({
        title: 'Error deleting property',
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

  const getPrimaryImage = (images: any[]) => {
    const primary = images?.find(img => img.is_primary)
    return primary?.image_url || images?.[0]?.image_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'
  }

  if (loading) {
    return <div className="text-center py-8">Loading your properties...</div>
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
          <p className="text-muted-foreground">Start by adding your first property listing.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={getPrimaryImage(property.property_images)}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                {property.status}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.city}, {property.state}</span>
              </div>
              <div className="text-xl font-bold text-blue-600 mb-3">
                {formatPrice(property.price)}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} baths</span>
              </div>
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                <span>{property.square_feet?.toLocaleString()} sqft</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditProperty(property)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteProperty(property.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default PropertyList
