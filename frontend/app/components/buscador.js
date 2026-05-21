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
export default function Buscador({ onBuscar, tipos, filtroTipo, setFiltroTipo, filtroDisponibilidad, setFiltroDisponibilidad }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* ── Contenedor del input de búsqueda ─────────────────────────────── */}
      <div style={{ position: "relative" }}>

        {/* ── Ícono lupa ──────────────────────────────────────────────────── */}
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

        {/* ── Input de búsqueda ──────────────────────────────────────────── */}
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
            outline: "none",
            fontFamily: "'Barlow', sans-serif",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "#F5C800"}
          onBlur={e => e.target.style.borderColor = "#3A3A3A"}
        />
      </div>

      {/* ── Filtros adicionales ─────────────────────────────────────��────── */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>

        {/* ── Selector de tipo ───────────────────────────────────────────── */}
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          style={{
            background: "#1E1E1E",
            border: "1px solid #3A3A3A",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#F0F0F0",
            fontSize: "0.85rem",
            fontFamily: "'Barlow', sans-serif",
            cursor: "pointer",
            outline: "none",
            flex: "1",
            minWidth: "140px",
          }}
        >
          <option value="">Todos los tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>

        {/* ── Selector de disponibilidad ──────────────────────────────────── */}
        <select
          value={filtroDisponibilidad}
          onChange={(e) => setFiltroDisponibilidad(e.target.value)}
          style={{
            background: "#1E1E1E",
            border: "1px solid #3A3A3A",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#F0F0F0",
            fontSize: "0.85rem",
            fontFamily: "'Barlow', sans-serif",
            cursor: "pointer",
            outline: "none",
            flex: "1",
            minWidth: "140px",
          }}
        >
          <option value="">Todas</option>
          <option value="disponible">Disponible</option>
          <option value="agotado">Agotado</option>
        </select>
      </div>
    </div>
  );
}
