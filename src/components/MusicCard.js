import React from "react";
import styles from "../styles/styles.module.css";

function MusicCard({id, name, OnPlay, image, myList, setMyList, artist,setIsPlaying, setIsPlayClicked, isPlaying, setIsHeartClicked,isHeartClicked, isPlayClicked}) {

  // const OnPlay = (event)=>{
  //   const ID = event.target.id;
  //   event.stopPropagation();
  //   const Id = ID.toString();
  //   if (!myList.some(songId => songId===Id)) {
  //     setIsPlaying(true);
  //   }
  //   setIsPlayClicked(true)
    
  // }
  const OnSave =(event)=>{
    const ID = event.target.id;
    event.stopPropagation();
    const Id = ID.toString();
    if (!myList.some(songId => songId===Id)) {
    setMyList(prev => [...prev, Id])
  }

    setIsHeartClicked(true);

  }
  
  return (
    <div className={styles.musicCard}>
      <div className={styles.musicInfo}>
        <h3>
          {name} : {`${artist} Cover`}
        </h3>
        {/* <p>{artist}</p> */}
        <img className={styles.artistImage} src={image} alt={name} />
      </div>
      <div className={styles.icons}>
      <span
          id={id}
          role="img"
          aria-label="Play"
          onClick={(e) => {OnPlay(e)}}
          className={`${isPlaying ? styles.playing : ''} ${isPlayClicked ? styles.clicked : ''} ${styles.musicCardIcons}`}
        >
          {isPlaying ? '\u23F8' : '\u25B6'} {/* Unicode characters for pause and play */}
        </span>
        <span
          id={id}
          role="img"
          aria-label="Heart"
          onClick={OnSave}
          className={`${isHeartClicked ? styles.clicked : ''} ${styles.musicCardIcons}`}
        >
          &#10084;
        </span>
      </div>
    </div>
  );
}

export default MusicCard;
