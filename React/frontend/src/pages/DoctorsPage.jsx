import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button, Modal, Table } from "react-bootstrap";
import ReusableForm from "../components/ReusableForm";
import useDoctors from "../hooks/useDoctors";

export default function DoctorsPage() {

  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

   const {
    doctors,
    doctor,
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
     } =useDoctors();

 const initialData = {
     first_name: "",
     last_name: "",
     email: "",
     phone: "",
     specialization: "",
   };
 
   const [formData, setFormData] = useState(initialData);
 
   const fields = [
     { name: "first_name", label: "First Name", type: "text", required: true },
     { name: "last_name", label: "Last Name", type: "text", required: true },
     { name: "email", label: "Email", type: "email", required: true },
     { name: "phone", label: "Phone Number", type: "tel" },
     { name: "specialization", label: "Specialization", type: "text" },
   ];

  return (
    <div >
      {/* Header */}
       {/* Button INSIDE the tab content */}
      <Button
        variant="outline-primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        Add Doctor
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
                addDoctor({
                ...data,
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
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  doctors.map((d) => (
                    <tr key={d.id}>
                      <td>{d.first_name} {d.last_name}</td>
                      <td>{d.specialization}</td>
                      <td>{d.email}</td>
                      <td>{d.phone}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeDoctor(d.id)}
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
}
