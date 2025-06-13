
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  type: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleClick = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {property.type}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-blue-600 hover:bg-blue-700">
            Featured
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(property.price)}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="font-semibold text-foreground">{property.beds}</div>
            <div>Beds</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{property.baths}</div>
            <div>Baths</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{property.sqft.toLocaleString()}</div>
            <div>Sq Ft</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
