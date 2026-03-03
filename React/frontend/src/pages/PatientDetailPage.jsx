import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import usePatients from "../hooks/usePatients";
import useAuth from "../hooks/useAuth";

import OverviewTab from '../components/Tabs/OverviewTab';
import MedicalRecordsTab from '../components/Tabs/MedicalRecordsTab';
import AppointmentsTab from '../components/Tabs/AppointmentsTab';
import { Button } from "react-bootstrap";
import { Nav } from "react-bootstrap";



export default function PatientDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
   const {
    patient,
    loading,
    error,
  } = usePatients(isAuthenticated, id); // Pass ID to fetch single patient

  const [activeTab, setActiveTab] = useState("overview");

  const [showRecordModal, setShowRecordModal] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-gray-600 text-lg">
        Loading patient...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex justify-center p-10 text-red-500 text-lg">
        Patient not found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="bg-white p-4 shadow rounded flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{patient.first_name} {patient.last_name}</h1>
          <p className="text-gray-600 text-sm">ID: {patient.id}</p>
        </div>
      </div>

      {/* TABS */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
        </Nav.Item>

        <Nav.Item>
            <Nav.Link eventKey="records">Medical Records</Nav.Link>
        </Nav.Item>
         <Nav.Item>
            <Nav.Link eventKey="appointments">Appointments</Nav.Link>
        </Nav.Item>
        </Nav>


      {/* CONTENT AREA */}
      <div className="bg-white p-6 shadow-md rounded-lg min-h-[300px]">
        {activeTab === "overview" && <OverviewTab patient={patient} />}
        {activeTab === "records" && <MedicalRecordsTab
         patient={patient} />}
        {activeTab === "appointments" && <AppointmentsTab patient={patient} />}
      </div>
    </div>
  );
}
