"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [productos, setProductos] = useState([]);

  function cargar() {
    fetch("http://127.0.0.1:8000/productos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }

  useEffect(() => {
    cargar();
  }, []);

  function agregar() {
    fetch("http://127.0.0.1:8000/productos?nombre=Mouse&precio=5000&stock=10", {
      method: "POST"
    }).then(cargar);
  }

  function eliminar(id) {
    fetch(`http://127.0.0.1:8000/productos/${id}`, {
      method: "DELETE"
    }).then(cargar);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Productos</h1>

      <button onClick={agregar}>Agregar producto</button>

      {productos.map(p => (
        <div key={p.id}>
          {p.nombre} - ${p.precio} - Stock: {p.stock}
          <button onClick={() => eliminar(p.id)}>❌</button>
        </div>
      ))}
    </div>
  );
}