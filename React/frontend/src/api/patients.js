// api/customers.js
import api from "./axios";

export const fetchPatients = async () => {
  const res = await api.get("patients/");
  return res.data;
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
