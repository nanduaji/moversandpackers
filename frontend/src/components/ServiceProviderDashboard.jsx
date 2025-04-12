import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Container, Row, Col, Badge } from "react-bootstrap";

const ServiceProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [rating, setRating] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  // ADD ROLE FOR SERVICE PROVIDER
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${user.token}`,
        };

        const [bookingsRes, earningsRes, ratingRes] = await Promise.all([
          axios.post(`http://localhost:3001/api/getMyBookings/${user.data.id}`, {}, { headers }),
        //   axios.post("http://localhost:3001/api/getEarnings", {}, { headers }),
        //   axios.post("http://localhost:3001/api/getRating", {}, { headers }),
        ]);
        console.log("bookingsRes",bookingsRes.data.data)
        setBookings(bookingsRes.data.data || []);
        // setEarnings(earningsRes.data.total || 0);
        // setRating(ratingRes.data.rating || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/signuporlogin';
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Welcome, {user?.name || "Service Provider"}!</h2>
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
      </div>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h5 className="card-title text-muted">Total Bookings</h5>
              <h2 className="fw-bold text-success">{bookings.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h5 className="card-title text-muted">Earnings</h5>
              <h2 className="fw-bold text-info">₹ {earnings.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h5 className="card-title text-muted">Rating</h5>
              <h2 className="fw-bold text-warning">{rating} ⭐</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mt-5 mb-3">Recent Bookings</h4>
      {bookings.length === 0 ? (
        <p className="text-muted">No bookings available.</p>
      ) : (
        <Row className="g-4">
          {bookings.slice(0, 5).map((booking, index) => (
            <Col md={6} key={index}>
              <Card className="border-start border-4 border-primary shadow-sm">
                <Card.Body>
                  <h5>{booking.service}</h5>
                  <p className="mb-1"><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="mb-1"><strong>Client:</strong> {booking.clientName}</p>
                  <Badge bg={booking.status === "completed" ? "success" : "warning"}>{booking.status}</Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <h4 className="mt-5 mb-3">Quick Actions</h4>
      <Row className="g-3">
        <Col md={3}>
          <Button variant="primary" className="w-100">View All Jobs</Button>
        </Col>
        <Col md={3}>
          <Button variant="success" className="w-100">Update Availability</Button>
        </Col>
        <Col md={3}>
          <Button variant="warning" className="w-100">Edit Profile</Button>
        </Col>
        <Col md={3}>
          <Button variant="info" className="w-100">Support</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceProviderDashboard;
