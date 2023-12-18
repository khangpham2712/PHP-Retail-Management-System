import axiosClient from "./axiosClient";

const customerApi = {
  createCustomer: (storeUuid, body) => {
    const url = `/stores/${storeUuid}/customers`;
    return axiosClient.post(url, body);
  },
  getCustomers: (storeUuid, query) => {
    const url = `/stores/${storeUuid}/customers`;
    return axiosClient.get(url, {params: query});
  },
  getCustomer: (storeUuid, customerUuid) => {
    const url = `/stores/${storeUuid}/customers/${customerUuid}`;
    return axiosClient.get(url);
  },
  deleteCustomer: (storeUuid, customerUuid) => {
    const url = `/stores/${storeUuid}/customers/${customerUuid}`;
    return axiosClient.delete(url);
  },
  updateCustomer: (storeUuid, customerUuid,body) => {
    const url = `/stores/${storeUuid}/customers/${customerUuid}`;
    return axiosClient.put(url,body);
  },
  payDebt: (storeUuid, customerUuid, body) => {
    const url = `/stores/${storeUuid}/customers/${customerUuid}/payDebt`;
    return axiosClient.put(url,body);
  },
  importCustomerJson : (storeUuid, json) => {
    const url = `stores/${storeUuid}/customers/addCustomersByJson`;
    return axiosClient.post(url, {
      "json_data": json
    });
  },
  updateCustomerVouchers: (storeUuid, customerUuid,vouchers) => {
    const url = `stores/${storeUuid}/customer/${customerUuid}`;
    return axiosClient.post(url, {
      "vouchers": JSON.stringify(vouchers)
    });
  },
  getCustomerDebts: (storeUuid, query) => {
    const url = `stores/${storeUuid}/customerDebts`;
    return axiosClient.get(url, {params: query});
  },
  getCustomerGroups: (storeUuid) => {
    const url = `stores/${storeUuid}/customerGroups`;
    return axiosClient.get(url);
  },
  updateCustomerGroup: (storeUuid, id, body) => {
    const url = `stores/${storeUuid}/customerGroups/${id}`;
    return axiosClient.put(url, body);
  },
  createCustomerGroup: (storeUuid, body) => {
    const url = `stores/${storeUuid}/customerGroups/`;
    return axiosClient.post(url, body);
  },
  deleteCustomerGroup: (storeUuid, id) => {
    const url = `stores/${storeUuid}/customerGroups/${id}`;
    return axiosClient.delete(url);
  },
};
export default customerApi;
