import React from 'react';
import { Heart, Github, Mail, Twitter, Linkedin, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo.png"
                alt="CivicSense Logo"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-white tracking-tight">CivicSense</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Empowering citizens to build better cities through AI-driven reporting and community action.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/report" className="text-sm hover:text-indigo-400 transition-colors">Report Issue</Link>
              </li>
              <li>
                <Link to="/map" className="text-sm hover:text-indigo-400 transition-colors">Live Map</Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm hover:text-indigo-400 transition-colors">Leaderboard</Link>
              </li>
              <li>
                <Link to="/analytics" className="text-sm hover:text-indigo-400 transition-colors">City Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-indigo-400 transition-colors">About Us</Link>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-indigo-400 transition-colors">Community Guidelines</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-indigo-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <Link to="/admin-login" className="text-sm hover:text-indigo-400 transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-indigo-500 mr-2 shrink-0" />
                <span className="text-sm">Team Technova, HITAM<br />Hyderabad, India</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-indigo-500 mr-2 shrink-0" />
                <a href="mailto:team@civicsense.org" className="text-sm hover:text-indigo-400">team@civicsense.org</a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-indigo-500 mr-2 shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2026 CivicSense. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-4 md:mt-0 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 mx-1 fill-red-500 animate-pulse" />
            <span>by</span>
            <span className="font-semibold text-indigo-400 ml-1">Team Technova</span>
            <span className="mx-2 text-slate-700">|</span>
            <span>CivicTech Hackathon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;