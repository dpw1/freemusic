import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./Player.scss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { createBrowserHistory } from "history";

import useStore from "./store/store";
import { formatTime } from "./utils";
import InstagramIcon from "./assets/InstagramIcon";
import TikTokIcon from "./assets/TikTokIcon";
import { songsList } from "./assets/songsList";
import { Tooltip } from "react-tooltip";

import { useStatePersist as useStickyState } from "use-state-persist";

export default function Player() {
  const isPlaying = useStore((state) => state.isPlaying);
  const setPlay = useStore((state) => state.setPlay);

  const currentSongData = useStore((state) => state.currentSongData);
  const setCurrentSongData = useStore((state) => state.setCurrentSongData);
  const setIsSongReadyToPlay = useStore((state) => state.setIsSongReadyToPlay);
  const isSongReadyToPlay = useStore((state) => state.isSongReadyToPlay);

  const [playingSongInfo, setPlayingSongInfo] = useState({});
  const [second, setSecond] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekingSeconds, setSeekingSeconds] = useState(0); // currently loading new second of the song
  const [isChanging, setIsChanging] = useState(false); // user is dragging seek slider

  const [isDownloadTooltipOpen, setIsDownloadTooltipOpen] = useState(false);
  const [downloadTooltipWasShown, setDownloadTooltipWasShown] = useStickyState(
    "@download-tooltip-was-shown",
    false,
  );

  useEffect(() => {
    if (!currentSongData.hasOwnProperty("url")) {
      return;
    }

    console.log("play", isPlaying);
    console.log(currentSongData);
  }, [isPlaying]);

  useEffect(() => {
    updateSongBasedOnURL();
  }, []);

  function updateSongBasedOnURL() {
    const song = new URLSearchParams(window.location.search).get("song");

    try {
      if (!song || song.length <= 1) {
        return;
      }
    } catch (err) {
      return;
    }

    const found = songsList.filter(
      (e) => e.share.toLowerCase() === song.toLowerCase(),
    )[0];

    if (found === undefined) {
      return;
    }

    setCurrentSongData(found);
  }

  return (
    <>
      <div className="Player">
        <div className="Player-left">
          <div className="Player-thumbnail text-color">
            <span>
              {currentSongData.hasOwnProperty("name") &&
              currentSongData.name.length >= 1
                ? currentSongData.name[0]
                : "?"}
            </span>
          </div>
          <div className="Player-name">
            <p className="Player-title text-p text-color">
              {currentSongData.name}
            </p>
            <p className="Player-genre text-h6 text-color--secondary">
              {currentSongData.style}
            </p>
          </div>
          <a
            className="Player-download download-tooltip"
            onClick={() => {
              if (downloadTooltipWasShown) {
                return;
              } else {
                setDownloadTooltipWasShown(true);
                setIsDownloadTooltipOpen(true);
              }
            }}
            href={currentSongData.download}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="#000000"
              viewBox="0 0 29.978 29.978"
              xmlSpace="preserve">
              <g>
                <path d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012   v-8.861H25.462z" />
                <path d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723   c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742   c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193   C15.092,18.979,14.62,18.426,14.62,18.426z" />
              </g>
            </svg>
          </a>
        </div>
        <div className="Player-controls">
          <div className="Player-controls-top">
            <button
              onClick={() => {
                setPlay(!isPlaying);
              }}
              className="Player-play">
              {!isPlaying ? (
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="Player-svg--play">
                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                </svg>
              ) : (
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="Player-svg--pause">
                  <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
                </svg>
              )}
            </button>
          </div>
          <div className="Player-controls-bottom">
            <div className="text-h6 text-color--secondary Player-current-seconds">
              {formatTime(second)}
            </div>
            <Slider
              onChange={(seconds) => {
                console.log("seconds:", seconds);
                setSecond(seconds);
                setIsChanging(true);
              }}
              onChangeComplete={(seconds) => {
                setSecond(seconds);
                setPlay(false);
                setIsSeeking(true);
                setSeekingSeconds(seconds);
                setIsChanging(false);
                setTimeout(() => {
                  setPlay(true);
                }, 100);
              }}
              onFocus={(e) => {
                console.log("fucs", e);
                setPlay(false);
              }}
              min={0}
              max={parseInt(Math.floor(playingSongInfo?.loadedSeconds))}
              value={second}
              step={1}
            />
            <div className="text-h6 text-color--secondary Player-total-seconds">
              {playingSongInfo?.loadedSeconds
                ? formatTime(playingSongInfo.loadedSeconds)
                : "0:00"}
            </div>
          </div>
        </div>
        <div className="Player-right">
          <a
            className="Player-social"
            target="_blank"
            href="https://instagram.com/diegofortes016"
            rel="noreferrer">
            <InstagramIcon></InstagramIcon>
          </a>
          <a
            className="Player-social"
            target="_blank"
            href="https://www.tiktok.com/@diegofortes16"
            rel="noreferrer">
            <TikTokIcon></TikTokIcon>
          </a>
        </div>
      </div>
      <ReactPlayer
        style={{ display: "none" }}
        onStart={() => {
          setIsSongReadyToPlay(true);
        }}
        onEnded={() => {
          setIsSongReadyToPlay(false);
          setPlay(false);
        }}
        onProgress={(e) => {
          setPlayingSongInfo(e);

          if (isChanging) {
            return;
          }

          setSecond(parseInt(Math.floor(e.playedSeconds)));
        }}
        ref={(player) => {
          if (!player) {
            return;
          }

          if (!isSeeking) {
            return;
          }

          player.seekTo(seekingSeconds);
        }}
        onSeek={(e) => {
          console.log("seeking...", e);
          setIsSeeking(false);
        }}
        playing={isPlaying}
        url={currentSongData.url}
      />

      <Tooltip
        className="Player-download-tooltip"
        clickable
        anchorSelect=".Player-download"
        content={() => {
          return (
            <div>
              <p className="text-h3">Thank you for your download!</p> <br />
              <p className="text-p">
                Please support my work by sharing with a friend and following me
                on{" "}
                <a
                  style={{ textDecoration: "underline" }}
                  href="https://www.instagram.com/diegofortes016/"
                  rel="noreferrer">
                  Instagram
                </a>
                . Thanks!
              </p>
              <div className="Player-download-social">
                <button
                  onClick={() => {
                    setIsDownloadTooltipOpen(false);
                  }}
                  className="text-p">
                  Dismiss
                </button>

                <div className="">
                  <a
                    className=""
                    target="_blank"
                    href="https://instagram.com/diegofortes016"
                    rel="noreferrer">
                    <InstagramIcon></InstagramIcon>
                  </a>
                  <a
                    className=""
                    target="_blank"
                    href="https://www.tiktok.com/@diegofortes16"
                    rel="noreferrer">
                    <TikTokIcon></TikTokIcon>
                  </a>
                </div>
              </div>
            </div>
          );
        }}
        // style={{ display: downloadTooltipWasShown ? "none" : "auto" }}
        openEvents={["dblclick"]}
        isOpen={isDownloadTooltipOpen}
      />
    </>
  );
}
