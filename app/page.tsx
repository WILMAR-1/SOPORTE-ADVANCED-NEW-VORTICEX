import Link from "next/link"
import { GraduationCap, Shield, Headset, Clock, CheckCircle, Users, Zap, Lock } from "lucide-react"
import Footer from "@/components/ui/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/itla-logo.png"
                alt="ITLA Logo"
                className="h-14 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-[#003d7f] font-bold text-base">Centro de Soporte</h1>
                <p className="text-gray-500 text-xs">ITLA</p>
              </div>
            </Link>
            <nav className="flex items-center gap-2">
              <Link
                href="/estudiante"
                className="px-4 py-2 bg-[#003d7f] hover:bg-[#002855] text-white font-semibold rounded-lg transition-all text-sm shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Portal Estudiante</span>
                <span className="sm:hidden">Estudiante</span>
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-lg transition-all text-sm shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Acceso Admin</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-balance">
            <span className="relative inline-block">
              <span className="text-[#0350a3] bg-clip-text" style={{maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'}}>Soporte Estudiantil</span>
              <Headset className="absolute -right-6 md:-right-10 -top-2 w-8 h-8 md:w-12 md:h-12 text-[#dc2626] rotate-12 drop-shadow-md" />
            </span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-[#003d7f] to-[#003d7f]/50 rounded-full"></div>
            <span className="text-muted-foreground font-semibold text-lg md:text-xl tracking-wide">Rapido y Eficiente</span>
            <div className="h-1 w-12 bg-gradient-to-l from-[#dc2626] to-[#dc2626]/50 rounded-full"></div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Resolvemos tus problemas tecnicos y academicos. Crea una solicitud y nuestro equipo te ayudara en el menor
            tiempo posible.
          </p>
        </div>

        {/* Portal Cards - Yin-Yang Design */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Student Portal Card - Tema Azul */}
          <Link href="/estudiante" className="group">
            <div className="bg-card rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#003d7f] h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#003d7f] rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#003d7f]">Portal Estudiante</h3>
                  <p className="text-muted-foreground font-medium">Crea y da seguimiento a tus solicitudes</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-[#003d7f] flex-shrink-0" />
                  <span>Recuperacion de contrasenas (SIGEI, Correo, Plataforma)</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-[#003d7f] flex-shrink-0" />
                  <span>Problemas de redes, equipos y software</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-[#003d7f] flex-shrink-0" />
                  <span>Solicitudes academicas y mas</span>
                </li>
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-[#003d7f] font-bold group-hover:underline">Acceder al portal</span>
                <div className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Portal Card - Tema Rojo */}
          <Link href="/admin" className="group">
            <div className="bg-card rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#dc2626] h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#dc2626] rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#dc2626]">Portal Administrativo</h3>
                  <p className="text-muted-foreground font-medium">Gestion de tickets y soporte tecnico</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
                  <span>Dashboard en tiempo real</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
                  <span>Gestion por roles y categorias</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
                  <span>Reportes y descarga de PDF</span>
                </li>
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-[#dc2626] font-bold group-hover:underline">Iniciar sesion segura</span>
                <div className="w-10 h-10 bg-[#003d7f] rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-card backdrop-blur-sm rounded-2xl p-6 text-center border border-border">
            <Headset className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-black text-foreground">24/7</p>
            <p className="text-muted-foreground text-sm font-medium">Soporte Disponible</p>
          </div>
          <div className="bg-card backdrop-blur-sm rounded-2xl p-6 text-center border border-border">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-black text-foreground">{"<"}24h</p>
            <p className="text-muted-foreground text-sm font-medium">Tiempo de Respuesta</p>
          </div>
          <div className="bg-card backdrop-blur-sm rounded-2xl p-6 text-center border border-border">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-black text-foreground">95%</p>
            <p className="text-muted-foreground text-sm font-medium">Casos Resueltos</p>
          </div>
          <div className="bg-card backdrop-blur-sm rounded-2xl p-6 text-center border border-border">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-black text-foreground">5000+</p>
            <p className="text-muted-foreground text-sm font-medium">Estudiantes Atendidos</p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
