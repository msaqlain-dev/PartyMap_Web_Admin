import apiClient from "../config/api";

export const customerService = {
  getCustomers: async (filters = {}) => {
    const response = await apiClient.get("/customers", { params: filters });
    return response.data;
  },

  getCustomer: async (id) => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await apiClient.post("/customers", customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  },

  suspendCustomer: async (id) => {
    const response = await apiClient.patch(`/customers/${id}/suspend`);
    return response.data;
  },

  activateCustomer: async (id) => {
    const response = await apiClient.patch(`/customers/${id}/activate`);
    return response.data;
  },
};