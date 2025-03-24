from core.database import users_collection
from models import user
from passlib.context import CryptContext

# Create a password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against the hashed version."""
    return pwd_context.verify(plain_password, hashed_password)

def create_user(user: user):
    """Insert a new user into the database."""
    # Hash the password before storing
    hashed_password = hash_password(user.password)
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password  # Store hashed password
    }
    
    result = users_collection.insert_one(user_data)  # Insert into MongoDB
    return str(result.inserted_id)  # Return user ID


def create_jwt_token(data: dict, expires_delta: int = 60):
    """Generate JWT token with expiration time."""
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_delta)
    data.update({"exp": expire})
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_jwt_token(token: str):
    """Verify JWT token and return the payload if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token