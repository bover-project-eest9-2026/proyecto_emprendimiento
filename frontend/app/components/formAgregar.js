// formAgregar.js
// Formulario para agregar o editar empanadas. Estética oscura con amarillo.

"use client";

import { useState, useEffect } from "react";

const inputStyle = {
  background: "#2A2A2A",
  border: "1px solid #3A3A3A",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "#F0F0F0",
  fontSize: "0.9rem",
  width: "100%",
  outline: "none",
  fontFamily: "'Barlow', sans-serif",
  transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "4px",
  display: "block",
};

export default function FormAgregar({ onGuardar, empanadaEditar, onCancelar }) {

  const [form, setForm] = useState({
    nombre: "",
    relleno: "",
    precio: "",
    stock: "",
  });

  // Carga los datos al editar, limpia al crear
  useEffect(() => {
    if (empanadaEditar) {
      setForm({
        nombre: empanadaEditar.nombre,
        relleno: empanadaEditar.relleno,
        precio: empanadaEditar.precio,
        stock: empanadaEditar.stock,
      });
    } else {
      setForm({ nombre: "", relleno: "", precio: "", stock: "" });
    }
  }, [empanadaEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.relleno || !form.precio || !form.stock) {
      alert("Por favor completá todos los campos");
      return;
    }
    onGuardar({
      nombre: form.nombre,
      relleno: form.relleno,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
    });
    setForm({ nombre: "", relleno: "", precio: "", stock: "" });
  };

  return (
    <div style={{
      background: "#1E1E1E",
      border: "1px solid #2A2A2A",
      borderRadius: "12px",
      padding: "24px",
    }}>

      {/* Título */}
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.6rem",
        color: "#F5C800",
        letterSpacing: "1px",
        marginBottom: "20px",
      }}>
        {empanadaEditar ? "✏️ Editar empanada" : "➕ Nueva empanada"}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Nombre */}
        <div>
          <label style={labelStyle}>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Empanada de carne"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#F5C800"}
            onBlur={e => e.target.style.borderColor = "#3A3A3A"}
          />
        </div>

        {/* Relleno */}
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

        {/* Precio y Stock en fila */}
        <div style={{ display: "flex", gap: "12px" }}>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Precio ($)</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="850"
              min="0"
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

        {/* Botones */}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>

          <button type="submit" style={{
            flex: 1,
            background: "#F5C800",
            color: "#111",
            fontWeight: 700,
            fontSize: "0.95rem",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Barlow', sans-serif",
            letterSpacing: "0.5px",
          }}>
            {empanadaEditar ? "Guardar cambios" : "Agregar"}
          </button>

          {empanadaEditar && (
            <button type="button" onClick={onCancelar} style={{
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
