import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"] 
});

export const metadata: Metadata = {
  title: "ITLA Soporte Estudiantil",
  description: "Sistema de gestión de tickets y soporte técnico del Instituto Tecnológico de Las Américas",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <div className="background-effect" />
        {children}
      </body>
    </html>
  )
}
