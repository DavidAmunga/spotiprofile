require('dotenv').config();

const express = require('express');
const querystring = require('querystring');
const axios = require('axios');

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

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

  const scope = 'user-read-private user-read-email';

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
          const { access_token, token_type, refresh_token } = response.data;

          axios
            .get(
              `http://localhost:8888/refresh_token?refresh_token=${refresh_token}`,
            )
            .then((response) => {
              res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
            })
            .catch((error) => {
              res.send(error);
            });
        } else {
          res.send(response);
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

const port = 8888;

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
