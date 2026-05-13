# main.py
# Backend completo para la venta de empanadas usando JSON como base de datos.
# Los datos se guardan en un archivo "productos.json" en la misma carpeta.
# No necesita PostgreSQL ni SQLite, todo es un archivo de texto.
#
# Para correr el servidor:
# uvicorn main:app --reload
#
# Documentación automática:
# http://localhost:8000/docs

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os

# ─── CONFIGURACIÓN ─────────────────────────────────────────

app = FastAPI(
    title="API Empanadas 🫓",
    description="Backend para la venta de empanadas",
    version="1.0.0"
)

# CORS: permite que el frontend (Next.js en puerto 3000) hable con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta del archivo JSON donde se guardan los datos
ARCHIVO_JSON = "productos.json"


# ─── MODELOS ───────────────────────────────────────────────

# Modelo para CREAR una empanada (lo que manda el frontend)
class EmpanadaCreate(BaseModel):
    nombre: str
    relleno: str
    precio: float
    stock: int

# Modelo para EDITAR una empanada (todos los campos opcionales)
class EmpanadaUpdate(BaseModel):
    nombre: Optional[str] = None
    relleno: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None


# ─── FUNCIONES PARA MANEJAR EL JSON ────────────────────────

def leer_productos():
    """Lee el archivo JSON y devuelve la lista de productos.
    Si el archivo no existe, lo crea vacío."""

    if not os.path.exists(ARCHIVO_JSON):
        # Si no existe el archivo, lo creamos con una lista vacía
        guardar_productos([])
        return []

    with open(ARCHIVO_JSON, "r", encoding="utf-8") as f:
        return json.load(f)
        # json.load() → convierte el texto JSON a una lista de Python


def guardar_productos(productos):
    """Guarda la lista de productos en el archivo JSON."""

    with open(ARCHIVO_JSON, "w", encoding="utf-8") as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
        # json.dump() → convierte la lista Python a texto JSON
        # ensure_ascii=False → permite caracteres como ñ, á, é
        # indent=2 → formato legible con sangría de 2 espacios


def generar_id(productos):
    """Genera un nuevo id único para una empanada.
    Busca el id más alto y le suma 1."""

    if not productos:
        return 1  # Si no hay productos, el primer id es 1

    return max(p["id"] for p in productos) + 1
    # max() → busca el id más alto de todos los productos


# ─── RUTAS ─────────────────────────────────────────────────

# Ruta raíz → para verificar que el servidor funciona
@app.get("/")
def inicio():
    return {"mensaje": "¡Bienvenido a la API de Empanadas! 🫓"}


# ───────────────────────────────────────────────────────────
# GET /empanadas → Obtener TODAS las empanadas
# El frontend llama esto para mostrar el listado
# ───────────────────────────────────────────────────────────
@app.get("/empanadas")
def listar_empanadas():
    productos = leer_productos()  # Leemos el JSON
    return productos              # Devolvemos la lista completa


# ───────────────────────────────────────────────────────────
# GET /empanadas/{id} → Obtener UNA empanada por id
# Ejemplo: GET http://localhost:8000/empanadas/1
# ───────────────────────────────────────────────────────────
@app.get("/empanadas/{empanada_id}")
def obtener_empanada(empanada_id: int):
    productos = leer_productos()

    # Buscamos la empanada con el id recibido
    for producto in productos:
        if producto["id"] == empanada_id:
            return producto

    # Si no la encontramos, respondemos con error 404
    raise HTTPException(status_code=404, detail="Empanada no encontrada")


# ───────────────────────────────────────────────────────────
# POST /empanadas → Agregar una nueva empanada
# El frontend manda los datos del formulario
# ───────────────────────────────────────────────────────────
@app.post("/empanadas", status_code=201)
def crear_empanada(empanada: EmpanadaCreate):
    productos = leer_productos()  # Leemos los productos actuales

    # Creamos el nuevo producto como diccionario
    nuevo = {
        "id": generar_id(productos),   # Generamos un id único
        "nombre": empanada.nombre,
        "relleno": empanada.relleno,
        "precio": empanada.precio,
        "stock": empanada.stock,
    }

    productos.append(nuevo)       # Lo agregamos a la lista
    guardar_productos(productos)  # Guardamos el JSON actualizado

    return nuevo  # Devolvemos el producto creado con su id


# ───────────────────────────────────────────────────────────
# PUT /empanadas/{id} → Editar una empanada existente
# El frontend manda solo los campos que quiere cambiar
# ───────────────────────────────────────────────────────────
@app.put("/empanadas/{empanada_id}")
def editar_empanada(empanada_id: int, datos: EmpanadaUpdate):
    productos = leer_productos()

    # Buscamos la empanada con el id recibido
    for i, producto in enumerate(productos):
        if producto["id"] == empanada_id:

            # Actualizamos solo los campos que no son None
            cambios = datos.model_dump(exclude_unset=True)
            productos[i].update(cambios)
            # .update() → actualiza el diccionario con los nuevos valores

            guardar_productos(productos)  # Guardamos
            return productos[i]           # Devolvemos el producto actualizado

    raise HTTPException(status_code=404, detail="Empanada no encontrada")


# ───────────────────────────────────────────────────────────
# DELETE /empanadas/{id} → Eliminar una empanada
# El frontend llama esto al hacer click en "Eliminar"
# ───────────────────────────────────────────────────────────
@app.delete("/empanadas/{empanada_id}")
def eliminar_empanada(empanada_id: int):
    productos = leer_productos()

    # Filtramos la lista EXCLUYENDO el producto con el id recibido
    productos_filtrados = [p for p in productos if p["id"] != empanada_id]

    # Si la lista no cambió, el producto no existía
    if len(productos_filtrados) == len(productos):
        raise HTTPException(status_code=404, detail="Empanada no encontrada")

    guardar_productos(productos_filtrados)  # Guardamos la lista sin el producto

    return {"mensaje": "Empanada eliminada correctamente"}
