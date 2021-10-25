import { useEffect, useState } from 'react';
import { accessToken, logout, getCurrentUsersProfile } from './spotify';
import { catchErrors } from './utils';
import './App.css';

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
          <>
            <div>Logged In!</div>
            <button onClick={logout}>Log out</button>
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
        )}
      </header>
    </div>
  );
}

export default App;
