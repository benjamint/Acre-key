import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
    ChevronLeft, Search, LayoutGrid, List, Heart, 
    Calendar, FileCheck, Sparkles, Home, Filter
} from 'lucide-react';
import { cn } from "@/lib/utils";
import PropertyCard from '@/components/property/PropertyCard';
import PropertyDetail from '@/components/property/PropertyDetail';
import { motion, AnimatePresence } from 'framer-motion';

const statusTabs = [
    { value: 'all', label: 'All', icon: LayoutGrid },
    { value: 'sourced', label: 'Sourced', icon: Sparkles },
    { value: 'interested', label: 'Interested', icon: Heart },
    { value: 'viewing_scheduled', label: 'Viewings', icon: Calendar },
    { value: 'applied', label: 'Applied', icon: FileCheck },
];

export default function PropertyBoard() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [user, setUser] = useState(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await base44.auth.me();
            setUser(currentUser);
        };
        loadUser();
    }, []);

    const { data: properties = [], isLoading } = useQuery({
        queryKey: ['properties', user?.email],
        queryFn: () => base44.entities.Property.filter({ seeker_id: user?.email }, '-match_score'),
        enabled: !!user?.email,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Property.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
    });

    const filteredProperties = properties.filter(prop => {
        const matchesTab = activeTab === 'all' || prop.status === activeTab;
        const matchesSearch = !searchQuery || 
            prop.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.address?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleStatusChange = (propertyId, newStatus) => {
        updateMutation.mutate({ id: propertyId, data: { status: newStatus } });
        if (selectedProperty?.id === propertyId) {
            setSelectedProperty({ ...selectedProperty, status: newStatus });
        }
    };

    const getTabCount = (status) => {
        if (status === 'all') return properties.length;
        return properties.filter(p => p.status === status).length;
    };

    return (
        <div className="min-h-screen bg-stone-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            {/* Header */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link to={createPageUrl('Home')}>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-stone-900">My Property Board</h1>
                                <p className="text-sm text-stone-500">
                                    {properties.length} properties sourced by Acre
                                </p>
                            </div>
                        </div>
                        
                        <Link to={createPageUrl('AcreChat')}>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Talk to Acre
                            </Button>
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <Input
                                placeholder="Search properties..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-full border-stone-300"
                            />
                        </div>
                        
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-stone-100 p-1 rounded-full">
                                {statusTabs.map(tab => (
                                    <TabsTrigger 
                                        key={tab.value} 
                                        value={tab.value}
                                        className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm px-4"
                                    >
                                        <tab.icon className="w-4 h-4 mr-2" />
                                        {tab.label}
                                        <span className="ml-2 text-xs bg-stone-200 px-2 py-0.5 rounded-full">
                                            {getTabCount(tab.value)}
                                        </span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </header>

            {/* Property Grid */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
                        ))}
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Home className="w-10 h-10 text-stone-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-stone-900 mb-2">No properties yet</h3>
                        <p className="text-stone-600 mb-6 max-w-md mx-auto">
                            {activeTab === 'all' 
                                ? "Tell Acre what you're looking for and it will start sourcing properties for you."
                                : `No properties in "${statusTabs.find(t => t.value === activeTab)?.label}" status.`
                            }
                        </p>
                        <Link to={createPageUrl('AcreChat')}>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Brief Acre
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    onClick={() => setSelectedProperty(property)}
                                    onStatusChange={(status) => handleStatusChange(property.id, status)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Property Detail Modal */}
            <PropertyDetail
                property={selectedProperty}
                open={!!selectedProperty}
                onClose={() => setSelectedProperty(null)}
                onStatusChange={(status) => handleStatusChange(selectedProperty?.id, status)}
            />
        </div>
    );
}