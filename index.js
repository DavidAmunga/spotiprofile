require('dotenv').config();

const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const path = require('path');

const app = express();

const port = 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 8888;

// Priority serve any static files
app.use(express.static(path.resolve(__dirname, './client/build')));

app.get('/', (req, res) => {
  const data = {
    name: 'Hello',
    isAwesome: true,
  };
  res.json(data);
});

/**
 * Generates a Random String containing numbers and letters
 * @param {number} length The Length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

// Request User Authorization
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = ['user-read-private', 'user-read-email', 'user-top-read'].join(
    ' ',
  );

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
    scope,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// Oauth Callback
// Request Oauth Token
app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state == null) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  } else {
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`,
        ).toString('base64')}`,
      },
    })
      .then((response) => {
        if (response.status == 200) {
          const { access_token, token_type, refresh_token, expires_in } =
            response.data;

          const queryParams = querystring.stringify({
            access_token,
            expires_in,
            refresh_token,
          });
          // Redirect to React App
          // Pass along tokens in query params
          res.redirect(`${FRONTEND_URI}?${queryParams}`);
        } else {
          res.redirect(
            `/?${querystring.stringify({ error: 'Invalid Token' })}`,
          );
        }
      })
      .catch((error) => {
        res.send(error);
      });
  }
});

app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      refresh_token: refresh_token,
      grant_type: 'refresh_token',
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

// All remaining requests return the React App , so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Express app listening at http://localhost:${PORT}`);
});
