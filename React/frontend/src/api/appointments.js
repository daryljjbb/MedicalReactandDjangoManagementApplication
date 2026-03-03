// api/customers.js
import api from "./axios";

export const fetchAppointments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`appointments/?${query}`);
  return res.data;
};

export const fetchAppointmentById = async (id) => {
  const response = await api.get(`appointments/${id}/`);
  return response.data;
};



export const createAppointment = async (payload) => {
  const res = await api.post("appointments/", payload);
  return res.data;
};


/**
 * Delete an appointment by ID
 * @param {number} id
 */
export const deleteAppointment = async (id) => {
  await api.delete(`appointments/${id}/`);
};
