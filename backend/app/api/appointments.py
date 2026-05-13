from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Appointment, User, RoleEnum
from app.schemas.schemas import AppointmentCreate, AppointmentResponse
from typing import List

router = APIRouter()

@router.post("/appointments", response_model=AppointmentResponse)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    # Validar que el barbero exista
    barber = db.query(User).filter(User.id == appointment.barber_id).first()
    if not barber:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
        
    db_appointment = Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.get("/appointments")
def get_appointments(db: Session = Depends(get_db)):
    # Devuelve las citas
    appointments = db.query(Appointment).all()
    
    result = []
    for app in appointments:
        barber = db.query(User).filter(User.id == app.barber_id).first()
        app_dict = {
            "id": app.id,
            "date": app.date,
            "time": app.time,
            "status": app.status,
            "client_name": app.client_name,
            "barber_id": app.barber_id,
            "barber_name": barber.full_name if barber else "Desconocido"
        }
        result.append(app_dict)
    return result    


# Endpoint extra para obtener todos los usuarios (para llenar los selects en el frontend)
@router.get("/users/barbers")
def get_barbers(db: Session = Depends(get_db)):
    barbers = db.query(User).filter(User.role == RoleEnum.barber).all()
    return [{"id": b.id, "full_name": b.full_name} for b in barbers]

#funcion para eliminar una cita
@router.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    import os
    print(f"DB URL: {db.bind.url}")  # <-- muestra qué base de datos está usando
    print(f"Buscando id: {appointment_id}")
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    print(f"Resultado: {appointment}")
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(appointment)
    db.commit()

@router.delete("/test-delete")
def test_delete():
    return {"message": "delete funciona"}
