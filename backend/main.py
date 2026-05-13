from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import auth, appointments, catalog, sales

# Esto asegura que las tablas se creen al iniciar, aunque ya lo hacemos en init_db.py
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Liberty Barber API")

# Configuración de CORS para permitir peticiones desde el frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(appointments.router, prefix="/api")
app.include_router(catalog.router, prefix="/api")
app.include_router(sales.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Liberty Barber"}
