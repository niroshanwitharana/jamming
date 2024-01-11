

const RefreshToken = async (oldToken) => {
        // Your client ID and client secret from the Spotify Developer Dashboard
        const clientId = '7d8bd7441d74464ca6cdc0effec13157';
        const clientSecret = '1a11b82b8e74433b9ca66fe71d3ca781bv';
        
        // Your refresh token (previously obtained during the authorization process)
        const refreshToken = oldToken;
      
        // Encode the client ID and client secret in base64
        const credentials = `${clientId}:${clientSecret}`;
        const encodedCredentials = btoa(credentials);
      
        try {
          // Make a request to Spotify's token endpoint to refresh the access token
          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${encodedCredentials}`,
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
          });
      
          if (!response.ok) {
            console.error('Failed to refresh access token:', response.status, response.statusText);
            return;
          }
      
          // Parse the JSON response to get the new access token
          const result = await response.json();
          const newAccessToken = result.access_token;
      
          // Update the state or context with the new access token
          return newAccessToken;
      
          console.log('Access token refreshed successfully:', newAccessToken);
        } catch (error) {
          console.error('Error refreshing access token:', error.message);
        }
      };
      
  


export default RefreshToken;