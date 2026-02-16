import { useState } from "react";
import { createPatient } from "../api/patients";
import { Modal, Button } from "react-bootstrap";

const PatientForm = ({show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        gender: "",
        blood_type: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

   const [loading, setLoading] = useState(false);

   const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Client-side validation
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.first_name) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    return newErrors;
  };

  /**
   * Submit handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});


      // ✅ THIS is where await belongs
     await onSubmit(formData);


      // Reset form
      setFormData({
       first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        gender: "",
        blood_type: "",
      });

       // 2. If successful, close the modal using the prop from parent
      onHide(); 


    } catch (err) {
      console.error("Create customer failed:", err);

      // Django validation errors come back as an object
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Failed to create invoice" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <form
      onSubmit={handleSubmit}
      className=""
    >
      <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>

      {/* First Name */}
      <div>
        <label className="form-label">First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="form-label">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="form-label">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-control"
        />
      </div>
       {/* Address */}
      <div>
        <label className="form-label">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="form-label">Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="form-label">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {/* Blood Type */}
      <div>
        <label className="form-label">Blood Type</label>
        <select
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Blood Type</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                    <option key={type} value={type}>{type}</option>

                  ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-outline-primary"
      >
        {submitting ? "Saving..." : "Save Patient"}

      </button>
    </form>
     </Modal.Body>
    </Modal>
  );

};

export default PatientForm;
