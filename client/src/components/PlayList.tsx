import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../lib/hooks";
import Image from "next/image";
import { createAudio, deleteSong, updatePlayList } from "@/lib/features/playList/playListSlice";
import { openModal } from "@/lib/features/modal/modalSlice";
import { FaPlay } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import axios from "axios";
import { Loading } from "@/components/Loading";

export const PlayList: React.FC<{isPlaying: boolean}> = ({isPlaying}) => {
    const dispatch = useAppDispatch();
    const [isDownLoad, setIsDownLoad] = useState<boolean>(false);
    const [downLoadedId, setDownLoadedId] = useState<string>('')
    const { playList, currentSong } = useAppSelector(
        (store: { playList: any }) => store.playList
    );

    useEffect(() => {
            if (
                localStorage.getItem("playList") !== null
            ) {
                const newPlayList = JSON.parse(localStorage.getItem("playList") || "[]")
                dispatch(updatePlayList(newPlayList));
            }
    }, [])

    const makeAudio = async ({
        videoId,
        title,
        channelTitle,
        url,
        data,
        isExpired
    }: {
        videoId: string;
        title: string;
        channelTitle: string;
        url: string;
        data: string;
        isExpired: boolean
    }) => {
        dispatch(createAudio({ videoId, title, channelTitle, url, data, isExpired }));
    };

    const handleDownLoad = async (videoId: string) => {
        setIsDownLoad(true);
        try {
            const response = await axios.get(
                `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
                {
                    headers: {
                        "X-RapidAPI-Key":
                            "250dec0effmshe79baf9114a4c9bp1aa898jsna0d05fc57b6b",
                        "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
                    },
                }
            );
            const newTab = window.open(response.data.link, "_blank");
            if (newTab) {
                newTab.focus();
            } else {
                console.error("Popup window blocked");
            }
        } catch (error) {
            console.log(error);
        }
        setIsDownLoad(false);
    };
    
    return (
        <div className="max-w-[770px] mx-4 md:mx-auto mt-20 mb-10">
            <h2 className="mb-5 font-bold text-2xl dark:text-white">
                PlayList
            </h2>
            <hr />
            {playList.length > 0 ? (
                <div className="mt-5">
                    {playList.map((play: any) => {
                        return (
                            <div
                                className="flex items-center justify-between"
                                key={play.videoId}
                            >
                                <div
                                    className={`relative flex flex-1 mr-3 hover:bg-[#f3f5f7] dark:hover:bg-[#313744] transition-all py-[10px] items-center px-[15px] rounded-lg mb-2 cursor-pointer ${
                                        play.videoId === currentSong.videoId &&
                                        "bg-[#f3f5f7] dark:bg-[#313744]"
                                    }`}
                                    onClick={() =>
                                        makeAudio({
                                            videoId: play.videoId,
                                            title: play.title,
                                            channelTitle: play.channelTitle,
                                            url: play.url,
                                            data: play.data,
                                            isExpired: play.isExpired
                                        })
                                    }
                                >
                                    <div className="relative w-[40px] h-[40px] mr-3">
                                        <Image
                                            src={play.url}
                                            alt="image"
                                            width={40}
                                            height={40}
                                            quality={100}
                                            unoptimized={true}
                                            className="block w-full min-w-[40px] min-h-[40px] h-full object-cover rounded-lg "
                                        />
                                        {play.videoId ===
                                            currentSong.videoId && (
                                            <div>
                                                {isPlaying ? (
                                                    <Image
                                                        src="data:image/gif;base64,R0lGODlhJAAkAIABAP///////yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0NmRjOGMyNC03YmYxLTQxZTMtYjQ2Zi1mY2ZhMDk4MDE1YWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTBDRTc0QzlGNDBEMTFFQTk4NDZENjI0QzI1MENFQzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTBDRTc0QzhGNDBEMTFFQTk4NDZENjI0QzI1MENFQzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YzBhNGU4OWYtNjc4Yy00NmMyLTg4NmUtYzIxNGE0NTIwZDRjIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ODRlMDBjYmEtZjhlNy03YzQ4LWE4MTgtNDc3NTI3MGQ1ZTAyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4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"
                                                        alt="song"
                                                        width={20}
                                                        height={20}
                                                        unoptimized={true}
                                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                                                    />
                                                ) : (
                                                    <FaPlay className="cursor-pointer text-lg text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-semibold dark:text-white h-6 overflow-hidden">
                                            {play.title}
                                        </h4>
                                        <p className="font-mono text-sm text-gray-500">
                                            {play.channelTitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {downLoadedId=== play.videoId ? (
                                        <>
                                            {isDownLoad ? (
                                                <Loading />
                                            ) : (
                                                <MdOutlineFileDownload
                                                    onClick={() =>
                                                        handleDownLoad(
                                                            play.videoId
                                                        )
                                                    }
                                                    className="text-gray-500 cursor-pointer hover:text-black dark:hover:text-white transition-colors dark:text-gray-400 text-3xl"
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <MdOutlineFileDownload
                                            onClick={() =>{
                                                setDownLoadedId(play.videoId)
                                                handleDownLoad(play.videoId)
                                            }
                                            }
                                            className="text-gray-500 cursor-pointer hover:text-black dark:hover:text-white transition-colors dark:text-gray-400 text-3xl"
                                        />
                                    )}

                                    <MdDeleteOutline
                                        onClick={() => {
                                            dispatch(deleteSong(play.videoId));
                                        }}
                                        className="text-gray-500 cursor-pointer hover:text-black dark:hover:text-white transition-colors dark:text-gray-400 text-3xl ml-3"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="mt-9">
                    <p className="text-[#6b7589] text-lg text-center mb-3 font-bold">
                        Your playlist is empty now!
                    </p>
                    <p className="text-[#a4abb8] text-sm text-center">
                        Please click the button below to add your favorite songs
                        . Or add song from the suggestions
                    </p>
                </div>
            )}
            <button
                className="mt-9 active:scale-95 border-none block w-fit mx-auto border py-2 px-10 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-base bg-[#f3f5f7] cursor-pointer dark:bg-[#313744] dark:text-white dark:border-none"
                onClick={() => dispatch(openModal())}
            >
                + Add my song
            </button>
        </div>
    );
};
