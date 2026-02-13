export interface Group {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  discord: string | null;
  email: string | null;
  twitter: string | null;
  language: string[];
  leader?: {
    id: string;
    username: string;
  } | null;
  repliesCount?: number;
  totalUploaded?: number;
}

export interface GroupStats {
  repliesCount: number;
  totalUploaded: number;
}
