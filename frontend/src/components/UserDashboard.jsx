import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Toast } from 'react-bootstrap';
import { FaTruck, FaBell, FaClipboardList, FaUserCircle } from 'react-icons/fa';
import styles from './UserDashboard.module.css';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user?.data?.name || "User";
    const email = user?.data?.email || "user@example.com";
    const phoneNumber = user?.data?.phoneNumber || "0000000000";
    const address = user?.data?.address || "Not Provided";
    const joinDate = user?.data?.joinDate || "Unknown";
    const role = user?.data?.role || "User";
    const [showModal, setShowModal] = useState(false);
    const [booking, setBooking] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceType: '',
        pickupAddress: { street: '', city: '', state: '', zipCode: '' },
        deliveryAddress: { street: '', city: '', state: '', zipCode: '' },
        itemsDescription: '',
        estimatedWeight: '',
        pickupDate: '',
        deliveryDate: '',
        priceEstimate: '100',
        finalPrice: '100',
        status: 'Scheduled',
        paymentStatus: 'Paid'
    });
    const [userBookings, setUserBookings] = useState([]);
    const [ongoingBookings, setOngoingBookings] = useState([]);
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [deliverySuggestions, setDeliverySuggestions] = useState([]);
    const handleAddressInput = async (query, isPickup = true) => {
        if (query.length < 3) return;
        const endpoint = "https://nominatim.openstreetmap.org/search";
        const res = await axios.get(endpoint, {
            params: {
                q: query,
                format: "json",
                addressdetails: 1,
                limit: 5,
            },
        });

        if (isPickup) {
            setPickupSuggestions(res.data);
        } else {
            setDeliverySuggestions(res.data);
        }
    };

    const handleSelectAddress = (place, isPickup = true) => {
        const address = place.display_name;
        if (isPickup) {
            setBooking(prev => ({
                ...prev,
                pickupAddress: { ...prev.pickupAddress, street: address },
            }));
            setPickupSuggestions([]);
        } else {
            setBooking(prev => ({
                ...prev,
                deliveryAddress: { ...prev.deliveryAddress, street: address },
            }));
            setDeliverySuggestions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bookingResponse = await axios.post(`http://localhost:3001/api/bookService`, booking, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (bookingResponse.status === 201) {
                toast.success("Your booking has been created successfully and you will receive a confirmation email shortly.");
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error creating booking:', error);
            toast.error("Failed to create booking. Please try again.");
        }
    };
    useEffect(() => {
        const userBookings = async () => {
            try {
                const response = await axios.post(`http://localhost:3001/api/userBookings/${user.data.email}`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                localStorage.setItem('userBookings', JSON.stringify(response.data));
                setUserBookings(response.data);
                toast.success("User bookings fetched successfully!");
            } catch (error) {
                console.error('Error fetching user bookings:', error);
            }
        }
        userBookings();
        const ongoingBookings = async () => {
            try {
                const response = await axios.post(`http://localhost:3001/api/userBookings/${user.data.email}`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const bookings = response.data.data;
                if (bookings.length > 0) {
                    const ongoing = bookings.filter(
                        (booking) => booking.status === "Scheduled" || booking.status === "In Transit"
                    );
                    setOngoingBookings(ongoing);
                }

            } catch (error) {
                console.error('Error fetching ongoing bookings:', error);
            }
        }
        ongoingBookings();
    }, [])

    return (
        <div className={styles.dashboardWrapper}>
            <ToastContainer />
            <Container className="py-5">
                <h2 className={`text-center fw-bold mb-5 ${styles.heading}`}>Welcome back, {username} 👋</h2>
                <div className="text-center mb-4">
                    <Button variant="primary" onClick={() => setShowModal(true)}>Create Booking</Button>
                    <Button variant="primary" style={{marginLeft:'20px'}}>Track Booking</Button>
                </div>

                <Row>
                    <Col md={4} sm={12} className="mb-4">
                        <Card className={`${styles.glassCard} text-center`}>
                            <Card.Body className="d-flex align-items-center">
                                {/* Left side: Avatar and Name */}
                                <div className="d-flex flex-column align-items-start me-3">
                                    <FaUserCircle size={60} className="mb-3 text-primary" />
                                    <Card.Title className="fw-semibold">{username}</Card.Title>
                                </div>

                                {/* Right side: Email and Edit Button */}
                                <div className="d-flex flex-column align-items-end">
                                    <Card.Text className={styles.subtext}>
                                        <strong>Email:</strong> {email}
                                    </Card.Text>
                                    <Button variant="outline-primary" size="sm">Edit Profile</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} sm={12} className="mb-4">
                        <Card className={`${styles.glassCard} text-center`}>
                            <Card.Body>
                                <FaTruck size={40} className="mb-3 text-primary" />
                                <Card.Title>Active Deliveries</Card.Title>
                                <Card.Text className={styles.subtext}>{ongoingBookings?.length} ongoing deliveries
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} sm={12} className="mb-4">
                        <Card className={`${styles.glassCard} text-center`}>
                            <Card.Body>
                                <FaClipboardList size={40} className="mb-3 text-success" />
                                <Card.Title>Total Orders</Card.Title>
                                <Card.Text className={styles.subtext}>{userBookings?.data?.length} orders placed</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Recent Activity */}
                <Row className="mb-4">
                    <Col>
                        <Card className={styles.glassCard}>
                            <Card.Header className={`fw-semibold ${styles.cardHeader}`}>Recent Activity</Card.Header>
                            <Card.Body>
                                <ul className={`list-group list-group-flush ${styles.activityList}`}>
                                    <li className="list-group-item">Order #1234 dispatched 🚚</li>
                                    <li className="list-group-item">Received delivery #1198 📦</li>
                                    <li className="list-group-item">Account password changed 🔒</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title className="fw-semibold text-primary">📦 Create Booking</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="bg-white">
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                {/* Left Column */}
                                <Col md={6}>
                                    <h5 className="mb-3 text-secondary">Customer Info</h5>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Customer Name</Form.Label>
                                        <Form.Control
                                            name="customerName"
                                            value={booking.customerName}
                                            onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            name="customerEmail"
                                            type="email"
                                            value={booking.customerEmail}
                                            onChange={(e) => setBooking({ ...booking, customerEmail: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            name="customerPhone"
                                            value={booking.customerPhone}
                                            onChange={(e) => setBooking({ ...booking, customerPhone: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Service Type</Form.Label>
                                        <Form.Select
                                            name="serviceType"
                                            value={booking.serviceType}
                                            onChange={(e) => setBooking({ ...booking, serviceType: e.target.value })}
                                            required
                                        >
                                            <option value="">Select a service</option>
                                            <option value="House Shifting">House Shifting</option>
                                            <option value="Office Relocation">Office Relocation</option>
                                            <option value="Vehicle Transport">Vehicle Transport</option>
                                            <option value="Storage Service">Storage Service</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <h6 className="text-secondary mt-4">Pickup Address</h6>
                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            name="pickupAddress.street"
                                            placeholder="Street"
                                            value={booking.pickupAddress.street}
                                            onChange={(e) => setBooking({ ...booking, pickupAddress: { ...booking.pickupAddress, street: e.target.value } })}
                                            onInput={(e) => handleAddressInput(e.target.value, true)}
                                        />
                                        {pickupSuggestions.length > 0 && (
                                            <ul className="list-group position-absolute w-100 z-3">
                                                {pickupSuggestions.map((place) => (
                                                    <li
                                                        key={place.place_id}
                                                        className="list-group-item list-group-item-action"
                                                        onClick={() => handleSelectAddress(place, true)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {place.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </Form.Group>
                                    <Row className="g-2 mb-3">
                                        <Col>
                                            <Form.Control
                                                name="pickupAddress.city"
                                                placeholder="City"
                                                value={booking.pickupAddress.city}
                                                onChange={(e) => setBooking({ ...booking, pickupAddress: { ...booking.pickupAddress, city: e.target.value } })}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                name="pickupAddress.state"
                                                placeholder="State"
                                                value={booking.pickupAddress.state}
                                                onChange={(e) => setBooking({ ...booking, pickupAddress: { ...booking.pickupAddress, state: e.target.value } })}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                name="pickupAddress.zipCode"
                                                placeholder="Zip"
                                                value={booking.pickupAddress.zipCode}
                                                onChange={(e) => setBooking({ ...booking, pickupAddress: { ...booking.pickupAddress, zipCode: e.target.value } })}
                                            />
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Items Description</Form.Label>
                                        <Form.Control
                                            name="itemsDescription"
                                            as="textarea"
                                            rows={3}
                                            value={booking.itemsDescription}
                                            onChange={(e) => setBooking({ ...booking, itemsDescription: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Right Column */}
                                <Col md={6}>
                                    <h5 className="mb-3 text-secondary">Shipping Details</h5>

                                    <h6 className="text-secondary">Delivery Address</h6>
                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            name="deliveryAddress.street"
                                            placeholder="Street"
                                            value={booking.deliveryAddress.street}
                                            onChange={(e) => setBooking({ ...booking, deliveryAddress: { ...booking.deliveryAddress, street: e.target.value } })}
                                            onInput={(e) => handleAddressInput(e.target.value, false)}
                                        />
                                        {deliverySuggestions.length > 0 && (
                                            <ul className="list-group position-absolute w-100 z-3">
                                                {deliverySuggestions.map((place) => (
                                                    <li
                                                        key={place.place_id}
                                                        className="list-group-item list-group-item-action"
                                                        onClick={() => handleSelectAddress(place, false)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {place.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </Form.Group>
                                    <Row className="g-2 mb-3">
                                        <Col>
                                            <Form.Control
                                                name="deliveryAddress.city"
                                                placeholder="City"
                                                value={booking.deliveryAddress.city}
                                                onChange={(e) => setBooking({ ...booking, deliveryAddress: { ...booking.deliveryAddress, city: e.target.value } })}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                name="deliveryAddress.state"
                                                placeholder="State"
                                                value={booking.deliveryAddress.state}
                                                onChange={(e) => setBooking({ ...booking, deliveryAddress: { ...booking.deliveryAddress, state: e.target.value } })}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                name="deliveryAddress.zipCode"
                                                placeholder="Zip"
                                                value={booking.deliveryAddress.zipCode}
                                                onChange={(e) => setBooking({ ...booking, deliveryAddress: { ...booking.deliveryAddress, zipCode: e.target.value } })}
                                            />
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Estimated Weight (kg)</Form.Label>
                                        <Form.Control
                                            name="estimatedWeight"
                                            type="number"
                                            value={booking.estimatedWeight}
                                            onChange={(e) => setBooking({ ...booking, estimatedWeight: e.target.value })}
                                        />
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Label>Pickup Date</Form.Label>
                                            <Form.Control
                                                name="pickupDate"
                                                type="date"
                                                value={booking.pickupDate}
                                                onChange={(e) => setBooking({ ...booking, pickupDate: e.target.value })}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Label>Delivery Date</Form.Label>
                                            <Form.Control
                                                name="deliveryDate"
                                                type="date"
                                                value={booking.deliveryDate}
                                                onChange={(e) => setBooking({ ...booking, deliveryDate: e.target.value })}
                                            />
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>

                            <div className="text-end mt-4">
                                <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="me-2">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    🚚 Create Booking
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>


            </Container>
        </div>
    );
};

export default UserDashboard;
