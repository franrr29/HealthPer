# HealthPer — Style Brief for Tailwind v4

## Paleta de colores

- Fondo general: `bg-[#F8FAFC]`
- Fondo cards: `bg-white`
- Fondo sidebar: `bg-white`
- Acento principal (botones, links activos, badges): `bg-[#3B9ECF]` / `text-[#3B9ECF]`
- Acento hover botones: `bg-[#2D8BB8]`
- Acento suave (fondos highlight, estados): `bg-[#E8F4FD]`
- Texto principal: `text-[#2D3748]`
- Texto secundario: `text-[#718096]`
- Bordes: `border-[#E2E8F0]`
- Danger/delete: `text-red-500`
- Status signed: `text-green-600`
- Status draft: `text-yellow-600`

## Cards (claymorphism suave)

```
bg-white rounded-2xl shadow-md p-6 border border-[#E2E8F0]
```

No usar shadow-lg, shadow-2xl, ni blur. Solo shadow-md.

## Botones

Primario:
```
bg-[#3B9ECF] text-white rounded-xl px-5 py-2.5 shadow-sm font-medium
```

Secundario:
```
bg-white text-[#2D3748] rounded-xl px-5 py-2.5 border border-[#E2E8F0] shadow-sm font-medium
```

Danger:
```
bg-red-500 text-white rounded-xl px-5 py-2.5 shadow-sm font-medium
```

Disabled:
```
opacity-50 cursor-not-allowed
```

NO agregar hover effects, transitions, ni transform. Solo disabled state.

## Tipografia

- Titulos de pagina: `text-2xl font-bold text-[#2D3748]`
- Subtitulos/labels: `text-sm font-medium text-[#718096] uppercase tracking-wide`
- Texto normal: `text-base text-[#2D3748]`
- Texto pequeño: `text-sm text-[#718096]`

Usar la fuente default del sistema. No importar fuentes externas.

## Layout

Sidebar + contenido principal:
```
<div class="flex min-h-screen bg-[#F8FAFC]">
  <aside class="w-64 bg-white border-r border-[#E2E8F0] p-6">
  <main class="flex-1 p-8">
</div>
```

## Sidebar

- Logo/titulo arriba: `text-xl font-bold text-[#3B9ECF] mb-8`
- Links: `text-[#718096] py-2 px-3 rounded-lg text-sm font-medium`
- Link activo: `bg-[#E8F4FD] text-[#3B9ECF] py-2 px-3 rounded-lg text-sm font-medium`
- Sin iconos. Solo texto.

## Inputs

```
w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#2D3748] placeholder-[#A0AEC0] focus:outline-none focus:border-[#3B9ECF]
```

## Listas (pacientes, consultas)

Cada item es una card simple:
```
bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm mb-3
```

## Patient details

- Datos del paciente en grid de 2 columnas: `grid grid-cols-2 gap-4`
- Labels en uppercase small: `text-sm font-medium text-[#718096] uppercase tracking-wide`
- Valores: `text-base text-[#2D3748]`

## Consultation flow

- Steps con numero + texto, estado activo en acento celeste
- Cada step en su propia card
- Textarea para transcript/summary: `w-full min-h-[200px] px-4 py-3 rounded-xl border border-[#E2E8F0] text-[#2D3748] resize-none focus:outline-none focus:border-[#3B9ECF]`

## Spacing general

- Entre secciones: `mb-6` o `mb-8`
- Padding de pagina: `p-8`
- Padding de cards: `p-6`
- Gap en grids: `gap-4` o `gap-6`

## Regla principal

NO modificar logica, funcionalidad, estructura de componentes, imports, hooks, estados, handlers, ni services. Solo agregar clases de Tailwind a los elementos que ya existen. Si un div no tiene className, agregarle. Si ya tiene, reemplazar o complementar con las clases del brief. No mover, borrar ni reorganizar nada del codigo original.

## Responsive

La app debe verse bien en mobile y desktop. Usar un approach simple de junior:

