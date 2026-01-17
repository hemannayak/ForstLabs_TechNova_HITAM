import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Globe, Shield, Users, Rocket } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-indigo-900 text-white py-24">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-900/80"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-800 border border-indigo-700 text-indigo-200 text-sm font-semibold mb-6">
                            Frost Labs Hackathon 2026
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Building Smart Cities with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">CivicSense</span>
                        </h1>
                        <p className="text-xl text-indigo-200 max-w-3xl mx-auto leading-relaxed">
                            CivicSense is an AI-powered platform designed to bridge the gap between citizens and authorities.
                            Built by Team Technova for the Frost Labs Hackathon.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            We believe that every citizen has the power to improve their community. Our goal is to make civic reporting effortless, transparent, and actionable using cutting-edge technology.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            By leveraging Google's powerful ecosystem, including Maps and Gemini AI, we ensure that every report is verified, accurately located, and prioritized for rapid resolution.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-3xl transform rotate-3"></div>
                        <img
                            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                            alt="Community collaboration"
                            className="relative rounded-3xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Tech Stack - Google Emphasis */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Google Cloud & AI</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We leverage the best of Google's technology stack to deliver a robust, scalable, and intelligent platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Brain, title: 'Google Gemini Vision', desc: 'Advanced AI analysis to detect issue types, severity, and risks from images automatically.', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: Globe, title: 'Google Maps Platform', desc: ' precise geolocation, interactive live maps, and clustering for visualization.', color: 'text-green-600', bg: 'bg-green-50' },
                            { icon: Shield, title: 'Firebase', desc: 'Real-time database, secure authentication, and cloud functions for instant updates.', color: 'text-amber-600', bg: 'bg-amber-50' }
                        ].map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mb-6`}>
                                    <item.icon className={`w-8 h-8 ${item.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <Users className="w-12 h-12 mx-auto mb-6 text-indigo-300" />
                        <h2 className="text-3xl font-bold mb-4">Built with ❤️ by Team Technova</h2>
                        <p className="text-indigo-200 mb-8 font-medium">HITAM Students • Frost Labs Hackathon 2026</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Hemanth', 'Full Stack Dev', 'AI Engineer'].map((role) => (
                                <span key={role} className="px-4 py-2 bg-indigo-800/50 backdrop-blur-sm rounded-lg text-sm border border-indigo-700">
                                    {role}
                                </span>
                            ))}
                            <span className="px-4 py-2 bg-white text-indigo-900 rounded-lg text-sm font-bold flex items-center">
                                <Rocket className="w-4 h-4 mr-2" />
                                Innovation Driven
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
