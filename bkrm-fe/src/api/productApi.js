import axios from "axios";
import { currentDate } from "../utils";
import axiosClient from "./axiosClient";
const productApi = {
  createProduct: (storeUuid, params) => {
    const url = `stores/${storeUuid}/products`;
    return axiosClient.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  addProductWithVaration: (storeUuid, params) => {
    const url = `stores/${storeUuid}/products/addProductWithVariation`;
    return axiosClient.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getProductsOfBranch: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/products`;
    return axiosClient.get(url, { params: query });
  },

  getProduct: (storeUuid, productUuid, query) => {
    const url = `stores/${storeUuid}/products/${productUuid}`;
    return axiosClient.get(url, { params: query });
  },

  createCategory: (storeUuid, params) => {
    const url = `stores/${storeUuid}/categories`;
    return axiosClient.post(url, JSON.stringify(params));
  },
  getAllCategory: (storeUuid) => {
    const url = `/stores/${storeUuid}/categories`;
    return axiosClient.get(url);
  },
  getParentCategory: (storeUuid) => {
    const url = `/stores/${storeUuid}/categories/parent`;
    return axiosClient.get(url);
  },
  getSubCategory: (storeUuid, parentCategory) => {
    const url = `/stores/${storeUuid}/categories/${parentCategory}`;
    return axiosClient.get(url);
  },
  deleteProduct: (storeUuid, productUuid) => {
    const url = `stores/${storeUuid}/products/${productUuid}`;
    return axiosClient.delete(url);
  },
  searchProduct: (storeUuid, searchKey) => {
    const url = `stores/${storeUuid}/products/`;
    return axiosClient.get(url, { params: { searchKey: searchKey } });
  },

  searchBranchProduct: (storeUuid, branchUuid, searchKey) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/search-products/`;
    return axiosClient.get(url, { params: { searchKey: searchKey } });
  },

  updateProduct: (storeUuid, productUuid, params) => {
    const url = `stores/${storeUuid}/products/${productUuid}`;
    return axiosClient.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getNestedCategory: (storeUuid) => {
    const url = `stores/${storeUuid}/categories/getNestedCategory`;
    return axiosClient.get(url);
  },

  searchDefaultProducts: (searchKey, page) => {
    const url = `/searchDefaultProduct?searchKey=${searchKey}&page=${page}&limit=${15}`;
    return axiosClient.get(url);
  },

  addCategory: (storeUuid, body) => {
    const url = `stores/${storeUuid}/categories`;
    return axiosClient.post(url, body);
  },

  editCategory: (storeUuid, categoryUuid, body) => {
    const url = `stores/${storeUuid}/categories/${categoryUuid}`;
    return axiosClient.put(url, body);
  },
  deleteCategory: (storeUuid, categoryUuid) => {
    const url = `stores/${storeUuid}/categories/${categoryUuid}`;
    return axiosClient.delete(url);
  },

  createBatch: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/createBatch`;
    return axiosClient.post(url, body);
  },
  productOrderRecommend: (storeUuid, branchUuid, body) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/productOrderRecommend`;
    return axiosClient.get(url, {params: body});
  },

  
};
export default productApi;
