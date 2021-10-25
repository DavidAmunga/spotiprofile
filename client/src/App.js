import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { accessToken, logout, getCurrentUsersProfile } from './spotify';
import { catchErrors } from './utils';
import ScrollToTop from './components/utils/ScrollToTop';
import { GlobalStyle } from './styles';
import {Login} from './pages';

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
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
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
