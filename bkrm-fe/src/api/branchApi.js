import axiosClient from "./axiosClient";
const branchApi = {
  createBranch: (storeUuid, body) => {
    const url = `stores/${storeUuid}/branches`;
    return axiosClient.post(url, body);
  },
  getBranches: (storeUuid) => {
    const url = `/stores/${storeUuid}/branches`;
    return axiosClient.get(url);
  },
  getAllBranches: (storeUuid) => {
    const url = `/stores/${storeUuid}/branches/getAllBranches`;
    return axiosClient.get(url);
  },

  reportBranch: (storeUuid, from, to) => {
    const url = `/stores/${storeUuid}/report/branch?from_date=${from}&to_date=${to}`;
    return axiosClient.get(url);
  },

  getBranch: (storeUuid, branchUuid) => {
    const url = `/stores/${storeUuid}/branches/${branchUuid}`;
    return axiosClient.get(url);
  },

  deleteBranch: (storeUuid, branchUuid) => {
    const url = `/stores/${storeUuid}/branches/${branchUuid}`;
    return axiosClient.delete(url);
  },

  updateBranch: (storeUuid, branchUuid, body) => {
    const url = `/stores/${storeUuid}/branches/${branchUuid}`;
    return axiosClient.post(url, body);
  },
  inactiveBranch: (storeUuid, branchUuid) => {
    const url = `/stores/${storeUuid}/branches/${branchUuid}`;
    return axiosClient.put(url, { status: "inactive" });
  },
  activeBranch: (storeUuid, branchUuid) => {
    const url = `/stores/${storeUuid}/branches/${branchUuid}`;
    return axiosClient.put(url, { status: "active" });
  },
};
export default branchApi;
