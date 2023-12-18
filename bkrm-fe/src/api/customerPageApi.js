import axiosClient from "./axiosClient";
const customerPageApi = {
  storeInfo: (store_web_page) => {
    const url = `/storeInfo`;
    return axiosClient.get(url, {params: {store_web_page: store_web_page}});
  },
  storeProducts: (store_uuid) => {
    const url = `/storeInfo/${store_uuid}/products`;
    return axiosClient.get(url);
  },
  storeCategroies: (store_uuid) => {
    const url = `/storeInfo/${store_uuid}/getNestedCategories`;
    return axiosClient.get(url);
  },
  addOrder: (store_uuid, body) => {
    const url = `/storeInfo/${store_uuid}/addOrder`;
    return axiosClient.post(url, body);
  },
};
export default customerPageApi;
