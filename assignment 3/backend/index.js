const express = require('express');
const path = require(`path`);

const app = express();
app.use(express.static(path.join(__dirname, `../frontend/dist`)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, `../frontend/dist/index.html`));
});

app.get('/api', (req, res) => {
    res.send('Hello from the backend!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});