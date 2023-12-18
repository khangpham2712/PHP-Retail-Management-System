import axiosClient from "./axiosClient";

const inventoryCheckApi = {
  create: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/inventory-checks/`;
    return axiosClient.post(url, body);
  },
  getAllOfBranch: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/inventory-checks/`;
    return axiosClient.get(url, {params: query});
  },
  search: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/inventory-checks/`;
    return axiosClient.get(url, { params: query });
  },
};
export default inventoryCheckApi;
