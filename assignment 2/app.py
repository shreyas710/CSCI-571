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
    cache['artists'] = json.loads(r.text)['_embedded']['results']

def get_selected_artist(artist_id):
    r = requests.get(BASE_URL + '/artists/' + artist_id, headers={'X-XAPP-Token': cache['token']})
    cache['selected_artist'] = json.loads(r.text)

@app.route('/', methods=['GET', 'POST'])
def initialize():
    if request.method == 'GET':
        get_token()
        return render_template('index.html')
    elif request.method == 'POST':
        if 'token' not in cache:
            get_token()
        get_artists(request.form['artist'])
        return render_template('index.html', artists=cache['artists'])

@app.route('/artist/<artist_id>', methods=['GET'])
def get_artist(artist_id):
    if 'token' not in cache:
        get_token()
    get_selected_artist(artist_id)
    return render_template('index.html', artists=cache['artists'], artist=cache['selected_artist'])