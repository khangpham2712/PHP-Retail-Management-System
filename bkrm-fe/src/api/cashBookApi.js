import axiosClient from "./axiosClient";
import moment from 'moment'
const cashBookApi = {
  get: (storeUuid, branchUuid, query) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/cashbook`;
    return axiosClient.get(url, {params: query});
  },
  create: (storeUuid, branchUuid, body) => {
    let d = moment.now() / 1000;

    let currentDate = moment
      .unix(d)
      .format("YYYY-MM-DD", { trim: false });
    const url = `stores/${storeUuid}/branches/${branchUuid}/cashbook`;
    return axiosClient.post(url, {...body,date: currentDate});
  },
  update: (storeUuid, branchUuid, id, body) => {
    
    const url = `stores/${storeUuid}/branches/${branchUuid}/cashbook/${id}`;
    return axiosClient.put(url, body);
  },
  delete: (storeUuid, branchUuid, id) => {
    const url = `stores/${storeUuid}/branches/${branchUuid}/cashbook/${id}`;
    return axiosClient.delete(url);
  },
};
export default cashBookApi;
