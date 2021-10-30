## Spotiprofile App

React App using Spotify API

## Local Installation and Setup

1. Register a Spotify App in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and add `http://localhost:8888/callback` as a Redirect URI in the App Settings
2. Create an `env` file at the root of the project based on `env.example` and add your unique `CLIENT_ID` and `CLIENT_SECRET` from the Spotify Dashboard
3. Ensure [nvm](https://github.com/nvm-sh/nvm) and [npm](https://npmjs.com/) are installed globally
4. Install the Correct version of Node

```shell
nvm install
```

5. Install Dependencies

```shell
npm install
```

6. Run the React App on <http://localhost:3000> and the Node Server on <http://localhost:8888>

```shell
npm start
```

## Deploying to Heroku with Git

1. Create a [Heroku](https://www.heroku.com/) app
2. Add your Heroku app as a Git Remote

```
heroku git:remote -a your-app-name
```

3. Add `https://your-app-name.herokuapp.com/callback` as a Redirect URI in your Spotify App's settings
4. In your app's **Settings** tab in the Heroku Dashboard , add [config-vars](https://devcenter.heroku.com/articles/config-vars#using-the-heroku-dashboard)

   Based on the values in your `env` file, The `CLIENT_ID`,`CLIENT_SECRET`,`REDIRECT_URI`, and `FRONTEND_URI` key value pairs . Make sure to replace the `localhost` URLs with your heroku app's URL

   ```env
   REDIRECT-URL:http://your-app-name.herokuapp.com/callback
   FRONTEND_URL:http://your-app-name.herokuapp.com
   ```

5. Push to Heroku

```shell
  git push heroku main
```
