export interface Author {
  id: string;
  name: string;
}

export interface Artist {
  id: string;
  name: string;
}

export interface AuthorDetail {
  id: string;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  social: {
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
  };
  mangas: string[];
}
