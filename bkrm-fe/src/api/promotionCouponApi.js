import axiosClient from "./axiosClient";
import moment from "moment";
const promotionCouponApi = {
  createPromotion: (storeUuid, body) => {
    const url = `stores/${storeUuid}/createPromotion`;
    return axiosClient.post(url, body);
  },

  createVoucher: (storeUuid, body) => {
    const url = `stores/${storeUuid}/createVoucher`;
    return axiosClient.post(url, body);
  },
  updatePromotion: (storeUuid, body) => {
    const url = `stores/${storeUuid}/updatePromotion`;
    return axiosClient.put(url, body);
  },
  updateVoucher: (storeUuid, body) => {
    const url = `stores/${storeUuid}/updatePromotion`;
    return axiosClient.put(url, body);
  },
  getActivePromotionVoucher: (storeUuid) => {
    let d = moment.now() / 1000;

    let currentDate = moment
      .unix(d)
      .format("YYYY-MM-DD", { trim: false });
    const url = `stores/${storeUuid}/getActivePromotionVoucher`;
    return axiosClient.get(url, {
      params: {
        date: currentDate,
      },
    });
  },
  getAllPromotions: (storeUuid,query) => {
    const url = `stores/${storeUuid}/getAllPromotions`;
    return axiosClient.get(url, {
      params: query,
    });
  },
  getAllVouchers: (storeUuid,query) => {
    const url = `stores/${storeUuid}/getAllVouchers`;
    return axiosClient.get(url, {
      params: query,
    });
  },
};
export default promotionCouponApi;
