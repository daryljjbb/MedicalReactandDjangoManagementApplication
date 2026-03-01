// api/customers.js
import api from "./axios";

export const fetchPatients = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`patients/?${query}`);
  return res.data;
};

export const fetchPatientById = async (id) => {
  const response = await api.get(`patients/${id}/`);
  return response.data;
};



export const createPatient = async (payload) => {
  const res = await api.post("patients/", payload);
  return res.data;
};


/**
 * Delete a patient by ID
 * @param {number} id
 */
export const deletePatient = async (id) => {
  await api.delete(`patients/${id}/`);
};
