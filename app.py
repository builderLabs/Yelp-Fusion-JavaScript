
import string
import random
import json
import requests

from urllib import urlencode

import flask
from flask import Flask, render_template, redirect, url_for
from flask import request, jsonify

app = Flask(__name__)

# === task settings =================================================

# yelp URL for OAuth2.0 toke:
YELP_AUTH_URL = "https://api.yelp.com/oauth2/token"

# path to credentials file (see credentials sample file):
CRED_FILE = "static/assets/docs/credentials"

# length you want your salt to be
SALT_LEN = 64 

# ===================================================================

def fetchCredentials():
    with open(CRED_FILE) as credentials:
        creds = json.load(credentials)    
    return creds

def getBearerToken():    

    creds = fetchCredentials()

    data = urlencode({
        'client_id': creds['YELP_CLIENT_ID'],
        'client_secret': creds['YELP_CLIENT_SECRET'],
        'grant_type': 'client_credentials',
    })
    headers = {
        'content-type': 'application/x-www-form-urlencoded',
    }
    response = requests.request('POST', YELP_AUTH_URL, data=data, headers=headers)
    response = response.json()
    return response['access_token']  

def makeSalt(len,chars):
    salt = ''.join(random.choice(chars) for x in range(len))
    salt = '-'+salt+'_'
    return salt

@app.route('/')
def main():
    global BEARER_TOKEN
    global SALT
    global SALTED_TOKEN
    BEARER_TOKEN = getBearerToken()
    SALT = makeSalt(SALT_LEN, string.ascii_letters + string.digits)
    SALTED_TOKEN = BEARER_TOKEN[0:int(len(BEARER_TOKEN)/2)] + SALT +\
                BEARER_TOKEN[int(len(BEARER_TOKEN)/2):len(BEARER_TOKEN)]    
    return render_template('index.html')


@app.route('/saltydog', methods=['POST'])
def giveItUp():
    outgoing = [{'term1': SALTED_TOKEN},
                {'term2': SALT}]
    return json.dumps(outgoing)

   
if __name__ == '__main__':    
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port= )  # choose your port