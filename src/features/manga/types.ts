import type { Artist, Author } from "../author/types";
import type { Chapter } from "../chapter/types";
import type { Tag } from "../tag/types";

// --- Enums & Unions ---
export type ContentRating = "safe" | "suggestive" | "erotica" | "pornographic";
export type Status = "ongoing" | "completed" | "cancelled" | "hiatus";
export type OriginLanguge = "en" | "vi" | "ja" | "ko" | "zh";
export type Demosgraphic = "shounen" | "shoujo" | "jousei" | "seinen";
export type TranslatedLanguage = "en" | "vi";
export type LocalizedString = Record<string, string>; // VD: { "en": "Value", "vi": "Giá trị" }

export interface MangaTagAttributes {
  name: LocalizedString;
  description: LocalizedString;
  group: "genre" | "format" | "theme" | "content";
  version: number;
}

export interface UserAttributes {
  username: string;
  roles: string[];
  version: number;
}

export interface ScanlationGroupAttributes {
  name: string;
  website: string | null;
  discord: string | null;
  description: string | null;
  contactEmail: string | null;
  twitter: string | null;
  focusedLanguages: string[] | null;
  leader: string | null;
}

export interface MangaTagAttributes {
  name: LocalizedString;
  group: "content" | "format" | "genre" | "theme";
}

export interface MangaTag {
  id: string;
  type: "tag";
  attributes: {
    name: LocalizedString;
    description: LocalizedString;
    group: "content" | "format" | "genre" | "theme";
    version: number;
  };
  relationships: Relationship[];
}

export interface AuthorAttributes {
  name: string;
  imageUrl: string | null;
  biography: LocalizedString;
  twitter: string | null;
  pixiv: string | null;
  melonBook: string | null;
  fanBox: string | null;
  booth: string | null;
  namicomi: string | null;
  nicoVideo: string | null;
  skeb: string | null;
  fantia: string | null;
  tumblr: string | null;
  youtube: string | null;
  weibo: string | null;
  naver: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CoverArtAttributes {
  description: string;
  volume: string;
  fileName: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type Relationship =
  // Author & Artist
  | { type: "author" | "artist"; id: string; attributes?: AuthorAttributes }

  // Cover Art
  | { type: "cover_art"; id: string; attributes?: CoverArtAttributes }

  // Manga (Dùng cho Related Manga / Recommendation)
  | {
      type: "manga";
      id: string;
      attributes?: MangaAttributes;
      related?: string;
    }

  // Scanlation Group (QUAN TRỌNG CHO CHAPTER)
  | {
      type: "scanlation_group";
      id: string;
      attributes?: ScanlationGroupAttributes;
    }

  // User & Creator (Creator thực chất là User)
  | {
      type: "user" | "creator" | "leader" | "member";
      id: string;
      attributes?: UserAttributes;
    }

  // Tag
  | { type: "tag"; id: string; attributes?: MangaTagAttributes }

  // Fallback an toàn (Giữ autocomplete)
  | { type: string & {}; id: string; attributes?: any };

export interface MangaLinks {
  mu?: string; // MangaUpdates
  amz?: string; // Amazon
  mal?: string; // MyAnimeList
  raw?: string; // Raw Link
  engtl?: string;
  ap?: string; // AnimePlanet
  bw?: string; // BookWalker
  kt?: string; // Kitsu
  [key: string]: string | undefined; // Cho phép các key khác
}

export interface MangaAttributes {
  title: LocalizedString;
  altTitles: LocalizedString[];
  description: LocalizedString;
  isLocked: boolean;
  links: Record<string, string> | null;
  originalLanguage: string;
  lastVolume: string | null;
  lastChapter: string | null;
  publicationDemographic: "shounen" | "shoujo" | "josei" | "seinen" | null;
  status: "completed" | "ongoing" | "cancelled" | "hiatus";
  year: number | null;
  contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
  tags: MangaTag[];
  state: "draft" | "submitted" | "published" | "rejected";
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string | null;
}

export interface MangaData {
  id: string;
  type: "manga";
  attributes: MangaAttributes;
  relationships: Relationship[];
}

export interface MangaStatisticsItem {
  comments: {
    threadId: number;
    repliesCount: number;
  } | null;
  rating: {
    average: number;
    bayesian: number;
    distribution: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
      "6": number;
      "7": number;
      "8": number;
      "9": number;
      "10": number;
    };
  };
  follows: number;
  unavailableChaptersCount: number;
}

export interface MangaDexStatisticsResponse {
  result: "ok" | "error";
  statistics: Record<string, MangaStatisticsItem>;
}

export interface MangaDexBatchStatisticsResponse {
  result: "ok" | "error";
  statistics: Record<string, BatchMangaStatsItem>;
}

interface BatchMangaStatsItem {
  rating: {
    average?: number;
    bayesian: number;
  };
  follows: number;
  comments: {
    repliesCount: number;
  } | null;
  unavailableChapterCount?: number;
}

export interface MangaDexFeedResponse {
  result: "ok" | "error";
  response: "collection";
  data: ChapterItem[];
  limit: number;
  offset: number;
  total: number;
}

export interface ChapterItem {
  id: string;
  type: "chapter";
  attributes: ChapterAttributes;
  relationships: Relationship[];
}

export interface ChapterAttributes {
  volume: string | null; // Có thể null nếu là Oneshot hoặc chưa rõ volume
  chapter: string | null; // Có thể null nếu là Oneshot
  title: string | null; // Tên chapter (ví dụ: "Lời hồi đáp")
  translatedLanguage: string; // "vi", "en", ...
  externalUrl: string | null; // Link truyện gốc nếu là external chapter
  isUnavailable: boolean; // True nếu bị ẩn/xóa
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  pages: number;
}

export interface MangaListResponse {
  result: "ok" | "error";
  response: "collection";
  data: MangaData[];
  limit: number;
  offset: number;
  total: number;
}

export interface MangaRecommendationResponse {
  result: "ok" | "error";
  data: MangaRecommendationItem[];
  limit: number;
  offset: number;
  total: number;
}

interface MangaRecommendationItem {
  id: string; // Đây là ID của recommendation, KHÔNG PHẢI ID manga
  type: "manga_recommendation";
  attributes: {
    score: number;
  };
  relationships: {
    id: string;
    type: string;
  }[];
}

export interface CustomListResponse {
  result: "ok" | "error";
  response: "entity";
  data: CustomList;
}

export interface CustomList {
  id: string;
  type: "custom_list";
  relationships: Relationship[]; // Chứa list manga IDs
}

// --- Stats ---
export interface MangaStats {
  rating: {
    bayesian: number;
    distribution?: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
      "6": number;
      "7": number;
      "8": number;
      "9": number;
      "10": number;
    };
    max?: number;
  };
  follows: number;
  comments?: number;
}

export interface MangasStats {
  rating: {
    bayesian: number;
  };
  follows: number;
  comments?: number;
}

// --- Entities ---
export interface Cover {
  id: string;
  volume: string;
  description: string;
  locale: string;
  fileName: string;
}

export interface Manga {
  id: string;
  title: string;
  altTitle: string | null;
  altTitles: string[];
  tags: Tag[];
  cover: string | null;
  author: Author[];
  artist: Artist[];
  language: string[];
  description: {
    language: "en" | "vi";
    content: string;
  };
  contentRating: ContentRating;
  status: Status;
  raw?: string;
  firstChapter?: {
    en: string;
    vi: string;
  };
  finalChapter?: string;
  latestChapter?: string;
  stats?: MangaStats;
}

export interface LastestManga {
  info: Manga;
  lastestChap: Chapter[];
  total?: number;
}
