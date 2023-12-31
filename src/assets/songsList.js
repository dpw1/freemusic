import { cleanGoogleDriveLink } from "./../utils";

export const _songsList = [
  {
    id: "",
    name: "displacement",
    url: `https://drive.google.com/uc?id=1DxPnvftgT5vOukcuoGkJMnIKRD1DEnMt`,
    download: cleanGoogleDriveLink(
      `https://drive.google.com/uc?id=1DxPnvftgT5vOukcuoGkJMnIKRD1DEnMt`,
    ),
    style: `lo-fi`,
    mood: `Ambient, contemplative mood. Piano with subtle hints of hip-hop.`,

    release: "Dec 21, 2023",
    duration: "1:19",
  },
  {
    id: "",
    name: "Grasp",
    url: "https://drive.google.com/uc?id=1wcScsSiz0IACUgYXqwUwtq-rscqY3jpj",
    download: cleanGoogleDriveLink(
      `https://drive.google.com/uc?id=1wcScsSiz0IACUgYXqwUwtq-rscqY3jpj`,
    ),
    style: "Dark lo-fi",
    mood: "Good for horror and thriller. Piano, bass, drum beat, lots of textures.",
    release: "Dec 31, 2023",
    duration: "1:44",
  },
];

export const songsList = processSongsList(_songsList);

function processSongsList(songs) {
  /* Add share URL */
  for (var each of songs) {
    each.share = each.name.replaceAll(` `, `-`).toLowerCase();
  }

  return songs;
}
