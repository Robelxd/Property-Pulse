
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Square } from 'lucide-react'
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
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={getPrimaryImage()}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {getPropertyType()}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-2 left-2 ml-20">
            <Badge className="bg-blue-600">Featured</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <FavoriteButton propertyId={String(id)} />
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{getDisplayLocation()}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(price)}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{getBedrooms()} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{getBathrooms()} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{getSquareFeet()?.toLocaleString()} sq ft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyCard
