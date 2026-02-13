import { Manga } from "@/types/types";
import { axiosWithProxy } from "../../shared/config/axios";
import { MangaParser } from "./manga";

export async function getRandomManga(r18: boolean): Promise<Manga> {
  const data = await axiosWithProxy({
    url: `/manga/random`,
    method: "get",
    params: {
      includes: ["cover_art", "author", "artist"],
      contentRating: r18
        ? ["safe", "suggestive", "erotica", "pornographic"]
        : ["safe", "suggestive", "erotica"],
    },
  });

  return MangaParser(data.data);
}
