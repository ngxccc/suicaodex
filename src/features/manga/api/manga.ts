import type {
  Chapter,
  Manga,
  MangasStats,
  MangaStats,
} from "@/shared/types/common";
import { siteConfig } from "@/shared/config/site";
import type {
  CustomListResponse,
  MangaDexBatchStatisticsResponse,
  MangaDexFeedResponse,
  MangaDexStatisticsResponse,
  MangaListResponse,
  MangaRecommendationResponse,
} from "@/features/manga/types";
import { axiosWithProxy } from "@/shared/config/axios";
import { ChaptersParser } from "@/features/chapter/api/chapter";
import { cacheRequest } from "@/shared/lib/cache";
import type { MangaDexApiResponse } from "@/shared/types/mangadex-api";
import {
  MangaParser,
  MangasStatsParser,
  MangaStatsParser,
} from "../utils/parsers";

const CONTENT_RATING_ALL = ["safe", "suggestive", "erotica", "pornographic"];
const CONTENT_RATING_SAFE = ["safe", "suggestive", "erotica"];

const fetchFirstChapter = async (
  id: string,
  r18: boolean,
): Promise<{ en: string | null; vi: string | null }> => {
  const params = {
    limit: 1,
    contentRating: r18
      ? ["safe", "suggestive", "erotica", "pornographic"]
      : ["safe", "suggestive", "erotica"],
    order: {
      volume: "asc", // Quan trọng: Lấy volume nhỏ nhất
      chapter: "asc", // Lấy chapter nhỏ nhất
    },
    includes: ["scanlation_group", "manga"],
  };

  try {
    const [enRes, viRes] = await Promise.all([
      axiosWithProxy<MangaDexFeedResponse>({
        url: `/manga/${id}/feed`,
        method: "get",
        params: { ...params, translatedLanguage: ["en"] },
      }),
      axiosWithProxy<MangaDexFeedResponse>({
        url: `/manga/${id}/feed`,
        method: "get",
        params: { ...params, translatedLanguage: ["vi"] },
      }),
    ]);

    return {
      en: enRes.data[0]?.id ?? null,
      vi: viRes.data[0]?.id ?? null,
    };
  } catch (error) {
    console.error(`[FirstChapter] Error fetching for ${id}:`, error);
    return { en: null, vi: null };
  }
};

async function fetchFirstChapterByLang(
  id: string,
  r18: boolean,
  lang: "vi" | "en",
): Promise<Chapter | null> {
  try {
    const data = await axiosWithProxy<MangaDexFeedResponse>({
      url: `/manga/${id}/feed`, // Dùng feed của manga chuẩn hơn
      method: "get",
      params: {
        limit: 1,
        translatedLanguage: [lang],
        contentRating: r18
          ? ["safe", "suggestive", "erotica", "pornographic"]
          : ["safe", "suggestive", "erotica"],
        order: {
          volume: "asc", // Volume nhỏ nhất
          chapter: "asc", // Chapter nhỏ nhất
        },
        includes: ["scanlation_group", "manga", "user"], // Include đủ info
      },
    });

    // Parse data
    const chapters = ChaptersParser(data.data);

    // Check an toàn
    const firstChapter = chapters[0];
    return firstChapter ? (firstChapter as unknown as Chapter) : null;
  } catch (error) {
    console.error(`Error fetching first ${lang} chapter for ${id}`, error);
    return null;
  }
}

async function fetchTopFollowedMangas(
  language: ("vi" | "en")[],
  r18: boolean,
): Promise<Manga[]> {
  try {
    const data = await axiosWithProxy<MangaListResponse>({
      url: `/manga`,
      method: "get",
      params: {
        limit: 10,
        includes: ["cover_art", "author", "artist"],
        availableTranslatedLanguage: language,
        hasAvailableChapters: "true",
        contentRating: r18 ? CONTENT_RATING_ALL : CONTENT_RATING_SAFE,
        order: { followedCount: "desc" },
      },
    });

    const mangas = data.data.map((item) => MangaParser(item));
    
    // Fetch stats riêng (Batch)
    const stats = await getMangasStats(mangas.map((m) => m.id));

    return mangas.map((manga, index) => ({
      ...manga,
      stats: stats[index],
    }));
  } catch (error) {
    console.error("[TopFollowed] Error:", error);
    return [];
  }
}

