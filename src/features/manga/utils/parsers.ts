import type {
  Artist,
  Author,
  Manga,
  MangasStats,
  MangaStats,
  Tag,
} from "@/shared/types/common";
import type {
  AuthorAttributes,
  CoverArtAttributes,
  MangaData,
  MangaDexBatchStatisticsResponse,
  MangaDexStatisticsResponse,
  MangaTag,
  Relationship,
} from "@/features/manga/types";

function getPreferredTitle(
  titles: Record<string, string>,
  altTitles: Record<string, string>[],
) {
  const allTitles: Record<string, string> = { ...titles };
  altTitles.forEach((t) => {
    const key = Object.keys(t)[0];
    if (key && t[key]) {
      allTitles[key] = t[key];
    }
  });

  const vi = allTitles.vi;
  const en = allTitles.en;
  const jaRo = allTitles["ja-ro"]; // Romaji
  const ja = allTitles.ja;
  const original = Object.values(titles)[0]; // Title gốc (key bất kỳ)

  // Ưu tiên: Tiếng Việt > Tiếng Anh > Romaji > Gốc
  const mainTitle = vi ?? en ?? jaRo ?? original ?? "Untitled";

  // Nếu main là Vi -> Alt là En hoặc Romaji
  // Nếu main là En -> Alt là Romaji hoặc Ja
  let subTitle: string | null = null;

  if (mainTitle === vi) subTitle = en ?? jaRo ?? ja ?? null;
  else if (mainTitle === en) subTitle = jaRo ?? ja ?? null;
  else if (mainTitle === jaRo) subTitle = ja ?? null;

  return { mainTitle, subTitle };
}

function getCreators(
  relationships: Relationship[],
  type: "author" | "artist",
): Author[] | Artist[] {
  return relationships
    .filter((r) => r.type === type)
    .map((r) => ({
      id: r.id,
      name: (r.attributes as AuthorAttributes).name,
    }));
}

function getTags(rawTags: MangaTag[]): Tag[] {
  return rawTags.map((tag) => ({
    id: tag.id,
    name: tag.attributes.name.en ?? "Unknown",
    group: tag.attributes.group,
  }));
}

function generateEmptyDistribution() {
  return {
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
  };
}

export function MangaParser(data: MangaData): Manga {
  const attr = data.attributes;
  const rels = data.relationships;

  // Xử lý Title
  const { mainTitle, subTitle } = getPreferredTitle(attr.title, attr.altTitles);

  // Xử lý Description (Ưu tiên Vi -> En -> Fallback)
  const descContent =
    attr.description.vi ??
    attr.description.en ??
    Object.values(attr.description)[0] ??
    "";

  // Xác định language của description
  const descLang: "vi" | "en" = attr.description.vi ? "vi" : "en";

  // Xử lý Cover Art
  const coverRel = rels.find((r) => r.type === "cover_art");
  const coverFileName = coverRel?.attributes
    ? (coverRel.attributes as CoverArtAttributes).fileName
    : null;

  return {
    id: data.id,
    title: mainTitle,
    altTitle: subTitle,
    // Flat map lấy tất cả value của altTitles, filter undefined
    altTitles: attr.altTitles
      .map((t) => Object.values(t)[0])
      .filter((title) => title !== undefined),

    language: attr.availableTranslatedLanguages,

    description: {
      language: descLang,
      content: descContent,
    },

    tags: getTags(attr.tags),
    author: getCreators(rels, "author"),
    artist: getCreators(rels, "artist"),

    cover: coverFileName,

    contentRating: attr.contentRating,
    status: attr.status,

    raw: attr.links?.raw ?? undefined,

    finalChapter: attr.lastChapter ?? undefined,

    latestChapter: attr.latestUploadedChapter ?? undefined,
  };
}

export function MangaStatsParser(
  data: MangaDexStatisticsResponse,
  id: string,
): MangaStats {
  const stats = data.statistics[id];

  // Defensive programming: Nếu không tìm thấy stats cho id này thì trả về default
  if (!stats) {
    return {
      rating: {
        bayesian: 0,
        distribution: generateEmptyDistribution(),
        max: 0,
      },
      follows: 0,
      comments: 0,
    };
  }

  const distribution = stats.rating.distribution;

  // Find the max value in the distribution
  const max = Math.max(...Object.values(distribution));

  return {
    rating: {
      bayesian: stats.rating.bayesian,
      distribution: {
        "1": distribution["1"] || 0,
        "2": distribution["2"] || 0,
        "3": distribution["3"] || 0,
        "4": distribution["4"] || 0,
        "5": distribution["5"] || 0,
        "6": distribution["6"] || 0,
        "7": distribution["7"] || 0,
        "8": distribution["8"] || 0,
        "9": distribution["9"] || 0,
        "10": distribution["10"] || 0,
      },
      max: max,
    },
    follows: stats.follows,
    comments: stats.comments ? stats.comments.repliesCount : 0,
  };
}

export function MangasStatsParser(
  data: MangaDexBatchStatisticsResponse,
  id: string,
): MangasStats {
  const stats = data.statistics[id];

  if (!stats) {
    return {
      rating: { bayesian: 0 },
      follows: 0,
      comments: 0,
    };
  }

  return {
    rating: {
      bayesian: stats.rating.bayesian,
    },
    follows: stats.follows,
    comments: stats.comments ? stats.comments.repliesCount : 0,
  };
}
