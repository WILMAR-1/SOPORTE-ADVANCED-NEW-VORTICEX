"use client";

import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // No hash links exist in app/page.tsx, so no scrolling logic needed for now.

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png" alt="ITLA Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-white">ITLA Soporte Estudiantil</span>
            </div>
            <p className="text-gray-400 mb-4">
              Plataforma de soporte para estudiantes del ITLA.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Seguir en Facebook">
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Seguir en Twitter">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Seguir en Instagram">
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Seguir en YouTube">
                <Youtube className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Seguir en LinkedIn">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navigation Column - Simplified as no specific sections found */}
          <div>
            <h3 className="text-white font-bold mb-4">Navegación</h3>
            <ul className="space-y-2">
              {/* Keeping a placeholder or general links */}
              <li><Link href="/" className="text-gray-300 hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/estudiante" className="text-gray-300 hover:text-primary transition-colors">Portal Estudiante</Link></li>
              <li><Link href="/admin" className="text-gray-300 hover:text-primary transition-colors">Portal Administrativo</Link></li>
            </ul>
          </div>

          {/* Legal Column - Removed as no specific pages found */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              {/* Keeping placeholder for legal if needed later, but no specific links */}
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Términos de Servicio</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 mt-0.5 text-secondary" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href="mailto:soporte@itla.edu.do" className="text-gray-200 hover:text-primary hover:underline transition-colors">
                    soporte@itla.edu.do
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 mt-0.5 text-secondary" />
                <div>
                  <p className="text-sm text-gray-400">Teléfono</p>
                  <a href="tel:+18097384852" className="text-gray-200 hover:text-primary hover:underline transition-colors">
                    (809) 738-4852
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaWhatsapp className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <a href="https://wa.me/18097384852" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-primary hover:underline transition-colors">
                     (809) 738-4852
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-secondary" />
                <div>
                  <p className="text-sm text-gray-400">Ubicación</p>
                  <p>Santo Domingo, República Dominicana</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p className="mb-1">© {currentYear} ITLA. Todos los derechos reservados.</p>
            </div>
            {/* Legal links removed as pages do not exist */}
            <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">Política de Privacidad</a>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