async function fetchTopRatedMangas(
  language: ("vi" | "en")[],
  r18: boolean,
): Promise<Manga[]> {
  try {
    const data = await axiosWithProxy<MangaListResponse>({
      url: `/manga`,
      method: "get",
      params: {
        limit: 10,
        includes: ["cover_art", "author", "artist"],
        hasAvailableChapters: "true",
        availableTranslatedLanguage: language,
        contentRating: r18 ? CONTENT_RATING_ALL : CONTENT_RATING_SAFE,
        order: { rating: "desc" },
      },
    });

    const mangas = data.data.map((item) => MangaParser(item));
    const stats = await getMangasStats(mangas.map((m) => m.id));

    return mangas.map((manga, index) => ({
      ...manga,
      stats: stats[index],
    }));
  } catch (error) {
    console.error("[TopRated] Error:", error);
    return [];
  }
}

async function fetchStaffPickMangas(r18: boolean): Promise<Manga[]> {
  try {
    const { staffPickList, seasonalList } = siteConfig.mangadexAPI;
    const selectedList = Math.random() < 0.5 ? staffPickList : seasonalList;

    // 1. Lấy danh sách ID từ CustomList
    const listRes = await axiosWithProxy<CustomListResponse>({
      url: `/list/${selectedList}`,
      method: "get",
    });

    const mangaIds = listRes.data.relationships
      .filter((rel) => rel.type === "manga")
      .map((rel) => rel.id);

    if (mangaIds.length === 0) return [];

    // 2. Lấy chi tiết Manga (Random offset để đổi gió)
    const limit = Math.min(32, mangaIds.length);
    // Lưu ý: Offset random này làm cho việc Cache hơi khó đoán. 
    // Tốt nhất nên cache kết quả cuối cùng trong thời gian ngắn (vd: 30p)
    const maxOffset = Math.max(mangaIds.length - limit, 0);
    const randomOffset = selectedList === seasonalList
          ? Math.floor(Math.random() * (maxOffset + 1))
          : 0;

    const data = await axiosWithProxy<MangaListResponse>({
      url: `/manga`,
      method: "get",
      params: {
        limit,
        offset: 0, // MangaDex CustomList fetch theo IDs array thì không cần offset API
        ids: mangaIds.slice(randomOffset, randomOffset + limit), // Slice ID ở client
        includes: ["cover_art", "author", "artist"],
        contentRating: r18 ? CONTENT_RATING_ALL : CONTENT_RATING_SAFE,
        // Staff pick không cần sort rating, random shuffle ở dưới là đủ
      },
    });

    const mangaResults = data.data.map((item) => MangaParser(item));

    // Shuffle
    for (let i = mangaResults.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = mangaResults[i];
      if (temp && mangaResults[j]) {
        mangaResults[i] = mangaResults[j];
        mangaResults[j] = temp;
      }
    }

    return mangaResults;
  } catch (error) {
    console.error("[StaffPick] Error:", error);
    return [];
  }
}

async function fetchCompletedMangas(
  language: ("vi" | "en")[],
  r18: boolean,
): Promise<Manga[]> {
  try {
    const data = await axiosWithProxy<MangaListResponse>({
      url: `/manga`,
      method: "get",
      params: {
        limit: 32,
        includes: ["cover_art", "author", "artist"],
        hasAvailableChapters: "true",
        availableTranslatedLanguage: language,
        contentRating: r18 ? CONTENT_RATING_ALL : CONTENT_RATING_SAFE,
        status: ["completed"],
        order: { createdAt: "desc" }, // Nên sort để list ổn định
      },
    });

    return data.data.map((item) => MangaParser(item));
  } catch (error) {
    console.error("[Completed] Error:", error);
    return [];
  }
}

