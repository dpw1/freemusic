import React from "react";
import ReactDOM from "react-dom/client";
import Hero from "./Hero.jsx";
import "./index.scss";
import Sidebar from "./Sidebar";
import Player from "./Player";

import "react-tooltip/dist/react-tooltip.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="main">
      <Sidebar></Sidebar>
      <Hero />
      <Player></Player>
    </div>
  </React.StrictMode>,
);
