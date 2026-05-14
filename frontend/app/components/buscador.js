// buscador.js
// ─────────────────────────────────────────────────────────────────────────────
// Este archivo define el componente "Buscador": la barra de búsqueda
// que aparece en la página para filtrar empanadas por nombre o relleno.
//
// Un "componente" en React es una función que devuelve HTML (en realidad JSX).
// Se puede reutilizar en cualquier parte de la aplicación como si fuera
// una etiqueta HTML propia: <Buscador onBuscar={...} />
// ─────────────────────────────────────────────────────────────────────────────

"use client";
// Esta línea le dice a Next.js que este componente se ejecuta en el NAVEGADOR
// (del lado del cliente), no en el servidor.
// Es obligatoria cuando el componente usa interactividad (eventos, estados, etc.)


// Exportamos el componente como "default" para poder importarlo en otros archivos.
// { onBuscar } es una "prop" (propiedad): un valor que le pasa el componente padre.
// En este caso, onBuscar es una función que se ejecuta cada vez que el usuario escribe.
export default function Buscador({ onBuscar }) {
  return (

    // Contenedor principal del buscador.
    // position: "relative" permite posicionar la lupa DENTRO de este div
    // usando position: "absolute" en el span de abajo.
    <div style={{ position: "relative" }}>

      {/* ── Ícono lupa ──────────────────────────────────────────────────────
          Este span contiene el emoji de lupa 🔍.
          Se posiciona de forma ABSOLUTA respecto al div padre (position: relative).
          left: "14px"    → 14 píxeles desde la izquierda del contenedor
          top: "50%"      → lo ubica al 50% del alto del contenedor
          transform: "translateY(-50%)" → lo sube la mitad de su propio alto,
            dejándolo perfectamente centrado en vertical.
          pointerEvents: "none" → hace que el emoji no interfiera con el click
            ni el foco del input que está detrás.
      ──────────────────────────────────────────────────────────────────── */}
      <span style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#666",
        fontSize: "1rem",
        pointerEvents: "none",
      }}>
        🔍
      </span>

      {/* ── Input de búsqueda ────────────────────────────────────────────────
          type="text"    → campo de texto libre (no número, no fecha, etc.)
          placeholder    → texto gris que aparece cuando el campo está vacío
          onChange       → evento que se dispara cada vez que el usuario escribe.
            e es el "evento": contiene información sobre lo que pasó.
            e.target es el input mismo.
            e.target.value es el texto que tiene el input en ese momento.
            Llamamos a onBuscar() con ese texto para que el padre filtre la lista.
          padding: "10px 14px 10px 42px" → el padding izquierdo de 42px deja
            espacio para que la lupa no tape el texto que escribe el usuario.
          transition: "border-color 0.2s" → el cambio de color del borde
            se hace de forma suave en 0.2 segundos (animación CSS).
      ──────────────────────────────────────────────────────────────────── */}
      <input
        type="text"
        placeholder="Buscar empanada..."
        onChange={(e) => onBuscar(e.target.value)}
        style={{
          width: "100%",
          background: "#1E1E1E",
          border: "1px solid #3A3A3A",
          borderRadius: "8px",
          padding: "10px 14px 10px 42px",
          color: "#F0F0F0",
          fontSize: "0.9rem",
          outline: "none",         // Elimina el borde azul por defecto del navegador
          fontFamily: "'Barlow', sans-serif",
          transition: "border-color 0.2s",
        }}

        // onFocus → se dispara cuando el usuario hace click en el input (lo "enfoca")
        // Cambiamos el color del borde a amarillo para dar feedback visual.
        onFocus={e => e.target.style.borderColor = "#F5C800"}

        // onBlur → se dispara cuando el usuario sale del input (lo "desenfoca")
        // Volvemos el borde al color gris original.
        onBlur={e => e.target.style.borderColor = "#3A3A3A"}
      />
    </div>
  );
}
