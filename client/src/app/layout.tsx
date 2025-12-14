import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeDock - Exchange",
  description: "Of the people, for the people, by the people",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
      >
        <div className="flex justify-between px-2 md:px-10 py-5 items-center">
          <Link href="/markets">
            <Image
              src="/logo.png"
              alt=""
              width={200}
              height={200}
              className="rounded-xl cursor-pointer"
            />
          </Link>
          <p className="text-3xl md:text-4xl font-semibold md:font-extrabold">
            DEV MODE
          </p>
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
