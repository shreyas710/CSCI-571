const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('frontend/dist'));

app.get('/api', (req, res) => {
    res.send('Hello from the backend!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});