"use client";

import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Crown,
  Globe,
  Server,
  Cpu,
  GraduationCap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

const supportTeams = [
  { name: "Supremo Digital", icon: Crown },
  { name: "Globalizador", icon: Globe },
  { name: "Operaciones TICs", icon: Server },
  { name: "Tecnologia IT", icon: Cpu },
  { name: "DTE", icon: GraduationCap },
  { name: "CiberSeguridad", icon: ShieldCheck },
  { name: "Pasantes", icon: UserCheck },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002855] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/itla-logo-white.png"
                alt="ITLA Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-white">ITLA Soporte</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Plataforma de soporte tecnico y academico para estudiantes del Instituto Tecnologico de Las Americas.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/ITLARD/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/itlard/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@ITLARD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/school/itla/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-white font-bold mb-4">Navegacion</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/estudiante" className="text-gray-300 hover:text-white transition-colors">
                  Portal Estudiante
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-white hover:text-gray-300 transition-colors">
                  Portal Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Team Column */}
          <div>
            <h3 className="text-white font-bold mb-4">Equipo de Soporte</h3>
            <ul className="space-y-2">
              {supportTeams.map((team) => {
                const IconComponent = team.icon;
                return (
                  <li key={team.name} className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-400 text-sm">{team.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Column - Expanded */}
          <div>
            <h3 className="text-white font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a
                    href="mailto:soporte@itla.edu.do"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    soporte@itla.edu.do
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Telefono</p>
                  <a
                    href="tel:+18097384852"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    (809) 738-4852
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaWhatsapp className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                  <a
                    href="https://wa.me/18097384852"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    (809) 738-4852
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Ubicacion</p>
                  <a
                    href="https://www.google.com/maps/place/Instituto+Tecnol%C3%B3gico+de+Las+Am%C3%A9ricas+(ITLA)/@18.4513293,-69.6626983,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    La Caleta, Boca Chica
                  </a>
                  <p className="text-gray-400 text-xs">Republica Dominicana</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              {currentYear} Instituto Tecnologico de Las Americas (ITLA). Todos los derechos reservados.
            </p>
            <p className="text-gray-600 text-xs mt-2 md:mt-0">
              Sistema de Soporte Estudiantil v2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
