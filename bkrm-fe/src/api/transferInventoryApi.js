import { currentDate } from "../utils";
import axiosClient from "./axiosClient";
const transferInventoryApi = {
  get: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/transferInventory`;
    return axiosClient.get(url, body);
  },
  update: (storeUuid, branchUuid, id, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/transferInventory/${id}`;
    return axiosClient.put(url, body);
  },
  post: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/transferInventory`;
    return axiosClient.post(url, { ...body, created_at: currentDate() });
  },
};
export default transferInventoryApi;
