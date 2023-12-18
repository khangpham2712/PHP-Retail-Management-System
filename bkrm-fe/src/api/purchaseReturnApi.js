import axiosClient from "./axiosClient";

const purchaseReturnApi = {
  removeInventory: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/purchase-returns/removeInventory`;
    return axiosClient.post(url, body);
  },
  getAllOfBranch: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/purchase-returns`;
    return axiosClient.get(url, {params: query});
  },
  getAllOfStore: (storeUuid) => {
    const url = `stores/${storeUuid}/purchase-returns`;
    return axiosClient.get(url, {});
  },
  getPurchaseReturn: (storeUuid, purchaseReturnUuid) => {
    const url = `stores/${storeUuid}/purchase-returns/${purchaseReturnUuid}`;
    return axiosClient.get(url, {});
  },
  searchPurchaseReturn: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/purchase-returns`;
    return axiosClient.get(url, {params: query});
  }
};
export default purchaseReturnApi;
