// api/customers.js
import api from "./axios";

export const fetchMedicalRecords = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`medical-records/?${query}`);
  return res.data;
};

export const fetchMedicalRecordById = async (id) => {
  const response = await api.get(`medical-records/${id}/`);
  return response.data;
};



export const createMedicalRecord = async (payload) => {
  const res = await api.post("medical-records/", payload);
  return res.data;
};


/**
 * Delete a medical record by ID
 * @param {number} id
 */
export const deleteMedicalRecord = async (id) => {
  await api.delete(`medical-records/${id}/`);
};
