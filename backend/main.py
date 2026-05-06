from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "postgresql://postgres:1234@localhost/emprendimiento"
engine = create_engine(DATABASE_URL)

@app.get("/productos")
def listar():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM productos"))
        return [dict(row._mapping) for row in result]


@app.post("/productos")
def agregar(nombre: str, precio: float, stock: int):
    with engine.connect() as conn:
        conn.execute(
            text("INSERT INTO productos (nombre, precio, stock) VALUES (:n, :p, :s)"),
            {"n": nombre, "p": precio, "s": stock}
        )
        conn.commit()
    return {"ok": True}


@app.delete("/productos/{id}")
def eliminar(id: int):
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM productos WHERE id = :id"), {"id": id})
        conn.commit()
    return {"ok": True}