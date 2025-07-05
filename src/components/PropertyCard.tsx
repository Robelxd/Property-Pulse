
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Square, Heart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FavoriteButton from '@/components/FavoriteButton'

interface PropertyCardProps {
  id: string | number
  title: string
  price: number
  location?: string
  address?: string
  city?: string
  state?: string
  bedrooms?: number
  beds?: number
  bathrooms?: number
  baths?: number
  square_feet?: number
  sqft?: number
  image?: string
  type?: string
  property_type?: string
  featured?: boolean
  property_images?: Array<{
    image_url: string
    is_primary?: boolean
  }>
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  address,
  city,
  state,
  bedrooms,
  beds,
  bathrooms,
  baths,
  square_feet,
  sqft,
  image,
  type,
  property_type,
  featured,
  property_images
}: PropertyCardProps) => {
  const navigate = useNavigate()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getDisplayLocation = () => {
    if (location) return location
    if (address && city && state) return `${address}, ${city}, ${state}`
    if (city && state) return `${city}, ${state}`
    return 'Location not specified'
  }

  const getBedrooms = () => bedrooms || beds || 0
  const getBathrooms = () => bathrooms || baths || 0
  const getSquareFeet = () => square_feet || sqft || 0

  const getPrimaryImage = () => {
    if (image) return image
    if (property_images?.length) {
      const primary = property_images.find(img => img.is_primary)
      return primary?.image_url || property_images[0]?.image_url
    }
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
  }

  const getPropertyType = () => property_type || type || 'Property'

  const handleCardClick = () => {
    navigate(`/property/${id}`)
  }

  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] bg-gradient-to-br from-background to-muted/30 border-0 shadow-lg"
      onClick={handleCardClick}
    >
      {/* Animated background gradient using default colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        {/* Image container with overlay effects */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={getPrimaryImage()}
            alt={title}
            className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* Animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Floating badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge 
              variant="secondary" 
              className="bg-background/95 text-foreground backdrop-blur-sm border-0 shadow-lg transform transition-all duration-300 group-hover:scale-105 hover:bg-background"
            >
              {getPropertyType()}
            </Badge>
            {featured && (
              <Badge className="bg-gradient-to-r from-primary to-primary/80 border-0 shadow-lg transform transition-all duration-300 group-hover:scale-105 animate-pulse">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          {/* Favorite button with enhanced styling */}
          <div className="absolute top-4 right-4 transform transition-all duration-300 group-hover:scale-110">
            <div className="bg-background/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
              <FavoriteButton propertyId={String(id)} />
            </div>
          </div>
          
          {/* Price overlay on image */}
          <div className="absolute bottom-4 left-4 transform transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <span className="text-lg font-bold text-primary">
                {formatPrice(price)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 relative">
        {/* Animated content */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          
          <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">{getDisplayLocation()}</span>
          </div>

          {/* Price - hidden on hover since it shows on image */}
          <div className="flex justify-between items-center mb-4 group-hover:opacity-50 transition-opacity duration-300">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatPrice(price)}
            </span>
          </div>
          
          {/* Property details with enhanced styling using default colors */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center bg-muted rounded-lg p-3 group-hover:bg-primary/10 transition-colors duration-300">
              <Bed className="h-4 w-4 mr-2 text-primary" />
              <div className="text-center">
                <div className="font-semibold text-foreground">{getBedrooms()}</div>
                <div className="text-xs text-muted-foreground">Beds</div>
              </div>
            </div>
            <div className="flex items-center justify-center bg-muted rounded-lg p-3 group-hover:bg-primary/10 transition-colors duration-300">
              <Bath className="h-4 w-4 mr-2 text-primary" />
              <div className="text-center">
                <div className="font-semibold text-foreground">{getBathrooms()}</div>
                <div className="text-xs text-muted-foreground">Baths</div>
              </div>
            </div>
            <div className="flex items-center justify-center bg-muted rounded-lg p-3 group-hover:bg-primary/10 transition-colors duration-300">
              <Square className="h-4 w-4 mr-2 text-primary" />
              <div className="text-center">
                <div className="font-semibold text-foreground">{getSquareFeet()?.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Sq Ft</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated bottom border using primary color */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-primary/60 group-hover:w-full transition-all duration-500" />
      </CardContent>
    </Card>
  )
}

export default PropertyCard
