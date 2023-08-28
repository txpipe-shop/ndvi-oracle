import jwt

from .env import JWT_SECRET


def encode_user_token(user_id: str) -> str:
    return jwt.encode({'user_id': user_id}, JWT_SECRET, algorithm='HS256')


def decode_user_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
