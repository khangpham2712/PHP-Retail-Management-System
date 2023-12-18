import axiosClient from "./axiosClient";

const invoiceApi = {
  
  getAllOfBranch: (storeUuid, branchUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/invoices/`;
    return axiosClient.get(url, {});
  },
  getAllOfStore: (storeUuid) => {
    const url = `stores/${storeUuid}/invoices/`;
    return axiosClient.get(url, {});
  },
  getPurchaseOrder: (storeUuid, invoiceUuid) => {
    const url = `stores/${storeUuid}/invoices/${invoiceUuid}`;
    return axiosClient.get(url, {});
  }
};
export default invoiceApi;
