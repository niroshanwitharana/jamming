import React, {useState} from "react";
import styles from "../styles/styles.module.css";

const MyList = ({
  myList,
  accessToken,
  OnPlay,
  isPlaying,
  isPlayClicked,
  myDataList,
  onAddToSpotify,
  onGoBack,
  onRemoveTrack,
}) => {

  const [playlistName, setPlaylistName] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(playlistName)
    try {
      // Create a new playlist
      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/me/playlists`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: playlistName,
            public: false, // Set to true if you want the playlist to be public
          }),
        }
      );

      if (!createPlaylistResponse.ok) {
        console.error('Failed to create playlist:', createPlaylistResponse.status, createPlaylistResponse.statusText);
        // Handle the error as needed
        return;
      }

      const playlistData = await createPlaylistResponse.json();
      console.log(playlistData)
      const playlistId = playlistData.id;

      // Add tracks to the playlist
      for (const track of myList) {
        const trackId = track;

        const addTrackResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify:track:${trackId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!addTrackResponse.ok) {
          console.error(`Failed to add track ${trackId} to the playlist:`, addTrackResponse.status, addTrackResponse.statusText);
          // Handle the error as needed
        }
      }

      console.log('Tracks added to playlist successfully!');
      // Optionally, you can provide feedback to the user.
    } catch (error) {
      console.error('Error creating playlist and adding tracks:', error.message);
      // Handle the error as needed
    }
  };
  
  return (
    <div className={styles.auth}>
       {playlistName ? (
        <h2 className={styles.headder}>{playlistName}</h2>
      ) : (
        <h2 className={styles.headder}>My &#10084; List</h2>
      )}

      <form onSubmit={handleFormSubmit} className={styles.myListForm}>
        {/* <label>
          Playlist Name: */}
          <input
            className={styles.searchInput}
            placeholder="Enter playlist name"
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        {/* </label> */}
      {myDataList && myDataList.length > 0 ? (
        <div className={styles.listCard}>
          {myDataList.map((result) => (
            <div key={result.id} className={styles.myListCard}>
              <div className={styles.myListIcons}>                
                {/* Display the song information as needed */}
                <img
                  className={styles.image}
                  src={result.album.images[0].url}
                  alt={result.name}
                />
                <div className={styles.cardInfo}>
                <span
                      id={result.id}
                      role="img"
                      aria-label="Remove"
                      onClick={(e) => {
                        onRemoveTrack(e); // Pass the track ID to the remove function
                      }}
                      className={styles.removeIcon}
                    >
                      &#8722;
                    </span>
                  <span>Song name: {result.name}</span>
                  <span>Artist: {result.artists[0].name}</span>
                  <span>Release Date: {result.album.release_date}</span>
                  <span>
                    Duration:{" "}
                    {Math.floor((result.duration_ms / 60000) * 100) / 100}
                  </span>
                  <div className={styles.playOrRemove}>                    
                    <span
                      id={Response.id}
                      role="img"
                      aria-label="Play"
                      onClick={(e) => {
                        OnPlay(e);
                      }}
                      className={`${isPlaying ? styles.playing : ""} ${
                        isPlayClicked ? styles.clicked : ""
                      } ${styles.cardIcons}`}
                    >
                      {isPlaying ? "\u23F8" : "\u25B6"}{" "}
                      {/* Unicode characters for pause and play */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your list is empty. Save some songs from the search results.</p>
      )}

      <div className={styles.buttons}>
        <button className={styles.authButton} type="submit" onClick={onAddToSpotify}>
          Add to Spotify
        </button>
        <button className={styles.authButton} onClick={onGoBack}>
          Go Back to Search
        </button>
      </div>
      </form>
    </div>
  );
};

export default MyList;
