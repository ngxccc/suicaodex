import type { MangaData } from "@/features/manga/types";

export interface MangaDexApiResponse {
  result: "ok" | "error";
  response: "entity";
  data: MangaData;
}
