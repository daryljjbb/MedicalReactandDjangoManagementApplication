// src/components/Tabs/MedicalRecordsTab.jsx
import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import ReusableForm from "../ReusableForm";
import useMedicalRecords from "../../hooks/useMedicalRecords";

const MedicalRecordsTab = ({ patient }) => {
 const { medicalRecords, addMedicalRecord, removeMedicalRecord } =
  useMedicalRecords(patient?.id);


  const [showModal, setShowModal] = useState(false);

  const initialData = {
    record_date: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialData);

  const fields = [
    { name: "record_date", label: "Record Date", type: "date", required: true },
    { name: "diagnosis", label: "Diagnosis", type: "text", required: true },
    { name: "treatment", label: "Treatment", type: "text" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <div>
      {/* Button INSIDE the tab content */}
      <Button
        variant="outline-primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        Add Medical Record
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Medical Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReusableForm
            fields={fields}
            formData={formData}
            setFormData={setFormData}
            onSubmit={(data) => {
                addMedicalRecord({
                ...data,
                patient: patient.id,   // ⭐ attach the patient ID
                });
                setShowModal(false);
                setFormData(initialData);
            }}
            />

        </Modal.Body>
      </Modal>

      {/* Table */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Diagnosis</th>
            <th>Treatment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicalRecords.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No medical records found.
              </td>
            </tr>
          ) : (
            medicalRecords.map((r) => (
              <tr key={r.id}>
                <td>{r.record_date}</td>
                <td>{r.diagnosis}</td>
                <td>{r.treatment}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeMedicalRecord(r.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MedicalRecordsTab;
