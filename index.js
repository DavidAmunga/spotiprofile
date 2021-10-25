require('dotenv').config();

const express = require('express');

const app = express();



app.get('/', (req, res) => {
  const data = {
    name: 'Hello',
    isAwesome: true,
  };
  res.json(data);
});

app.get('/awesome-generator', (req, res) => {
  const { name, isAwesome } = req.query;
});
const port = 8888;

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
