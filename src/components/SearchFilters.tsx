
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSearch = () => {
    const searchParams = {
      location,
      propertyType,
      priceRange,
      bedrooms
    };
    onSearch(JSON.stringify(searchParams));
    console.log("Search params:", searchParams);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Enter location, city, or address..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12"
            />
          </div>
          
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-500000">Under $500K</SelectItem>
              <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
              <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
              <SelectItem value="2000000-5000000">$2M - $5M</SelectItem>
              <SelectItem value="5000000+">$5M+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1+ Bed</SelectItem>
              <SelectItem value="2">2+ Beds</SelectItem>
              <SelectItem value="3">3+ Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
              <SelectItem value="5">5+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            onClick={handleSearch}
            size="lg" 
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Properties
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
