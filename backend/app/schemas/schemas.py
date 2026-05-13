from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, time, datetime
from app.models.models import RoleEnum, AppointmentStatusEnum

# --- Sale Schemas ---
class SaleBase(BaseModel):
    amount: float
    description: Optional[str] = None
    date: datetime
    barber_id: Optional[int] = None

class SaleCreate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: int

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[RoleEnum] = RoleEnum.client

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    is_insumo: bool = False

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True
# --- Service Schemas ---
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    duration_minutes: int

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True

# --- Appointment Schemas ---
class AppointmentBase(BaseModel):
    date: date
    time: time
    status: Optional[AppointmentStatusEnum] = AppointmentStatusEnum.pending
    notes: Optional[str] = None
    client_name: str
    barber_id: int

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int
    
    class Config:
        from_attributes = True
