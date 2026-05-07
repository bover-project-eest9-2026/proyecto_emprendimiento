# schemas.py
# Los schemas son "moldes" que validan los datos que entran y salen de la API.
# Usamos Pydantic (viene incluido con FastAPI) para esto.
# 
# ¿Por qué necesitamos schemas si ya tenemos models?
# - models.py → define cómo se guarda en la BD
# - schemas.py → define cómo se reciben y envían los datos por la API

from pydantic import BaseModel
from typing import Optional


# Schema para CREAR una empanada (lo que manda el frontend al hacer POST)
# No incluye "id" porque la BD lo genera automáticamente
class EmpanadaCreate(BaseModel):
    nombre: str        # Texto obligatorio
    relleno: str       # Texto obligatorio
    precio: float      # Número decimal obligatorio
    stock: int         # Número entero obligatorio


# Schema para ACTUALIZAR una empanada (lo que manda el frontend al hacer PUT)
# Todos los campos son opcionales → solo se actualiza lo que se manda
class EmpanadaUpdate(BaseModel):
    nombre: Optional[str] = None    # Si no se manda, no se cambia
    relleno: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None


# Schema para RESPONDER al frontend (lo que devuelve la API)
# Incluye el "id" porque ya fue generado por la BD
class EmpanadaResponse(BaseModel):
    id: int
    nombre: str
    relleno: str
    precio: float
    stock: int

    # Esta configuración permite que Pydantic lea objetos de SQLAlchemy
    # Sin esto, no podría convertir el modelo de BD a JSON
    class Config:
        from_attributes = True
