from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Sale, Appointment
from app.schemas.schemas import SaleCreate, SaleResponse
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/sales", response_model=SaleResponse)
def create_sale(sale: SaleCreate, appointment_id: int = None, db: Session = Depends(get_db)):
    # Crear la venta
    db_sale = Sale(
        amount=sale.amount,
        description=sale.description,
        date=sale.date or datetime.now(),
        barber_id=sale.barber_id
    )
    db.add(db_sale)
    
    # Si viene con un appointment_id, lo eliminamos (o lo marcamos como completado)
    if appointment_id:
        appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
        if appointment:
            db.delete(appointment)
            
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.get("/sales", response_model=List[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()
