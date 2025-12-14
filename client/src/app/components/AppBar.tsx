"use client";
import Image from "next/image";
import Link from "next/link";

export function AppBar() {
  return (
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
  );
}
