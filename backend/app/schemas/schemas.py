from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, time
from app.models.models import RoleEnum, AppointmentStatusEnum

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
        orm_mode = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        orm_mode = True

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
        orm_mode = True

# --- Appointment Schemas ---
class AppointmentBase(BaseModel):
    date: date
    time: time
    status: Optional[AppointmentStatusEnum] = AppointmentStatusEnum.pending
    notes: Optional[str] = None
    client_id: int
    barber_id: int
    service_id: Optional[int] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int
    
    class Config:
        orm_mode = True
