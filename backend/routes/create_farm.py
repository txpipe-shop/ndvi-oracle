from flask import request, jsonify
from flask_cors import cross_origin
from bson.objectid import ObjectId
from bson.dbref import DBRef
from datetime import datetime

from __main__ import app, mongo_db
from utils import validate_body


@app.route('/farms', methods=['POST'])
@cross_origin()
def create_farm():

    # TODO: Add authentication

    body = request.get_json(force=True)

    validate_body(body, ['name', 'latitude', 'longitude'])

    id = ObjectId()

    mongo_db.farms.insert_one({
        '_id': id,
        'name': body['name'],
        'latitude': body['latitude'],
        'longitude': body['longitude'],
        'createdBy': DBRef('users', '0'),
        'createdAt': datetime.now()
    })
    
    return jsonify({ 'id': str(id) })