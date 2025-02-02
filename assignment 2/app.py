from flask import Flask, render_template, request
import requests

app = Flask(__name__)

CLIENT_ID = "ad7cd3662dd364ae367c"
CLIENT_SECRET = "cef9c262e44fe4d64e0c581b952bc9fc"
BASE_UTL = "https://api.artsy.net/api"

@app.route('/', methods=['GET'])
def initialize():
    return render_template('index.html')