const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { generateToken,
    searchArtist,
    getArtistByID,
    getArtistArtworks,
    getArtistGenes } = require('../../controllers/artsyController');
require('dotenv').config();

BASE_URL = process.env.BASE_URL;
CLIENT_ID = process.env.CLIENT_ID;
CLIENT_SECRET = process.env.CLIENT_SECRET;

router.use(cookieParser());

// search for artists
router.get('/search_artist/:name', searchArtist);

// get artist by id
router.get('/get_artist/:id', getArtistByID);

// get artworks for artist
router.get('/get_artist_artworks/:id', getArtistArtworks);

// get genes for artist
router.get('/get_artist_genes/:id', getArtistGenes);

// generate token
router.get('/', generateToken);

module.exports = router;