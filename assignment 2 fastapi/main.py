from typing import Union, List
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
BASE_URL = os.getenv("BASE_URL")

cache = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_token():
    try:
        response = requests.post(BASE_URL + '/tokens/xapp_token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET)
        data = response.json()
        cache['token'] = data['token']
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Failed to authenticate with Artsy API")


async def get_artists(name) -> List[dict]:
    if not cache.get('token'):
        await get_token()

    try:
        response = requests.get(BASE_URL + '/search?q=' + name + '&size=10&type=artist', headers={'X-XAPP-Token': cache['token']})
        data = response.json()
        artists = data['_embedded']['results']
        cache['artists'] = artists
        return artists
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Failed to fetch artists from Artsy API")

@app.get("/get_artsy_token")
async def get_artsy_token():
    try:
        await get_token()
        return {"message": "Token fetched successfully"}
    except HTTPException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search_artist/{name}")
async def search_artist(name: str):
    try:
        if not name.strip():
            raise HTTPException(status_code=400, detail="Artist name cannot be empty")

        artists = await get_artists(name)
        return artists
    except HTTPException as e:
        raise HTTPException(status_code=500, detail=str(e))

app.mount("/", StaticFiles(directory="static",html = True), name="static")