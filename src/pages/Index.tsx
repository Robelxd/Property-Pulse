
import { useState } from "react";
import { Search, MapPin, Home as HomeIconLucide, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  // Sample property data
  const featuredProperties = [
    {
      id: 1,
      title: "Modern Downtown Condo",
      price: 850000,
      location: "Downtown, San Francisco",
      beds: 2,
      baths: 2,
      sqft: 1200,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      type: "Condo"
    },
    {
      id: 2,
      title: "Luxury Family Home",
      price: 1250000,
      location: "Suburb Hills, CA",
      beds: 4,
      baths: 3,
      sqft: 2800,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      type: "House"
    },
    {
      id: 3,
      title: "Waterfront Villa",
      price: 2100000,
      location: "Marina District, CA",
      beds: 5,
      baths: 4,
      sqft: 3500,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      type: "Villa"
    },
    {
      id: 4,
      title: "Cozy Starter Home",
      price: 650000,
      location: "Oak Valley, CA",
      beds: 3,
      baths: 2,
      sqft: 1600,
      image: "https://images.unsplash.com/photo-1502005229762-cf1b2da27a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      type: "House"
    }
  ];

  const stats = [
    { icon: HomeIconLucide, label: "Properties Sold", value: "2,500+" },
    { icon: Users, label: "Happy Clients", value: "1,200+" },
    { icon: MapPin, label: "Cities Covered", value: "50+" }
  ];

  const handleHomePageSearch = (searchParamsJSON: string) => {
    navigate(`/all-properties?filters=${encodeURIComponent(searchParamsJSON)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Search Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Find Your Dream Home</h2>
            <SearchFilters onSearch={handleHomePageSearch} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured-properties" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties that offer exceptional value and lifestyle.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                id={property.id}
                title={property.title}
                price={property.price}
                location={property.location}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                image={property.image}
                type={property.type}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => navigate('/all-properties')}
            >
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our expert team is here to guide you through every step of your real estate journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Contact an Agent
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Schedule a Tour
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
