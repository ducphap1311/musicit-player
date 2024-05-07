"use client";
import { Modal } from "@/components/Modal";
import { Navbar } from "@/components/Navbar";
import { PlaySong } from "@/components/PlaySong";
import { useAppSelector } from "../lib/hooks";
import { ToastContainer } from 'react-toastify';

export default function Home() {
    const { isModalOpen } = useAppSelector((store) => store.modal)

    return (
        <main>
            <Navbar />
            <PlaySong />
            {isModalOpen && <Modal />}
            <ToastContainer />
        </main>
    );
}
