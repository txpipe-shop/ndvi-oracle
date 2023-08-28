from .error import InvalidUsage


def validate_body(body, fields):
    for field in fields:
        if not field in body or body[field] == None:
            raise InvalidUsage(f'Missing {field} parameter', status_code=400)
