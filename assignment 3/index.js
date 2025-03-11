const express = require('express');
const userRoutes = require('./routes/users');
const artsyRoutes = require('./routes/artsy');
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(express.json());
app.use(express.static('frontend/dist'));

app.get('/api', (req, res) => {
    res.send('Backend API configured');
});

app.use('/api/users', userRoutes);
app.use('/api/artsy', artsyRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});