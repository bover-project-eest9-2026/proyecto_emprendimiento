# main.py
# ─────────────────────────────────────────────────────────────────────────────
# Este archivo es el BACKEND (el servidor) de una tienda de empanadas.
# El backend es la parte que el usuario NO ve: recibe pedidos del frontend
# (la página web), los procesa y devuelve respuestas.
#
# En vez de usar una base de datos compleja (como PostgreSQL o SQLite),
# guardamos todo en un archivo de texto llamado "productos.json".
# Un archivo .json es simplemente texto con un formato especial que
# permite guardar listas y diccionarios de Python.
#
# ¿Cómo correr el servidor?
#   uvicorn main:app --reload
#   → "uvicorn" es el programa que ejecuta el servidor
#   → "main" es el nombre de este archivo (main.py)
#   → "app" es el nombre de la aplicación FastAPI que definimos abajo
#   → "--reload" hace que el servidor se reinicie solo cuando cambiamos el código
#
# ¿Dónde ver la documentación?
#   http://localhost:8000/docs
#   → FastAPI genera automáticamente una página donde podés probar todas
#     las rutas sin necesidad de un frontend
# ─────────────────────────────────────────────────────────────────────────────

# ── IMPORTACIONES ─────────────────────────────────────────────────────────────
# "import" trae herramientas de otros archivos o librerías instaladas.

from fastapi import FastAPI, HTTPException
# FastAPI  → el framework (conjunto de herramientas) que usamos para crear el servidor web.
# HTTPException → nos permite enviar errores HTTP con un mensaje claro al frontend.
#   Por ejemplo: "404 Not Found" si no se encuentra una empanada.

from fastapi.middleware.cors import CORSMiddleware
# CORS (Cross-Origin Resource Sharing) → una política de seguridad de los navegadores.
# Por defecto, un navegador NO deja que una página web hable con un servidor
# que está en otro dominio o puerto. CORSMiddleware le dice a nuestro servidor:
# "está bien, dejá pasar pedidos desde el frontend".

from pydantic import BaseModel
# Pydantic → librería que valida datos automáticamente.
# BaseModel es la clase base para definir "moldes" de datos (modelos).
# Si el frontend manda un precio como texto ("diez") en vez de número (10.0),
# Pydantic devuelve un error automáticamente.

from typing import Optional
# Optional → indica que un campo puede tener un valor o puede ser None (vacío).
# Se usa en el modelo de edición, donde no todos los campos son obligatorios.

import json
# json → módulo incluido en Python para leer y escribir archivos JSON.
# json.load()  → convierte texto JSON en estructuras de Python (listas, diccionarios)
# json.dump()  → convierte estructuras de Python en texto JSON

import os
# os → módulo incluido en Python para interactuar con el sistema operativo.
# Lo usamos para verificar si el archivo productos.json ya existe en el disco.


# ─── CONFIGURACIÓN DE LA APLICACIÓN ──────────────────────────────────────────

# Creamos la aplicación FastAPI. "app" es el objeto principal del servidor.
# Todo lo que hagamos a continuación (rutas, middleware, etc.) se agrega a "app".
app = FastAPI(
    title="API Empanadas 🫓",           # Nombre que aparece en la documentación
    description="Backend para la venta de empanadas",  # Descripción en la documentación
    version="1.0.0"                     # Versión de nuestra API
)

# ── Configuración de CORS ─────────────────────────────────────────────────────
# Le decimos al servidor desde qué orígenes (dominios/puertos) puede recibir pedidos.
# Esto es necesario porque el frontend (Next.js) corre en el puerto 3000
# y el backend corre en el puerto 8000. Sin esto, el navegador bloquea la comunicación.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Solo permitimos pedidos desde este origen
    allow_credentials=True,   # Permite enviar cookies o credenciales junto al pedido
    allow_methods=["*"],      # Permite todos los métodos HTTP: GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],      # Permite todos los encabezados HTTP
)

# ── Ruta del archivo de datos ─────────────────────────────────────────────────
# Guardamos el nombre del archivo en una variable para no repetirlo en el código.
# Si en el futuro cambiamos el nombre del archivo, solo lo cambiamos acá.
ARCHIVO_JSON = "productos.json"


# ─── MODELOS DE DATOS ────────────────────────────────────────────────────────
# Un "modelo" define la estructura que deben tener los datos que recibe el servidor.
# Pydantic valida automáticamente que el frontend mande los tipos correctos.

# Modelo para CREAR una empanada.
# Todos los campos son OBLIGATORIOS. Si falta uno, FastAPI devuelve error automáticamente.
class EmpanadaCreate(BaseModel):
    nombre: str     # str  → texto (string). Ej: "Empanada de carne"
    relleno: str    # str  → texto. Ej: "Carne cortada a cuchillo"
    precio: float   # float → número con decimales. Ej: 350.0
    stock: int      # int  → número entero (sin decimales). Ej: 20

# Modelo para EDITAR una empanada.
# Todos los campos son OPCIONALES (Optional[tipo] = None).
# Así el frontend puede mandar solo el campo que quiere cambiar,
# sin necesitar mandar todos los datos de nuevo.
class EmpanadaUpdate(BaseModel):
    nombre: Optional[str] = None    # Si no se manda, queda como None (vacío)
    relleno: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None


