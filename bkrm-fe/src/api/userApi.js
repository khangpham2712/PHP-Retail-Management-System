import axiosClient from "./axiosClient";
const userAPi = {
  ownerRegister: (params) => {
    const url = "/register";
    return axiosClient.post(url, JSON.stringify({ ...params }));
  },
  signIn: (params) => {
    const url = "/login";
    return axiosClient.post(url, JSON.stringify({ ...params }));
  },
  logOut: () => {
    const url = "/logout";
    return axiosClient.post(url);
  },
  verify: () => {
    const url = "/verify-token";
    return axiosClient.get(url);
  },
  getCity: () => {
    const url = "/address/provinces";
    return axiosClient.get(url);
  },
  getDistrict: (id) => {
    const url = "/address/provinces";
    return axiosClient.get(`${url}/${id}/districts`);
  },
  getWard: (cityId, districtId) => {
    const url = "/address/provinces";
    return axiosClient.get(`${url}/${cityId}/districts/${districtId}/wards`);
  },
  owenerChangePassword: (store_uuid, employee_uuid, body) => {
    const url = `/stores/${store_uuid}/employees/${employee_uuid}/updateEmployeePassword`
    return axiosClient.post(url, body)
  },
  confirmPassword: (store_uuid,body) =>{
    const url = `/stores/${store_uuid}/confirmPassword`;
    return axiosClient.post(url,body)
  },
  editProfile: (store_uuid,body) =>{
    const url = `/stores/${store_uuid}/editProfile`;
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    return axiosClient.post(url,body, body instanceof FormData ? config : null)
  }
};
export default userAPi;
