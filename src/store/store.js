import create from "zustand";
import { songsList } from "../assets/songsList";

const useStore = create((set, get) => ({
  isPlaying: false,
  currentSongData: songsList[0],
  isSongReadyToPlay: false,
  setPlay: (play = true) => {
    set((_) => {
      return {
        ...get(),
        isPlaying: play,
      };
    });
  },
  setCurrentSongData: (data) => {
    const current = get().currentSongData;

    const updated = {
      ...current,
      data,
    };
    set((_) => {
      return {
        ...get(),
        currentSongData: updated.data,
      };
    });
  },
  setIsSongReadyToPlay: (ready = false) => {
    set((_) => {
      return {
        ...get(),
        isSongReadyToPlay: ready,
      };
    });
  },
}));

export default useStore;
