
import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Home } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import SearchFilters from '@/components/SearchFilters'

interface Property {
  id: string
  title: string
  price: number
  property_type: string
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  featured: boolean
  property_images: Array<{
    image_url: string
    is_primary: boolean
  }>
}

const AllProperties = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('created_at')
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: ''
  })

  useEffect(() => {
    loadProperties()
  }, [sortBy])

  const loadProperties = async () => {
    try {
      let query = supabase
        .from('properties')
        .select(`
          id,
          title,
          price,
          property_type,
          city,
          state,
          bedrooms,
          bathrooms,
          square_feet,
          featured,
          property_images(image_url, is_primary)
        `)
        .eq('status', 'active')

      // Apply sorting
      if (sortBy === 'price_low') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price_high') {
        query = query.order('price', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

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

  const handleSearch = (searchParams: string) => {
    try {
      const parsedFilters = JSON.parse(searchParams)
      setFilters(parsedFilters)
      loadFilteredProperties(parsedFilters)
    } catch (error) {
      console.error('Error parsing search params:', error)
    }
  }

  const loadFilteredProperties = async (searchFilters = filters) => {
    setLoading(true)
    try {
      let query = supabase
        .from('properties')
        .select(`
          id,
          title,
          price,
          property_type,
          city,
          state,
          bedrooms,
          bathrooms,
          square_feet,
          featured,
          property_images(image_url, is_primary)
        `)
        .eq('status', 'active')

      // Apply location filter
      if (searchFilters.location) {
        query = query.or(`title.ilike.%${searchFilters.location}%,city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%`)
      }

      // Apply property type filter
      if (searchFilters.propertyType) {
        query = query.eq('property_type', searchFilters.propertyType)
      }

      // Apply price range filter
      if (searchFilters.priceRange) {
        const [min, max] = searchFilters.priceRange.split('-').map(Number)
        if (max) {
          query = query.gte('price', min).lte('price', max)
        } else {
          query = query.gte('price', min)
        }
      }

      // Apply bedrooms filter
      if (searchFilters.bedrooms) {
        const minBedrooms = parseInt(searchFilters.bedrooms)
        query = query.gte('bedrooms', minBedrooms)
      }

      // Apply sorting
      if (sortBy === 'price_low') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price_high') {
        query = query.order('price', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setProperties(data || [])
    } catch (error: any) {
      toast({
        title: 'Error searching properties',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
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
    if (!images?.length) {
      return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'
    }
    const primary = images.find(img => img.is_primary)
    return primary?.image_url || images[0]?.image_url
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">All Properties</h1>
          
          {/* Integrated Search Filters */}
          <div className="mb-6">
            <SearchFilters onSearch={handleSearch} />
          </div>

          {/* Sort Options */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {properties.length} properties found
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Newest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <Card 
                key={property.id} 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getPrimaryImage(property.property_images)}
                    alt={property.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      {property.property_type}
                    </Badge>
                  </div>
                  {property.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-blue-600 hover:bg-blue-700">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>
                    <div className="text-sm text-muted-foreground mb-3">
                      {property.city}, {property.state}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{property.bedrooms}</div>
                      <div>Beds</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{property.bathrooms}</div>
                      <div>Baths</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{property.square_feet?.toLocaleString()}</div>
                      <div>Sq Ft</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllProperties
