// page.js
// ─────────────────────────────────────────────────────────────────────────────
// Este es el archivo PRINCIPAL del frontend: la página de inicio de la app.
// Contiene toda la lógica de la interfaz:
//   - Cargar las empanadas desde el backend al iniciar
//   - Mostrar el formulario para agregar/editar
//   - Mostrar la barra de búsqueda
//   - Mostrar las tarjetas de cada empanada
//   - Manejar las acciones de guardar y eliminar
//
// En Next.js con el App Router, el archivo "page.js" dentro de una carpeta
// corresponde a una URL. Este está en la raíz ("/"), así que es la página
// que se muestra al entrar a http://localhost:3000
// ─────────────────────────────────────────────────────────────────────────────

"use client";
// Esta directiva es obligatoria porque usamos hooks de React (useState, useEffect)
// y eventos del navegador (fetch, confirm, alert).
// Los componentes del App Router de Next.js son Server Components por defecto;
// "use client" los convierte en Client Components que corren en el navegador.


// ── Importaciones ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
// useState  → guarda valores que pueden cambiar (estado del componente)
// useEffect → ejecuta código en momentos específicos (al montar, al cambiar un valor)

import ProductCard from "./components/productCard";
// Importamos el componente de tarjeta de empanada.
// "./" es una ruta relativa: busca la carpeta "components" en el mismo directorio.

import FormAgregar from "./components/formAgregar";
// Importamos el formulario de agregar/editar empanadas.

import Buscador from "./components/buscador";
// Importamos la barra de búsqueda.


// ── URL base del backend ──────────────────────────────────────────────────────
// Guardamos la URL del backend en una constante para no repetirla en cada fetch.
// Si cambiamos el puerto o dominio del backend, solo lo cambiamos acá.
const API_URL = "http://localhost:8000";


// ── Componente principal ──────────────────────────────────────────────────────
export default function Home() {

  // ── Estados del componente ────────────────────────────────────────────────
  // Cada estado es un valor que React "recuerda" entre renders.
  // Cuando un estado cambia, React vuelve a renderizar el componente
  // con los nuevos valores.

  const [empanadas, setEmpanadas] = useState([]);
  // Lista de empanadas cargadas desde el backend.
  // Empieza como lista vacía [] mientras se cargan los datos.

  const [busqueda, setBusqueda] = useState("");
  // Texto que el usuario escribe en el buscador.
  // Empieza vacío "".

  const [empanadaEditar, setEmpanadaEditar] = useState(null);
  // Empanada seleccionada para editar.
  // null = no hay ninguna siendo editada (modo "crear nueva").
  // Si el usuario hace click en "Editar", se guarda acá el objeto de esa empanada.

  const [cargando, setCargando] = useState(true);
  // Indica si los datos están siendo cargados desde el backend.
  // true = mostramos "Cargando..."; false = mostramos las tarjetas.

  const [error, setError] = useState(null);
  // Guarda el mensaje de error si la conexión al backend falla.
  // null = sin error; string = hay un error para mostrar.


  // ── Efecto al montar el componente ────────────────────────────────────────
  // useEffect con array vacío [] como dependencias se ejecuta UNA SOLA VEZ:
  // cuando el componente aparece en pantalla por primera vez.
  // Equivale al evento "onload" de JavaScript clásico.
  useEffect(() => {
    cargarEmpanadas();  // Cargamos las empanadas al iniciar la página
  }, []);
  // [] vacío → "ejecutar solo al montar, no volver a ejecutar"


  // ── Función para cargar empanadas desde el backend ────────────────────────
  // "async" indica que esta función es asíncrona: puede esperar (await)
  // sin bloquear el resto del código.
  const cargarEmpanadas = async () => {
    try {
      // try/catch: intenta ejecutar el código dentro de try.
      // Si algo falla (error de red, servidor caído), salta al catch.

      setCargando(true);   // Activamos el indicador de carga
      setError(null);      // Limpiamos cualquier error previo

      // fetch() hace un pedido HTTP al backend.
      // Por defecto es GET. Esperamos la respuesta con await.
      const respuesta = await fetch(`${API_URL}/empanadas`);

      // respuesta.ok es true si el código HTTP es 200-299 (éxito)
      // Si no es ok (ej: 404, 500), lanzamos un error manualmente.
      if (!respuesta.ok) throw new Error("Error al cargar");

      // .json() convierte la respuesta JSON a un objeto/array de JavaScript.
      // También es async, por eso usamos await.
      const datos = await respuesta.json();

      setEmpanadas(datos);  // Guardamos la lista de empanadas en el estado

    } catch (err) {
      // Si cualquier línea del try falla, llegamos acá.
      // Guardamos el mensaje de error para mostrarlo en pantalla.
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");

    } finally {
      // "finally" se ejecuta SIEMPRE: tanto si el try tuvo éxito como si falló.
      // Acá siempre desactivamos el indicador de carga.
      setCargando(false);
    }
  };


  // ── Función para guardar (crear o editar) una empanada ────────────────────
  // Se pasa como prop al componente FormAgregar.
  // "datosForm" es el objeto con los datos del formulario: { nombre, relleno, precio, stock }
  const handleGuardar = async (datosForm) => {
    try {
      if (empanadaEditar) {
        // Si hay una empanada en edición, hacemos un PUT para actualizarla.
        // La URL incluye el id: /empanadas/3 → edita la empanada con id 3.
        await fetch(`${API_URL}/empanadas/${empanadaEditar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Content-Type → le dice al backend que el body viene en formato JSON
          body: JSON.stringify(datosForm),
          // JSON.stringify() → convierte el objeto JavaScript a texto JSON
          // Ej: { nombre: "Carne" } → '{"nombre":"Carne"}'
        });
        setEmpanadaEditar(null);  // Salimos del modo edición
      } else {
        // Si no hay empanada en edición, hacemos un POST para crear una nueva.
        await fetch(`${API_URL}/empanadas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosForm),
        });
      }
      cargarEmpanadas();  // Recargamos la lista para mostrar los cambios
    } catch (err) {
      alert("Error al guardar.");
    }
  };


  // ── Función para eliminar una empanada ────────────────────────────────────
  // "id" es el id de la empanada a eliminar.
  const handleEliminar = async (id) => {
    // confirm() muestra un cuadro de diálogo con "Aceptar" y "Cancelar".
    // Devuelve true si el usuario acepta, false si cancela.
    // El "!" invierte el resultado: si el usuario cancela, salimos de la función.
    if (!confirm("¿Seguro que querés eliminar esta empanada?")) return;

    try {
      // Hacemos un DELETE al backend con el id de la empanada.
      await fetch(`${API_URL}/empanadas/${id}`, { method: "DELETE" });
      cargarEmpanadas();  // Recargamos la lista sin la empanada eliminada
    } catch (err) {
      alert("Error al eliminar.");
    }
  };


  // ── Filtrado de empanadas ─────────────────────────────────────────────────
  // Filtramos la lista de empanadas según el texto de búsqueda.
  // .filter() devuelve un nuevo array con solo los elementos que cumplen la condición.
  // .toLowerCase() convierte a minúsculas para que la búsqueda no distinga entre
  //   "Carne", "carne" y "CARNE".
  // .includes() devuelve true si el string contiene el texto buscado.
  const empanadsFiltradas = empanadas.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    // || es el operador OR: devuelve true si cualquiera de las dos condiciones es true
    e.relleno.toLowerCase().includes(busqueda.toLowerCase())
    // Filtramos por nombre O por relleno
  );


  // ── JSX: lo que se muestra en pantalla ───────────────────────────────────
  return (

    // Contenedor principal de la página
    <main style={{
      minHeight: "100vh",      // Mínimo 100% del alto de la ventana
      background: "#111111",
      padding: "32px 16px",   // 32px arriba/abajo, 16px izquierda/derecha
      minWidth: "100vw",       // 100% del ancho de la ventana
    }}>

      {/* ── Header (encabezado) ────────────────────────────────────────────────
          margin: "0 auto 40px" → centra el div horizontalmente (0 arriba, auto
            izquierda/derecha, 40px abajo).
          maxWidth: "1100px" → el contenido no se estira más de 1100px aunque
            la pantalla sea más ancha (pantallas grandes).
      ──────────────────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto 40px", textAlign: "center" }}>

        {/* Franja roja decorativa superior */}
        <div style={{
          background: "#CC1C1C",
          height: "6px",
          width: "80px",
          margin: "0 auto 16px",
          borderRadius: "3px",
        }} />

        {/* Título principal */}
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          // clamp(min, preferred, max) → tamaño responsivo:
          //   mínimo 2.5rem, preferiblemente 6% del ancho de la ventana,
          //   máximo 4.5rem. Se ajusta automáticamente según el tamaño de pantalla.
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          color: "#F5C800",
          letterSpacing: "3px",
          lineHeight: 1,
          // textShadow: desplazamiento-x desplazamiento-y blur color
          // Agrega un halo amarillo suave debajo del texto
          textShadow: "0 2px 20px rgba(245,200,0,0.3)",
        }}>
          Tienda de Empanadas
        </h1>

        {/* Subtítulo */}
        <p style={{
          color: "#666",
          marginTop: "8px",
          fontSize: "0.9rem",
          letterSpacing: "2px",
          textTransform: "uppercase",  // Muestra el texto en MAYÚSCULAS
        }}>
          Panel de administración
        </p>

        {/* Franja roja decorativa inferior */}
        <div style={{
          background: "#CC1C1C",
          height: "3px",
          width: "120px",
          margin: "16px auto 0",
          borderRadius: "3px",
        }} />
      </div>


      {/* ── Contenido principal ───────────────────────────────────────────────
          flexDirection: "column" → los hijos se apilan verticalmente
          gap: "24px" → espacio de 24px entre cada sección
      ──────────────────────────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>

        {/* ── Formulario de agregar/editar ───────────────────────────────────
            Le pasamos tres props:
            - onGuardar      → función que se llama al enviar el formulario
            - empanadaEditar → empanada seleccionada (o null si es nueva)
            - onCancelar     → función que limpia empanadaEditar (cancela edición)
        ──────────────────────────────────────────────────────────────────── */}
        <FormAgregar
          onGuardar={handleGuardar}
          empanadaEditar={empanadaEditar}
          onCancelar={() => setEmpanadaEditar(null)}
        />

        {/* ── Buscador ───────────────────────────────────────────────────────
            onBuscar → función que actualiza el estado "busqueda"
            Cada vez que el usuario escribe, setBusqueda actualiza el estado
            y el componente se re-renderiza con la lista filtrada.
        ──────────────────────────────────────────────────────────────────── */}
        <Buscador onBuscar={setBusqueda} />

        {/* ── Estado: cargando ───────────────────────────────────────────────
            Solo se muestra si cargando es true.
            El && es renderizado condicional: si la condición es false, no muestra nada.
        ──────────────────────────────────────────────────────────────────── */}
        {cargando && (
          <p style={{ textAlign: "center", color: "#F5C800", padding: "20px" }}>
            Cargando empanadas...
          </p>
        )}

        {/* ── Estado: error ──────────────────────────────────────────────────
            Solo se muestra si error no es null (hay un mensaje de error).
            {error} dentro del párrafo muestra el texto del error.
        ──────────────────────────────────────────────────────────────────── */}
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

        {/* ── Contador de resultados ─────────────────────────────────────────
            Solo se muestra si NO está cargando y NO hay error.
            Muestra cuántas empanadas coinciden con la búsqueda actual.
            El operador ternario maneja el plural: "1 empanada" vs "2 empanadas".
        ──────────────────────────────────────────────────────────────────── */}
        {!cargando && !error && (
          <p style={{ color: "#555", fontSize: "0.85rem" }}>
            {empanadsFiltradas.length} empanada{empanadsFiltradas.length !== 1 ? "s" : ""} encontrada{empanadsFiltradas.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* ── Grilla de tarjetas ─────────────────────────────────────────────
            Solo se muestra si NO está cargando y NO hay error.
            Tiene dos casos:
            1. Lista vacía → muestra un mensaje "No hay empanadas"
            2. Lista con elementos → muestra la grilla de tarjetas
        ──────────────────────────────────────────────────────────────────── */}
        {!cargando && !error && (
          empanadsFiltradas.length === 0 ? (

            // Caso 1: No hay empanadas para mostrar
            <p style={{ textAlign: "center", color: "#444", padding: "40px" }}>
              No hay empanadas para mostrar.
            </p>

          ) : (

            // Caso 2: Hay empanadas → mostramos la grilla
            // display: "grid" → layout de grilla (cuadrícula)
            // repeat(auto-fill, minmax(280px, 1fr)) → crea automáticamente
            //   la cantidad de columnas que entren, con un mínimo de 280px
            //   y máximo de 1fr (fracción igual del espacio disponible).
            //   Esto hace que la grilla sea RESPONSIVA: en pantallas chicas
            //   muestra 1 columna, en pantallas medianas 2, en grandes 3 o más.
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}>

              {/* .map() recorre la lista y devuelve un componente ProductCard
                  por cada empanada. Es como un "for" pero dentro del JSX.
                  key={empanada.id} → React necesita un identificador único
                  en cada elemento de una lista para actualizar eficientemente
                  solo los elementos que cambiaron. */}
              {empanadsFiltradas.map((empanada) => (
                <ProductCard
                  key={empanada.id}
                  empanada={empanada}          // Pasamos los datos de la empanada
                  onEliminar={handleEliminar}  // Función para eliminar
                  onEditar={setEmpanadaEditar} // Al editar, guardamos la empanada en el estado
                />
              ))}
            </div>
          )
        )}

      </div>
    </main>
  );
}
