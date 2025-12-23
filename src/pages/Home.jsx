import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { 
    Search, Home as HomeIcon, MessageSquare, Sparkles, 
    ArrowRight, Building2, Users, Zap, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <div className="min-h-screen bg-stone-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50" />
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#295646]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-stone-200">
                            <Sparkles className="w-4 h-4 text-[#295646]" />
                            <span className="text-sm font-medium text-stone-700">AI-Powered Real Estate Discovery</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-6 tracking-tight">
                            Stop searching.
                            <br />
                            <span className="bg-gradient-to-r from-[#295646] to-[#295646] bg-clip-text text-transparent">
                                Start briefing.
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-stone-600 mb-10 leading-relaxed">
                            Tell Acre what you're looking for. No filters, no endless scrolling.
                            <br className="hidden md:block" />
                            Just a conversation that finds you the perfect place.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to={createPageUrl('AcreChat')}>
                                <Button size="lg" className="bg-[#295646] hover:bg-[#1f4035] text-lg h-14 px-8 rounded-full shadow-lg shadow-[#295646]/20">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Talk to Acre
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to={createPageUrl('KeyChat')}>
                                <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-2">
                                    <Building2 className="w-5 h-5 mr-2" />
                                    List with Key
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-stone-900 mb-4">How it works</h2>
                        <p className="text-xl text-stone-600">Finding your next home in three simple steps</p>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: MessageSquare,
                                title: 'Brief Acre',
                                description: 'Have a 5-minute conversation about what matters to you. No forms, no filters.',
                                color: 'custom'
                            },
                            {
                                step: '02',
                                icon: Search,
                                title: 'Acre Searches',
                                description: 'Acre scans listings across the web 24/7, finding places that actually match your needs.',
                                color: 'blue'
                            },
                            {
                                step: '03',
                                icon: HomeIcon,
                                title: 'Review & Visit',
                                description: 'See curated matches on your personal board with AI explanations for each pick.',
                                color: 'purple'
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative group"
                            >
                                <div className="bg-stone-50 rounded-3xl p-8 h-full border border-stone-100 hover:border-stone-200 transition-all hover:shadow-lg">
                                    <span className="text-6xl font-bold text-stone-100 absolute top-6 right-6">
                                        {item.step}
                                    </span>
                                    <div className={`w-14 h-14 rounded-2xl ${item.color === 'custom' ? 'bg-[#295646]/10' : `bg-${item.color}-100`} flex items-center justify-center mb-6`}>
                                        <item.icon className={`w-7 h-7 ${item.color === 'custom' ? 'text-[#295646]' : `text-${item.color}-600`}`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-stone-900 mb-3">{item.title}</h3>
                                    <p className="text-stone-600 leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Two Agents Section */}
            <section className="py-24 bg-stone-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Acre Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-[#295646] to-[#1f4035] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Meet Acre</h3>
                                <p className="text-emerald-100 text-lg mb-6 leading-relaxed">
                                    Your personal property-finding assistant. Tell Acre what you want, 
                                    and it will search the web, qualify listings, and present you with 
                                    high-intent matches.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {['Conversational discovery', 'Remembers your preferences', 'Searches 24/7', 'Explains every match'].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#66b399]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to={createPageUrl('AcreChat')}>
                                    <Button size="lg" className="bg-white text-[#295646] hover:bg-[#295646]/5 rounded-full">
                                        Talk to Acre
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Key Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Meet Key</h3>
                                <p className="text-amber-100 text-lg mb-6 leading-relaxed">
                                    Your listing assistant. Tell Key about your property, set up 
                                    vetting questions, and receive pre-qualified leads who've already 
                                    been screened.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {['Easy listing intake', 'Smart lead vetting', 'Pre-qualified seekers', 'Save time on inquiries'].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-amber-200" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to={createPageUrl('KeyChat')}>
                                    <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 rounded-full">
                                        List with Key
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-stone-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to find your place?
                        </h2>
                        <p className="text-xl text-stone-400 mb-10">
                            Skip the endless scrolling. Have a conversation instead.
                        </p>
                        <Link to={createPageUrl('AcreChat')}>
                            <Button size="lg" className="bg-[#295646] hover:bg-[#1f4035] text-lg h-14 px-10 rounded-full">
                                Start Talking to Acre
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-50 border-t border-stone-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#295646] rounded-xl flex items-center justify-center">
                                <HomeIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-stone-900">Acre & Key</span>
                        </div>
                        <p className="text-stone-500 text-sm">
                            © 2024 Acre & Key. AI-powered real estate discovery.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}