
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

interface Property {
  id: string | number
  title: string
  price: number
  location: string
  latitude?: number
  longitude?: number
}

interface PropertyMapProps {
  properties: Property[]
}

const PropertyMap = ({ properties }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapboxToken, setMapboxToken] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(true)

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return

    mapboxgl.accessToken = mapboxToken
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-122.4194, 37.7749], // San Francisco center
      zoom: 11
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add property markers
    properties.forEach((property) => {
      const lat = property.latitude || 37.7749 + (Math.random() - 0.5) * 0.1
      const lng = property.longitude || -122.4194 + (Math.random() - 0.5) * 0.1

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${property.title}</h3>
            <p class="text-sm text-gray-600">${property.location}</p>
            <p class="font-bold text-blue-600">$${property.price.toLocaleString()}</p>
          </div>
        `)

      new mapboxgl.Marker({ color: '#2563eb' })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!)
    })

    setShowTokenInput(false)
  }

  useEffect(() => {
    return () => {
      map.current?.remove()
    }
  }, [])

  if (showTokenInput) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Map Setup Required</h3>
          <p className="text-muted-foreground mb-4">
            To display the interactive map, please enter your Mapbox public token.
            You can get one from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Enter Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={initializeMap} disabled={!mapboxToken}>
              Load Map
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}

export default PropertyMap