# ─── FUNCIONES AUXILIARES PARA EL ARCHIVO JSON ────────────────────────────────
# Estas funciones encapsulan (agrupan) la lógica de leer y escribir el JSON.
# Las usamos en las rutas para no repetir código.

def leer_productos():
    """
    Lee el archivo JSON y devuelve la lista de productos como lista de Python.
    Si el archivo todavía no existe (primera vez que se corre el servidor),
    lo crea con una lista vacía para evitar errores.
    """

    if not os.path.exists(ARCHIVO_JSON):
        # os.path.exists() devuelve True si el archivo existe, False si no.
        # El "not" lo invierte: entramos al if cuando el archivo NO existe.
        guardar_productos([])  # Creamos el archivo con una lista vacía []
        return []              # Devolvemos una lista vacía

    # Si el archivo existe, lo abrimos en modo lectura ("r" = read)
    # "encoding='utf-8'" permite leer caracteres especiales como ñ, á, é, etc.
    with open(ARCHIVO_JSON, "r", encoding="utf-8") as f:
        return json.load(f)
        # json.load(f) → lee el contenido del archivo y lo convierte en una lista de Python.
        # El resultado es algo como:
        # [{"id": 1, "nombre": "Carne", "relleno": "...", "precio": 350.0, "stock": 20}]


def guardar_productos(productos):
    """
    Recibe la lista de productos (lista de Python) y la guarda en el archivo JSON.
    Sobreescribe el archivo completo cada vez (no agrega, reemplaza).
    """

    # Abrimos el archivo en modo escritura ("w" = write).
    # Si el archivo no existe, Python lo crea. Si existe, lo reemplaza.
    with open(ARCHIVO_JSON, "w", encoding="utf-8") as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
        # json.dump() → convierte la lista Python a texto JSON y lo escribe en el archivo.
        # ensure_ascii=False → permite guardar caracteres especiales (ñ, á, etc.) tal cual.
        #   Sin esto, "ñ" se guardaría como "\u00f1", que es ilegible para humanos.
        # indent=2 → agrega sangría de 2 espacios para que el JSON sea legible.
        #   Sin indent, todo quedaría en una sola línea difícil de leer.


def generar_id(productos):
    """
    Genera un número de id único para una nueva empanada.
    Busca el id más alto entre todos los productos existentes y le suma 1.
    Así nunca se repite un id, aunque se hayan eliminado productos.
    """

    if not productos:
        # Si la lista está vacía (no hay productos), el primer id es 1.
        return 1

    return max(p["id"] for p in productos) + 1
    # Esto es una "generator expression" (expresión generadora):
    # → recorre todos los productos (p)
    # → extrae el valor del campo "id" de cada uno (p["id"])
    # → max() toma el más alto
    # → le sumamos 1 para que el nuevo id sea el siguiente


# ─── RUTAS (ENDPOINTS) ────────────────────────────────────────────────────────
# Una "ruta" o "endpoint" es una URL a la que el frontend puede hacer pedidos.
# Cada ruta tiene:
#   - Un método HTTP (GET, POST, PUT, DELETE)
#   - Una URL (/empanadas, /empanadas/1, etc.)
#   - Una función que se ejecuta cuando llega el pedido


# ── GET / ──────────────────────────────────────────────────────────────────────
# Ruta raíz. Solo sirve para verificar que el servidor está funcionando.
# Al entrar a http://localhost:8000/ en el navegador, devuelve un mensaje de bienvenida.
@app.get("/")
def inicio():
    # Devolvemos un diccionario. FastAPI lo convierte automáticamente a JSON.
    return {"mensaje": "¡Bienvenido a la API de Empanadas! 🫓"}


# ── GET /empanadas ─────────────────────────────────────────────────────────────
# Devuelve la lista COMPLETA de empanadas.
# El frontend llama esta ruta para mostrar todas las empanadas disponibles.
# Ejemplo: GET http://localhost:8000/empanadas
@app.get("/empanadas")
def listar_empanadas():
    productos = leer_productos()  # Leemos todos los productos del archivo JSON
    return productos               # FastAPI convierte la lista a JSON y la envía


# ── GET /empanadas/{id} ────────────────────────────────────────────────────────
# Devuelve UNA sola empanada según su id.
# {empanada_id} en la URL es un "parámetro de ruta": el valor que ponga el frontend
# en la URL se pasa automáticamente como argumento a la función.
# Ejemplo: GET http://localhost:8000/empanadas/3 → busca la empanada con id=3
@app.get("/empanadas/{empanada_id}")
def obtener_empanada(empanada_id: int):
    # empanada_id: int → FastAPI convierte el valor de la URL a entero automáticamente.
    # Si el frontend manda /empanadas/abc (no es número), devuelve error automáticamente.

    productos = leer_productos()  # Leemos todos los productos

    # Recorremos la lista buscando el producto con el id indicado
    for producto in productos:
        if producto["id"] == empanada_id:
            return producto  # ¡Lo encontramos! Lo devolvemos y terminamos la función.

    # Si el loop termina sin encontrar el producto, lanzamos un error HTTP 404.
    # HTTPException interrumpe la función y envía la respuesta de error al frontend.
    # status_code=404 → código estándar de HTTP para "recurso no encontrado"
    # detail → mensaje descriptivo que verá el frontend o el desarrollador
    raise HTTPException(status_code=404, detail="Empanada no encontrada")


