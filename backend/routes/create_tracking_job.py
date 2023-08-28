from flask import request, jsonify
from flask_cors import cross_origin
from bson.objectid import ObjectId
from bson.dbref import DBRef
from datetime import datetime

from __main__ import app, mongo_db
from utils import validate_body


SAMPLE_RASTER = {
    'kind': 'raster-ndvi',
    'thumbnailUrl': 'data:image/png;base64,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',
    'rasterUrl': 'https://s3-us-east-2.amazonaws.com/milar-pirwa-cache/plots/0833479586f547a786b78d6c5f889a7f.tif',
    'bins': [
        { 'max': 0.27734375, 'min': 0, 'color': '#ff2400' },
        { 'max': 0.30859375, 'min': 0.27734375, 'color': '#ffb600' },
        { 'max': 0.3359375, 'min': 0.30859375, 'color': '#fffe00' },
        { 'max': 1, 'min': 0.3359375, 'color': '#21a509' }
    ]
}


@app.route('/fields/<field_id>/tracking-jobs', methods=['POST'])
@cross_origin()
def create_tracking_job(field_id):

    # TODO: Add authentication

    body = request.get_json(force=True)

    validate_body(body, ['date'])

    id = ObjectId()

    mongo_db.tracking_jobs.insert_one({
        '_id': id,
        'date': body['date'],
        'raster': SAMPLE_RASTER,
        'field': DBRef('fields', field_id),
        'createdBy': DBRef('users', '0'),
        'createdAt': datetime.now()
    })
    
    return jsonify({ 'id': str(id) })