async function fetchPopularMangas(
  language: ("vi" | "en")[],
  r18: boolean,
): Promise<Manga[]> {
  try {
    // Ngày này tháng trước
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    const data = await axiosWithProxy<MangaListResponse>({
      url: `/manga`,
      method: "get",
      params: {
        limit: 10,
        includes: ["cover_art", "author", "artist"],
        contentRating: r18 ? CONTENT_RATING_ALL : CONTENT_RATING_SAFE,
        hasAvailableChapters: "true",
        availableTranslatedLanguage: language,
        order: { followedCount: "desc" },
        createdAtSince: lastMonth.toISOString().slice(0, 19),
      },
    });

    return data.data.map((item) => MangaParser(item));
  } catch (error) {
    console.error("[Popular] Error:", error);
    return [];
  }
}

export async function fetchMangaDetail(id: string): Promise<Manga> {
  const [mangaResponse, stats] = await Promise.all([
    axiosWithProxy<MangaDexApiResponse>({
      url: `/manga/${id}?`,
      method: "get",
      params: {
        includes: ["author", "artist", "cover_art"],
      },
    }),
    getMangaStats(id),
  ]);

  if (mangaResponse.result !== "ok") {
    throw new Error("Failed to fetch manga detail from MangaDex");
  }

  const manga = MangaParser(mangaResponse.data);
  manga.stats = stats;

  return manga;
}

export async function getMangaStats(id: string): Promise<MangaStats> {
  try {
    const data = await axiosWithProxy<MangaDexStatisticsResponse>({
      url: `/statistics/manga/${id}`,
      method: "get",
    });

    return MangaStatsParser(data, id);
  } catch (error) {
    console.log(error);
    return {
      rating: {
        bayesian: 0,
        distribution: {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
          "6": 0,
          "7": 0,
          "8": 0,
          "9": 0,
          "10": 0,
        },
        max: 0,
      },
      follows: 0,
      comments: 0,
    };
  }
}

export async function getMangasStats(ids: string[]): Promise<MangasStats[]> {
  try {
    const data = await axiosWithProxy<MangaDexBatchStatisticsResponse>({
      url: `/statistics/manga`,
      method: "get",
      params: {
        manga: ids,
      },
    });

    return ids.map((id) => MangasStatsParser(data, id));
  } catch (error) {
    console.error("Failed to fetch batch stats:", error);

    return ids.map(() => ({
      rating: {
        bayesian: 0,
      },
      follows: 0,
      comments: 0,
    }));
  }
}

export const getCachedFirstChapter = cacheRequest(
  fetchFirstChapter,
  ["first-chapter"],
  ["chapter"],
  60 * 60 * 24 * 7,
);

export async function FirstViChapter(
  id: string,
  r18: boolean,
): Promise<Chapter | null> {
  return fetchFirstChapterByLang(id, r18, "vi");
}

export async function FirstEnChapter(
  id: string,
  r18: boolean,
): Promise<Chapter | null> {
  return fetchFirstChapterByLang(id, r18, "en");
}

export async function FirstChapters(
  id: string, // Manga ID
  r18: boolean,
  translatedLanguage: ("vi" | "en")[],
  volume?: string,
  chapter?: string,
): Promise<Chapter[]> {
  try {
    const data = await axiosWithProxy<MangaDexFeedResponse>({
      url: `/chapter`,
      method: "get",
      params: {
        manga: id,
        ...(volume && { volume }),
        ...(chapter && { chapter }),

        limit: 100,
        contentRating: r18
          ? ["safe", "suggestive", "erotica", "pornographic"]
          : ["safe", "suggestive", "erotica"],
        order: {
          volume: "asc",
          chapter: "asc",
        },
        translatedLanguage: translatedLanguage,
        includes: ["scanlation_group", "manga", "user"],
      },
    });

    return ChaptersParser(data.data);
  } catch (error) {
    console.error(`Error fetching specific chapters for ${id}`, error);
    return [];
  }
}

