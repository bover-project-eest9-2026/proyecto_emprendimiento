// layout.js
// ─────────────────────────────────────────────────────────────────────────────
// Este archivo define el LAYOUT RAÍZ de la aplicación Next.js.
// Un "layout" es una estructura que se aplica a TODAS las páginas del proyecto.
// Es como el "marco" que envuelve cada página.
//
// Next.js busca este archivo automáticamente en la carpeta "app".
// Todo lo que pongas acá (fuentes, estilos globales, metadata) se aplica
// a toda la aplicación sin necesidad de repetirlo en cada página.
// ─────────────────────────────────────────────────────────────────────────────

// Importamos los estilos globales. Este import hace que globals.css
// se aplique a toda la aplicación.
import "./globals.css";


// ── Metadata ──────────────────────────────────────────────────────────────────
// La metadata es información SOBRE la página, no visible directamente en el
// contenido, pero usada por el navegador y los buscadores (Google, etc.).
//
// "title"       → el texto que aparece en la pestaña del navegador
// "description" → descripción que usan los buscadores para mostrar en resultados
//
// Next.js se encarga de inyectar esto en el <head> del HTML automáticamente.
export const metadata = {
  title: "Tienda de Empanadas",
  description: "Panel de administración",
};


// ── Componente RootLayout ─────────────────────────────────────────────────────
// Este es el componente principal del layout.
// Next.js lo llama automáticamente y le pasa "children" como prop.
//
// "children" → representa el contenido de la página actual.
//   Es como un "hueco" donde Next.js inserta la página que corresponde
//   a la URL que visitó el usuario.
//   Ej: si el usuario va a "/", children es el contenido de page.js
export default function RootLayout({ children }) {
  return (

    // Devolvemos la estructura HTML completa de la página.
    // En Next.js con el App Router, el RootLayout es el único lugar
    // donde se define el <html> y el <body>.

    <html lang="es">
    {/* lang="es" → indica que el idioma de la página es español.
        Esto es importante para la accesibilidad (lectores de pantalla)
        y para los buscadores. */}

      <head>
        {/* ── Importación de fuentes de Google ──────────────────────────────
            Cargamos dos fuentes tipográficas desde Google Fonts:

            Bebas Neue → fuente de display, mayúsculas condensadas.
              Se usa en títulos y precios para darle carácter al diseño.

            Barlow → fuente de texto, limpia y legible.
              Se usa en el cuerpo del texto, labels, botones, etc.
              wght@400;600;700 → cargamos tres pesos:
                400 = normal
                600 = semibold (medio grueso)
                700 = bold (negrita)

            display=swap → mientras la fuente carga, usa una fuente del sistema
              para que el texto sea legible de inmediato (sin flash en blanco).
        ──────────────────────────────────────────────────────────────────── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/..." rel="stylesheet" />
      </head>

      <body style={{ background: "#111111", margin: 0, padding: 0 }}>
        {/* El fondo negro y el reset de márgenes/padding también están en
            globals.css. Están repetidos acá como respaldo para asegurarse
            de que el body tenga el estilo correcto desde el primer render. */}
        
        {children}
        {/* Acá es donde Next.js inserta el contenido de la página actual.
            Es el "hueco" del layout: todo lo que esté fuera de {children}
            se mantiene igual sin importar a qué página va el usuario. */}
      </body>
    </html>
  );
}
