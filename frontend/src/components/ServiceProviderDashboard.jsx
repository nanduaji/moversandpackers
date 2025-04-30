// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button, Card, Container, Row, Col, Badge, Modal, Form } from "react-bootstrap";
// import styles from './ServiceProviderDashboard.module.css';
// import { toast, ToastContainer } from 'react-toastify';
// const ServiceProviderDashboard = () => {
//   const [bookings, setBookings] = useState([]);
//   const [earnings, setEarnings] = useState(0);
//   const [rating, setRating] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [showInputToAddReasonForCancellation, setShowInputToAddReasonForCancellation] = useState(false);
//   const [cancelledItem, setCancelledItem] = useState('');
//   const [selectedCancellationReason, setSelectedCancellationReason] = useState('');
//   const [cancelledItemUserEmail,setCancelledItemUserEmail] = useState("")
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const headers = {
//           Authorization: `Bearer ${user.token}`,
//         };

//         const [bookingsRes, earningsRes, ratingRes] = await Promise.all([
//           axios.post(`https://moversandpackers.onrender.com/api/getMyBookings/${user.data.id}`, {}, { headers }),
//           //   axios.post("https://moversandpackers.onrender.com/api/getEarnings", {}, { headers }),
//           //   axios.post("https://moversandpackers.onrender.com/api/getRating", {}, { headers }),
//         ]);
//         setBookings(bookingsRes.data.data || []);
//         // setEarnings(earningsRes.data.total || 0);
//         // setRating(ratingRes.data.rating || 0);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     window.location.href = '/signuporlogin';
//   };
//   const handleShowBookings = () => {
//     setShowModal(true)
//   }
//   const addReasonForCancellation = (bookingId,userEmail) => {
//     setShowInputToAddReasonForCancellation(true);
//     setShowModal(false)
//     setCancelledItem(bookingId);
//     setCancelledItemUserEmail(userEmail)
//   }


//   const handleCancellationReasonChange = (e) => {
//     setSelectedCancellationReason(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const confirm = window.confirm(
//       `Are you sure you want to cancel the booking with the id ${cancelledItem}?`
//     );
//     if (confirm) {
//       try {
//         const headers = {
//           Authorization: `Bearer ${user.token}`,
//         };
  
//         const cancellationResponse = await axios.post(
//           `https://moversandpackers.onrender.com/api/cancelBooking/${cancelledItem}`,
//           { userEmail:cancelledItemUserEmail,
//             reason: selectedCancellationReason },
//           { headers }
//         );
  
//         console.log('Cancellation successful:', cancellationResponse.data);
//         if (cancellationResponse.data.success === true) {
//           toast.success("Booking cancelled successfully");
//           setShowInputToAddReasonForCancellation(false);
//         } else {
//           toast.error("Cancellation failed. Please try again.");
//         }
//       } catch (error) {
//         console.error('Error cancelling booking:', error);
//         toast.error("Something went wrong while cancelling the booking.");
//       }
//     }
//   };
  
//   return (
//     <Container className="py-4">
//       <ToastContainer />
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold text-primary">Welcome, {user?.data?.name || "Service Provider"}!</h2>
//         <Button variant="danger" onClick={handleLogout}>Logout</Button>
//       </div>

//       <Row className="g-4">
//         <Col md={4}>
//           <Card className="shadow-lg border-0" >
//             <Card.Body>
//               <h5 className="card-title text-muted">Total Bookings</h5>
//               <h2 className="fw-bold text-success">{bookings.length}</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-lg border-0">
//             <Card.Body>
//               <h5 className="card-title text-muted">Earnings</h5>
//               <h2 className="fw-bold text-info">₹ {earnings.toLocaleString()}</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-lg border-0">
//             <Card.Body>
//               <h5 className="card-title text-muted">Rating</h5>
//               <h2 className="fw-bold text-warning">{rating} ⭐</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <h4 className="mt-5 mb-3">Recent Bookings</h4>
//       {bookings.length === 0 ? (
//         <p className="text-muted">No bookings available.</p>
//       ) : (
//         <Row className="g-4">
//           {bookings
//             .slice(0, 5)
//             .sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate))
//             .map((booking, index) => (
//               <Col md={6} key={index}>
//                 <Card className={`${styles.bookingCard} shadow-sm border-0`}>
//                   <Card.Body className="p-4">
//                     <div className="d-flex justify-content-between align-items-start mb-3">
//                       <div>
//                         <h5 className="fw-bold mb-1 text-primary">{booking.service}</h5>
//                         <small className="text-muted">Booked on {new Date(booking.pickupDate).toLocaleDateString()}</small>
//                       </div>
//                       <Badge
//                         bg={booking.status === 'completed' ? 'success' : 'warning'}
//                         className="px-3 py-2 text-capitalize"
//                         style={{ borderRadius: '20px', fontSize: '0.75rem' }}
//                       >
//                         {booking.status}
//                       </Badge>
//                     </div>

//                     <div className={styles.bookingInfo}>
//                       <p className="mb-2">
//                         <strong>Client:</strong> {booking.customerName}
//                       </p>
//                       <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
//                         Service ID: {booking._id}
//                       </p>
//                     </div>
//                   </Card.Body>
//                 </Card>

//               </Col>
//             ))}
//         </Row>

//       )}

//       <h4 className="mt-5 mb-3">Quick Actions</h4>
//       <Row className="g-3">
//         <Col md={6}>
//           <Button variant="primary" className="w-100" onClick={handleShowBookings}>View All Jobs</Button>
//         </Col>
//         <Col md={6}>
//           <Button variant="warning" className="w-100">Edit Profile</Button>
//         </Col>
//       </Row>
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Booking Details</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Row className="g-4">
//             {bookings.map((booking, index) => (
//               <Col md={6} key={index}>
//                 <Card className="shadow-sm border-0 d-flex flex-column">
//                   <Card.Body className="p-4 flex-grow-1">
//                     <div className="d-flex justify-content-between align-items-start mb-3">
//                       <div>
//                         <h5 className="fw-bold mb-1 text-primary">{booking.serviceType}</h5>
//                         <small className="text-muted">Booked on {new Date(booking.pickupDate).toLocaleDateString()}</small>
//                       </div>
//                       <Badge
//                         bg={booking.status === 'Delivered' ? 'primary' : 'warning'}
//                         className="px-3 py-2 text-capitalize"
//                         style={{ borderRadius: '20px', fontSize: '0.75rem' }}
//                       >
//                         {booking.status}
//                       </Badge>
//                     </div>
//                     <p className="mb-2"><strong>Client:</strong> {booking.customerName}</p>
//                     <p className="mb-2"><strong>Pickup Address:</strong> {`${booking.pickupAddress.street}, ${booking.pickupAddress.city}`}</p>
//                     <p className="mb-2"><strong>Delivery Address:</strong> {`${booking.deliveryAddress.street}, ${booking.deliveryAddress.city}`}</p>
//                     <p className="mb-2"><strong>Pickup Date:</strong> {new Date(booking.pickupDate).toLocaleDateString()}</p>
//                     <p className="mb-2"><strong>Delivery Date:</strong> {new Date(booking.deliveryDate).toLocaleDateString()}</p>
//                     <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
//                     {booking.status === "Scheduled" ? <Button variant="danger" onClick={() => addReasonForCancellation(booking._id,booking.customerEmail)}>Cancel Booking</Button> : <></>}
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <Modal
//         show={showInputToAddReasonForCancellation}
//         onHide={() => setShowInputToAddReasonForCancellation(false)}
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Select Reason for Cancellation</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="cancellationReason">
//               <Form.Label>Reason for Cancellation</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={selectedCancellationReason}
//                 onChange={handleCancellationReasonChange}
//                 required
//               >
//                 <option value="">Select a Reason</option>
//                 <option value="serviceNotAvailable">Service Not Available in Area</option>
//                 <option value="technicalIssues">Technical Issues or Malfunctions</option>
//                 <option value="scheduleConflict">Schedule Conflict</option>
//                 <option value="staffUnavailable">Staff Unavailable</option>
//                 <option value="emergency">Emergency or Unforeseen Circumstances</option>
//                 <option value="pricingIssue">Pricing Issue or Disagreement</option>
//                 <option value="other">Other</option>
//               </Form.Control>
//             </Form.Group>

//           </Form>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowInputToAddReasonForCancellation(false)}>
//             Close
//           </Button>
//           <Button type="submit" variant="primary" onClick={handleSubmit}>
//             Submit
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ServiceProviderDashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Container, Row, Col, Badge, Modal, Form } from "react-bootstrap";
import styles from './ServiceProviderDashboard.module.css';
import { toast, ToastContainer } from 'react-toastify';
const ServiceProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInputToAddReasonForCancellation, setShowInputToAddReasonForCancellation] = useState(false);
  const [cancelledItem, setCancelledItem] = useState('');
  const [selectedCancellationReason, setSelectedCancellationReason] = useState('');
  const [cancelledItemUserEmail,setCancelledItemUserEmail] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
        name: user?.data?.name || "",
        email: user?.data?.email || "",
        phoneNumber: user?.data?.phoneNumber || "",
        service: "",
        location: user?.data?.location || "",
      });
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${user.token}`,
        };

        const [bookingsRes, earningsRes, ratingRes] = await Promise.all([
          axios.post(`https://moversandpackers.onrender.com/api/getMyBookings/${user.data.id}`, {}, { headers }),
          //   axios.post("https://moversandpackers.onrender.com/api/getEarnings", {}, { headers }),
          //   axios.post("https://moversandpackers.onrender.com/api/getRating", {}, { headers }),
        ]);
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
  const handleShowBookings = () => {
    setShowModal(true)
  }
  const handleEditModal = () => {
    setShowEditModal(true)
  }
  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }
  const handleEditServiceProvider = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };
      const response = await axios.post(
        `https://moversandpackers.onrender.com/api/editServiceProvider/${user.data.id}`,
        formData,
        { headers }
      );
      console.log('Edit successful:', response.data);
      if (response.data.success === true) {
        toast.success("Profile updated successfully");
        setShowEditModal(false);
      } else {
        toast.error("Update failed. Please try again.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Something went wrong while updating the profile.");
    }
  };
  const addReasonForCancellation = (bookingId,userEmail) => {
    setShowInputToAddReasonForCancellation(true);
    setShowModal(false)
    setCancelledItem(bookingId);
    setCancelledItemUserEmail(userEmail)
  }


  const handleCancellationReasonChange = (e) => {
    setSelectedCancellationReason(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const confirm = window.confirm(
      `Are you sure you want to cancel the booking with the id ${cancelledItem}?`
    );
    if (confirm) {
      try {
        const headers = {
          Authorization: `Bearer ${user.token}`,
        };
  
        const cancellationResponse = await axios.post(
          `https://moversandpackers.onrender.com/api/cancelBooking/${cancelledItem}`,
          { userEmail:cancelledItemUserEmail,
            reason: selectedCancellationReason },
          { headers }
        );
  
        console.log('Cancellation successful:', cancellationResponse.data);
        if (cancellationResponse.data.success === true) {
          toast.success("Booking cancelled successfully");
          setShowInputToAddReasonForCancellation(false);
        } else {
          toast.error("Cancellation failed. Please try again.");
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error("Something went wrong while cancelling the booking.");
      }
    }
  };
  
  return (
    <Container className="py-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          Welcome, {user?.data?.name || "Service Provider"}!
        </h2>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
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
              <h2 className="fw-bold text-info">
                ₹ {earnings.toLocaleString()}
              </h2>
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
          {bookings
            .slice(0, 5)
            .sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate))
            .map((booking, index) => (
              <Col md={6} key={index}>
                <Card className={`${styles.bookingCard} shadow-sm border-0`}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-primary">
                          {booking.service}
                        </h5>
                        <small className="text-muted">
                          Booked on{" "}
                          {new Date(booking.pickupDate).toLocaleDateString()}
                        </small>
                      </div>
                      <Badge
                        bg={
                          booking.status === "completed" ? "success" : "warning"
                        }
                        className="px-3 py-2 text-capitalize"
                        style={{ borderRadius: "20px", fontSize: "0.75rem" }}
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <div className={styles.bookingInfo}>
                      <p className="mb-2">
                        <strong>Client:</strong> {booking.customerName}
                      </p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Service ID: {booking._id}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      )}

      <h4 className="mt-5 mb-3">Quick Actions</h4>
      <Row className="g-3">
        <Col md={6}>
          <Button
            variant="primary"
            className="w-100"
            onClick={handleShowBookings}
          >
            View All Jobs
          </Button>
        </Col>
        <Col md={6}>
          <Button variant="warning" className="w-100" onClick={handleEditModal}>
            Edit Profile
          </Button>
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-4">
            {bookings.map((booking, index) => (
              <Col md={6} key={index}>
                <Card className="shadow-sm border-0 d-flex flex-column">
                  <Card.Body className="p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-primary">
                          {booking.serviceType}
                        </h5>
                        <small className="text-muted">
                          Booked on{" "}
                          {new Date(booking.pickupDate).toLocaleDateString()}
                        </small>
                      </div>
                      <Badge
                        bg={
                          booking.status === "Delivered" ? "primary" : "warning"
                        }
                        className="px-3 py-2 text-capitalize"
                        style={{ borderRadius: "20px", fontSize: "0.75rem" }}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="mb-2">
                      <strong>Client:</strong> {booking.customerName}
                    </p>
                    <p className="mb-2">
                      <strong>Pickup Address:</strong>{" "}
                      {`${booking.pickupAddress.street}, ${booking.pickupAddress.city}`}
                    </p>
                    <p className="mb-2">
                      <strong>Delivery Address:</strong>{" "}
                      {`${booking.deliveryAddress.street}, ${booking.deliveryAddress.city}`}
                    </p>
                    <p className="mb-2">
                      <strong>Pickup Date:</strong>{" "}
                      {new Date(booking.pickupDate).toLocaleDateString()}
                    </p>
                    <p className="mb-2">
                      <strong>Delivery Date:</strong>{" "}
                      {new Date(booking.deliveryDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Payment Status:</strong> {booking.paymentStatus}
                    </p>
                    {booking.status === "Scheduled" ? (
                      <Button
                        variant="danger"
                        onClick={() =>
                          addReasonForCancellation(
                            booking._id,
                            booking.customerEmail
                          )
                        }
                      >
                        Cancel Booking
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showInputToAddReasonForCancellation}
        onHide={() => setShowInputToAddReasonForCancellation(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Reason for Cancellation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="cancellationReason">
              <Form.Label>Reason for Cancellation</Form.Label>
              <Form.Control
                as="select"
                value={selectedCancellationReason}
                onChange={handleCancellationReasonChange}
                required
              >
                <option value="">Select a Reason</option>
                <option value="serviceNotAvailable">
                  Service Not Available in Area
                </option>
                <option value="technicalIssues">
                  Technical Issues or Malfunctions
                </option>
                <option value="scheduleConflict">Schedule Conflict</option>
                <option value="staffUnavailable">Staff Unavailable</option>
                <option value="emergency">
                  Emergency or Unforeseen Circumstances
                </option>
                <option value="pricingIssue">
                  Pricing Issue or Disagreement
                </option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowInputToAddReasonForCancellation(false)}
          >
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                // value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                // value={formData.email}
                disabled
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                // value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formService" className="mb-3">
              <Form.Label>Service</Form.Label>
              <Form.Select
                // value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
              >
                <option value="">Select a service</option>
                <option value="packing">Packing</option>
                <option value="loading">Loading</option>
                <option value="unloading">Unloading</option>
                <option value="transportation">Transportation</option>
                <option value="full service moving">Full Service Moving</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formLocation" className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                // value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditServiceProvider}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServiceProviderDashboard;