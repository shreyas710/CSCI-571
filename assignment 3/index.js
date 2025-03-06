const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/users');
const artsyRoutes = require('./routes/artsy');

const app = express();
app.use(express.json());
app.use(express.static('frontend/dist'));

CLIENT_ID = process.env.CLIENT_ID;
CLIENT_SECRET = process.env.CLIENT_SECRET;
BASE_URL = process.env.BASE_URL;

app.get('/api', (req, res) => {
    res.send('Backend API configured');
});

app.use('/api/users', userRoutes);
app.use('/api/artsy', artsyRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});