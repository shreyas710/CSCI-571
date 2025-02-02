import json

from flask import Flask, render_template, request
import requests
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
BASE_URL = os.getenv("BASE_URL")

cache = {}

def get_token():
    r = requests.post(BASE_URL + '/tokens/xapp_token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET)
    cache['token'] = json.loads(r.text)['token']

def get_artists(artist):
    r = requests.get(BASE_URL + '/search?q=' + artist + '&size=10&type=artist', headers={'X-XAPP-Token': cache['token']})
    cache['results'] = json.loads(r.text)['_embedded']['results']
    return cache['results']

@app.route('/', methods=['GET', 'POST'])
def initialize():
    if request.method == 'GET':
        get_token()
        return render_template('index.html')
    elif request.method == 'POST':
        if 'token' not in cache:
            get_token()
        data = get_artists(request.form['artist'])
        print(data)
        return render_template('index.html', artists=data)

# @app.route('/', methods=['POST'])
# def normal_search():
#     print('normal search called')
#     data = request.form['artist']
#     print(data)
#     # if 'token' not in cache:
#     #     get_token()
#     # r = requests.get(BASE_URL + '/search?q=' + artist + '&size=10&type=artist', headers={'X-XAPP-Token': cache['token']})
#     return render_template('index.html')
