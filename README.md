# ITLA Soporte Estudiantil

Sistema de gestion de tickets y soporte tecnico para estudiantes del Instituto Tecnologico de Las Americas (ITLA).

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

---

## Descripcion

Plataforma web que permite a los estudiantes del ITLA crear y dar seguimiento a solicitudes de soporte tecnico y academico. El sistema cuenta con dos portales:

- **Portal Estudiante**: Crear tickets, seguimiento de solicitudes, recuperacion de credenciales
- **Portal Administrativo**: Dashboard, gestion de tickets, asignacion por roles, reportes

---

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS 4
- **Lenguaje**: TypeScript
- **Iconos**: Lucide React
- **Fuente**: Poppins (Google Fonts)
- **UI Components**: Radix UI

---

## Instalacion

### Requisitos

- Node.js 18+
- pnpm (recomendado) o npm

### Pasos

```bash
# Clonar repositorio
git clone <url-repositorio>
cd itlasoporteestudiantil

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

La aplicacion estara disponible en `http://localhost:3000`

---

## Estructura del Proyecto

```
itlasoporteestudiantil/
├── app/
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout raiz
│   ├── page.tsx          # Pagina principal
│   ├── icon.png          # Favicon
│   ├── estudiante/       # Portal estudiante
│   │   └── page.tsx
│   └── admin/            # Portal admin
│       └── page.tsx
├── components/
│   ├── ui/               # Componentes UI reutilizables
│   │   ├── Footer.tsx
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── student/          # Componentes portal estudiante
│   │   ├── student-auth.tsx
│   │   ├── student-header.tsx
│   │   └── student-sidebar.tsx
│   └── admin/            # Componentes portal admin
│       ├── admin-auth.tsx
│       ├── admin-header.tsx
│       └── admin-sidebar.tsx
├── lib/
│   ├── store.ts          # Estado global
│   └── types.ts          # Tipos TypeScript
├── public/
│   ├── itla-logo.png     # Logo principal
│   └── itla-logo-white.png # Logo blanco (footer)
├── STYLE-GUIDE.md        # Guia de estilos
└── README.md
```

---

## Rutas

| Ruta | Descripcion |
|------|-------------|
| `/` | Pagina principal con acceso a portales |
| `/estudiante` | Portal de estudiantes (login/registro + dashboard) |
| `/admin` | Portal administrativo (login + dashboard) |

---

## Caracteristicas

### Portal Estudiante
- Registro con correo institucional (@itla.edu.do)
- Creacion de tickets de soporte
- Seguimiento de estado de solicitudes
- Historial de tickets

### Portal Administrativo
- Login seguro para personal autorizado
- Dashboard con metricas en tiempo real
- Gestion de tickets por categoria
- Asignacion por roles (Supremo Digital, Globalizador, etc.)
- Generacion de reportes PDF

---

## Sistema de Diseno

El proyecto usa un sistema de diseno **yin-yang** con dos colores principales:

| Color | Hex | Uso |
|-------|-----|-----|
| Azul ITLA | `#003d7f` | Portal estudiante |
| Rojo ITLA | `#dc2626` | Portal admin |

Para mas detalles, consulta [STYLE-GUIDE.md](./STYLE-GUIDE.md)

---

## Equipos de Soporte

- Supremo Digital
- Globalizador
- Operaciones TICs
- Tecnologia IT
- DTE
- CiberSeguridad
- Pasantes

---

## Scripts

```bash
# Desarrollo
pnpm dev

# Build produccion
pnpm build

# Iniciar produccion
pnpm start

# Linting
pnpm lint
```

---

## Configuracion

### Variables de Entorno

Crear archivo `.env.local`:

```env
# Base de datos (si aplica)
DATABASE_URL=

# API Keys (si aplica)
NEXT_PUBLIC_API_URL=
```

---

## Contribucion

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Contacto

- **Email**: soporte@itla.edu.do
- **Telefono**: (809) 738-4852
- **Ubicacion**: La Caleta, Boca Chica, Republica Dominicana

### Redes Sociales

- [Facebook](https://www.facebook.com/ITLARD/)
- [Instagram](https://www.instagram.com/itlard/)
- [YouTube](https://www.youtube.com/@ITLARD)
- [LinkedIn](https://www.linkedin.com/school/itla/)

---

## Licencia

Este proyecto es propiedad del Instituto Tecnologico de Las Americas (ITLA).

---

Desarrollado con Next.js y Tailwind CSS
