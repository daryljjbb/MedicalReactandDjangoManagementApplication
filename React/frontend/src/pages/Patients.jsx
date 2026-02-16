import usePatients from "../hooks/usePatients";
import PatientCard from "../components/patientCard.";
import PatientForm from "../components/PatientForm";
import useAuth from "../hooks/useAuth";
import { Button, Table } from "react-bootstrap";
import { useState } from "react";

const Patients = () => {
  const {
    patients,
    loading,
    error,
    addPatient,
    removePatient,
  } = usePatients();

  const { isAdmin } = useAuth();

   const [showModal, setShowModal] = useState(false);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h2>Patients</h2>
        </div>
        <div className="d-flex justify-content-end mt-2">
          <Button onClick={() => setShowModal(true)}>Add Patient</Button>
        </div>
        
        <Table className="mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
          {patients.length === 0 ? (
            <p>No patients found.</p>
          ) : (
            Array.isArray(patients) && patients.map(patient => (
              
                <tbody>
                  <tr>
                    <td>{patient.first_name} {patient.last_name}</td>
                    <td>{patient.email}</td>
                    <td>
                      <Button variant="outline-primary">View</Button>
                      {isAdmin && (
                          <>
                            <span className="mx-2 text-muted">|</span>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => removePatient(patient.id)}
                            >
                              Remove
                            </Button>
                          </>
                        )}
                    </td>
                  </tr>
                </tbody>
              
            ))
          )}
        </Table>
          <PatientForm 
            show={showModal}
            onHide={() => setShowModal(false)}
            onSubmit={addPatient}
          />
    </>
  );
};

export default Patients;