
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const navigate = useNavigate();

  // Fetch properties from database - get more than 4 to ensure we have enough
  const { data: allProperties = [], isLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      console.log('Fetching properties from database...');
      
      // First try to get featured properties
      const { data: featuredData, error: featuredError } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            image_url,
            is_primary,
            caption
          )
        `)
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (featuredError) {
        console.error('Error fetching featured properties:', featuredError);
      }

      // If we don't have enough featured properties, get regular active properties
      if (!featuredData || featuredData.length < 4) {
        console.log('Not enough featured properties, fetching regular properties...');
        
        const { data: regularData, error: regularError } = await supabase
          .from('properties')
          .select(`
            *,
            property_images (
              image_url,
              is_primary,
              caption
            )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(8);

        if (regularError) {
          console.error('Error fetching properties:', regularError);
          throw regularError;
        }

        // Combine featured and regular properties, prioritizing featured
        const combined = [
          ...(featuredData || []),
          ...(regularData || []).filter(prop => !featuredData?.some(fp => fp.id === prop.id))
        ];

        console.log('Combined properties:', combined);
        return combined || [];
      }

      console.log('Featured properties:', featuredData);
      return featuredData || [];
    }
  });

  // Always show exactly 4 properties
  const featuredProperties = allProperties.slice(0, 4);

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

      {/* Featured Properties - Fixed to show exactly 4 cards */}
      <section id="featured-properties" className="py-20 bg-gradient-to-br from-background via-muted/20 to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent">
              Featured Properties
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover our handpicked selection of premium properties that offer exceptional value and lifestyle.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="animate-pulse overflow-hidden">
                  <div className="w-full h-64 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded mb-3"></div>
                    <div className="h-4 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded mb-4 w-2/3"></div>
                    <div className="h-8 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded mb-4 w-1/2"></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-6 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                      <div className="h-6 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                      <div className="h-6 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
                {featuredProperties.map((property, index) => (
                  <div 
                    key={property.id}
                    className="animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.15}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    <PropertyCard 
                      id={property.id}
                      title={property.title}
                      price={property.price}
                      address={property.address}
                      city={property.city}
                      state={property.state}
                      bedrooms={property.bedrooms}
                      bathrooms={property.bathrooms}
                      square_feet={property.square_feet}
                      property_type={property.property_type}
                      featured={property.featured}
                      property_images={property.property_images}
                    />
                  </div>
                ))}
              </div>
              {/* Show count indicator */}
              <div className="text-center text-muted-foreground mb-8">
                Showing {featuredProperties.length} of {allProperties.length} available properties
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/60 rounded-full flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">No Properties Available</h3>
                <p className="text-muted-foreground mb-6">We're currently updating our listings. Please check back soon for new premium properties.</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/all-properties')}
                  className="hover:bg-muted border-border"
                >
                  Browse All Properties
                </Button>
              </div>
            </div>
          )}
          
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="px-10 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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