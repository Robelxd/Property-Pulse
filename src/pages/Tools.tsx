
import React from 'react'
import Navigation from '@/components/Navigation'
import PropertyMap from '@/components/PropertyMap'
import MortgageCalculator from '@/components/MortgageCalculator'

const Tools = () => {
  // Sample properties for the map
  const sampleProperties = [
    {
      id: 1,
      title: "Modern Downtown Condo",
      price: 850000,
      location: "Downtown, San Francisco",
    },
    {
      id: 2,
      title: "Luxury Family Home",
      price: 1250000,
      location: "Suburb Hills, CA",
    },
    {
      id: 3,
      title: "Waterfront Villa",
      price: 2100000,
      location: "Marina District, CA",
    },
    {
      id: 4,
      title: "Cozy Starter Home",
      price: 650000,
      location: "Oak Valley, CA",
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Real Estate Tools</h1>
          <p className="text-muted-foreground">
            Explore properties on the map and calculate mortgage payments
          </p>
        </div>

        <div className="space-y-8">
          {/* Interactive Map Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Property Map</h2>
            <PropertyMap properties={sampleProperties} />
          </section>

          {/* Mortgage Calculator Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Mortgage Calculator</h2>
            <MortgageCalculator />
          </section>
        </div>
      </div>
    </div>
  )
}

export default Tools
