import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch } from "../lib/hooks";
import { openModal } from "@/lib/features/modal/modalSlice";
import { IoSearch } from "react-icons/io5";
import { FiSun } from "react-icons/fi";
import { ImHeadphones } from "react-icons/im";
import { FaMoon } from "react-icons/fa";

export const Navbar = () => {
    const dispatch = useAppDispatch();
    const [theme, setTheme] = useState<string | null>("");

    useEffect(() => {
        const mode = localStorage.getItem("theme");
        if (mode) {
            setTheme(mode);
        }
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.removeItem("theme");
        }
    }, [theme]);

    return (
        <div className="fixed top-0 left-0 w-full z-10 bg-white dark:bg-[#171c26]">
            <div className="max-w-[900px] px-4 md:px-0 mx-auto flex justify-between items-center py-3">
                <Link href="/" className="flex items-center cursor-pointer">
                    <ImHeadphones className="mr-2 text-2xl dark:text-white" />
                    <p className="font-black italic dark:text-white">
                        Music.it
                    </p>
                </Link>
                <div className="flex items-center">
                    <Link
                        href="/"
                        className="text-sm hidden md:block text-gray-500 dark:text-gray-400 dark:hover:text-white"
                    >
                        My playlists
                    </Link>
                    <IoSearch
                        className="ml-7 cursor-pointer text-xl text-gray-500 hover:text-black transition-all dark:text-gray-400 dark:hover:text-white"
                        onClick={() => dispatch(openModal())}
                    />
                    {theme === "dark" ? (
                        <FaMoon
                            className="ml-5 sm:ml-10 cursor-pointer text-lg text-gray-500 dark:text-gray-400 dark:hover:text-white hover:text-black transition-all"
                            onClick={() => setTheme("")}
                        />
                    ) : (
                        <FiSun
                            className="ml-5 sm:ml-10 cursor-pointer text-lg text-gray-500 hover:text-black transition-all"
                            onClick={() => setTheme("dark")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
