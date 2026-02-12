import { getCachedPopularMangas } from "@/features/manga/api/manga";
import PopularSwiper from "./index";

export default async function PopularContainer() {
  const popularData = await getCachedPopularMangas(["vi"], false);

  return <PopularSwiper initialData={popularData} />;
}
