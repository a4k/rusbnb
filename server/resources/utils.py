from typing import Callable
from flask import request, abort
import jwt
import os
import time


token_lifetime = lambda: time.time() + 60*60*24*14
""" lambda to get the token expiration time of 2 weeks relative to the current time """


def get_headers(key: str):
  """ 
  function get dict with headers from current request and return value for key

  @param key: key what value will be returned from headers dict
  @type key: str
  """
  headers = request.headers
  return headers.get(key)


blocked_tokens = []


def block_token(token: str):
  """
  function add token which must be blocked to array

  @param token: token which must be blocked
  @type token: str
  """
  global blocked_tokens
  blocked_tokens.add(token)


def jwt_required(arg=None, with_payload=None):
    def wrapper_block(func: Callable) -> Callable: 
        """ 
        decorator for usefull handling request on secure urls 

        @param func: wrapped function 
        @type func: Callable 
        """ 
        def wrapper(*args, **kwargs) -> Callable: 
            """ 
            function handle errors in authorization by jwt token 
            """ 
            global blocked_tokens 
        
            # get Authorization value from headers in format: "Bearer <token>" 
            access = get_headers('Authorization') 
            
            # if auth value missed, return code 401 with error text 
            if not access: 
                return abort( 
                    401, 
                    "access token must be in request headers with key 'Authorization'") 

            # split the auth type and token by using the space character " " 
            auth_type = access.split(' ')[0]

            # if auth type is not Bearer, return code 400 with error text 
            if auth_type != 'Bearer': 
                return abort(400, "Only 'Bearer' type of authentication is supported") 
            
            # take auth token 
            token = access.split(' ')[1]

            # if token in blocked tokens array and token hasn't expired, than return 400 and message about token blocking 
            #                                   if token expired, return 408 and info message about token expiration 
            # token must be blocked until the expired when user use /logout 
            if token in blocked_tokens: 
                try: 
                    payload = jwt.decode( 
                        token,
                        os.getenv('APP_SECRET_KEY'),
                        algorithms=['HS256'] 
                    ) 
                    return abort(400, "token has been blocked") 
                
                except jwt.ExpiredSignatureError: 
                    blocked_tokens = [x for x in blocked_tokens if x != token] 
                    return abort(408, "token has been expiried")
            
            # try to get payload from jwt token. 
            try: 
                payload = jwt.decode( 
                    token, 
                    os.getenv('APP_SECRET_KEY'), 
                    algorithms=['HS256'] 
                )
            except jwt.ExpiredSignatureError:
                return abort(408, "token has expired")
            except jwt.InvalidTokenError:
                return abort(400, "token is invalid")

            # if its OK, check if arg is none and handling arg
            if arg is not None:
                if payload["id"] != kwargs[arg]:
                    return abort(400, "access denied")

            if payload is None:
                return func(*args, **kwargs)
            if payload is not None:
                return func(*args, **kwargs, payload=payload)

        return wrapper
    return wrapper_block


def generate_token(
                    payload: dict,
                    token_expire_time: int = token_lifetime):
    """
    function encode custom payload to token with using 'HS256' algorithm with expired time (default: 14 days)

    @param payload: dict with payload data which must be encoded in token
    @type payload: dict

    :param token_expire_time: time is seconds which until token will be work (default: 14 days)
    :type token_expire_time: int
    """
    payload['exp'] = token_expire_time()
    token = jwt.encode(
        payload,
        os.getenv('APP_SECRET_KEY'),
        algorithm='HS256'
    )
    return token
