from flask import jsonify
from flask_cors import cross_origin

from __main__ import app, mongo_db


@app.route('/fields/<field_id>/tracking-jobs', methods=['GET'])
@cross_origin()
def list_tracking_jobs(field_id):

    # TODO: Add authentication

    return jsonify({
        'trackingJobs': list(map(
            lambda d: {
                'id': str(d['_id']),
                'date': d['date'],
                'raster': d['raster'],
                'createdAt': d['createdAt'].isoformat()
            },
            mongo_db.tracking_jobs.find({
                'field.$id': field_id
            })
        ))
    })