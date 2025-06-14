import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Home as HomeIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate, useLocation as useReactRouterLocation } from 'react-router-dom'
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
  const reactRouterLocation = useReactRouterLocation();

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('created_at')
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: ''
  })
  const [initialFiltersApplied, setInitialFiltersApplied] = useState(false);

  // Effect to parse filters from URL and update local filter state
  useEffect(() => {
    const params = new URLSearchParams(reactRouterLocation.search);
    const filtersFromUrlString = params.get('filters');
    let resolvedFilters = { location: '', propertyType: '', priceRange: '', bedrooms: '' };
  
    if (filtersFromUrlString) {
      try {
        resolvedFilters = JSON.parse(decodeURIComponent(filtersFromUrlString));
      } catch (e) {
        console.error("Error parsing filters from URL", e);
        // Keep resolvedFilters as default if parsing fails
      }
    }
    setFilters(resolvedFilters);
    setInitialFiltersApplied(true); // Signal that initial filter setup from URL (or default) is done
  }, [reactRouterLocation.search]); // Re-run if URL search params change

  // Effect to load properties when filters or sortBy change, after initial filters are set
  useEffect(() => {
    if (initialFiltersApplied) {
      loadFilteredProperties(filters);
    }
  }, [filters, sortBy, initialFiltersApplied]);

  const handleSearch = (searchParams: string) => { // This is for the SearchFilters within AllProperties page
    try {
      const parsedFilters = JSON.parse(searchParams)
      setFilters(parsedFilters) // This will trigger the useEffect above to reload properties
    } catch (error) {
      console.error('Error parsing search params:', error)
      toast({
        title: 'Filter Error',
        description: 'Could not apply filters.',
        variant: 'destructive',
      });
    }
  }

  const loadFilteredProperties = async (currentFilters = filters) => {
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
      if (currentFilters.location && currentFilters.location !== 'any') {
        query = query.or(`title.ilike.%${currentFilters.location}%,city.ilike.%${currentFilters.location}%,state.ilike.%${currentFilters.location}%`)
      }

      // Apply property type filter
      if (currentFilters.propertyType && currentFilters.propertyType !== 'any') {
        query = query.eq('property_type', currentFilters.propertyType)
      }

      // Apply price range filter
      if (currentFilters.priceRange && currentFilters.priceRange !== 'any') {
        const [minStr, maxStr] = currentFilters.priceRange.split('-')
        const min = parseInt(minStr, 10)
        const max = maxStr ? parseInt(maxStr, 10) : null

        if (!isNaN(min)) {
          query = query.gte('price', min)
        }
        if (max !== null && !isNaN(max)) {
          query = query.lte('price', max)
        } else if (maxStr === undefined && !isNaN(min)) { // For ranges like "5000000+"
           // This case is already handled by gte if max is null/undefined. No specific 'else' needed if it's just a minimum.
        }
      }

      // Apply bedrooms filter
      if (currentFilters.bedrooms && currentFilters.bedrooms !== 'any') {
        const minBedrooms = parseInt(currentFilters.bedrooms)
        if (!isNaN(minBedrooms)) {
          query = query.gte('bedrooms', minBedrooms)
        }
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
      setProperties([]) // Clear properties on error
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
          
          <div className="mb-6">
            {/* Pass current filters to SearchFilters so it displays them */}
            <SearchFilters onSearch={handleSearch} initialFilters={filters} />
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
              <HomeIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
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
