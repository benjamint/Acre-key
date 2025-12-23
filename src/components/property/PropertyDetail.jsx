import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Bed, Bath, Square, MapPin, ExternalLink, Calendar,
    ChevronLeft, ChevronRight, Sparkles, PawPrint, X, MessageSquare
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { cn } from "@/lib/utils";

const statusOptions = [
    { value: 'sourced', label: 'Sourced' },
    { value: 'interested', label: 'Interested' },
    { value: 'viewing_scheduled', label: 'Viewing Scheduled' },
    { value: 'applied', label: 'Applied / Offer Made' },
    { value: 'rejected', label: 'Not Interested' }
];

export default function PropertyDetail({ property, open, onClose, onStatusChange }) {
    const [currentImage, setCurrentImage] = useState(0);
    
    if (!property) return null;
    
    const images = property.images?.length > 0 
        ? property.images 
        : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'];
    
    const formatPrice = (price, type) => {
        if (!price) return 'Price TBD';
        const formatted = price.toLocaleString();
        return type === 'monthly' ? `$${formatted}/mo` : `$${formatted}`;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                {/* Image Gallery */}
                <div className="relative aspect-video bg-stone-100">
                    <img 
                        src={images[currentImage]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                    />
                    
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    {/* Match Score */}
                    {property.match_score && (
                        <div className="absolute bottom-4 left-4">
                            <Badge className="bg-[#295646] text-white border-0 shadow-lg text-sm py-1 px-3">
                                <Sparkles className="w-4 h-4 mr-1.5" />
                                {property.match_score}% Match
                            </Badge>
                        </div>
                    )}
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                        {currentImage + 1} / {images.length}
                    </div>
                </div>

                <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-stone-900 mb-2">
                                {formatPrice(property.price, property.price_type)}
                            </h2>
                            <h3 className="text-xl text-stone-700 mb-2">{property.title}</h3>
                            {property.address && (
                                <p className="flex items-center gap-2 text-stone-600">
                                    <MapPin className="w-4 h-4" />
                                    {property.address}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <label className="text-sm font-medium text-stone-700">Status</label>
                            <Select 
                                value={property.status || 'sourced'} 
                                onValueChange={onStatusChange}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {/* Specs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {property.bedrooms && (
                            <div className="bg-stone-50 rounded-xl p-4 text-center">
                                <Bed className="w-6 h-6 mx-auto mb-2 text-stone-600" />
                                <p className="text-lg font-semibold text-stone-900">{property.bedrooms}</p>
                                <p className="text-sm text-stone-500">Bedrooms</p>
                            </div>
                        )}
                        {property.bathrooms && (
                            <div className="bg-stone-50 rounded-xl p-4 text-center">
                                <Bath className="w-6 h-6 mx-auto mb-2 text-stone-600" />
                                <p className="text-lg font-semibold text-stone-900">{property.bathrooms}</p>
                                <p className="text-sm text-stone-500">Bathrooms</p>
                            </div>
                        )}
                        {property.sqft && (
                            <div className="bg-stone-50 rounded-xl p-4 text-center">
                                <Square className="w-6 h-6 mx-auto mb-2 text-stone-600" />
                                <p className="text-lg font-semibold text-stone-900">{property.sqft.toLocaleString()}</p>
                                <p className="text-sm text-stone-500">Sq Ft</p>
                            </div>
                        )}
                        {property.pets_allowed !== undefined && (
                            <div className="bg-stone-50 rounded-xl p-4 text-center">
                                <PawPrint className="w-6 h-6 mx-auto mb-2 text-stone-600" />
                                <p className="text-lg font-semibold text-stone-900">
                                    {property.pets_allowed ? 'Yes' : 'No'}
                                </p>
                                <p className="text-sm text-stone-500">Pets Allowed</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Match Reasoning */}
                    {property.match_reasoning && (
                        <div className="bg-[#295646]/5 border border-[#295646]/20 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold text-[#295646] mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Why Acre Chose This
                            </h4>
                            <p className="text-[#295646]">{property.match_reasoning}</p>
                        </div>
                    )}
                    
                    {/* Features */}
                    {property.features?.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-semibold text-stone-900 mb-3">Features</h4>
                            <div className="flex flex-wrap gap-2">
                                {property.features.map((feature, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-stone-100">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Description */}
                    {property.description && (
                        <div className="mb-6">
                            <h4 className="font-semibold text-stone-900 mb-3">Description</h4>
                            <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>
                    )}
                    
                    {/* Neighborhood Deep Dive */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mb-6">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-semibold text-stone-900 mb-1 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    Neighborhood Insights
                                </h4>
                                <p className="text-sm text-stone-600">
                                    Want to know about schools, safety, noise levels, and local vibe?
                                </p>
                            </div>
                        </div>
                        <a 
                            href={`${window.location.origin}${createPageUrl('AcreChat')}?neighborhood=${encodeURIComponent(property.address || property.title)}`}
                            onClick={onClose}
                        >
                            <Button variant="outline" className="w-full bg-white hover:bg-blue-50 border-blue-200">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Ask Acre for a Neighborhood Deep Dive
                            </Button>
                        </a>
                    </div>

                    {/* Source Info */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
                        {property.source_url && (
                            <Button 
                                className="flex-1 bg-[#295646] hover:bg-[#1f4035]"
                                onClick={() => window.open(property.source_url, '_blank')}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View on {property.source_platform || 'Original Site'}
                            </Button>
                        )}
                        {property.available_date && (
                            <Button variant="outline" className="flex-1">
                                <Calendar className="w-4 h-4 mr-2" />
                                Available {new Date(property.available_date).toLocaleDateString()}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}