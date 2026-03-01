import usePatients from "../hooks/usePatients";
import PatientForm from "../components/PatientForm";
import useAuth from "../hooks/useAuth";
import ReusableSearchForm from "../components/ReusableSearchForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

const Patients = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const {
    patients,
    loading,
    error,
    search,
    setSearch,
    ordering,
    setOrdering,
    addPatient,
    removePatient,
  } = usePatients(isAuthenticated);

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const highlightMatch = (text, query) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "i");
  return text.replace(regex, "<mark>$1</mark>");
};

const toggleOrdering = (field) => {
  if (ordering === field) {
    setOrdering(`-${field}`); // descending
  } else {
    setOrdering(field); // ascending
  }
};



  if (loading) return <p>Loading patients...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2>Patients</h2>
      </div>

      <ReusableSearchForm
        value={search}
        onChange={setSearch}
        loading={loading}
        placeholder="Search by name or email..."
      />


      <div className="d-flex justify-content-end mt-2">
        <Button onClick={() => setShowModal(true)}>Add Patient</Button>
      </div>

      <Table className="mt-3">
       <thead>
        <tr>
          <th
            style={{ cursor: "pointer" }}
            onClick={() => toggleOrdering("first_name")}
          >
            Name{" "}
            {ordering === "first_name" && "↑"}
            {ordering === "-first_name" && "↓"}
          </th>

          <th
            style={{ cursor: "pointer" }}
            onClick={() => toggleOrdering("email")}
          >
            Email{" "}
            {ordering === "email" && "↑"}
            {ordering === "-email" && "↓"}
          </th>

          <th>Actions</th>
        </tr>
      </thead>


        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="3">No patients found.</td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(
                      `${patient.first_name} ${patient.last_name}`,
                      search
                    )
                  }}
                />

                <td
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(patient.email, search)
                  }}
                />
                <td>
                  <Button variant="outline-primary"onClick={() => navigate(`/patients/${patient.id}`)}>View</Button>
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
            ))
          )}
        </tbody>
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