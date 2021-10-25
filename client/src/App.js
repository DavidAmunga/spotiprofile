import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { accessToken, logout, getCurrentUsersProfile } from './spotify';
import { catchErrors } from './utils';
import './App.css';
import ScrollToTop from './components/utils/ScrollToTop';

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUsersProfile();
      setProfile(data);
    };

    catchErrors(fetchData());
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-Link" href="http://localhost:8888/login">
            Login to Spotify
          </a>
        ) : (
          <Router>
            <ScrollToTop />
            <Switch>
              <Route path="/top-artists">
                <h1>Top Artists</h1>
              </Route>
              <Route path="/top-tracks">
                <h1>Top Tracks</h1>
              </Route>
              <Route path="/playlist/:id">
                <h1>Playlist</h1>
              </Route>
              <Route path="/playlists">
                <h1>Playlist</h1>
              </Route>
              <Route path="/">
                <>
                  <button onClick={() => logout()}>Log out</button>
                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <h1>{profile.followers.total} Followers</h1>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Avatar" />
                      )}
                    </div>
                  )}
                </>
              </Route>
            </Switch>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
