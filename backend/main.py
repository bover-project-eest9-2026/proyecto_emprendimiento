# main.py
# Este es el archivo principal del backend.
# Aquí se crea el servidor FastAPI y se definen todas las RUTAS (endpoints).
#
# ¿Qué es una ruta? Es una URL que el frontend puede llamar.
# Ejemplo: GET http://localhost:8000/empanadas → devuelve todas las empanadas

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Importamos nuestros propios archivos
import models
import schemas
from database import engine, get_db

# Esto crea todas las tablas en la BD si no existen todavía
# La primera vez que corras el servidor, crea el archivo "empanadas.db"
models.Base.metadata.create_all(bind=engine)

# Creamos la aplicación FastAPI
app = FastAPI(
    title="API Empanadas 🫓",
    description="Backend para la venta de empanadas",
    version="1.0.0"
)

# CORS: permite que el frontend (Next.js en puerto 3000) hable con el backend
# Sin esto, el navegador bloquea las peticiones por seguridad
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],   # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# RUTA RAÍZ → solo para verificar que el servidor funciona
# Probala en el navegador: http://localhost:8000
# ─────────────────────────────────────────────
@app.get("/")
def inicio():
    return {"mensaje": "¡Bienvenido a la API de Empanadas! 🫓"}


# ─────────────────────────────────────────────
# GET /empanadas → Obtener TODAS las empanadas
# El frontend llama esto para mostrar el listado
# ─────────────────────────────────────────────
@app.get("/empanadas", response_model=List[schemas.EmpanadaResponse])
def listar_empanadas(db: Session = Depends(get_db)):
    # db.query(models.Empanada) → hace un SELECT * FROM empanadas
    # .all() → trae todos los resultados
    empanadas = db.query(models.Empanada).all()
    return empanadas


# ─────────────────────────────────────────────
# GET /empanadas/{id} → Obtener UNA empanada por su id
# Ejemplo: GET http://localhost:8000/empanadas/1
# ─────────────────────────────────────────────
@app.get("/empanadas/{empanada_id}", response_model=schemas.EmpanadaResponse)
def obtener_empanada(empanada_id: int, db: Session = Depends(get_db)):
    # .filter() → equivale a WHERE id = empanada_id
    # .first() → trae solo el primer resultado (o None si no existe)
    empanada = db.query(models.Empanada).filter(models.Empanada.id == empanada_id).first()

    # Si no existe, respondemos con error 404
    if empanada is None:
        raise HTTPException(status_code=404, detail="Empanada no encontrada")

    return empanada


# ─────────────────────────────────────────────
# POST /empanadas → Agregar una nueva empanada
# El frontend manda los datos del formulario aquí
# ─────────────────────────────────────────────
@app.post("/empanadas", response_model=schemas.EmpanadaResponse, status_code=201)
def crear_empanada(empanada: schemas.EmpanadaCreate, db: Session = Depends(get_db)):
    # Creamos un objeto del modelo con los datos recibidos
    nueva_empanada = models.Empanada(
        nombre=empanada.nombre,
        relleno=empanada.relleno,
        precio=empanada.precio,
        stock=empanada.stock
    )

    db.add(nueva_empanada)    # La agregamos a la sesión (INSERT)
    db.commit()                # Guardamos los cambios en la BD
    db.refresh(nueva_empanada) # Actualizamos el objeto con el id generado

    return nueva_empanada


# ─────────────────────────────────────────────
# PUT /empanadas/{id} → Editar una empanada existente
# El frontend manda solo los campos que quiere cambiar
# ─────────────────────────────────────────────
@app.put("/empanadas/{empanada_id}", response_model=schemas.EmpanadaResponse)
def editar_empanada(empanada_id: int, datos: schemas.EmpanadaUpdate, db: Session = Depends(get_db)):
    # Buscamos la empanada a editar
    empanada = db.query(models.Empanada).filter(models.Empanada.id == empanada_id).first()

    if empanada is None:
        raise HTTPException(status_code=404, detail="Empanada no encontrada")

    # Actualizamos solo los campos que no son None
    # exclude_unset=True → ignora los campos que no se mandaron
    datos_a_actualizar = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_a_actualizar.items():
        setattr(empanada, campo, valor)  # Equivale a: empanada.nombre = valor

    db.commit()             # Guardamos
    db.refresh(empanada)    # Actualizamos el objeto

    return empanada


# ─────────────────────────────────────────────
# DELETE /empanadas/{id} → Eliminar una empanada
# El frontend llama esto cuando el usuario hace click en "Eliminar"
# ─────────────────────────────────────────────
@app.delete("/empanadas/{empanada_id}")
def eliminar_empanada(empanada_id: int, db: Session = Depends(get_db)):
    # Buscamos la empanada a eliminar
    empanada = db.query(models.Empanada).filter(models.Empanada.id == empanada_id).first()

    if empanada is None:
        raise HTTPException(status_code=404, detail="Empanada no encontrada")

    db.delete(empanada)  # La marcamos para borrar
    db.commit()           # Confirmamos el borrado

    return {"mensaje": f"Empanada '{empanada.nombre}' eliminada correctamente"}


# ─────────────────────────────────────────────
# Para correr el servidor:
# uvicorn main:app --reload
#
# --reload → reinicia automáticamente cuando guardás cambios
#
# Documentación automática disponible en:
# http://localhost:8000/docs  ← interfaz visual para probar las rutas
# ─────────────────────────────────────────────
