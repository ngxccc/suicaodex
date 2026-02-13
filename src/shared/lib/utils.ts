import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import { load } from "cheerio";
import { siteConfig } from "@/shared/config/site";
import slugify from "slugify";

interface FormatDistanceOptions {
  addSuffix?: boolean;
  comparison?: number; // -1: quá khứ, 1: tương lai, 0: hiện tại
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getContentLength(html: string): number {
  const $ = load(html);

  const text = $.text().trim();
  const textLength = text.length;

  const imgCount = $("img").length;

  const totalLength = textLength + imgCount;

  return totalLength;
}

const formatDistanceLocale = {
  lessThanXSeconds: "vừa xong",
  xSeconds: "vừa xong",
  halfAMinute: "vừa xong",
  lessThanXMinutes: "{{count}} phút",
  xMinutes: "{{count}} phút",
  aboutXHours: "{{count}} giờ",
  xHours: "{{count}} giờ",
  xDays: "{{count}} ngày",
  aboutXWeeks: "{{count}} tuần",
  xWeeks: "{{count}} tuần",
  aboutXMonths: "{{count}} tháng",
  xMonths: "{{count}} tháng",
  aboutXYears: "{{count}} năm",
  xYears: "{{count}} năm",
  overXYears: "{{count}} năm",
  almostXYears: "{{count}} năm",
};

function formatDistance(
  token: string,
  count: number,
  options: FormatDistanceOptions = {},
): string {
  options = options ?? {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "Khoảng " + result;
    } else {
      if (result === "vừa xong") return result;
      return result + " trước";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date | number): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...vi,
      formatDistance,
    },
  });
}

// Format time in short form: 2s, 5m, 3h, 1d, 2w, 3mo, 1y
const formatDistanceShort = {
  lessThanXSeconds: "{{count}}s",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}mo",
  xMonths: "{{count}}mo",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistanceShortFn(token: string, count: number): string {
  return formatDistanceShort[token as keyof typeof formatDistanceShort].replace(
    "{{count}}",
    count.toString(),
  );
}

export function formatShortTime(date: Date | number): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: false,
    locale: {
      ...vi,
      formatDistance: formatDistanceShortFn,
    },
  });
}

export function isFacebookUrl(url: string): boolean {
  return url.includes("facebook.com");
}

let currentWorkingApiUrl = "";
let currentImageProxyUrl = "";

export function getCurrentApiUrl(): string {
  return currentWorkingApiUrl;
}

export function setCurrentApiUrl(url: string): void {
  currentWorkingApiUrl = url;
}

export function getCurrentImageProxyUrl(): string {
  return currentImageProxyUrl;
}

export function setCurrentImageProxyUrl(url: string): void {
  currentImageProxyUrl = url;
}

export function getCoverImageUrl(
  mangaId: string,
  fileName: string,
  size = "",
): string {
  const sizeStr = size === "full" ? "" : size ? `.${size}` : ".256.jpg";
  const finalFileName =
    size === "full" ? fileName : `${fileName}${sizeStr}.jpg`;

  return createProxyUrl(
    siteConfig.mangadexAPI.uploadsUrl,
    `/covers/${mangaId}/${finalFileName}`,
  );
}

export function formatNumber(num: number): string {
  const f = Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });
  return f.format(num);
}

export function generateSlug(title: string): string {
  if (!title) return "";

  // Xử lý các ký tự đặc biệt có ý nghĩa trước khi slugify
  const preProcessedTitle = title
    .trim()
    .replace(/\//g, "-") // Fate/Stay -> Fate-Stay
    .replace(/&/g, "-and-") // Hunter & Hunter -> Hunter-and-Hunter
    .replace(/\+/g, "-plus-"); // Love+ -> Love-plus

  // Cấu hình slugify chuẩn SEO
  return slugify(preProcessedTitle, {
    lower: true, // Chữ thường
    locale: "vi", // Hỗ trợ tiếng Việt (đ -> d)
    strict: true, // Tự động xóa sạch ký tự đặc biệt (!@#$%^&*...)
    trim: true, // Xóa ký tự ngăn cách thừa ở đầu/cuối
    replacement: "-", // Ký tự thay thế khoảng trắng
  });
}

export const createProxyUrl = (targetBase: string, path = ""): string => {
  const proxyServer = siteConfig.proxy.defaultUrl;

  // Xử lý việc nối path để tránh bị double slash "//"
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const targetUrl = `${targetBase}${path ? cleanPath : ""}`;

  return `${proxyServer}?url=${targetUrl}`;
};
