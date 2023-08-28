from flask import jsonify
from flask_cors import cross_origin

from __main__ import app, mongo_db


@app.route('/farms', methods=['GET'])
@cross_origin()
def list_farms():

    # TODO: Add authentication

    return jsonify({
        'farms': list(map(
            lambda d: {
                'id': str(d['_id']),
                'name': d['name'],
                'latitude': d['latitude'],
                'longitude': d['longitude'],
                'createdAt': d['createdAt'].isoformat()
            },
            mongo_db.farms.find()
        ))
    })