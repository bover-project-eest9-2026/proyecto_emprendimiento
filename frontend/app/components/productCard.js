// productCard.js
// Tarjeta de cada empanada con estética oscura, amarillo y rojo.

export default function ProductCard({ empanada, onEliminar, onEditar }) {
  return (
    <div style={{
      background: "#1E1E1E",
      border: "1px solid #2A2A2A",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      transition: "transform 0.2s, border-color 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.borderColor = "#F5C800";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = "#2A2A2A";
    }}
    >

      {/* Encabezado: nombre + badge stock */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "1.5rem",
          color: "#F5C800",
          letterSpacing: "1px",
          lineHeight: 1.1,
        }}>
          {empanada.nombre}
        </h2>

        {/* Badge de stock */}
        <span style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: "999px",
          whiteSpace: "nowrap",
          background: empanada.stock > 0 ? "#1a3a1a" : "#3a1a1a",
          color: empanada.stock > 0 ? "#4ade80" : "#f87171",
          border: `1px solid ${empanada.stock > 0 ? "#4ade80" : "#f87171"}`,
        }}>
          {empanada.stock > 0 ? `Stock: ${empanada.stock}` : "Sin stock"}
        </span>
      </div>

      {/* Relleno */}
      <p style={{ color: "#999", fontSize: "0.875rem", lineHeight: 1.4 }}>
        {empanada.relleno}
      </p>

      {/* Precio */}
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "2rem",
        color: "#F0F0F0",
        letterSpacing: "1px",
      }}>
        ${empanada.precio.toLocaleString("es-AR")}
      </p>

      {/* Botones */}
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>

        <button
          onClick={() => onEditar(empanada)}
          style={{
            flex: 1,
            background: "#F5C800",
            color: "#111",
            fontWeight: 700,
            fontSize: "0.85rem",
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#e6b800"}
          onMouseLeave={e => e.currentTarget.style.background = "#F5C800"}
        >
          ✏️ Editar
        </button>

        <button
          onClick={() => onEliminar(empanada.id)}
          style={{
            flex: 1,
            background: "transparent",
            color: "#CC1C1C",
            fontWeight: 700,
            fontSize: "0.85rem",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #CC1C1C",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#CC1C1C22"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          🗑️ Eliminar
        </button>

      </div>
    </div>
  );
}
