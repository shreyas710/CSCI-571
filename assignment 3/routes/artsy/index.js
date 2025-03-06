const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

BASE_URL = process.env.BASE_URL;
CLIENT_ID = process.env.CLIENT_ID;
CLIENT_SECRET = process.env.CLIENT_SECRET;

var token = undefined;

async function getArtsyToken() {
    try {
        const response = await axios.post(BASE_URL + '/tokens/xapp_token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET);
        token = response.data.token;
        console.log(token);
    } catch (error) {
        console.error(error);
    }
}

// generate token
router.get('/', async (req, res) => {
    try {
        await getArtsyToken();
        res.json({ "message": "Token fetched successfully" });
    } catch (error) {
        console.error(error);
    }
});

// search for artists
router.get('/search_artist/:name', async (req, res) => {
    try {
        if (token === undefined) {
            await getArtsyToken();
        }
        const name = req.params.name;
        if (name === undefined) {
            res.json({ "message": "Please provide a name" });
        }
        const response = await axios.get(BASE_URL + '/search?q=' + name + '&size=10&type=artist', {
            headers: {
                'X-Xapp-Token': token
            }
        });
        artists = response.data['_embedded']['results']
        res.json(artists);
    } catch (error) {
        console.error(error);
    }
});

// get artist by id
router.get('/get_artist/:id', async (req, res) => {
    try {
        if (token === undefined) {
            await getArtsyToken();
        }
        const id = req.params.id;
        if (id === undefined) {
            res.json({ "message": "Please provide an id" });
        }
        const response = await axios.get(BASE_URL + '/artists/' + id, {
            headers: {
                'X-Xapp-Token': token
            }
        });
        artist = response.data;
        res.json(artist);
    }  catch (error) {
        console.error(error);
    }
});

// get artworks for artist
router.get('/get_artist_artworks/:id', async (req, res) => {
    try {
        if (token === undefined) {
            await getArtsyToken();
        }
        const id = req.params.id;
        if (id === undefined) {
            res.json({ "message": "Please provide an id" });
        }
        const response = await axios.get(BASE_URL + '/artworks?artist_id=' + id + '&size=10', {
            headers: {
                'X-Xapp-Token': token
            }
        });
        artist = response.data['_embedded']['artworks'];
        res.json(artist);
    } catch (error) {
        console.error(error);
    }
});

// get genes for artist
router.get('/get_artist_genes/:id', async (req, res) => {
    try {
        if (token === undefined) {
            await getArtsyToken();
        }
        const id = req.params.id;
        if (id === undefined) {
            res.json({ "message": "Please provide an id" });
        }
        const response = await axios.get(BASE_URL + '/genes?artist_id=' + id, {
            headers: {
                'X-Xapp-Token': token
            }
        });
        artist = response.data['_embedded']['genes'];
        res.json(artist);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;