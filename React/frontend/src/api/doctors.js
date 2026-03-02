// api/customers.js
import api from "./axios";

export const fetchDoctors = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`doctors/?${query}`);
  return res.data;
};

export const fetchDoctorById = async (id) => {
  const response = await api.get(`doctors/${id}/`);
  return response.data;
};



export const createDoctor = async (payload) => {
  const res = await api.post("doctors/", payload);
  return res.data;
};


/**
 * Delete a doctor by ID
 * @param {number} id
 */
export const deleteDoctor = async (id) => {
  await api.delete(`doctors/${id}/`);
};
