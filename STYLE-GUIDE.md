# Guia de Estilos - ITLA Soporte Estudiantil

Sistema de diseno para la plataforma de soporte estudiantil del Instituto Tecnologico de Las Americas.

---

## Paleta de Colores

### Colores Institucionales ITLA

| Color | Hex | Uso |
|-------|-----|-----|
| Azul ITLA | `#003d7f` | Color principal estudiantes, titulos, enlaces |
| Azul Oscuro | `#002855` | Footer, headers oscuros, hover azul |
| Azul Claro | `#0056b3` | Acentos, gradientes |
| Rojo ITLA | `#dc2626` | Color principal admin, alertas, CTA |
| Rojo Oscuro | `#b91c1c` | Hover rojo, estados activos |

### Sistema Yin-Yang

El diseno usa un concepto de **yin-yang** donde:
- **Azul** = Portal Estudiante (conocimiento, confianza)
- **Rojo** = Portal Administrativo (accion, urgencia)

Los colores se complementan y crean contraste visual:
- Boton estudiante: fondo azul, flecha roja
- Boton admin: fondo rojo, flecha azul

### Variables CSS

```css
:root {
  --itla-blue: #003d7f;
  --itla-blue-dark: #002855;
  --itla-blue-light: #0056b3;
  --itla-red: #dc2626;
  --itla-red-light: #f87171;

  --primary: var(--itla-red);
  --secondary: var(--itla-blue);
  --background: #ffffff;
  --foreground: #0f172a;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
}
```

---

## Tipografia

### Fuente Principal

**Poppins** - Google Fonts

```css
font-family: 'Poppins', sans-serif;
```

### Pesos Disponibles

| Peso | Clase Tailwind | Uso |
|------|----------------|-----|
| 400 | `font-normal` | Texto de parrafos |
| 500 | `font-medium` | Subtitulos, labels |
| 600 | `font-semibold` | Botones, enfasis |
| 700 | `font-bold` | Titulos secundarios |
| 800 | `font-extrabold` | Titulos principales |
| 900 | `font-black` | Hero titles, impacto |

### Tamanos de Texto

| Elemento | Clase | Ejemplo |
|----------|-------|---------|
| Hero Title | `text-4xl md:text-6xl font-black` | "Soporte Estudiantil" |
| Section Title | `text-2xl font-bold` | "Portal Estudiante" |
| Card Title | `text-xl font-bold` | Titulos de tarjetas |
| Body | `text-base` | Texto general |
| Small | `text-sm` | Descripciones, meta |
| Caption | `text-xs` | Labels, footnotes |

---

## Espaciado

### Sistema de Espaciado (Tailwind)

| Clase | Valor | Uso |
|-------|-------|-----|
| `p-4` | 16px | Padding cards pequenos |
| `p-6` | 24px | Padding cards medianos |
| `p-8` | 32px | Padding cards grandes |
| `gap-2` | 8px | Espaciado entre items pequenos |
| `gap-4` | 16px | Espaciado entre items |
| `gap-8` | 32px | Espaciado entre secciones |
| `mb-6` | 24px | Margen inferior estandar |
| `mb-16` | 64px | Margen entre secciones grandes |

### Contenedor Principal

```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

---

## Bordes y Radios

### Radio de Esquinas

| Clase | Valor | Uso |
|-------|-------|-----|
| `rounded-lg` | 8px | Botones, inputs |
| `rounded-xl` | 12px | Cards pequenos |
| `rounded-2xl` | 16px | Cards medianos |
| `rounded-3xl` | 24px | Cards principales |
| `rounded-full` | 50% | Avatares, iconos circulares |

### Bordes

```css
border-border  /* Color: #e2e8f0 */
border-b-4     /* Borde inferior enfatizado en cards */
```

---

## Sombras

| Clase | Uso |
|-------|-----|
| `shadow-md` | Botones, elementos elevados |
| `shadow-lg` | Cards, dropdowns |
| `shadow-xl` | Cards destacados |
| `shadow-2xl` | Cards principales, modales |

### Hover States

```css
hover:shadow-lg   /* Elevacion sutil */
hover:shadow-xl   /* Elevacion media */
hover:shadow-2xl  /* Elevacion alta */
```

---

## Componentes

### Botones

#### Boton Primario (Azul - Estudiante)
```html
<button class="px-4 py-2 bg-[#003d7f] hover:bg-[#002855] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
  Texto
</button>
```

#### Boton Secundario (Rojo - Admin)
```html
<button class="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
  Texto
</button>
```

### Cards

#### Card Principal
```html
<div class="bg-card rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#003d7f]">
  <!-- Contenido -->
