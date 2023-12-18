import axiosClient from "./axiosClient";
const employeeApi = {
  createEmployee: (storeUuid, formData) => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const url = `stores/${storeUuid}/employees`;
    return axiosClient.post(url, formData, config);
  },
  getEmployees: (storeUuid, query) => {
    const url = `/stores/${storeUuid}/employees`;
    return axiosClient.get(url, {params: query});
  },

  getEmployee: (storeUuid, employeeUuid) => {
    const url = `/stores/${storeUuid}/employees/${employeeUuid}`;
    return axiosClient.get(url);
  },
  deleteEmployee: (storeUuid, employeeUuid) => {
    const url = `/stores/${storeUuid}/employees/${employeeUuid}`;
    return axiosClient.delete(url);
  },
  updateEmployee: (storeUuid, employeeUuid, formData) => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const url = `/stores/${storeUuid}/employees/${employeeUuid}`;
    return axiosClient.post(url, formData, config);
  },
  inactiveEmployee: (storeUuid, employeeUuid) => {
    const url = `/stores/${storeUuid}/employees/${employeeUuid}`;
    return axiosClient.post(url, {status: 'inactive'});
  },
  activeEmployee: (storeUuid, employeeUuid) => {
    const url = `/stores/${storeUuid}/employees/${employeeUuid}`;
    return axiosClient.post(url, {status: 'active'});
  },
};
export default employeeApi;
