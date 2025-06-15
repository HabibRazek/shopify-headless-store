'use client';

import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-green-600 text-white py-2 px-4 fixed top-0 left-0 right-0 z-50 shadow-sm hidden sm:block">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm">
          {/* Left side - Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 mb-1 sm:mb-0">
            {/* Location */}
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">Nabeul, Tunisie</span>
            </div>
            
            {/* Phone Numbers */}
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>+216 50 095 115 / 20 387 333</span>
            </div>
            
            {/* Email */}
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              <a 
                href="mailto:contact@packedin.tn" 
                className="hover:text-green-200 transition-colors"
              >
                contact@packedin.tn
              </a>
            </div>
          </div>
          
          {/* Right side - Social Media */}
          <div className="flex items-center gap-3">
            <a 
              href="https://www.facebook.com/search/top?q=packedin.tn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-200 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a 
              href="https://www.instagram.com/packedin.tn/?fbclid=IwY2xjawK7765leHRuA2FlbQIxMABicmlkETFFcXlUZllPVGE5dXRmWXlvAR56MyK3IOPJiH8Izak9lCRwJjl3J9iSKntIABqh1VNQRcv-QwhAWnpodLQALA_aem_sNu9ZJ26oFcMnyYGb1rJsw#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-200 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