export async function SearchManga(
  query: string,
  r18: boolean,
): Promise<Manga[]> {
  try {
    const data = await axiosWithProxy<MangaListResponse>({
      url: "/manga",
      method: "get",
      params: {
        limit: 20,
        title: query,
        contentRating: r18 ? CONTENT_RATING_ALL : CONTENT_RATING_SAFE,
        includes: ["author", "artist", "cover_art"],
        order: { relevance: "desc" },
      },
    });

    const mangas = data.data.map((item) => MangaParser(item));
    if (mangas.length === 0) return [];

    // Search thường cần hiện Stats (Rating) ngay để user chọn
    const stats = await getMangasStats(mangas.map((m) => m.id));

    return mangas.map((manga, index) => ({
      ...manga,
      stats: stats[index],
    }));
  } catch (error) {
    console.error("[Search] Error:", error);
    return [];
  }
}

export const getCachedPopularMangas = cacheRequest(
  fetchPopularMangas,
  ["popular-mangas"],
  ["manga"],
  60 * 60
);

export async function getRecentlyMangas(
  limit: number,
  language: ("vi" | "en")[],
  r18: boolean,
  offset = 0,
): Promise<{ mangas: Manga[]; total: number }> {
  const max_total = 10000;
  
  // Logic giới hạn offset
  if (limit + offset > max_total) {
    limit = Math.max(0, max_total - offset);
  }

  try {
    const data = await axiosWithProxy<MangaListResponse>({
      url: `/manga`,
      method: "get",
      params: {
        limit: limit,
        offset: offset,
        includes: ["cover_art", "author", "artist"],
        availableTranslatedLanguage: language,
        contentRating: r18 ? CONTENT_RATING_ALL : CONTENT_RATING_SAFE,
        order: { createdAt: "desc" },
      },
    });

    return {
      mangas: data.data.map((item) => MangaParser(item)),
      total: Math.min(data.total, max_total),
    };
  } catch (error) {
    console.error("[RecentlyMangas] Error:", error);
    return { mangas: [], total: 0 };
  }
}

export const getCachedTopFollowedMangas = cacheRequest(
  fetchTopFollowedMangas,
  ["top-followed-mangas"],
  ["manga"],
  60 * 60
);

export const getCachedTopRatedMangas = cacheRequest(
  fetchTopRatedMangas,
  ["top-rated-mangas"],
  ["manga"],
  60 * 60
);

export const getCachedStaffPickMangas = cacheRequest(
  fetchStaffPickMangas,
  ["staff-pick-mangas"],
  ["manga"],
  60 * 30 // 30 phút đổi 1 lần
);

export const getCachedCompletedMangas = cacheRequest(
  fetchCompletedMangas,
  ["completed-mangas"],
  ["manga"],
  60 * 60
);

export async function getRecommendedMangas(
  id: string,
  r18: boolean,
): Promise<Manga[]> {
  try {
    const rcmData = await axiosWithProxy<MangaRecommendationResponse>({
      url: `/manga/${id}/recommendation`,
      method: "get",
      params: {
        includes: ["manga"],
      },
    });

    const mangaIDs = rcmData.data
      .map((item) => {
        const mangaRel = item.relationships.find((rel) => rel.type === "manga");
        return mangaRel ? mangaRel.id : null;
      })
      .filter((id): id is string => id !== null);

    if (mangaIDs.length === 0) return [];

    const mangasData = await axiosWithProxy<MangaListResponse>({
      url: "/manga",
      method: "get",
      params: {
        limit: 100,
        ids: mangaIDs,
        includes: ["cover_art", "author", "artist"],
        contentRating: r18
          ? ["safe", "suggestive", "erotica", "pornographic"]
          : ["safe", "suggestive", "erotica"],
      },
    });

    return mangasData.data.map((m) => MangaParser(m));
  } catch (error) {
    console.error(`[Recommended] Error fetching for ${id}:`, error);
    return [];
  }
}

export async function getTotalMangas(): Promise<number> {
  const data = await axiosWithProxy<MangaListResponse>({
    url: `/manga`,
    method: "get",
    params: {
      limit: 0,
      availableTranslatedLanguage: ["vi"],
    },
  });

  if (data.total > 10000) return 10000;

  return data.total;
}
