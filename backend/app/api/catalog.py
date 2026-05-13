from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Service, Product
from app.schemas.schemas import ServiceResponse, ProductResponse, ServiceCreate, ProductCreate
from typing import List

router = APIRouter()

@router.get("/services", response_model=List[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()

@router.post("/services", response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.get("/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.post("/products", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock=product.stock,
        is_insumo=product.is_insumo
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(product)
    db.commit()