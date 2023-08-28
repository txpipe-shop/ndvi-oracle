from flask import request, jsonify
from flask_cors import cross_origin
from bson.objectid import ObjectId
from bson.dbref import DBRef
from datetime import datetime

from __main__ import app, mongo_db
from utils import validate_body


@app.route('/farms/<farm_id>/fields', methods=['POST'])
@cross_origin()
def create_field(farm_id):

    # TODO: Add authentication

    body = request.get_json(force=True)

    validate_body(body, ['name', 'cropType', 'geometry'])

    id = ObjectId()

    mongo_db.fields.insert_one({
        '_id': id,
        'name': body['name'],
        'cropType': body['cropType'],
        'geometry': body['geometry'],
        'farm': DBRef('farms', farm_id),
        'createdBy': DBRef('users', '0'),
        'createdAt': datetime.now()
    })
    
    return jsonify({ 'id': str(id) })