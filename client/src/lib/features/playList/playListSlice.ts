import { createSlice } from "@reduxjs/toolkit";

type Song = {
    videoId?: string;
    channelTitle?: string;
    title?: string;
    data?: string;
    url?: string;
    isExpired?: boolean;
};

interface Types {
    playList: Song[];
    currentSong: Song;
}

const initialState: Types = {
    playList: [],
    currentSong: {},
};

export const playListSlice = createSlice({
    name: "playList",
    initialState,
    reducers: {
        updatePlayList: (state, action) => {
            state.playList = action.payload
        },
        addSong: (state, action) => {
            state.playList.push(action.payload);
            localStorage.setItem("playList", JSON.stringify(state.playList));
        },
        deleteSong: (state, action) => {
            state.playList = state.playList.filter(
                (item: any) => item.videoId !== action.payload
            );
            localStorage.setItem("playList", JSON.stringify(state.playList));
        },
        createAudio: (state, action) => {
            state.currentSong = action.payload;
        },

    },
});

export const { addSong, deleteSong, createAudio, updatePlayList } = playListSlice.actions;
export default playListSlice.reducer;
