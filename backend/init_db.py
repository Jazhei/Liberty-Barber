from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.models import User, RoleEnum, Sale, Service, Product
import bcrypt
from datetime import datetime, timedelta

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def init_db():
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Usuario admin Benja
    email = "benja@barberia.com"
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        new_user = User(
            email=email,
            full_name="benja",
            hashed_password=get_password_hash("123"),
            role=RoleEnum.admin
        )
        db.add(new_user)
        print(f"Usuario '{email}' con contraseña '123' creado con éxito.")
    
    # Barbero Ivan
    ivan_email = "ivan@barberia.com"
    ivan = db.query(User).filter(User.email == ivan_email).first()
    if not ivan:
        ivan = User(
            email=ivan_email,
            full_name="Ivan",
            hashed_password=get_password_hash("123"),
            role=RoleEnum.barber
        )
        db.add(ivan)
        
    # Barbero Jean Carlos
    jean_email = "jeancarlos@barberia.com"
    jean = db.query(User).filter(User.email == jean_email).first()
    if not jean:
        jean = User(
            email=jean_email,
            full_name="Jean Carlos",
            hashed_password=get_password_hash("123"),
            role=RoleEnum.barber
        )
        db.add(jean)

    db.commit()

    # Create dummy sales
    if db.query(Sale).count() == 0:
        now = datetime.now()
        sales = [
            Sale(amount=12000, description="Corte de pelo regular", date=now - timedelta(days=1), barber_id=ivan.id),
            Sale(amount=12000, description="Corte de pelo regular", date=now, barber_id=ivan.id),
            Sale(amount=12000, description="Corte de pelo regular", date=now, barber_id=jean.id)
        ]
        db.add_all(sales)
        db.commit()
        print("Ventas de prueba creadas exitosamente.")

    # Create Services
    if db.query(Service).count() == 0:
        services = [
            Service(name="Corte de pelo regular", description="Corte clásico con máquina y tijera", price=12000, duration_minutes=30),
            Service(name="Perfilado de barba", description="Arreglo de barba con navaja", price=5000, duration_minutes=15)
        ]
        db.add_all(services)
        db.commit()
        print("Servicios creados exitosamente.")

    # Create Products
    if db.query(Product).count() == 0:
        products = [
            Product(name="Cera para peinar mate", description="Fijación fuerte, acabado mate", price=8000, stock=20),
            Product(name="Agua mineral", description="Botella de agua 500ml", price=1000, stock=50),
            Product(name="Refresco en lata", description="Bebida carbonatada 330ml", price=1500, stock=30)
        ]
        db.add_all(products)
        db.commit()
        print("Productos creados exitosamente.")
        
    db.close()

if __name__ == "__main__":
    init_db()
