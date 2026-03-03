// src/components/Tabs/AppointmentsTab.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import ReusableForm from "../ReusableForm";
import useAppointments from "../../hooks/useAppointments";
import useDoctors from "../../hooks/useDoctors";
import toast from "react-hot-toast";

const AppointmentsTab = ({ patient }) => {
  // -------------------------
  // STATE
  // -------------------------
 const { appointments, loading, error, addAppointment, removeAppointment } =
  useAppointments(patient?.id);
  const { doctors,doctor} = useDoctors();

 
  const [showModal, setShowModal] = useState(false);

   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
    const initialData = {
    appointment_date: "",
    doctor: "",
    reason: "",
    notes: "",
    };
  
    const [formData, setFormData] = useState(initialData);

    const fields = [
  {
    name: "appointment_date",
    label: "Appointment Date",
    type: "date",
    required: true,
  },
  {
    name: "doctor",
    label: "Doctor",
    type: "select",
    required: true,
    options: doctors.map((d) => ({
      value: d.id,
      label: `Dr. ${d.first_name} ${d.last_name}${d.specialization ? ` (${d.specialization})` : ""}`,
    })),
  },
  {
    name: "reason",
    label: "Reason",
    type: "text",
    required: true,
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
  },
];


  // -------------------------
  // MUST STILL RUN HOOKS EVEN IF patient is missing
  // So we don't early return
  // -------------------------

 


 

  // -------------------------
  // HANDLERS
  // -------------------------
  
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Appointments</h3>

      {/* Button INSIDE the tab content */}
      <Button
        variant="outline-primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        Add Appointment
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
                addAppointment({
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
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.appointment_date}</td>
                      <td>{a.doctor}</td>
                      <td>{a.reason}</td>
                      <td>{a.notes}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeAppointment(a.id)}
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

export default AppointmentsTab;
