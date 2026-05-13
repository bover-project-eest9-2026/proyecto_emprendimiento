// buscador.js
// Barra de búsqueda con estética oscura.

"use client";

export default function Buscador({ onBuscar }) {
  return (
    <div style={{ position: "relative" }}>

      {/* Ícono lupa */}
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
  );
}
