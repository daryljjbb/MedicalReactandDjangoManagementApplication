import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

const ReusableForm = ({ fields, formData, setFormData, onSubmit, submitLabel = "Save" }) => {
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate all fields
  const validateForm = () => {
    let newErrors = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <Form.Group className="mb-3" controlId={field.name} key={field.name}>
          <Form.Label>{field.label}</Form.Label>

          {/* InputGroup for prefix/suffix */}
          <InputGroup>
            {field.prefix && <InputGroup.Text>{field.prefix}</InputGroup.Text>}

            {field.type === "select" ? (
                <Form.Select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    disabled={field.readOnly}
                    isInvalid={!!errors[field.name]}
                >
                    <option value="">Select {field.label}</option>
                    {(field.options || field.choices || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                    ))}
                </Form.Select>

            ) : field.type === "textarea" ? (
              <Form.Control
                as="textarea"
                rows={field.rows || 3}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                readOnly={field.readOnly}
                isInvalid={!!errors[field.name]}
              />
            ) : (
              <Form.Control
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                readOnly={field.readOnly}
                isInvalid={!!errors[field.name]}
              />
            )}

            {field.suffix && <InputGroup.Text>{field.suffix}</InputGroup.Text>}

            <Form.Control.Feedback type="invalid">
              {errors[field.name]}
            </Form.Control.Feedback>
          </InputGroup>

          {field.helpText && (
            <Form.Text className="text-muted">{field.helpText}</Form.Text>
          )}
        </Form.Group>
      ))}

      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </Form>
  );
};

export default ReusableForm;
