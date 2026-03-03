import { useEffect, useState, useCallback} from "react";
import { fetchDoctors, fetchDoctorById, deleteDoctor, createDoctor } from "../api/doctors";
import useAuth from "./useAuth";
const useDoctors = (doctorId = null) => {
  // Always store doctors as an array
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null); // For single doctor view

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

 const [ordering, setOrdering] = useState("first_name");


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

  const loadDoctors = useCallback(async () => {
  try {
    setLoading(true);
    const data = await fetchDoctors({
    search: debouncedSearch || "",
    ordering,
    });

    setDoctors(normalizeList(data));
  } catch (err) {
    setError("Failed to load doctors");
  } finally {
    setLoading(false);
  }
}, [debouncedSearch, ordering]);

 

  useEffect(() => {
    loadDoctors();
  }, [isAuthenticated, debouncedSearch, ordering]);


   // 🔄 NEW: Function to load a SINGLE doctor
  const loadSingleDoctor = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchDoctorById(doctorId);
      setDoctor(data);
    } catch (err) {
      setError("Doctor not found");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  // 🚀 Trigger correct load logic
  useEffect(() => {
    if (isAuthenticated) {
      if (doctorId) {
        loadSingleDoctor(); // Fetch one if ID exists
      } else {
        loadDoctors();    // Otherwise fetch the list
      }
    }
  }, [isAuthenticated, doctorId, loadDoctors, loadSingleDoctor]);

  /**
   * Add a new doctor
   */
  const addDoctor = async (payload) => {
  try {
    const newDoctor = await createDoctor(payload);
    setDoctors((prev) => [...prev, newDoctor]);
  } catch (err) {
    console.error("Failed to create doctor:", err);
    console.log("Response data:", err.response?.data); // 👈 ADD THIS
    throw err;
  }
};

  /**
   * Remove a doctor
   */
  const removeDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteDoctor(id);

      // Safe because `doctors` is always an array
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));

    } catch (err) {
      alert("Failed to delete doctor");
    }
  };

  return {
    doctors,
    doctor, // ✨ Expose single doctor
    loading,
    error,
    search,
    setSearch,
    ordering,
    setOrdering,
    authError,
    reload: loadDoctors,
    removeDoctor,
    addDoctor,
  };
};

export default useDoctors;