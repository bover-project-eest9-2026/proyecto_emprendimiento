# models.py
# Este archivo define la estructura de las tablas en la base de datos.
# Cada clase representa UNA tabla.
# Cada atributo representa UNA columna de esa tabla.

from sqlalchemy import Column, Integer, String, Float
from database import Base  # Importamos la Base que definimos en database.py


class Empanada(Base):
    # Nombre de la tabla en la base de datos
    __tablename__ = "empanadas"

    # Columnas de la tabla:

    id = Column(Integer, primary_key=True, index=True)
    # primary_key=True → es el identificador único de cada registro
    # index=True → hace más rápidas las búsquedas por id

    nombre = Column(String, nullable=False)
    # nullable=False → este campo es OBLIGATORIO (no puede estar vacío)
    # Ejemplo: "Empanada de carne", "Empanada de jamón y queso"

    relleno = Column(String, nullable=False)
    # Descripción del relleno
    # Ejemplo: "Carne cortada a cuchillo con aceitunas"

    precio = Column(Float, nullable=False)
    # Float permite decimales → ej: 850.50
    # nullable=False → obligatorio

    stock = Column(Integer, nullable=False, default=0)
    # Cantidad disponible
    # default=0 → si no se indica, arranca en 0
