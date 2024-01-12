import React, { useState, useEffect } from 'react';
import SpotifyAuth from './containers/SpotifyAuth';
import SpotifySearch from './containers/SpotifySearch';
import styles from './styles/styles.module.css'
const App = () => {
  // State to track the access token
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Check if the access token is available in the URL after Spotify redirects back
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const tokenFromUrl = urlParams.get('access_token');
    const refreshTokenFromUrl = urlParams.get('refresh_token');

    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
    }
    if(refreshTokenFromUrl){
      setRefreshToken(refreshTokenFromUrl);
    }
  }, []);
  console.log(window.location.search);

  return (
    <div className={styles.containerStyles}>
      <h1 className={styles.title}>Jamming</h1>
      {/* If there is no access token, show the authentication component */}
      {!accessToken ? (
        <SpotifyAuth />
      ) : (
        // If there is an access token, show the Spotify search component
        <SpotifySearch accessToken={accessToken} refreshToken={refreshToken} />
      )}
    </div>
  );
};

export default App;
