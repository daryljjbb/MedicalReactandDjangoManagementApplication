import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Patients from "./pages/Patients";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import Navbar from "./components/Navbar"; // Import Navbar
import useAuth from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Navbar /> {/* Navbar will now appear on every page if logged in */}
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Add this */}
          
          <Route 
            path="/patients" 
            element={isAuthenticated ? <Patients /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/patients" /> : <Navigate to="/login" />} 
          />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      
    </Router>
  );
}

export default App;
