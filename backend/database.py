# database.py
# Este archivo configura la conexión con la base de datos SQLite.
# SQLite guarda todos los datos en un archivo local llamado "empanadas.db"
# No necesita instalación ni contraseñas, ideal para desarrollo local.

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexión a SQLite
# El archivo "empanadas.db" se crea automáticamente en la misma carpeta
DATABASE_URL = "sqlite:///./empanadas.db"

# Creamos el motor de conexión
# check_same_thread=False es necesario para que FastAPI funcione con SQLite
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# SessionLocal es la "fábrica" de sesiones de base de datos
# Cada vez que necesitemos hablar con la BD, abrimos una sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base es la clase padre de todos nuestros modelos (tablas)
Base = declarative_base()


# Esta función se usa en cada ruta para obtener y cerrar la sesión correctamente
# Se llama con "Depends(get_db)" en las rutas
def get_db():
    db = SessionLocal()  # Abre la conexión
    try:
        yield db          # La usa
    finally:
        db.close()        # La cierra siempre, aunque haya un error
