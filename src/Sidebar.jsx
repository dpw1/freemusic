import React from "react";
import "./Sidebar.scss";
import InstagramIcon from "./assets/InstagramIcon";
import TikTokIcon from "./assets/TikTokIcon";

export default function Sidebar() {
  return (
    <div className="Sidebar">
      <div className="Sidebar-wrapper">
        <a className="Player-social" href="#">
          <InstagramIcon></InstagramIcon>
        </a>
        <a className="Player-social" href="#">
          <TikTokIcon></TikTokIcon>
        </a>
      </div>
    </div>
  );
}