# ── POST /empanadas ────────────────────────────────────────────────────────────
# Crea una NUEVA empanada y la agrega al archivo JSON.
# El frontend manda los datos del formulario en el cuerpo (body) del pedido.
# Ejemplo: POST http://localhost:8000/empanadas con body: {"nombre": "...", ...}
@app.post("/empanadas", status_code=201)
# status_code=201 → código HTTP estándar para "recurso creado exitosamente".
# Por defecto FastAPI usa 200 ("OK"), pero 201 es más preciso para creaciones.
def crear_empanada(empanada: EmpanadaCreate):
    # "empanada: EmpanadaCreate" → FastAPI lee el body JSON del pedido y lo convierte
    # automáticamente al modelo EmpanadaCreate. Si faltan campos o tienen tipos incorrectos,
    # devuelve un error 422 antes de siquiera llegar a esta función.

    productos = leer_productos()  # Leemos los productos existentes

    # Creamos el nuevo producto como un diccionario de Python.
    # Un diccionario es una colección de pares "clave: valor", como un formulario.
    nuevo = {
        "id": generar_id(productos),   # Generamos un id único automáticamente
        "nombre": empanada.nombre,     # Accedemos a los campos del modelo con punto (.)
        "relleno": empanada.relleno,
        "precio": empanada.precio,
        "stock": empanada.stock,
    }

    productos.append(nuevo)        # .append() agrega el nuevo diccionario al final de la lista
    guardar_productos(productos)   # Guardamos la lista actualizada en el archivo JSON

    return nuevo  # Devolvemos el producto recién creado (con su id asignado)


# ── PUT /empanadas/{id} ────────────────────────────────────────────────────────
# Edita una empanada existente. Solo actualiza los campos que se manden.
# Combina un parámetro de ruta ({empanada_id}) con datos en el body.
# Ejemplo: PUT http://localhost:8000/empanadas/2 con body: {"precio": 400.0}
@app.put("/empanadas/{empanada_id}")
def editar_empanada(empanada_id: int, datos: EmpanadaUpdate):
    # empanada_id → id de la empanada a editar (viene de la URL)
    # datos       → campos a actualizar (vienen del body, todos opcionales)

    productos = leer_productos()  # Leemos los productos actuales

    # Usamos enumerate() para obtener tanto el índice (i) como el valor (producto)
    # de cada elemento de la lista. Necesitamos el índice para poder modificar
    # el elemento directamente dentro de la lista.
    for i, producto in enumerate(productos):
        if producto["id"] == empanada_id:

            # .model_dump(exclude_unset=True) convierte el modelo Pydantic a diccionario,
            # pero SOLO incluye los campos que el frontend mandó explícitamente.
            # Así evitamos sobreescribir campos con None cuando no se mandaron.
            # Ej: si solo se mandó {"precio": 400.0}, cambios = {"precio": 400.0}
            cambios = datos.model_dump(exclude_unset=True)

            # .update() actualiza el diccionario del producto con los nuevos valores.
            # Los campos que no están en "cambios" quedan igual.
            productos[i].update(cambios)

            guardar_productos(productos)  # Guardamos los cambios en el archivo JSON
            return productos[i]           # Devolvemos el producto ya actualizado

    # Si no encontramos la empanada, enviamos error 404
    raise HTTPException(status_code=404, detail="Empanada no encontrada")


# ── DELETE /empanadas/{id} ─────────────────────────────────────────────────────
# Elimina una empanada de la lista según su id.
# Ejemplo: DELETE http://localhost:8000/empanadas/5 → elimina la empanada con id=5
@app.delete("/empanadas/{empanada_id}")
def eliminar_empanada(empanada_id: int):
    productos = leer_productos()  # Leemos los productos actuales

    # Creamos una nueva lista que contiene TODOS los productos EXCEPTO el que queremos borrar.
    # Esto se llama "list comprehension" (comprensión de lista): es una forma compacta
    # de recorrer una lista y filtrar elementos según una condición.
    # La condición "p["id"] != empanada_id" significa: "incluir solo si el id NO coincide"
    productos_filtrados = [p for p in productos if p["id"] != empanada_id]

    # Si la lista filtrada tiene el mismo largo que la original,
    # significa que no se eliminó nada → el producto no existía.
    if len(productos_filtrados) == len(productos):
        raise HTTPException(status_code=404, detail="Empanada no encontrada")

    guardar_productos(productos_filtrados)  # Guardamos la lista sin el producto eliminado

    # Devolvemos un mensaje de confirmación.
    # No devolvemos el producto eliminado porque ya no existe en nuestros datos.
    return {"mensaje": "Empanada eliminada correctamente"}