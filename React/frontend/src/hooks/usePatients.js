import { useEffect, useState, useCallback} from "react";
import { fetchPatients, fetchPatientById, deletePatient, createPatient } from "../api/patients";

const usePatients = (isAuthenticated, patientId = null) => {
  // Always store patients as an array
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null); // For single patient view

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [ordering, setOrdering] = useState("first_name");


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);


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

  const loadPatients = useCallback(async () => {
  try {
    setLoading(true);
    const data = await fetchPatients({
    search: debouncedSearch || "",
    ordering
    });

    setPatients(normalizeList(data));
  } catch (err) {
    setError("Failed to load patients");
  } finally {
    setLoading(false);
  }
}, [debouncedSearch, ordering]);

 

  useEffect(() => {
    loadPatients();
  }, [isAuthenticated, debouncedSearch, ordering]);


   // 🔄 NEW: Function to load a SINGLE customer
  const loadSinglePatient = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchPatientById(patientId);
      setPatient(data);
    } catch (err) {
      setError("Patient not found");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // 🚀 Trigger correct load logic
  useEffect(() => {
    if (isAuthenticated) {
      if (patientId) {
        loadSinglePatient(); // Fetch one if ID exists
      } else {
        loadPatients();    // Otherwise fetch the list
      }
    }
  }, [isAuthenticated, patientId, loadPatients, loadSinglePatient]);

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
    patient, // ✨ Expose single patient
    loading,
    error,
    search,
    setSearch,
    ordering,
    setOrdering,
    authError,
    reload: loadPatients,
    removePatient,
    addPatient,
  };
};

export default usePatients;
