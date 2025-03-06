const express = require('express');
const router = express.Router();
const axios = require('axios');
const sessionMiddleware = require('../../middlewares/session-middleware');
require('dotenv').config();

BASE_URL = process.env.BASE_URL;
CLIENT_ID = process.env.CLIENT_ID;
CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getArtsyToken() {
    try {
        const response = await axios.post(BASE_URL + '/tokens/xapp_token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET);
        return response.data.token
    } catch (error) {
        console.error(error);
    }
}

// middleware to check if token is present
router.use(sessionMiddleware);
router.use(async (req, res, next) => {
    if (req.session.token === undefined) {
        console.log("Token not present, generating token");
        req.session.token = await getArtsyToken();
        next();
    } else {
        next();
    }
});

// generate token
router.get('/', async (req, res) => {
    try {
        req.session.token = await getArtsyToken();
        res.json({ "message": "Token generated" });
    } catch (error) {
        console.error(error);
    }
});

// search for artists
router.get('/search_artist/:name', async (req, res) => {
    try {
        if (req.session.token === undefined) {
            res.json({ "message": "Please generate a token first" });
        }
        const name = req.params.name;
        if (name === undefined) {
            res.json({ "message": "Please provide a name" });
        }
        const response = await axios.get(BASE_URL + '/search?q=' + name + '&size=10&type=artist', {
            headers: {
                'X-Xapp-Token': req.session.token
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
        if (req.session.token === undefined) {
            res.json({ "message": "Please generate a token first" });
        }
        const id = req.params.id;
        if (id === undefined) {
            res.json({ "message": "Please provide an id" });
        }
        const response = await axios.get(BASE_URL + '/artists/' + id, {
            headers: {
                'X-Xapp-Token': req.session.token
            }
        });
        artist = response.data;
        res.json(artist);
    } catch (error) {
        console.error(error);
    }
});

// get artworks for artist
router.get('/get_artist_artworks/:id', async (req, res) => {
    try {
        if (req.session.token === undefined) {
            res.json({ "message": "Please generate a token first" });
        }
        const id = req.params.id;
        if (id === undefined) {
            res.json({ "message": "Please provide an id" });
        }
        const response = await axios.get(BASE_URL + '/artworks?artist_id=' + id + '&size=10', {
            headers: {
                'X-Xapp-Token': req.session.token
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
        if (req.session.token === undefined) {
            res.send({ "message": "Please generate a token first" });
        }
        const id = req.params.id;
        if (id === undefined) {
            res.json({ "message": "Please provide an id" });
        }
        const response = await axios.get(BASE_URL + '/genes?artist_id=' + id, {
            headers: {
                'X-Xapp-Token': req.session.token
            }
        });
        artist = response.data['_embedded']['genes'];
        res.json(artist);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;