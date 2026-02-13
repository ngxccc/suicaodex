import { unstable_cache } from "next/cache";

// Hàm helper để cache bất kỳ Promise nào (như axios request)
export const cacheRequest = <T, P extends any[]>(
  fn: (...params: P) => Promise<T>,
  keys: string[],
  tags: string[],
  revalidate: number = 60 * 5,
) => {
  return unstable_cache(fn, keys, {
    tags: tags,
    revalidate: revalidate,
  });
};