</div>
```

### Inputs

#### Input Estudiante (focus azul)
```html
<input class="w-full bg-input border-border rounded-xl py-3 px-4 text-foreground font-medium focus:ring-2 focus:ring-[#003d7f]/20 focus:border-[#003d7f] outline-none transition-all" />
```

#### Input Admin (focus rojo)
```html
<input class="w-full bg-input border-border rounded-xl py-3 px-4 text-foreground font-medium focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626] outline-none transition-all" />
```

---

## Animaciones

### Keyframes Disponibles

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes bokeh-breathe-red {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.05; }
  50% { transform: translate(3%, 2%) scale(1.08); opacity: 0.08; }
}

@keyframes bokeh-breathe-blue {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.05; }
  50% { transform: translate(-2%, -3%) scale(1.1); opacity: 0.08; }
}
```

### Clases de Animacion

| Clase | Duracion | Uso |
|-------|----------|-----|
| `animate-fadeIn` | 0.4s | Entrada de elementos |
| `animate-slideIn` | 0.3s | Entrada lateral |
| `transition-all duration-300` | 0.3s | Transiciones hover |

### Efecto de Fondo Bokeh

El fondo usa un efecto sutil de "respiracion" con circulos difuminados:
- Circulo rojo: esquina superior izquierda
- Circulo azul: esquina inferior derecha
- Opacidad: 5-8% (muy sutil)
- Respeta `prefers-reduced-motion`

---

## Iconos

### Libreria

**Lucide React** - https://lucide.dev/icons

### Iconos Principales

| Icono | Uso |
|-------|-----|
| `GraduationCap` | Portal estudiante |
| `Shield` | Portal admin, seguridad |
| `Headset` | Soporte, titulo principal |
| `Lock` | Acceso seguro |
| `CheckCircle` | Listas de caracteristicas |
| `Crown` | Supremo Digital |
| `Globe` | Globalizador |
| `Server` | Operaciones TICs |
| `Cpu` | Tecnologia IT |
| `ShieldCheck` | CiberSeguridad |
| `UserCheck` | Pasantes |

### Tamanos de Iconos

| Clase | Uso |
|-------|-----|
| `w-4 h-4` | Iconos en botones |
| `w-5 h-5` | Iconos en listas |
| `w-8 h-8` | Iconos en cards de stats |
| `w-10 h-10` | Iconos principales |
| `w-12 h-12` | Iconos hero |

---

## Responsive Design

### Breakpoints (Tailwind)

| Prefijo | Min-width | Uso |
|---------|-----------|-----|
| `sm:` | 640px | Tablets pequenas |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Desktop grande |

### Patrones Comunes

```html
<!-- Grid responsive -->
<div class="grid md:grid-cols-2 gap-8">

<!-- Texto responsive -->
<h1 class="text-4xl md:text-6xl">

<!-- Ocultar en movil -->
<span class="hidden sm:inline">Texto completo</span>
<span class="sm:hidden">Corto</span>
```

---

## Accesibilidad

### Colores de Contraste

- Texto sobre fondo blanco: `#0f172a` (ratio > 7:1)
- Texto sobre fondo azul oscuro: `#ffffff` (ratio > 7:1)
- Links: usar `hover:underline` para indicar interactividad

### Focus States

Todos los elementos interactivos deben tener estados de focus visibles:

```css
focus:ring-2 focus:ring-offset-0 outline-none
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .background-effect::before,
  .background-effect::after {
    animation: none;
  }
}
```

---

## Estructura de Archivos

```
app/
  globals.css      # Estilos globales, variables, animaciones
  layout.tsx       # Layout raiz con fuente Poppins
  page.tsx         # Pagina principal
  icon.png         # Favicon
  estudiante/      # Portal estudiante
  admin/           # Portal admin

components/
  ui/
    Footer.tsx     # Footer global
    button.tsx     # Componente boton
    card.tsx       # Componente card
  student/
    student-auth.tsx    # Login estudiante (tema azul)
    student-header.tsx  # Header estudiante
  admin/
    admin-auth.tsx      # Login admin (tema rojo)
    admin-header.tsx    # Header admin

public/
  itla-logo.png        # Logo para contenido
  itla-logo-white.png  # Logo para footer
```

---

## Assets

### Logos

| Archivo | Uso | Fondo |
|---------|-----|-------|
| `/itla-logo.png` | Header, contenido general | Transparente/Blanco |
| `/itla-logo-white.png` | Footer | Oscuro |
| `/app/icon.png` | Favicon | Blanco |

### Redes Sociales ITLA

- Facebook: https://www.facebook.com/ITLARD/
- Instagram: https://www.instagram.com/itlard/
- YouTube: https://www.youtube.com/@ITLARD
- LinkedIn: https://www.linkedin.com/school/itla/

---

## Equipo de Soporte

| Departamento | Icono |
|--------------|-------|
| Supremo Digital | Crown |
| Globalizador | Globe |
| Operaciones TICs | Server |
| Tecnologia IT | Cpu |
| DTE | GraduationCap |
| CiberSeguridad | ShieldCheck |
| Pasantes | UserCheck |
