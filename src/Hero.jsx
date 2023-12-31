import React, { useEffect, useRef } from "react";

import "./Hero.css";
import SongsTable from "./SongsTable";

import useStore from "./store/store";
import man from "./assets/man.jpg";

export default function Hero() {
  const isPlaying = useStore((state) => state.isPlaying);
  const setPlay = useStore((state) => state.setPlay);

  const currentSongData = useStore((state) => state.currentSongData);
  const setIsSongReadyToPlay = useStore((state) => state.setIsSongReadyToPlay);
  const isSongReadyToPlay = useStore((state) => state.isSongReadyToPlay);

  return (
    <div className="Hero">
      <div className="Hero-wrapper">
        <div className="Hero-content">
          <div className="Hero-figure">
            <img className="Hero-image" src={man} alt="" />
          </div>

          <div data-hero className="Hero-text">
            <div className="xHero-toptitle text-p" style={{ marginBottom: 5 }}>
              Download and use anywhere, <b>no attribution required</b>.
            </div>
            <div data-data="testss" className="Hero-title text-h1">
              Copyright Free Music
            </div>
            <div className="Hero-subtitle text-p" data-o>
              Welcome! My name is Diego. All songs below were composed by me and
              you're free to use them anywhere you like.
            </div>

            <div className="Hero-subtitle text-p">
              To support my work and/or get notified of new releases,{" "}
              <a
                target="_blank"
                style={{ textDecoration: "underline" }}
                href="https://www.instagram.com/diegofortes016/"
                rel="noreferrer">
                follow me on Instagram
              </a>
              .
            </div>
            <div className="Hero-subtitle text-p">
              Suggestions or issues:{" "}
              <span style={{ textDecoration: "underline" }}>
                actuallyfreemusic@gmail.com
              </span>
            </div>
            <div className="Hero-subtitle text-p text-color">
              Thanks for stopping by!
            </div>
          </div>
        </div>
      </div>
      <SongsTable> </SongsTable>
    </div>
  );
}
