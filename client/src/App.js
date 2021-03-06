import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { accessToken, logout } from './spotify';
import ScrollToTop from './components/utils/ScrollToTop';
import { GlobalStyle } from './styles';
import {
  Login,
  Profile,
  TopArtists,
  TopTracks,
  Playlists,
  Playlist,
} from './pages';
import styled from 'styled-components/macro';

const StyledLogoutButton = styled.div`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  cursor: pointer;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);
  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <>
            <StyledLogoutButton onClick={() => logout()}>
              Log out
            </StyledLogoutButton>
            <Router>
              <ScrollToTop />
              <Switch>
                <Route path="/top-artists">
                  <TopArtists />
                </Route>
                <Route path="/top-tracks">
                  <TopTracks />
                </Route>
                <Route path="/playlists/:id">
                  <Playlist />
                </Route>
                <Route path="/playlists">
                  <Playlists />
                </Route>
                <Route path="/">
                  <>
                    <Profile />
                  </>
                </Route>
              </Switch>
            </Router>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
