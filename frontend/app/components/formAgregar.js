// formAgregar.js
// ─────────────────────────────────────────────────────────────────────────────
// Este componente muestra el formulario para AGREGAR o EDITAR una empanada.
// Es el mismo formulario para los dos casos: si recibe "empanadaEditar"
// carga sus datos para editarlos; si no, muestra los campos vacíos para crear una nueva.
//
// Recibe tres "props" (propiedades) del componente padre (page.js):
//   onGuardar     → función que se llama cuando el usuario envía el formulario
//   empanadaEditar → objeto con los datos de la empanada a editar (o null si es nueva)
//   onCancelar    → función que se llama cuando el usuario cancela la edición
// ─────────────────────────────────────────────────────────────────────────────

"use client";
// Necesario porque usamos useState y useEffect (hooks de React),
// que solo funcionan en el navegador (lado del cliente).

import { useState, useEffect } from "react";
// useState  → permite guardar y actualizar valores dentro del componente.
//   Ejemplo: guardar el texto que escribe el usuario en cada campo.
// useEffect → permite ejecutar código en momentos específicos del ciclo de vida
//   del componente (cuando se monta, cuando cambia un valor, etc.)


// ── Estilos reutilizables ─────────────────────────────────────────────────────
// Definimos los estilos de los inputs y labels como variables de JavaScript
// para no repetir el mismo objeto en cada campo del formulario.
// Es equivalente a definir una clase CSS, pero en JavaScript.

const inputStyle = {
  background: "#2A2A2A",
  border: "1px solid #3A3A3A",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "#F0F0F0",
  fontSize: "0.9rem",
  width: "100%",       // Ocupa todo el ancho disponible
  outline: "none",     // Elimina el borde azul por defecto del navegador al enfocar
  fontFamily: "'Barlow', sans-serif",
  transition: "border-color 0.2s",  // Animación suave al cambiar el color del borde
};

const labelStyle = {
  fontSize: "0.75rem",
  fontWeight: 700,               // Negrita
  color: "#888",
  textTransform: "uppercase",   // Convierte el texto a MAYÚSCULAS automáticamente
  letterSpacing: "0.5px",       // Espacio extra entre letras
  marginBottom: "4px",
  display: "block",             // Hace que el label ocupe su propia línea
};


