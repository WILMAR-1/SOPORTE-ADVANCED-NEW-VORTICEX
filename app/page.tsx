import Link from "next/link"
import { GraduationCap, Shield, Headphones, Clock, CheckCircle, Users, Zap, Lock } from "lucide-react"
import Footer from "@/components/ui/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002855] via-[#003876] to-[#004a99]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl">
                <img
                  src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png"
                  alt="ITLA Logo"
                  className="h-10 w-auto"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg">Centro de Soporte</h1>
                <p className="text-blue-200 text-xs">Instituto Tecnológico de Las Américas</p>
              </div>
            </div>
            <nav className="flex items-center gap-3">
              <Link
                href="/estudiante"
                className="px-5 py-2.5 bg-[#f9b233] hover:bg-[#e6a020] text-[#002855] font-bold rounded-xl transition-all text-sm shadow-lg hover:shadow-xl"
              >
                Portal Estudiante
              </Link>
              <Link
                href="/admin"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all text-sm border border-white/20 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Acceso Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight text-balance">
            Soporte Estudiantil
            <span className="block text-[#f9b233]">Rápido y Eficiente</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Resolvemos tus problemas técnicos y académicos. Crea una solicitud y nuestro equipo te ayudará en el menor
            tiempo posible.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Student Portal Card */}
          <Link href="/estudiante" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#f9b233]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#003876] to-[#004a99] rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#002855]">Portal Estudiante</h3>
                  <p className="text-slate-500 font-medium">Crea y da seguimiento a tus solicitudes</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Recuperación de contraseñas (SIGEI, Correo, Plataforma)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Problemas de redes, equipos y software</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Solicitudes académicas y más</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-[#003876] font-bold group-hover:underline">Acceder al portal</span>
                <div className="w-10 h-10 bg-[#f9b233] rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-md">
                  <svg className="w-5 h-5 text-[#002855]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Portal Card */}
          <Link href="/admin" className="group">
            <div className="bg-[#002855] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#f9b233]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f9b233] to-[#e6a020] rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-[#002855]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Portal Administrativo</h3>
                  <p className="text-blue-200 font-medium">Solo personal autorizado</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className="w-5 h-5 text-[#f9b233]" />
                  <span>Dashboard en tiempo real</span>
                </li>
                <li className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className="w-5 h-5 text-[#f9b233]" />
                  <span>Gestión por roles y categorías</span>
                </li>
                <li className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className="w-5 h-5 text-[#f9b233]" />
                  <span>Reportes y descarga de PDF</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-[#f9b233] font-bold group-hover:underline">Iniciar sesión segura</span>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
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
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
            <Headphones className="w-8 h-8 text-[#f9b233] mx-auto mb-3" />
            <p className="text-3xl font-black text-white">24/7</p>
            <p className="text-blue-200 text-sm font-medium">Soporte Disponible</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
            <Clock className="w-8 h-8 text-[#f9b233] mx-auto mb-3" />
            <p className="text-3xl font-black text-white">{"<"}24h</p>
            <p className="text-blue-200 text-sm font-medium">Tiempo de Respuesta</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
            <Zap className="w-8 h-8 text-[#f9b233] mx-auto mb-3" />
            <p className="text-3xl font-black text-white">95%</p>
            <p className="text-blue-200 text-sm font-medium">Casos Resueltos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
            <Users className="w-8 h-8 text-[#f9b233] mx-auto mb-3" />
            <p className="text-3xl font-black text-white">5000+</p>
            <p className="text-blue-200 text-sm font-medium">Estudiantes Atendidos</p>
          </div>
        </div>

        {/* Roles Info */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Equipo de Soporte</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: "Supremo Digital", color: "bg-amber-500" },
              { name: "Globalizador", color: "bg-purple-500" },
              { name: "Operaciones TICs", color: "bg-blue-500" },
              { name: "Tecnología IT", color: "bg-cyan-500" },
              { name: "DTE", color: "bg-emerald-500" },
              { name: "CiberSeguridad", color: "bg-red-500" },
              { name: "Pasantes", color: "bg-slate-500" },
            ].map((role) => (
              <div key={role.name} className="text-center">
                <div className={`w-3 h-3 ${role.color} rounded-full mx-auto mb-2`}></div>
                <p className="text-blue-200 text-xs font-medium">{role.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
