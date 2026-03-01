import React from "react";
import { Form, Row, Col, InputGroup, Button, Spinner } from "react-bootstrap";

const ReusableSearchForm = React.memo(function ReusableSearchForm({
  value,
  onChange,
  placeholder = "Search...",
  loading
}) {
  return (
    <Form className="mb-3">
      <Row className="w-100">
        <Col xs={12}>
          <InputGroup>

            <Form.Control
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
            />

            {/* Spinner while loading */}
            {loading && (
              <InputGroup.Text>
                <Spinner animation="border" size="sm" />
              </InputGroup.Text>
            )}

            {/* Clear button */}
            {value && !loading && (
              <Button
                variant="outline-secondary"
                onClick={() => onChange("")}
              >
                ✕
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>
    </Form>
  );
});

export default ReusableSearchForm;

