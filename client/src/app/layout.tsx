import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import StoreProvider from "@/app/StoreProvider";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
    title: "Musicit",
    description: "Create your own playlist",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} dark:bg-[#171c26]`}>
                <StoreProvider>
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
