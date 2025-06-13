
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Bed, Bath, Home, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import Navigation from '@/components/Navigation'

interface Property {
  id: string
  title: string
  description: string
  price: number
  property_type: string
  address: string
  city: string
  state: string
  zip_code: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  status: string
  featured: boolean
  user_id: string
  property_images: Array<{
    image_url: string
    is_primary: boolean
    caption?: string
  }>
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (id) {
      loadProperty()
      if (user) {
        checkIfSaved()
      }
    }
  }, [id, user])

  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_primary, caption)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setProperty(data)
    } catch (error: any) {
      toast({
        title: 'Error loading property',
        description: error.message,
        variant: 'destructive'
      })
      navigate('/properties')
    } finally {
      setLoading(false)
    }
  }

  const checkIfSaved = async () => {
    if (!user || !id) return

    try {
      const { data } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', id)
        .single()

      setIsSaved(!!data)
    } catch (error) {
      // Property not saved
    }
  }

  const toggleSaveProperty = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save properties.',
        variant: 'destructive'
      })
      return
    }

    try {
      if (isSaved) {
        await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', id)

        setIsSaved(false)
        toast({
          title: 'Property removed',
          description: 'Property removed from your saved list.'
        })
      } else {
        await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: id
          })

        setIsSaved(true)
        toast({
          title: 'Property saved',
          description: 'Property added to your saved list.'
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
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

  const getPrimaryImage = () => {
    if (!property?.property_images?.length) {
      return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'
    }
    const primary = property.property_images.find(img => img.is_primary)
    return primary?.image_url || property.property_images[0]?.image_url
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Property not found</h3>
              <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/properties')}>
                View All Properties
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="relative mb-4">
              <img
                src={getPrimaryImage()}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {property.featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600">Featured</Badge>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSaveProperty}
                className={`absolute top-4 right-4 ${isSaved ? 'text-red-500' : 'text-gray-500'}`}
              >
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {property.property_images && property.property_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.property_images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`Property image ${index + 2}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.address}, {property.city}, {property.state} {property.zip_code}</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    {formatPrice(property.price)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Bed className="h-4 w-4 mr-1" />
                    </div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Beds</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Bath className="h-4 w-4 mr-1" />
                    </div>
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Baths</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Home className="h-4 w-4 mr-1" />
                    </div>
                    <div className="font-semibold">{property.square_feet?.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Property Type</h3>
                  <Badge variant="outline">{property.property_type}</Badge>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default PropertyDetail
