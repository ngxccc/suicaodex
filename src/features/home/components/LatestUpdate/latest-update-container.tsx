import { getCachedLatestChapters } from "@/features/manga/api/latest";
import LatestUpdate from ".";

const LatestUpdateContainer = async () => {
  const latestUpdateData = await getCachedLatestChapters(18, ["vi"], false);

  return <LatestUpdate initialData={latestUpdateData} />;
};
export default LatestUpdateContainer;