- Layout sidebar: en desktop `flex` con sidebar fija. En mobile la sidebar se oculta y el contenido ocupa todo el ancho.
- Usar solo `md:` como breakpoint principal. No usar sm:, lg:, xl:, 2xl:.
- Grid de datos del paciente: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Contenido principal: `w-full` en mobile, con sidebar en desktop via `md:flex`
- Botones y inputs: siempre `w-full` en mobile
- Ejemplo sidebar responsive simple:
```tsx
<aside className="hidden md:block w-64 bg-white border-r border-[#E2E8F0] p-6">
<main className="flex-1 p-4 md:p-8">
```

No hacer responsive elaborado con hamburger menu, drawers, ni toggles. Si la sidebar se oculta en mobile, los links de navegacion van arriba del contenido como links simples.

## Codigo junior-friendly

- Clases de Tailwind directas en el className, no extraer a variables ni crear objetos de estilos
- No usar clsx, cn(), ni classnames
- Si un className queda largo esta bien, un junior no lo optimiza
- No crear archivos de theme, constants de colores, ni design tokens
- No usar @apply en CSS
- No crear componentes de UI custom (tipo `<Card>`, `<Badge>`, `<Label>`) solo para wrappear clases de Tailwind. Usar los divs directos
- Los componentes de shadcn/ui que ya estan importados si se pueden usar (Button, etc)
- Comentarios simples en español sin tildes ni mayusculas

## Reglas estrictas

1. NO usar hover effects ni transitions
2. NO usar gradientes
3. NO usar dark mode
4. NO usar iconos (solo texto)
5. NO usar animaciones
6. NO usar shadow-lg o shadow-2xl, solo shadow-sm y shadow-md
7. NO usar colores neon o saturados
8. NO agregar componentes extra que no existan (footers, notificaciones, modales decorativos)
9. Solo estilizar lo que ya existe en el codigo
10. Mantener la estructura de componentes tal cual esta, solo agregar clases de Tailwind

## Codigo que parece hecho por IA — EVITAR TODO ESTO

El codigo debe parecer escrito por un desarrollador junior real, no generado por IA.

### Comentarios
EVITAR:
```tsx
{/* Primary action button with loading state */}
{/* Patient information card with responsive grid layout */}
{/* Render consultation list with status indicators */}
```
CORRECTO:
```tsx
{/* boton login */}
{/* datos del paciente */}
{/* lista de consultas */}
```
Comentarios cortos, en español, sin mayusculas, sin ser descriptivos de mas. Un junior no comenta cada div.

### Naming de clases y estructura
EVITAR:
```tsx
<div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex-shrink-0">
    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
```
CORRECTO:
```tsx
<div className="max-w-5xl mx-auto p-8">
  <h1 className="text-2xl font-bold text-[#2D3748]">
```
No usar responsive breakpoints (sm:, md:, lg:) salvo que sea estrictamente necesario. Un junior no piensa en 4 breakpoints.

### Patrones tipicos de IA a evitar
- NO poner aria-label en todo
- NO agregar data-testid en elementos
- NO usar sr-only spans
- NO crear componentes wrapper innecesarios (tipo `<PageWrapper>`, `<ContentArea>`, `<ActionBar>`)
- NO agregar empty states elaborados con ilustraciones SVG inline
- NO poner tooltips
- NO usar transition, transform, duration, ease en clases
- NO crear constantes para arrays de colores o config de estilos
- NO mapear arrays de objetos config para renderizar nav items o form fields
- NO agregar try-catch con mensajes ultra descriptivos tipo "Failed to fetch patient data. Please try again later."
- NO usar template patterns tipo "hero section", "feature grid", "CTA banner"
- NO agregar loading skeletons elaborados, un simple "Loading..." basta
- NO meter ring, focus-visible, outline custom elaborados
- NO usar gap-x-4 gap-y-6 con precision milimetrica, usar gap-4 o gap-6
- NO poner max-w-prose, max-w-7xl, container mx-auto en cada seccion

### Errores que un junior SI comete (y esta bien)
- Algun padding inconsistente entre paginas (p-6 en una, p-8 en otra)
- No todos los textos tienen el mismo shade de gris exacto
- Algun margin-bottom manual en vez de gap
- Mezclar rounded-xl con rounded-2xl en distintas paginas
- Un className largo sin extraer a variable