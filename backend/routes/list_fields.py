from flask import jsonify
from flask_cors import cross_origin

from __main__ import app, mongo_db


@app.route('/farms/<farm_id>/fields', methods=['GET'])
@cross_origin()
def list_fields(farm_id):

    # TODO: Add authentication

    return jsonify({
        'fields': list(map(
            lambda d: {
                'id': str(d['_id']),
                'name': d['name'],
                'cropType': d['cropType'],
                'geometry': d['geometry'],
                'createdAt': d['createdAt'].isoformat()
            },
            mongo_db.fields.find({
                'farm.$id': farm_id
            })
        ))
    })