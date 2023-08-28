from flask import Request
from .error import InvalidUsage
from .token import decode_user_token


def _get_request_token(request: Request) -> str:
    if request.headers.get('authorization') == None:
        raise InvalidUsage('Missing authorization header', status_code=401)

    token = request.headers.get('authorization').split(' ')
    if len(token) != 2:
        raise InvalidUsage('Invalid authorization header', status_code=401)

    try:
        return token.pop()
    except:
        raise InvalidUsage('Invalid authorization header', status_code=401)


def get_request_user(request: Request) -> dict:
    token = _get_request_token(request)

    try:
        return decode_user_token(token)
    except:
        raise InvalidUsage('Invalid token provided', status_code=403)
