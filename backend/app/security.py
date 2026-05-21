import os
from datetime import datetime,timedelta,timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
pwd_context=CryptContext(schemes=['bcrypt'],deprecated='auto')
SECRET_KEY=os.getenv('SECRET_KEY','dev-secret'); ALGORITHM='HS256'; EXPIRE=int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES','1440'))
def hash_password(p): return pwd_context.hash(p)
def verify_password(p,h): return pwd_context.verify(p,h)
def create_token(data):
    to=data.copy(); to.update({'exp':datetime.now(timezone.utc)+timedelta(minutes=EXPIRE)})
    return jwt.encode(to,SECRET_KEY,algorithm=ALGORITHM)
def decode_token(token):
    try: return jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
    except JWTError: return None
