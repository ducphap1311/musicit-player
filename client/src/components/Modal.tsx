import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { closeModal } from "@/lib/features/modal/modalSlice";
import { addSong } from "@/lib/features/playList/playListSlice";
import { createSourceAudio } from "@/api/createService";
import { Loading } from "@/components/Loading";
import { toast } from 'react-toastify';

interface YoutubeSong {
    id: { videoId: string };
    snippet: {
        channelTitle: string;
        thumbnails: {
            medium: {
                url: string;
            };
        };
        title: string;
    };
}

export const Modal = () => {
    const [songs, setSongs] = useState<YoutubeSong[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useAppDispatch();
    const { playList } = useAppSelector((store) => store.playList);
    const [loading, setLoading] = useState<boolean>(false);
    const [pickedId, setPickedId] = useState<string>("");

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSearchChange = debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value === "") {
                setSongs([]);
            } else {
                axios
                    .get(
                        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${e.target.value}&type=video&key=AIzaSyAHet0rDx61UiGSq_WGbz33Q85uSajJoOo`
                    )
                    .then((res) => {
                        const items = res.data.items;
                        setSongs(items);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        1000
    );

    const convertYTLinkToAudio = async (
        videoId: string,
        url: string,
        title: string,
        channelTitle: string,
    ) => {
        let flag = false;
        setLoading(true);
        setPickedId(videoId);
        playList.map((item: any) => {
            if (item.videoId === videoId) {
                flag = true;
            }
        });
        if (flag) {
            toast("Song already added!", {
                type: "warning",
                draggable: true,
                position: "bottom-center",
                theme: "dark",
                closeOnClick: true,
            });
            setLoading(false);
            return;
        }
        const data = await createSourceAudio(videoId);
        if (!data) {
            toast("Network error, try later!", {
                type: "error",
                draggable: true,
                position: "bottom-center",
                theme: "dark",
                closeOnClick: true
            });
            setLoading(false);
            return;
        }
        dispatch(
            addSong({
                videoId,
                channelTitle,
                url,
                title,
                data,
                isExpired: false
            })
        );
        setLoading(false);
        toast("Add song successfully!", {
            type: "success",
            theme: "dark",
            draggable: true,
            position: "bottom-center",
            closeOnClick: true
        });
        setSongs([]);
        inputRef.current?.focus();
    };

    return (
        <div>
            <div className="fixed top-20 left-1/2 -translate-x-1/2 max-w-[600px] w-full z-40 px-4 sm:px-0">
                <div className="w-full relative">
                    <Image
                        src="/images/search.png"
                        alt="search icon"
                        width={22}
                        height={22}
                        className="absolute top-1/2 -translate-y-1/2 ml-4"
                    />
                    <input
                        type="text"
                        onChange={(e) => {
                            handleSearchChange(e);
                        }}
                        placeholder="Search your song"
                        className="py-[15px] pl-[55px] pr-[15px] w-full rounded-lg text-black outline-none"
                        ref={inputRef}
                    />
                </div>
                {songs.length > 0 && (
                    <div>
                        {songs.map((song: YoutubeSong) => {
                            const {
                                id: { videoId },
                                snippet: {
                                    channelTitle,
                                    thumbnails: {
                                        medium: { url },
                                    },
                                    title,
                                },
                            } = song;
                            return (
                                <div
                                    key={videoId}
                                    className="my-3 py-[10px] px-[15px] hover:scale-105 bg-white rounded-lg cursor-pointer transition-transform flex justify-between items-center"
                                    onClick={() =>
                                        convertYTLinkToAudio(
                                            videoId,
                                            url,
                                            title,
                                            channelTitle
                                        )
                                    }
                                >
                                    <div className=" flex items-center h-full pr-3">
                                        <img
                                            src={url}
                                            alt="image"
                                            className="h-[50px] w-[50px] object-cover rounded-lg mr-3"
                                        />
                                        <div>
                                            <p className="font-semibold text-sm sm:text-base h-6 overflow-hidden">
                                                {title}
                                            </p>
                                            <p className="text-sm font-mono text-gray-500 h-5 overflow-hidden">
                                                {channelTitle}
                                            </p>
                                        </div>
                                    </div>
                                    {pickedId === videoId ? (
                                        <>
                                            {loading ? (
                                                <Loading />
                                            ) : (
                                                <Image
                                                    src="/images/musical-note.png"
                                                    alt="musical note"
                                                    width={20}
                                                    height={20}
                                                    quality={100}
                                                    unoptimized={true}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <Image
                                            src="/images/musical-note.png"
                                            alt="musical note"
                                            width={20}
                                            height={20}
                                            quality={100}
                                            unoptimized={true}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div
                className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-35 z-20"
                onClick={() => dispatch(closeModal())}
            ></div>
        </div>
    );
};


