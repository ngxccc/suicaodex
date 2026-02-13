import type { Group } from "../groups/types";

export interface Chapter {
  id: string;
  vol: string | null;
  chapter: string | null;
  title: string | null;
  updatedAt: string;
  externalUrl: string | null;
  group: Group[];
  language: string;
  pages: number;
  manga: {
    id: string;
    title?: string;
    cover?: string;
  };
  isUnavailable: boolean;
  publishAt: string;
}

export interface ChapterGroup {
  chapter: string;
  group: Chapter[];
}

export interface Volume {
  vol: string;
  chapters: ChapterGroup[];
}

export interface ChapterVolume {
  chapters: Chapter[];
  total: number;
}

export interface ChapterAggregate {
  vol: string;
  chapters: {
    id: string;
    chapter: string;
    other?: string[];
  }[];
}
