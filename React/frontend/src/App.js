import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Patients from "./pages/Patients";
import PatientDetailPage from "./pages/PatientDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import Layout from "./components/Layout";   // <-- IMPORTANT
import useAuth from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes wrapped in Layout */}
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          {/* Add more pages here */}
        </Route>

        {/* Default redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/patients" /> : <Navigate to="/login" />
          }
        />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
