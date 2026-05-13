// page.js
// Página principal con estética oscura inspirada en la imagen de referencia.
// Fondo negro, amarillo como acento, rojo como color secundario.

"use client";

import { useState, useEffect } from "react";
import ProductCard from "./components/productCard";
import FormAgregar from "./components/formAgregar";
import Buscador from "./components/buscador";

const API_URL = "http://localhost:8000";

export default function Home() {

  const [empanadas, setEmpanadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [empanadaEditar, setEmpanadaEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEmpanadas();
  }, []);

  const cargarEmpanadas = async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await fetch(`${API_URL}/empanadas`);
      if (!respuesta.ok) throw new Error("Error al cargar");
      const datos = await respuesta.json();
      setEmpanadas(datos);
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (datosForm) => {
    try {
      if (empanadaEditar) {
        await fetch(`${API_URL}/empanadas/${empanadaEditar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosForm),
        });
        setEmpanadaEditar(null);
      } else {
        await fetch(`${API_URL}/empanadas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosForm),
        });
      }
      cargarEmpanadas();
    } catch (err) {
      alert("Error al guardar.");
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que querés eliminar esta empanada?")) return;
    try {
      await fetch(`${API_URL}/empanadas/${id}`, { method: "DELETE" });
      cargarEmpanadas();
    } catch (err) {
      alert("Error al eliminar.");
    }
  };

  const empanadsFiltradas = empanadas.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.relleno.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main style={{
      minHeight: "100vh",
      background: "#111111",
      padding: "32px 16px",
      minWidth: "100vw",
    }}>

      {/* Header */}
      <div style={{ maxWidth: "1100px", margin: "0 auto 40px", textAlign: "center" }}>

        {/* Franja roja decorativa arriba */}
        <div style={{
          background: "#CC1C1C",
          height: "6px",
          width: "80px",
          margin: "0 auto 16px",
          borderRadius: "3px",
        }} />

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          color: "#F5C800",
          letterSpacing: "3px",
          lineHeight: 1,
          textShadow: "0 2px 20px rgba(245,200,0,0.3)",
        }}>
          Tienda de Empanadas
        </h1>

        <p style={{
          color: "#666",
          marginTop: "8px",
          fontSize: "0.9rem",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}>
          Panel de administración
        </p>

        {/* Franja roja decorativa abajo */}
        <div style={{
          background: "#CC1C1C",
          height: "3px",
          width: "120px",
          margin: "16px auto 0",
          borderRadius: "3px",
        }} />
      </div>

      {/* Contenido */}
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>

        {/* Formulario */}
        <FormAgregar
          onGuardar={handleGuardar}
          empanadaEditar={empanadaEditar}
          onCancelar={() => setEmpanadaEditar(null)}
        />

        {/* Buscador */}
        <Buscador onBuscar={setBusqueda} />

        {/* Estados */}
        {cargando && (
          <p style={{ textAlign: "center", color: "#F5C800", padding: "20px" }}>
            Cargando empanadas...
          </p>
        )}

        {error && (
          <p style={{
            textAlign: "center",
            color: "#f87171",
            background: "#3a1a1a",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #CC1C1C",
          }}>
            {error}
          </p>
        )}

        {/* Contador */}
        {!cargando && !error && (
          <p style={{ color: "#555", fontSize: "0.85rem" }}>
            {empanadsFiltradas.length} empanada{empanadsFiltradas.length !== 1 ? "s" : ""} encontrada{empanadsFiltradas.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Grilla de tarjetas */}
        {!cargando && !error && (
          empanadsFiltradas.length === 0 ? (
            <p style={{ textAlign: "center", color: "#444", padding: "40px" }}>
              No hay empanadas para mostrar.
            </p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}>
              {empanadsFiltradas.map((empanada) => (
                <ProductCard
                  key={empanada.id}
                  empanada={empanada}
                  onEliminar={handleEliminar}
                  onEditar={setEmpanadaEditar}
                />
              ))}
            </div>
          )
        )}

      </div>
    </main>
  );
}
