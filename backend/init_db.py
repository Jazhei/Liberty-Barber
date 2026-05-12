from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.models import User, RoleEnum
import bcrypt

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def init_db():
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
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
        db.commit()
        print(f"Usuario '{email}' con contraseña '123' creado con éxito.")
    else:
        print(f"El usuario '{email}' ya existe.")
        
    db.close()

if __name__ == "__main__":
    init_db()
