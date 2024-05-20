import NodeCache from "node-cache";
import accountBankData from "../api/accountBankData";
import { IAccountBankData } from "../utils/types";
import accountBankDataCache from "../seed/accountBankDataCache";
const apiCache = new NodeCache();

const fetchAccountBankDataFromAPI = async (pixKey: string) => {
  const apiData = accountBankData.find((el) => el.pixKey === pixKey);
  return (
    apiData || { pixKey, bankName: "", bankImageUrl: "", agency: "", cc: "" }
  );
};

const setAccountBankDataCache = async () => {
  console.log("Starting cache");
  accountBankDataCache.forEach((el) => {
    apiCache.set(el.pixKey, el);
  });
  console.log("Seed cache completed");
};

const getAccountBankData = async (
  pixKey: string
): Promise<IAccountBankData> => {
  const cachedData: IAccountBankData = apiCache.get(pixKey);
  if (cachedData) {
    console.log("\n\n### Using data from cache ###\n\n");
    return cachedData;
  }

  console.log("\n\n### Data not found in cache, fetching from API ###\n\n");
  const apiData: IAccountBankData = await fetchAccountBankDataFromAPI(pixKey);
  if (apiData) {
    apiCache.set(pixKey, apiData);
  }
  return apiData;
};

export default { getAccountBankData, setAccountBankDataCache };
