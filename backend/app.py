import logging
import utils.env as ENV

from flask import Flask, jsonify
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
from pymongo import MongoClient
from utils import InvalidUsage


# Init Logger
logging.basicConfig(
    level=ENV.LOG_LEVEL,
    format='%(asctime)s %(levelname)s --- %(message)s'
)


# Init MongoDB
mongo_client = None

if ENV.MONGO_SSL_CERT == '':
    mongo_client = MongoClient(ENV.MONGO_CONNECTION_URI, retrywrites=False)
else:
    mongo_client = MongoClient(ENV.MONGO_CONNECTION_URI, retrywrites=False, tls=True, tlsCAFile=ENV.MONGO_SSL_CERT)

mongo_db = mongo_client[ENV.MONGO_DATABASE]


# Init Flask
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


## Init error handlers
@app.errorhandler(InvalidUsage)
def invalid_usage_handler(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.errorhandler(404)
def not_found_exception_handler(error):
    return jsonify({'message': 'The requested URL was not found on the server'}), 404

@app.errorhandler(Exception)
def all_exception_handler(error):
    app.logger.exception('An unhandled exception ocurred')
    return jsonify({'message': 'Internal server error'}), 500


## Init routes
from routes import *


## Init server
app.logger.info(f'Server running on http://0.0.0.0:{ENV.PORT}')

http_server = WSGIServer(('0.0.0.0', ENV.PORT), app)
http_server.serve_forever()