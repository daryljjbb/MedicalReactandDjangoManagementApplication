import { useEffect, useState, useCallback} from "react";
import { fetchMedicalRecords, fetchMedicalRecordById, deleteMedicalRecord, createMedicalRecord } from "../api/medicalrecords";
import useAuth from "./useAuth";
const useMedicalRecords = (patientId, medicalRecordId = null) => {
  // Always store medical records as an array
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalRecord, setMedicalRecord] = useState(null); // For single medical record view

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

 const [ordering, setOrdering] = useState("record_date");

 const { isAuthenticated } = useAuth();



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

  const loadMedicalRecords = useCallback(async () => {
  try {
    setLoading(true);
    const data = await fetchMedicalRecords({
    search: debouncedSearch || "",
    ordering,
    patient: patientId,   // ⭐ FILTER BY PATIENT
    });

    setMedicalRecords(normalizeList(data));
  } catch (err) {
    setError("Failed to load medical records");
  } finally {
    setLoading(false);
  }
}, [debouncedSearch, ordering]);

 

  useEffect(() => {
    loadMedicalRecords();
  }, [isAuthenticated, debouncedSearch, ordering]);


   // 🔄 NEW: Function to load a SINGLE medical record
  const loadSingleMedicalRecord = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchMedicalRecordById(medicalRecordId);
      setMedicalRecord(data);
    } catch (err) {
      setError("Medical record not found");
    } finally {
      setLoading(false);
    }
  }, [medicalRecordId]);

  // 🚀 Trigger correct load logic
  useEffect(() => {
    if (isAuthenticated) {
      if (medicalRecordId) {
        loadSingleMedicalRecord(); // Fetch one if ID exists
      } else {
        loadMedicalRecords();    // Otherwise fetch the list
      }
    }
  }, [isAuthenticated, medicalRecordId, loadMedicalRecords, loadSingleMedicalRecord]);

  /**
   * Add a new medical record
   */
  const addMedicalRecord = async (payload) => {
  try {
    const newMedicalRecord = await createMedicalRecord(payload);
    setMedicalRecords((prev) => [...prev, newMedicalRecord]);
  } catch (err) {
    console.error("Failed to create medical record:", err);
    console.log("Response data:", err.response?.data); // 👈 ADD THIS
    throw err;
  }
};

  /**
   * Remove a medical record
   */
  const removeMedicalRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medical record?")) return;
    try {
      await deleteMedicalRecord(id);

      // Safe because `medicalRecords` is always an array
      setMedicalRecords((prev) => prev.filter((record) => record.id !== id));

    } catch (err) {
      alert("Failed to delete medical record");
    }
  };

  return {
    medicalRecords,
    medicalRecord, // ✨ Expose single medical record
    loading,
    error,
    search,
    setSearch,
    ordering,
    setOrdering,
    authError,
    reload: loadMedicalRecords,
    removeMedicalRecord,
    addMedicalRecord,
  };
};

export default useMedicalRecords;