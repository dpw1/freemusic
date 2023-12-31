import "./SongsTable.scss";
import "ka-table/style.scss";
import { Tooltip } from "react-tooltip";

import playingGif from "./assets/playing.gif";
import { createBrowserHistory } from "history";

import React, { useState } from "react";

import { Table, kaReducer } from "ka-table";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";
import {
  cleanGoogleDriveLink,
  copyToClipboard,
  generateColumns,
  getRandomColorForThumbnail,
} from "./utils";

import { useStatePersist as useStickyState } from "use-state-persist";
import useStore from "./store/store";
import { songsList } from "./assets/songsList";
import InstagramIcon from "./assets/InstagramIcon";
import TikTokIcon from "./assets/TikTokIcon";

// https://drive.google.com/uc?id=1mo500DWDXcOzZFdOq6eLFx4f0nCMgPF0

const SongsTable = () => {
  const history = createBrowserHistory();

  const dataArray = songsList.map((e, i) => {
    e.id = i + 1;

    return e;
  });

  const [searchText, setSearchText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isShareLinkTooltipOpen, setIsShareLinkTooltipOpen] = useState(false);
  const [isDownloadTooltipOpen, setIsDownloadTooltipOpen] = useState(false);
  const [downloadTooltipWasShown, setDownloadTooltipWasShown] = useStickyState(
    "@download-tooltip-was-shown",
    false,
  );

  // const [tableProps, changeTableProps] = useState(dataArray);

  const setPlay = useStore((state) => state.setPlay);
  const isPlaying = useStore((state) => state.isPlaying);
  const currentSongData = useStore((state) => state.currentSongData);
  const setCurrentSongData = useStore((state) => state.setCurrentSongData);
  const isSongReadyToPlay = useStore((state) => state.isSongReadyToPlay);
  const setIsSongReadyToPlay = useStore((state) => state.setIsSongReadyToPlay);

  // const dispatch = (action) => {
  //   changeTableProps((prevState) => kaReducer(prevState, action));
  // };

  return (
    <div className="SongsTable">
      {/* <input
        type="search"
        value={searchText}
        onChange={(event) => {
          setSearchText(event.currentTarget.value);
        }}
        className="top-element"
      /> */}
      <Table
        sortingMode={SortingMode.Single}
        columns={generateColumns(songsList, DataType)}
        data={dataArray}
        search={({ searchText: searchTextValue, rowData, column }) => {
          if (column.key === "passed") {
            return (
              (searchTextValue === "false" && !rowData.passed) ||
              (searchTextValue === "true" && rowData.passed)
            );
          }
        }}
        rowKeyField={"id"}
        searchText={searchText}
        noData={{
          text: "No Data Found",
        }}
        childComponents={{
          headCellContent: {
            content: (props) => {
              if (props.column.key === "duration") {
                return (
                  <svg
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="Svg-sc-ytk21e-0 kPpCsU">
                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                    <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path>
                  </svg>
                );
              }
            },
          },
          cell: {
            content: (props) => {
              const url = props.value;

              if (props.column.key === "name") {
                return (
                  <div className="SongsTable-titlebox">
                    <figure className="SongsTable-thumbnail">
                      <span>{url[0].toUpperCase()}</span>
                    </figure>
                    <div
                      onClick={(e) => {
                        const $parent = e.target.closest(`.ka-row`);
                        const $play = $parent.querySelector(`.SongsTable-play`);

                        $play.click();
                      }}
                      className="SongsTable-title">
                      {url}
                    </div>
                  </div>
                );
              }

              if (props.column.key === "url") {
                /* Start playing/pause the song
                ============================================== */

                if (!isPlaying || (isPlaying && currentSongData.url !== url)) {
                  return (
                    <a
                      onClick={(e) => {
                        e.preventDefault();

                        history.push(`?song=${props.rowData.share}`);

                        if (
                          currentSongData.hasOwnProperty("url") &&
                          currentSongData.url.length >= 2 &&
                          currentSongData.url === url
                        ) {
                          setPlay(!isPlaying);
                          return;
                        }

                        setPlay(false);

                        setCurrentSongData(props.rowData);
                        setIsSongReadyToPlay(false);

                        setPlay();
                      }}
                      className="SongsTable-play"
                      href={"#"}>
                      <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        className="Svg-sc-ytk21e-0 iYxpxA UIBT7E6ZYMcSDl1KL62g"
                        viewBox="0 0 24 24">
                        <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
                      </svg>
                    </a>
                  );
                }

                /* Show loading icon 
                ============================================== */
                if (
                  isPlaying &&
                  !isSongReadyToPlay &&
                  currentSongData.url === url
                ) {
                  return (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setPlay();
                      }}
                      className="SongsTable-play"
                      href={"#"}>
                      <div className="kabobloader">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                      </div>
                    </a>
                  );
                }

                /* Show playing gif 
                ============================================== */
                if (
                  isPlaying &&
                  isSongReadyToPlay &&
                  currentSongData.url === url
                ) {
                  return (
                    <a
                      onMouseEnter={() => {
                        setIsHovering(true);
                      }}
                      onMouseLeave={() => {
                        setIsHovering(false);
                      }}
                      onClick={(e) => {
                        e.preventDefault();

                        if (currentSongData.url === url) {
                          setPlay(!isPlaying);
                          return;
                        }

                        setPlay();
                      }}
                      className="SongsTable-play"
                      href={"#"}>
                      {isHovering ? (
                        <svg
                          data-encore-id="icon"
                          role="img"
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          className="Player-svg--pause">
                          <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
                        </svg>
                      ) : (
                        <img
                          className="SongsTable-gif"
                          src={playingGif}
                          alt=""
                        />
                      )}
                    </a>
                  );
                }
              }

              if (props.column.key === "download") {
                return (
                  <a
                    className="SongsTable-download download-tooltip"
                    href={url}
                    onClick={(e) => {
                      if (downloadTooltipWasShown) {
                        return;
                      } else if (!downloadTooltipWasShown) {
                        setDownloadTooltipWasShown(true);
                        setIsDownloadTooltipOpen(true);
                      }
                    }}>
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
                );
              }

              if (props.column.key === "share") {
                const share = `${window.location.origin}/${props.rowData.share}`;
                return (
                  <button
                    className="SongsTable-share"
                    onClick={() => {
                      setIsShareLinkTooltipOpen(false);

                      copyToClipboard(share);
                      setIsShareLinkTooltipOpen(true);

                      setTimeout((_) => {
                        setIsShareLinkTooltipOpen(false);
                      }, 1000);
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z"
                        fill="currentColor"></path>
                    </svg>
                  </button>
                );
              }
            },
          },
        }}
        // dispatch={dispatch}
      />
      <Tooltip
        clickable
        anchorSelect=".SongsTable-share"
        content={"Link copied!"}
        openOnClick={true}
        isOpen={isShareLinkTooltipOpen}
      />

      <Tooltip
        className="SongsTable-download-tooltip"
        clickable
        data-test=" "
        anchorSelect=".SongsTable-download"
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
              <div className="SongsTable-download-social">
                <button
                  onClick={() => {
                    setIsDownloadTooltipOpen(false);
                    setDownloadTooltipWasShown(true);
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
    </div>
  );
};

export default SongsTable;
