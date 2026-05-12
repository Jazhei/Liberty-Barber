from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Date, Time
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    barber = "barber"
    client = "client"

class AppointmentStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.client)

    # Relaciones
    appointments_as_barber = relationship("Appointment", foreign_keys="Appointment.barber_id", back_populates="barber")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0, nullable=False)

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    duration_minutes = Column(Integer, default=30, nullable=False)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, nullable=False)
    barber_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    barber = relationship("User", foreign_keys=[barber_id])

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    status = Column(Enum(AppointmentStatusEnum), default=AppointmentStatusEnum.pending)
    notes = Column(String, nullable=True)

    client_name = Column(String, nullable=False)
    barber_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    barber = relationship("User", foreign_keys=[barber_id], back_populates="appointments_as_barber")
