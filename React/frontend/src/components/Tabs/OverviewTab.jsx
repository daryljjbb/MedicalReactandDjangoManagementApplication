import { Card, Row, Col } from "react-bootstrap";

export default function OverviewTab({ patient }) {
  if (!patient) {
    return (
      <div className="text-center text-muted p-4">
        No patient data available.
      </div>
    );
  }

  return (
    <div className="mt-3">

      {/* PERSONAL INFO */}
      <section className="mb-4">
        <h4 className="mb-3">Personal Information</h4>

        <Row className="g-3">
          <Col md={6}>
            <InfoCard label="Full Name" value={`${patient.first_name} ${patient.last_name}`} />
          </Col>

          <Col md={6}>
            <InfoCard label="Date of Birth" value={patient.date_of_birth} />
          </Col>

          <Col md={6}>
            <InfoCard label="Gender" value={patient.gender} />
          </Col>

          <Col md={6}>
            <InfoCard label="Blood Type" value={patient.blood_type} />
          </Col>
        </Row>
      </section>

      {/* CONTACT INFO */}
      <section className="mb-4">
        <h4 className="mb-3">Contact Details</h4>

        <Row className="g-3">
          <Col md={6}>
            <InfoCard label="Phone" value={patient.phone || "N/A"} />
          </Col>

          <Col md={6}>
            <InfoCard label="Email" value={patient.email || "N/A"} />
          </Col>

          <Col md={12}>
            <InfoCard label="Address" value={patient.address || "N/A"} />
          </Col>
        </Row>
      </section>

      {/* EMERGENCY CONTACT */}
      <section className="mb-4">
        <h4 className="mb-3">Emergency Contact</h4>

        {patient.emergency_contact_name ? (
          <Row className="g-3">
            <Col md={6}>
              <InfoCard
                label="Contact Name"
                value={patient.emergency_contact_name}
              />
            </Col>

            <Col md={6}>
              <InfoCard
                label="Contact Phone"
                value={patient.emergency_contact_phone}
              />
            </Col>
          </Row>
        ) : (
          <p className="text-muted">No emergency contact information.</p>
        )}
      </section>

    </div>
  );
}

/* Bootstrap Info Card Component */
function InfoCard({ label, value }) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Text className="text-muted small mb-1">{label}</Card.Text>
        <Card.Text className="fw-semibold">{value || "N/A"}</Card.Text>
      </Card.Body>
    </Card>
  );
}