export default function FormAgregar({ onGuardar, empanadaEditar, onCancelar }) {

  // ── Estado del formulario ───────────────────────────────────────────────────
  // "form" es un objeto que guarda el valor actual de cada campo del formulario.
  // useState({...}) inicializa el estado con todos los campos vacíos.
  // "setForm" es la función que usamos para actualizar el estado.
  // Cuando llamamos a setForm(), React re-renderiza el componente con los nuevos valores.
  const [form, setForm] = useState({
    nombre: "",
    relleno: "",
    precio: "",
    stock: "",
  });


  // ── Efecto: cargar datos al editar ──────────────────────────────────────────
  // useEffect ejecuta la función que le pasamos cada vez que "empanadaEditar" cambia.
  // El array [empanadaEditar] al final se llama "array de dependencias":
  //   → si empanadaEditar cambia, React ejecuta la función de nuevo.
  //   → si no cambia, no la ejecuta.
  useEffect(() => {
    if (empanadaEditar) {
      // Si hay una empanada para editar, cargamos sus datos en el formulario
      setForm({
        nombre: empanadaEditar.nombre,
        relleno: empanadaEditar.relleno,
        precio: empanadaEditar.precio,
        stock: empanadaEditar.stock,
      });
    } else {
      // Si no hay empanada para editar (null), limpiamos todos los campos
      setForm({ nombre: "", relleno: "", precio: "", stock: "" });
    }
  }, [empanadaEditar]);
  // Este efecto se ejecuta cuando:
  //   1. El componente se monta por primera vez
  //   2. El valor de empanadaEditar cambia (el usuario hace click en "Editar" o "Cancelar")


  // ── Manejador de cambios en los inputs ──────────────────────────────────────
  // Se llama cada vez que el usuario escribe en cualquier campo.
  // "e" es el evento del input.
  // e.target.name  → el atributo "name" del input que cambió (ej: "nombre", "precio")
  // e.target.value → el valor actual de ese input
  const handleChange = (e) => {
    setForm({
      ...form,                        // Copiamos todos los campos actuales del form
      [e.target.name]: e.target.value // Sobreescribimos solo el campo que cambió
      // [e.target.name] con corchetes es una "computed property key":
      // permite usar el valor de una variable como nombre de la clave del objeto.
    });
  };


  // ── Manejador del envío del formulario ──────────────────────────────────────
  // Se llama cuando el usuario hace click en "Agregar" o "Guardar cambios".
  const handleSubmit = (e) => {
    e.preventDefault();
    // e.preventDefault() evita el comportamiento por defecto del formulario HTML,
    // que sería recargar la página al hacer submit. Nosotros manejamos el envío
    // manualmente con fetch() en el componente padre.

    // Validación: verificamos que ningún campo esté vacío antes de enviar
    if (!form.nombre || !form.relleno || !form.precio || !form.stock) {
      alert("Por favor completá todos los campos");
      return; // Salimos de la función sin enviar nada
    }

    // Llamamos a onGuardar() con los datos del formulario.
    // Convertimos precio a float (número decimal) y stock a int (número entero)
    // porque los inputs de HTML siempre devuelven texto (string), no números.
    onGuardar({
      nombre: form.nombre,
      relleno: form.relleno,
      precio: parseFloat(form.precio),  // "850.5" → 850.5
      stock: parseInt(form.stock),      // "20"    → 20
    });

    // Limpiamos el formulario después de guardar
    setForm({ nombre: "", relleno: "", precio: "", stock: "" });
  };


  // ── JSX: lo que se muestra en pantalla ─────────────────────────────────────
  return (

    // Contenedor del formulario con estilo oscuro
    <div style={{
      background: "#1E1E1E",
      border: "1px solid #2A2A2A",
      borderRadius: "12px",
      padding: "24px",
    }}>

      {/* ── Título ─────────────────────────────────────────────────────────────
          Muestra un título diferente según si estamos editando o creando.
          El operador ternario "condición ? valor_si_true : valor_si_false"
          es una forma compacta de escribir un if/else dentro del JSX.
      ──────────────────────────────────────────────────────────────────────── */}
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.6rem",
        color: "#F5C800",
        letterSpacing: "1px",
        marginBottom: "20px",
      }}>
        {empanadaEditar ? "✏️ Editar empanada" : "➕ Nueva empanada"}
      </h2>

      {/* ── Formulario ─────────────────────────────────────────────────────────
          onSubmit → función que se ejecuta cuando el usuario envía el formulario
            (hace click en el botón submit o presiona Enter).
      ──────────────────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* ── Campo Nombre ─────────────────────────────────────────────────── */}
        <div>
          <label style={labelStyle}>Nombre</label>
          <input
            type="text"
            name="nombre"              // Debe coincidir con la clave en el objeto "form"
            value={form.nombre}        // El valor del input está controlado por el estado
            onChange={handleChange}    // Actualiza el estado cada vez que el usuario escribe
            placeholder="Ej: Empanada de carne"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#F5C800"}
            onBlur={e => e.target.style.borderColor = "#3A3A3A"}
          />
        </div>

        {/* ── Campo Relleno ────────────────────────────────────────────────── */}
        <div>
          <label style={labelStyle}>Relleno</label>
          <input
            type="text"
            name="relleno"
            value={form.relleno}
            onChange={handleChange}
            placeholder="Ej: Carne cortada a cuchillo con aceitunas"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#F5C800"}
            onBlur={e => e.target.style.borderColor = "#3A3A3A"}
          />
        </div>

        {/* ── Precio y Stock en fila ───────────────────────────────────────────
            display: "flex" pone los dos campos uno al lado del otro.
            flex: 1 en cada campo hace que ambos ocupen el mismo ancho disponible.
        ──────────────────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "12px" }}>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Precio ($)</label>
            <input
              type="number"   // Solo acepta números
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="850"
              min="0"         // No permite valores negativos
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F5C800"}
              onBlur={e => e.target.style.borderColor = "#3A3A3A"}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="20"
              min="0"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F5C800"}
              onBlur={e => e.target.style.borderColor = "#3A3A3A"}
            />
          </div>

        </div>

        {/* ── Botones ──────────────────────────────────────────────────────────
            display: "flex" + gap pone los botones uno al lado del otro con espacio.
        ──────────────────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>

          {/* Botón principal: envía el formulario (type="submit") */}
          <button type="submit" style={{
            flex: 1,
            background: "#F5C800",
            color: "#111",
            fontWeight: 700,
            fontSize: "0.95rem",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",   // Muestra el cursor de "manito" al pasar por encima
            fontFamily: "'Barlow', sans-serif",
            letterSpacing: "0.5px",
          }}>
            {/* Texto del botón: cambia según si editamos o creamos */}
            {empanadaEditar ? "Guardar cambios" : "Agregar"}
          </button>

          {/* Botón cancelar: solo aparece cuando estamos EDITANDO.
              "&&" es el operador lógico AND: si la condición de la izquierda es
              verdadera, React renderiza lo que está a la derecha.
              Si empanadaEditar es null (falso), no muestra nada. */}
          {empanadaEditar && (
            <button
              type="button"      // type="button" evita que este botón envíe el formulario
              onClick={onCancelar}  // Llama a la función onCancelar del padre
              style={{
                flex: 1,
                background: "transparent",
                color: "#888",
                fontWeight: 700,
                fontSize: "0.95rem",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #3A3A3A",
                cursor: "pointer",
                fontFamily: "'Barlow', sans-serif",
              }}>
              Cancelar
            </button>
          )}

        </div>
      </form>
    </div>
  );
}
