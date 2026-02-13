import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import {
  setCurrentApiUrl,
  setCurrentImageProxyUrl,
  getCurrentImageProxyUrl,
  createProxyUrl,
} from "../lib/utils";
import { siteConfig } from "@/shared/config/site";

const BASE_API_URL = createProxyUrl(siteConfig.mangadexAPI.baseUrl);

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosWithProxy = async <T = any>(
  config: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>(config);

    setCurrentApiUrl(BASE_API_URL);

    console.info(
      `[API Success] Via Proxy: ${siteConfig.proxy.defaultUrl} | Status: ${response.status}`,
    );

    return response.data;
  } catch (error) {
    const status =
      (error as { response?: { status: number } }).response?.status ??
      "Unknown Error";
    console.error(`[API Failed] Proxy request failed: ${status}`);
    throw error;
  }
};

export const initImageProxy = (): void => {
  const imageProxyUrl = createProxyUrl(siteConfig.mangadexAPI.uploadsUrl);

  setCurrentImageProxyUrl(imageProxyUrl);
  console.info(`[Image Init] Set image proxy target to uploads server`);
};

export const refreshImageProxy = (): string => {
  initImageProxy();
  return (
    getCurrentImageProxyUrl() ||
    createProxyUrl(siteConfig.mangadexAPI.uploadsUrl)
  );
};
