import React from 'react';
import styles from '../styles/styles.module.css';

const SpotifyAuth = () => {
  // Replace 'your_client_id' with your Spotify client ID
//   const clientId = process.env.CLIENT_ID;
  // Set this to your app's redirect URI
  const redirectUri = 'http://localhost:3000';

  // Function to initiate Spotify login
  const handleLogin = () => {
    // Construct the Spotify authentication URL
    const authUrl = `https://accounts.spotify.com/authorize?client_id=7d8bd7441d74464ca6cdc0effec13157&redirect_uri=${redirectUri}&response_type=token&scope=user-read-private%20user-read-email%20playlist-modify-private%20user-modify-playback-state`;
    // Redirect the user to the Spotify authentication page
    console.log(authUrl)
    window.location.href = authUrl;
  };

  return (
    <div className={styles.auth}>
      <h2 className={styles.headder}>Spotify Authentication</h2>
      <button className={styles.authButton} onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
};

export default SpotifyAuth;
