import { getCachedLatestChapters } from "@/lib/mangadex/latest";
import LatestUpdate from ".";

const LatestUpdateContainer = async () => {
  const latestUpdateData = await getCachedLatestChapters(18, ["vi"], false);

  return <LatestUpdate initialData={latestUpdateData} />;
};
export default LatestUpdateContainer;
