from flask import Flask, render_template, request
import requests
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
BASE_URL = os.getenv("BASE_URL")

@app.route('/', methods=['GET'])
def initialize():
    return render_template('index.html')