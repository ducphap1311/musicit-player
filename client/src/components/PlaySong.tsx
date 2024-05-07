import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "../lib/hooks";
import { createAudio, deleteSong } from "@/lib/features/playList/playListSlice";
import { PlayList } from "@/components/PlayList";
import { GoUnmute, GoMute } from "react-icons/go";
import { LiaRandomSolid } from "react-icons/lia";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { GiPauseButton } from "react-icons/gi";
import { FaPlay } from "react-icons/fa6";
import { BsArrowRepeat } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { toast } from 'react-toastify';

type Song = {
    videoId?: string;
    channelTitle?: string;
    title?: string;
    data?: string;
    url?: string;
};

export const PlaySong = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoop, setIsLoop] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { currentSong, playList } = useAppSelector((store) => store.playList);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number | undefined>(0);
    const [maxTime, setMaxTime] = useState<string>("0:00");
    const [minTime, setMinTime] = useState<string>("0:00");
    const [isRandom, setIsRandom] = useState<boolean>(false);
    const [isVolumeAppear, setIsVolumneAppear] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (currentSong.title) {
            setCurrentTime(0);
            setIsPlaying(true);
            if (audioRef.current) {
                audioRef.current.play();
                audioRef.current.onloadedmetadata = function () {
                    const time = audioRef.current?.duration;
                    if (time) {
                        setDuration(Math.floor(time));
                        var h = Math.floor(time / 3600);
                        var m = Math.floor((time % 3600) / 60);
                        var s = Math.floor((time % 3600) % 60);
                        setMaxTime(
                            `${h > 0 ? `${h}:` : ""}${m}:${
                                s < 10 ? `0${s}` : s
                            }`
                        );
                    }
                };
                audioRef.current.ontimeupdate = function () {
                    const current = audioRef.current?.currentTime;
                    if (current) {
                        var h = Math.floor(current / 3600);
                        var m = Math.floor((current % 3600) / 60);
                        var s = Math.floor((current % 3600) % 60);
                        setMinTime(
                            `${h > 0 ? `${h}:` : ""}${m}:${
                                s < 10 ? `0${s}` : s
                            }`
                        );
                        setCurrentTime(Math.floor(current));
                        audioRef.current.onended = (e) => {
                            if (isRandom) {
                                playRandom();
                            } else {
                                playNext();
                            }
                        };
                    }
                };
            }
        }
    }, [currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLoop;
        }
    }, [isLoop]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const playNext = async () => {
        const index = playList.findIndex(
            (x: Song) => x.videoId == currentSong.videoId
        );
        if (index === playList.length - 1) {
            const { videoId, title, channelTitle, url, data } = playList[0];
            dispatch(createAudio({ videoId, title, channelTitle, url, data }));
        } else {
            const { videoId, title, channelTitle, url, data } =
                playList[index + 1];
            dispatch(createAudio({ videoId, title, channelTitle, url, data }));
        }
    };

    const playPrev = async () => {
        const index = playList.findIndex(
            (x: Song) => x.videoId == currentSong.videoId
        );
        if (index === 0) {
            const { videoId, title, channelTitle, url, data } =
                playList[playList.length - 1];
            dispatch(createAudio({ videoId, title, channelTitle, url, data }));
        } else {
            const { videoId, title, channelTitle, url, data } =
                playList[index - 1];
            dispatch(createAudio({ videoId, title, channelTitle, url, data }));
        }
    };

    function generateRandom(max: number): number {
        var num = Math.floor(Math.random() * max);
        const currentIndex = playList.findIndex(
            (x: Song) => x.videoId == currentSong.videoId
        );
        return num === currentIndex ? generateRandom(max) : num;
    }

    const playRandom = async () => {
        const max = playList.length;
        const index = generateRandom(max);
        const { videoId, title, channelTitle, url, data } = playList[index];
        dispatch(createAudio({ videoId, title, channelTitle, url, data }));
    };

    const handleAudioError = () => {
        // alert("This song has been expired or not allowed to use!")
        toast("This song has been expired or not allowed to use!", {
            type: "warning",
            draggable: true,
            position: "bottom-center",
            theme: "dark",
            closeOnClick: true,
            
        });
        dispatch(deleteSong(currentSong.videoId));
        dispatch(createAudio({}))
    };

    const togglePlayAndPause = () => {
        if (currentSong.title) {
            if (isPlaying) {
                setIsPlaying(false);
                audioRef.current?.pause();
            } else {
                setIsPlaying(true);
                audioRef.current?.play();
            }
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTime(Math.floor(Number(e.target.value)));
        const current = Number(e.target.value);
        var h = Math.floor(current / 3600);
        var m = Math.floor((current % 3600) / 60);
        var s = Math.floor((current % 3600) % 60);
        setMinTime(`${h > 0 ? `${h}:` : ""}${m}:${s < 10 ? `0${s}` : s}`);
        if (audioRef.current) {
            audioRef.current.currentTime = Math.floor(Number(e.target.value));
        }
    };
    return (
        <>
            <div className="max-w-[770px] mt-36 flex flex-col mx-4 md:mx-auto items-center md:items-start md:flex-row z-20">
                <div
                    className="w-[250px] h-[250px] mr-5 relative rounded-full cursor-pointer mb-3 md:mb-0 bg-black dark:bg-white "
                    onClick={togglePlayAndPause}
                >
                    {currentSong.url && (
                        <Image
                            src={currentSong.url}
                            alt="song"
                            width={250}
                            height={250}
                            unoptimized={true}
                            className={`h-[250px] rounded-full object-contain ${
                                isPlaying
                                    ? "animate-[spin_30s_linear_infinite]"
                                    : ""
                            }`}
                        />
                    )}
                    {isPlaying ? (
                        <Image
                            src="data:image/gif;base64,R0lGODlhJAAkAIABAP///////yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0NmRjOGMyNC03YmYxLTQxZTMtYjQ2Zi1mY2ZhMDk4MDE1YWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTBDRTc0QzlGNDBEMTFFQTk4NDZENjI0QzI1MENFQzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTBDRTc0QzhGNDBEMTFFQTk4NDZENjI0QzI1MENFQzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YzBhNGU4OWYtNjc4Yy00NmMyLTg4NmUtYzIxNGE0NTIwZDRjIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ODRlMDBjYmEtZjhlNy03YzQ4LWE4MTgtNDc3NTI3MGQ1ZTAyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4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"
                            alt="song"
                            width={30}
                            height={30}
                            unoptimized={true}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                        />
                    ) : (
                        <FaPlay className="cursor-pointer text-4xl text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                </div>
                <div className="md:max-w-[500px] w-full">
                    {currentSong.title ? (
                        <h2 className="font-bold text-4xl mb-2 h-20 overflow-hidden dark:text-white">
                            {currentSong.title?.length >= 45 ? (
                                <>{currentSong.title}</>
                            ) : (
                                currentSong.title
                            )}
                        </h2>
                    ) : (
                        <h2 className="font-bold text-4xl mb-2 dark:text-white">
                            Waiting...
                        </h2>
                    )}
                    {currentSong.channelTitle ? (
                        <p className="text-sm text-gray-500 font-mono mb-8 dark:text-white">
                            {currentSong.channelTitle}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 font-mono mb-8 dark:text-white">
                            Please select your song
                        </p>
                    )}
                    <div className="flex justify-between mb-0">
                        <p className="text-gray-500 font-mono dark:text-white">
                            {minTime}
                        </p>
                        <p className="text-gray-500 font-mono dark:text-white">
                            {maxTime}
                        </p>
                    </div>
                    <input
                        type="range"
                        id="points"
                        name="points"
                        value={currentTime}
                        min={0}
                        step={1}
                        max={duration}
                        className="w-full mb-5 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none "
                        onChange={handleProgressChange}
                    />
                    <div className="w-full flex items-center justify-between">
                        <div
                            className="relative"
                            onMouseEnter={() => {
                                setIsVolumneAppear(true);
                            }}
                            onMouseLeave={() => {
                                setIsVolumneAppear(false);
                            }}
                        >
                            {volume === 0 ? (
                                <GoMute className=" dark:text-white cursor-pointer text-2xl" />
                            ) : (
                                <GoUnmute className=" dark:text-white cursor-pointer text-2xl" />
                            )}
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={volume}
                                onChange={(event) => {
                                    setVolume(event.target.valueAsNumber);
                                }}
                                className={`${
                                    isVolumeAppear ? "block" : "hidden"
                                } absolute left-1/2 -translate-x-1/2 h-1 bg-white dark:bg-black rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-black/25 dark:[&::-webkit-slider-runnable-track]:bg-white/25 p-3 shadow-md`}
                            />
                        </div>
                        <LiaRandomSolid
                            className={`dark:text-white cursor-pointer text-2xl ${
                                isRandom ? "opacity-100" : "opacity-50"
                            }`}
                            onClick={() => {
                                setIsRandom(!isRandom);
                                setIsLoop(false);
                            }}
                        />
                        <MdSkipPrevious
                            onClick={() => playPrev()}
                            className="cursor-pointer text-4xl dark:text-white"
                        />
                        <div className="w-[55px] h-[55px] bg-black dark:bg-white rounded-full active:scale-90 cursor-pointer">
                            {isPlaying ? (
                                <div
                                    className="w-full h-full flex justify-center items-center"
                                    onClick={() => {
                                        setIsPlaying(false);
                                        if (audioRef.current) {
                                            audioRef.current.pause();
                                        }
                                    }}
                                >
                                    <GiPauseButton className=" dark:text-black cursor-pointer text-base text-white" />
                                </div>
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    onClick={() => {
                                        if (currentSong.title) {
                                            setIsPlaying(true);
                                            if (audioRef.current) {
                                                audioRef.current.play();
                                            }
                                        }
                                    }}
                                >
                                    <FaPlay className=" dark:text-black cursor-pointer text-base text-white" />
                                </div>
                            )}
                        </div>
                        <MdSkipNext
                            onClick={() => playNext()}
                            className="cursor-pointer text-4xl dark:text-white"
                        />
                        <BsArrowRepeat
                            className={`cursor-pointer text-2xl dark:text-white ${
                                isLoop
                                    ? "opacity-100 animate-[spin_5s_linear_infinite]"
                                    : "opacity-50"
                            }`}
                            onClick={() => {
                                setIsLoop(!isLoop);
                                setIsRandom(false);
                            }}
                        />
                        <a
                            href={`https://www.youtube.com/watch?v=${currentSong.videoId}`}
                            target="_blank"
                        >
                            <FaYoutube className="cursor-pointer opacity-70 hover:opacity-100 text-2xl dark:text-white" />
                        </a>
                    </div>
                    <audio
                        onError={handleAudioError}
                        preload="metadata"
                        src={currentSong.data}
                        hidden
                        ref={audioRef}
                    ></audio>
                </div>
            </div>
            <PlayList isPlaying={isPlaying} />
        </>
    );
};
