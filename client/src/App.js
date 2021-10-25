import { useEffect, useState } from 'react';
import { accessToken, logout } from './spotify';
import './App.css';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
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
          </>
        )}
      </header>
    </div>
  );
}

export default App;
