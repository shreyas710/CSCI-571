const axios = require('axios');

async function getArtsyToken() {
    try {
        console.log("Generating token");
        const response = await axios.post(BASE_URL + '/tokens/xapp_token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET);
        return response.data.token
    } catch (error) {
        console.error(error);
    }
}

const generateToken = async (req, res) => {
    try {
        var newDate = new Date(new Date().getTime() + 86400000);
        res.cookie('token', await getArtsyToken(), { expires: newDate });
        res.json({ "message": "Token generated" });
    } catch (error) {
        console.error(error);
    }
}

// search for artists
const searchArtist = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token === undefined) {
            res.json({ "message": "Please generate a token first" });
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
}

// get artist by id
const getArtistByID = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token === undefined) {
            res.json({ "message": "Please generate a token first" });
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
    } catch (error) {
        console.error(error);
    }
}

// get artworks for artist
const getArtistArtworks = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token === undefined) {
            res.json({ "message": "Please generate a token first" });
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
}

// get genes for artist
const getArtistGenes = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token === undefined) {
            res.send({ "message": "Please generate a token first" });
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
}

module.exports = {
    generateToken,
    searchArtist,
    getArtistByID,
    getArtistArtworks,
    getArtistGenes
};