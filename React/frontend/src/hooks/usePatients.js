import { useEffect, useState } from "react";
import { fetchPatients, deletePatient, createPatient } from "../api/patients";

const usePatients = (isAuthenticated) => {
  // Always store patients as an array
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false);

  /**
   * Normalize API responses so `patients` is ALWAYS an array.
   * This prevents the "prev is not iterable" crash forever.
   */
  const normalizeList = (data) => {
    // If backend returns an array directly → use it
    if (Array.isArray(data)) return data;

    // If backend returns paginated data → use results
    if (Array.isArray(data?.results)) return data.results;

    // Fallback → always return an empty array
    return [];
  };

  /**
   * Load patients from API
   */
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchPatients();

      // Normalize once here → the rest of the app stays clean
      setPatients(normalizeList(data));

    } catch (err) {
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [isAuthenticated]);

  /**
   * Add a new patient
   */
  const addPatient = async (payload) => {
    try {
      const newPatient = await createPatient(payload);

      // Because we normalized earlier, `prev` is ALWAYS an array
      setPatients((prev) => [...prev, newPatient]);

    } catch (err) {
      console.error("Failed to create patient:", err);
      throw err; // allow form to show errors
    }
  };

  /**
   * Remove a patient
   */
  const removePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await deletePatient(id);

      // Safe because `patients` is always an array
      setPatients((prev) => prev.filter((patient) => patient.id !== id));

    } catch (err) {
      alert("Failed to delete patient");
    }
  };

  return {
    patients,
    loading,
    error,
    authError,
    reload: loadPatients,
    removePatient,
    addPatient,
  };
};

export default usePatients;
