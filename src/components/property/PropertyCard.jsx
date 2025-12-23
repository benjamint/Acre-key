import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Bed, Bath, Square, MapPin, ExternalLink, Heart, 
    ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const statusColors = {
    sourced: 'bg-stone-100 text-stone-700',
    interested: 'bg-[#295646]/10 text-[#295646]',
    viewing_scheduled: 'bg-blue-100 text-blue-700',
    applied: 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700'
};

const statusLabels = {
    sourced: 'Sourced',
    interested: 'Interested',
    viewing_scheduled: 'Viewing Scheduled',
    applied: 'Applied',
    rejected: 'Not Interested'
};

export default function PropertyCard({ property, onStatusChange, onClick }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    const images = property.images?.length > 0 
        ? property.images 
        : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'];
    
    const formatPrice = (price, type) => {
        if (!price) return 'Price TBD';
        const formatted = price.toLocaleString();
        return type === 'monthly' ? `$${formatted}/mo` : `$${formatted}`;
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card 
                className="overflow-hidden cursor-pointer group border-0 shadow-md hover:shadow-xl transition-all duration-300"
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img 
                        src={images[currentImage]} 
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Image Navigation */}
                    {images.length > 1 && isHovered && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    
                    {/* Image Dots */}
                    {images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, idx) => (
                                <span 
                                    key={idx}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-colors",
                                        idx === currentImage ? 'bg-white' : 'bg-white/50'
                                    )}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Match Score */}
                    {property.match_score && (
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-[#295646] text-white border-0 shadow-lg">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {property.match_score}% Match
                            </Badge>
                        </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                        <Badge className={cn("border-0 shadow-lg", statusColors[property.status || 'sourced'])}>
                            {statusLabels[property.status || 'sourced']}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-4">
                    {/* Price */}
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="text-2xl font-bold text-stone-900">
                            {formatPrice(property.price, property.price_type)}
                        </span>
                        {property.property_type && (
                            <span className="text-sm text-stone-500 capitalize">
                                {property.property_type}
                            </span>
                        )}
                    </div>
                    
                    {/* Specs */}
                    <div className="flex items-center gap-4 text-sm text-stone-600 mb-3">
                        {property.bedrooms && (
                            <span className="flex items-center gap-1">
                                <Bed className="w-4 h-4" />
                                {property.bedrooms} bed
                            </span>
                        )}
                        {property.bathrooms && (
                            <span className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                {property.bathrooms} bath
                            </span>
                        )}
                        {property.sqft && (
                            <span className="flex items-center gap-1">
                                <Square className="w-4 h-4" />
                                {property.sqft.toLocaleString()} sqft
                            </span>
                        )}
                    </div>
                    
                    {/* Address */}
                    {property.address && (
                        <p className="flex items-start gap-1.5 text-sm text-stone-600 mb-3">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{property.address}</span>
                        </p>
                    )}
                    
                    {/* Title */}
                    <h3 className="font-semibold text-stone-900 line-clamp-1 mb-3">
                        {property.title}
                    </h3>
                    
                    {/* Match Reasoning */}
                    {property.match_reasoning && (
                        <div className="bg-[#295646]/5 rounded-lg p-3 mb-3">
                            <p className="text-xs text-[#295646] leading-relaxed">
                                <span className="font-medium">Why Acre chose this:</span> {property.match_reasoning}
                            </p>
                        </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                        {property.source_url && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(property.source_url, '_blank');
                                }}
                            >
                                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                View Original
                            </Button>
                        )}
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                                "px-3",
                                property.status === 'interested' && "text-red-500"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange?.(property.status === 'interested' ? 'sourced' : 'interested');
                            }}
                        >
                            <Heart className={cn(
                                "w-4 h-4",
                                property.status === 'interested' && "fill-current"
                            )} />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}