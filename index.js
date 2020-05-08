const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');

require('dotenv').config();

const app = express();
app.use(morgan('tiny'));
app.use(cors());

app.use('/videos', (req, res) => {
  // const url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLqhmS_S1oOPHMTxA6Ms67C29XMnz-HbEw&maxResults=50';
  const url = 'https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=UCC7y8uQQXtSxXDGle76HAxw&maxResults=50';
  fetch(`${url}&key=${process.env.GOOGLE_API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      res.json(json.items);
    })
    .catch((error) => console.log(error) );
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found!');
  next(error);
}

function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message
  })
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`);
})