import os
from dotenv import load_dotenv


load_dotenv()

PORT = int(os.getenv('PORT', default='5000'))
LOG_LEVEL = os.getenv('LOG_LEVEL', default='DEBUG').upper()
JWT_SECRET = os.getenv('JWT_SECRET')
MONGO_CONNECTION_URI = os.getenv('MONGO_CONNECTION_URI')
MONGO_SSL_CERT = os.getenv('MONGO_SSL_CERT', default='')
MONGO_DATABASE = os.getenv('MONGO_DATABASE')
