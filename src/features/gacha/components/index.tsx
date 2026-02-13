"use client";

import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import PKMTCGP from "#/images/gacha/pkmtcg.svg";
import HSR from "#/images/gacha/hsr.webp";
import BA from "#/images/gacha/ba.png";
import Link from "next/link";

export default function Gacha() {
  //TODO: padding
  return (
    <div className="flex flex-col space-y-5 py-3">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-indigo-500/10 to-purple-500/10 px-4 py-6 shadow-md dark:from-indigo-500/20 dark:to-purple-500/20">
        <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="animate-float inline-block">
            <span className="mb-3 inline-block rounded-full bg-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300">
              SuicaoDex88 - Nhà cái đầu hàng Vi En
            </span>
          </div>

          <h1 className="text-3xl font-extrabold md:text-5xl">
            <span className="from-primary bg-linear-to-tr to-purple-600 bg-clip-text text-transparent">
              99% người chơi dừng lại trước khi thắng lớn.
            </span>
          </h1>

          {/* <div className="pt-2 flex justify-center space-x-3">
            <div className="h-1.5 w-20 rounded-full bg-indigo-500/60"></div>
            <div className="h-1.5 w-10 rounded-full bg-purple-500/60"></div>
            <div className="h-1.5 w-5 rounded-full bg-pink-500/60"></div>
          </div> */}
        </div>

        <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-linear-to-br from-indigo-500/30 to-purple-500/30 blur-xl"></div>
        <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-linear-to-br from-purple-500/30 to-pink-500/30 blur-xl"></div>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Pokemon TCG Pocket Card */}
        <Link
          href="/gacha/pkm-tcgp"
          className="group relative overflow-hidden rounded-xl border border-yellow-200 bg-linear-to-br from-yellow-50 to-yellow-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-yellow-800 dark:from-yellow-950 dark:to-yellow-900"
        >
          <div className="absolute inset-0 z-10 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>

          <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-white/30 p-6 dark:bg-black/30">
            <Image
              className="max-h-full object-contain transition-all duration-500 group-hover:scale-110"
              src={PKMTCGP}
              alt="Pokemon TCG Pocket"
              priority
            />
          </div>

          <div className="space-y-3 p-5">
            <h3 className="line-clamp-1 text-xl font-bold break-all text-yellow-800 dark:text-yellow-300">
              Pokémon TCG Pocket
            </h3>
            {/* <p className="text-sm text-gray-600 dark:text-gray-300">Collect digital cards and build your ultimate Pokémon deck!</p> */}
            {/* <Link href="/gacha/pkm-tcgp" className="block"> */}
            <Button className="w-full bg-yellow-500 text-white hover:bg-yellow-600">
              Mở pack ngay
            </Button>
            {/* </Link> */}
          </div>
        </Link>

        {/* Honkai Star Rail Card */}
        <Link
          href="/gacha/hsr"
          className="group relative overflow-hidden rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-purple-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-blue-800 dark:from-blue-950 dark:to-purple-900"
        >
          <div className="absolute inset-0 z-10 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>

          <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-white/30 p-6 dark:bg-black/30">
            <Image
              className="max-h-full object-contain transition-all duration-500 group-hover:scale-110"
              src={HSR}
              alt="Honkai Star Rail"
              priority
            />
          </div>

          <div className="space-y-3 p-5">
            <h3 className="line-clamp-1 text-xl font-bold break-all text-blue-800 dark:text-blue-300">
              Honkai Star Rail
            </h3>
            {/* <p className="text-sm text-gray-600 dark:text-gray-300">Embark on an interstellar adventure with powerful characters!</p> */}
            {/* <Link href="/gacha/hsr" className="block"> */}
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
              100 roll free (riu 100%)
            </Button>
            {/* </Link> */}
          </div>
        </Link>

        {/* Blue Archive Card */}
        <Link
          href="/gacha/blue-archive"
          className="group relative overflow-hidden rounded-xl border border-sky-200 bg-linear-to-br from-sky-50 to-indigo-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-sky-800 dark:from-sky-950 dark:to-indigo-900"
        >
          <div className="absolute inset-0 z-10 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>

          <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-white/30 p-6 dark:bg-black/30">
            <Image
              className="max-h-full object-contain transition-all duration-500 group-hover:scale-110"
              src={BA}
              alt="Blue Archive"
              priority
            />
          </div>

          <div className="space-y-3 p-5">
            <h3 className="line-clamp-1 text-xl font-bold break-all text-sky-800 dark:text-sky-300">
              Blue Archive
            </h3>
            {/* <p className="text-sm text-gray-600 dark:text-gray-300">Recruit students and form the ultimate tactical team!</p> */}
            {/* <Link href="/gacha/ba" className="block"> */}
            <Button className="w-full bg-sky-500 text-white hover:bg-sky-600">
              Uhhoohhh!!! 🦀🦀😭😭😭
            </Button>
            {/* </Link> */}
          </div>
        </Link>
      </div>
    </div>
  );
}
