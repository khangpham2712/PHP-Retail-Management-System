import axiosClient from "./axiosClient";

const orderApi = {
  addOrder: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/orders/addOrder`;
    return axiosClient.post(url, body);
  },
  getAllOfStore: (storeUuid) => {
    const url = `stores/${storeUuid}/orders`;
    return axiosClient.get(url, {});
  },
  getAllOfBranch: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/orders`;
    return axiosClient.get(url, { params: query });
  },
  getOrder: (storeUuid, orderUuid) => {
    const url = `stores/${storeUuid}/orders/${orderUuid}`;
    return axiosClient.get(url, {});
  },
  searchOrder: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/orders`;
    return axiosClient.get(url, { params: query });
  },
  editOrderApi: (storeUuid, branchUuid, orderUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/orders/${orderUuid}`;
    return axiosClient.put(url, body);
  },
  deleteOrder: (storeUuid, branchUuid, orderUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/orders/${orderUuid}`;
    return axiosClient.delete(url);
  },
  deleteAll: (storeUuid, branchUuid) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/orders/deleteAll`;
    return axiosClient.delete(url);
  },

  // api for customer order
  searchCustomerOrder: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/customerOrders`;
    return axiosClient.get(url, { params: query });
  },
  processCustomerOrder: (storeUuid, branchUuid, customerOrderId) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/customerOrders/${customerOrderId}/process`;
    return axiosClient.get(url);
  },
  confirmCustomerOrder: (storeUuid, branchUuid, customerOrderId, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/customerOrders/${customerOrderId}/confirm`;
    return axiosClient.post(url, body);
  },
  cancleCustomerOrder: (storeUuid, branchUuid, customerOrderId) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/customerOrders/${customerOrderId}/cancel`;
    return axiosClient.post(url);
  },
  paymentCustomerOrder: (storeUuid, branchUuid, customerOrderId, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/customerOrders/${customerOrderId}/payment`;
    return axiosClient.post(url, body);
  },
  updateCustomerOrder: (storeUuid, branchUuid, customerOrderId, newDetails) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/customerOrders/${customerOrderId}/updateDetails`;
    return axiosClient.post(url, {
      details: JSON.stringify(newDetails),
    });
  },
};
export default orderApi;
