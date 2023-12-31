export function cleanGoogleDriveLink(link) {
  if (link.includes("export=download")) {
    return link;
  }

  if (link.includes(`/view?usp=drive_link`)) {
    return link.replace("view?usp=drive_link", "&export=download");
  }

  return `${link}&export=download`;
}

export function getRandomColorForThumbnail() {
  const colors = ["#4003e6"];

  return shuffleArray(colors)[0];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function generateColumns(dataArray, DataType) {
  if (!dataArray || dataArray.length === 0) {
    return [];
  }

  const firstItem = dataArray[0];

  const res = Object.keys(firstItem).map((key, index) => {
    const column = {
      id: index + 1, // Add an "id" property based on the index + 1
      key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataType: DataType.String,
      share: key.replaceAll(` `, `-`),
    };

    if (key === "url") {
      column.title = "Play";
    }

    if (key === "id") {
      column.title = "#";
    }

    if (key === "id") {
      column.width = "35px";
    } else if (key === "name") {
      column.width = isMobile() ? "250px" : "25%";
    } else if (key === "url") {
      column.width = "50px";
    } else if (key === "download") {
      column.width = "80px";
    } else if (key === "style") {
      column.title = "Genre";

      column.width = "150px";
    } else if (key === "mood") {
      column.title = "Vibe";
      column.width = "250px";
    } else if (key === "release") {
      column.width = "120px";
    } else if (key === "duration") {
      column.width = "60px";
    } else if (key === "share") {
      column.width = "60px";
    }
    return column;
  });

  console.log(res);
  return res;
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(1, "0"); // Ensure only one digit before ":"
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return clipboardData.setData("Text", text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function isMobile() {
  const mediaQuery = window.matchMedia("(max-width: 749px)");
  return mediaQuery.matches;
}
