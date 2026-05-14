// productCard.js
// ─────────────────────────────────────────────────────────────────────────────
// Este componente muestra la TARJETA de una empanada individual.
// Recibe los datos de una empanada y dos funciones del componente padre:
//
// Props que recibe:
//   empanada  → objeto con los datos: { id, nombre, relleno, precio, stock }
//   onEliminar → función que se llama cuando el usuario hace click en "Eliminar"
//   onEditar   → función que se llama cuando el usuario hace click en "Editar"
//
// Este componente NO tiene estado propio (no usa useState).
// Solo recibe datos y los muestra. Se llama "componente presentacional".
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductCard({ empanada, onEliminar, onEditar }) {
  return (

    // ── Contenedor de la tarjeta ──────────────────────────────────────────────
    // onMouseEnter → evento que se dispara cuando el mouse ENTRA en el elemento
    // onMouseLeave → evento que se dispara cuando el mouse SALE del elemento
    // Usamos estos eventos para crear el efecto de "levantar" la tarjeta
    // al pasar el mouse por encima (hover effect).
    // e.currentTarget → es el div de la tarjeta, el elemento donde está el evento.
    //   (no confundir con e.target, que podría ser un elemento hijo)
    <div
      style={{
        background: "#1E1E1E",
        border: "1px solid #2A2A2A",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",  // Los hijos se apilan de arriba a abajo
        gap: "12px",              // Espacio entre cada hijo
        transition: "transform 0.2s, border-color 0.2s",  // Animación suave al cambiar
        cursor: "default",        // Cursor normal (no de manito ni de texto)
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";  // Sube 3px la tarjeta
        e.currentTarget.style.borderColor = "#F5C800";          // Borde amarillo
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";      // Vuelve a su lugar
        e.currentTarget.style.borderColor = "#2A2A2A";          // Borde gris original
      }}
    >

      {/* ── Encabezado: nombre + badge de stock ───────────────────────────────
          justifyContent: "space-between" → separa los elementos a los extremos
          alignItems: "flex-start"        → alinea los elementos al tope (arriba)
          gap: "8px"                      → espacio mínimo entre nombre y badge
      ──────────────────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>

        {/* Nombre de la empanada */}
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "1.5rem",
          color: "#F5C800",
          letterSpacing: "1px",
          lineHeight: 1.1,  // Altura de línea ajustada para nombres largos
        }}>
          {empanada.nombre}
        </h2>

        {/* ── Badge (etiqueta) de stock ────────────────────────────────────────
            Muestra si hay stock disponible o no, con colores distintos.
            Usamos operadores ternarios (condición ? si_true : si_false)
            para cambiar el color del fondo, texto y borde según el stock.
            borderRadius: "999px" → hace que el badge sea completamente redondeado
            whiteSpace: "nowrap"  → evita que el texto se corte en varias líneas
        ──────────────────────────────────────────────────────────────────────── */}
        <span style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: "999px",
          whiteSpace: "nowrap",
          // Si stock > 0: fondo verde oscuro; si no: fondo rojo oscuro
          background: empanada.stock > 0 ? "#1a3a1a" : "#3a1a1a",
          // Si stock > 0: texto verde; si no: texto rojo
          color: empanada.stock > 0 ? "#4ade80" : "#f87171",
          // Si stock > 0: borde verde; si no: borde rojo
          // Los backticks `` permiten insertar variables dentro de un string con ${}
          border: `1px solid ${empanada.stock > 0 ? "#4ade80" : "#f87171"}`,
        }}>
          {/* Si hay stock, muestra la cantidad. Si no, muestra "Sin stock". */}
          {empanada.stock > 0 ? `Stock: ${empanada.stock}` : "Sin stock"}
        </span>
      </div>

      {/* ── Descripción del relleno ──────────────────────────────────────────── */}
      <p style={{
        color: "#999",
        fontSize: "0.875rem",
        lineHeight: 1.4,  // 1.4 = 140% del tamaño de fuente → texto más legible
      }}>
        {empanada.relleno}
      </p>

      {/* ── Precio ───────────────────────────────────────────────────────────────
          .toLocaleString("es-AR") → formatea el número según la región Argentina.
          Ej: 1500 → "1.500" (con punto como separador de miles)
          Ej: 1500.5 → "1.500,5" (con coma decimal)
      ──────────────────────────────────────────────────────────────────────── */}
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "2rem",
        color: "#F0F0F0",
        letterSpacing: "1px",
      }}>
        ${empanada.precio.toLocaleString("es-AR")}
      </p>

      {/* ── Botones: Editar y Eliminar ───────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>

        {/* Botón Editar: al hacer click llama a onEditar pasando la empanada completa.
            El padre (page.js) guardará esta empanada en el estado "empanadaEditar",
            lo que hará que el formulario se llene con sus datos. */}
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
          // Efecto hover: oscurece el amarillo al pasar el mouse
          onMouseEnter={e => e.currentTarget.style.background = "#e6b800"}
          onMouseLeave={e => e.currentTarget.style.background = "#F5C800"}
        >
          ✏️ Editar
        </button>

        {/* Botón Eliminar: al hacer click llama a onEliminar con el ID de la empanada.
            El padre pedirá confirmación y luego hará el DELETE al backend. */}
        <button
          onClick={() => onEliminar(empanada.id)}
          style={{
            flex: 1,
            background: "transparent",   // Fondo transparente (solo el borde se ve)
            color: "#CC1C1C",
            fontWeight: 700,
            fontSize: "0.85rem",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #CC1C1C",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          // Efecto hover: rellena el fondo con rojo semitransparente
          // "#CC1C1C22" → el color rojo con 22 en hexadecimal de opacidad (~13% opaco)
          onMouseEnter={e => e.currentTarget.style.background = "#CC1C1C22"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          🗑️ Eliminar
        </button>

      </div>
    </div>
  );
}
