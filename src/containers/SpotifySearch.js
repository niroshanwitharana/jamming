import React, { useState, useEffect } from "react";
import styles from "../styles/styles.module.css";
import MusicCard from "../components/MusicCard";
import MyList from "../components/MyList";
import RefreshToken from "./RefreshToken";

const SpotifySearch = ({ accessToken, refreshToken }) => {
  // State to track the search query, search results, and errors
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isPlayClicked, setIsPlayClicked] = useState(false);
  const [myList, setMyList] = useState([]);
  const [showMyList, setShowMyList] = useState(false);
  const [myDataList, setMyDataList] = useState([]);

  // Function to handle Spotify search
  const handleSearch = async () => {
    try {
      // Make a request to the Spotify API to search for tracks
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&market=US&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Check if the request was successful (status code in the range 200-299)
      if (!response.ok) {
        const errorMessage = `HTTP error! Status: ${response.status}`;
        console.log(errorMessage);
        setError(errorMessage);
        console.log(error);
        setSearchResults([]);
        return;
      }

      // Parse the JSON response
      const result = await response.json();
      // Update the state with the search results
      setSearchResults(result.tracks.items);
      setError(null);
    } catch (error) {
      // Handle errors
      setError("Error fetching data: " + error.message);
      setSearchResults([]);
    }
  };

  const fetchDataById = async (id) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchDataForMyList = async () => {
      const fetchDataPromises = myList.map(async (item) => {
        const data = await fetchDataById(item);
        return data;
      });
      const dataList = await Promise.all(fetchDataPromises);
      setMyDataList(dataList.filter(Boolean));
    };
    fetchDataForMyList();
  }, [myList]);

  const OnPlay = async (event) => {
    const ID = event.target.id;
    event.stopPropagation();
    console.log(ID);

    try {
      const headers = {
        Authorization: `Bearer ${refreshToken}`,
      };

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?uris=spotify:track:${ID}`,
        {
          method: "PUT",
          headers: headers,
        }
      );
      console.log(response);
      if (!response.ok) {
        if (response.status === 403) {
          // If 403, it might be due to an expired token, try refreshing it
          const token = await RefreshToken(refreshToken);
          console.log(token);
          if (token) {
            // Retry the play request with the new access token
            const retryHeaders = {
              Authorization: `Bearer ${token}`,
            };

            const retryResponse = await fetch(
              `https://api.spotify.com/v1/me/player/play?uris=spotify:track:${ID}`,
              {
                method: "PUT",
                headers: retryHeaders,
              }
            );
            console.log(retryResponse);

            if (!retryResponse.ok) {
              console.error(
                "Failed to play the song after token refresh:",
                retryResponse.status,
                retryResponse.statusText
              );
            }
          } else {
            console.error("Failed to refresh access token!");
          }
        } else {
          console.error(
            "Failed to play the song:",
            response.status,
            response.statusText
          );
        }
      }
    } catch (error) {
      console.error("Error playing the song:", error.message);
    }
  };

  const onRemoveTrack = (event) => {
    const targetId = event.target.id;
    event.stopPropagation();
    const Id = targetId.toString();
    setMyList((prev) => prev.filter((songId => songId !== Id)));
  };

  const onGoBack = () => {
    setShowMyList(false);
  };

  const onAddToSpotify = () => {
    // Implement logic to add myList to Spotify account
  };

  return (
    <div>
      <div className={styles.myList}>
        <span
          className={styles.favourite}
          role="img"
          aria-label="My List"
          onClick={() => setShowMyList(true)}
        >
          {showMyList ? "🎵" : "💖"} - {myList.length}
        </span>
      </div>
      <div className={styles.auth}>
        {showMyList ? (
          <MyList
            OnPlay={OnPlay}
            isPlaying={isPlaying}
            isPlayClicked={isPlayClicked}
            myList={myList}
            myDataList={myDataList}
            accessToken={accessToken}
            onAddToSpotify={onAddToSpotify}
            onGoBack={onGoBack}
            onRemoveTrack={onRemoveTrack}
          />
        ) : (
          <>
            <h2 className={styles.headder}>Spotify Search</h2>
            {/* Input for the user to enter the search query */}
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Enter song, artist, or genre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Button to initiate the Spotify search */}
            <button className={styles.authButton} onClick={handleSearch}>
              Search on Spotify
            </button>

            {/* Display the search results if there are any */}
            {searchResults.length > 0 && (
              <div className={styles.card}>
                {/* <h3>Search Results:</h3>           */}
                {searchResults.map((result) => (
                  <MusicCard
                    key={result.id}
                    id={result.id}
                    name={result.name}
                    artist={result.artists[0].name}
                    image={result.album.images[0].url}
                    setIsHeartClicked={setIsHeartClicked}
                    OnPlay={OnPlay}
                    setIsPlaying={setIsPlaying}
                    setIsPlayClicked={setIsPlayClicked}
                    isPlaying={isPlaying}
                    isHeartClicked={isHeartClicked}
                    isPlayClicked={isPlayClicked}
                    myList={myList}
                    setMyList={setMyList}
                  />
                ))}
              </div>
            )}

            {/* Display an error message if there is an error */}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default SpotifySearch;
