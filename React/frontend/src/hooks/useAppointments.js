import { fetchAppointments, fetchAppointmentById, createAppointment, deleteAppointment } from "../api/appointments";
import { useState, useEffect, useCallback} from "react";
import useAuth from "./useAuth";

const useAppointments = (patientId, appointmentId = null) => {

 const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState(null); // For single appointment view

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
  
    const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAppointments({
      search: debouncedSearch || "",
      ordering,
      patient: patientId,   // ⭐ FILTER BY PATIENT
      });
  
      setAppointments(normalizeList(data));
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, ordering]);
  
   
  
    useEffect(() => {
      loadAppointments();
    }, [isAuthenticated, debouncedSearch, ordering]);
  
  
     // 🔄 NEW: Function to load a SINGLE appointment
    const loadSingleAppointment = useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAppointmentById(appointmentId);
        setAppointment(data);
      } catch (err) {
        setError("Appointment not found");
      } finally {
        setLoading(false);
      }
    }, [appointmentId]);
  
    // 🚀 Trigger correct load logic
   useEffect(() => {
  if (isAuthenticated) {
    if (appointmentId) loadSingleAppointment();
    else loadAppointments();
  }
}, [isAuthenticated, appointmentId, loadAppointments, loadSingleAppointment]);


    /**
     * Add a new appointment
     */
    const addAppointment = async (payload) => {
    try {
      const newAppointment = await createAppointment(payload);
      setAppointments((prev) => [...prev, newAppointment]);
    } catch (err) {
      console.error("Failed to create appointment:", err);
      console.log("Response data:", err.response?.data); // 👈 ADD THIS
      throw err;
    }
  };
  
    /**
     * Remove an appointment
     */
    const removeAppointment = async (id) => {
      if (!window.confirm("Are you sure you want to delete this appointment?")) return;
      try {
        await deleteAppointment(id);
  
        // Safe because `appointments` is always an array
        setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
  
      } catch (err) {
        alert("Failed to delete appointment");
      }
    };
  return {
    appointments,
    appointment, // ✨ Expose single appointment
    loading,
    error,
    search,
    setSearch,
    ordering,
    setOrdering,
    authError,
    reload: loadAppointments,
    removeAppointment,
    addAppointment,
  };
};

export default useAppointments; 