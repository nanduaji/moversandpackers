import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Toast } from 'react-bootstrap';
import { FaTruck, FaBell, FaClipboardList, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import styles from './UserDashboard.module.css';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import DeliveryTrackingMap from './DeliveryTrackingMap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user?.data?.name || "User";
    const email = user?.data?.email || "user@example.com";
    const phoneNumber = user?.data?.phoneNumber || "0000000000";
    const address = user?.data?.address || "Not Provided";
    const joinDate = user?.data?.joinDate || "Unknown";
    const role = user?.data?.role || "User";
    const [showModal, setShowModal] = useState(false);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
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
    const [showBookings, setShowBookings] = useState(true);
    const [trackingStatus, setTrackingStatus] = useState('');
    const [pickUpAddressCoords, setPickUpAddressCoords] = useState(null);
    const [deliveryAddressCoords, setDeliveryAddressCoords] = useState({});
    const [showUserEditModal, setShowUserEditModal] = useState(false);
    const [recentBookings, setRecentBookings] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentIntent, setPaymentIntent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('cod');

    const paymentOptions = [
        { label: "Cash On Delivery", value: "cod" },
        { label: "Card Payment", value: "card" },
    ];
    const stripe = useStripe();
    const elements = useElements();
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
    const proceedToPayment = (e) => {
        e.preventDefault();
        setShowPaymentModal(true);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("booking", booking)
        if (!stripe || !elements) {
            toast.error("Stripe has not loaded yet.");
            return;
        }

        setLoading(true);
        try {
            if (selectedPayment === "card") {
                const paymentIntentRes = await axios.post(
                    "https://moversandpackers.onrender.com/api/createPaymentIntent",
                    { amount: booking.finalPrice },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                const clientSecret = paymentIntentRes.data.clientSecret;

                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: user.name,
                            email: user.email,
                        },
                    },
                });
                console.log("result", result)
                if (result.error) {
                    toast.error(result.error.message);
                    return;
                }

                if (result.paymentIntent.status === "succeeded") {
                    booking.paymentStatus = 'Paid'
                    const bookingResponse = await axios.post(
                        `https://moversandpackers.onrender.com/api/bookService`,
                        booking,
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        }
                    );

                    if (bookingResponse.status === 201) {
                        toast.success("Your booking has been created successfully and you will receive a confirmation email shortly.");
                        setShowPaymentModal(false);
                    }
                    setShowModal(false);
                }
            }
            else if (selectedPayment === "cod") {
                booking.paymentStatus = 'Unpaid'
                const bookingResponse = await axios.post(
                    `https://moversandpackers.onrender.com/api/bookService`,
                    booking,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                if (bookingResponse.status === 201) {
                    toast.success("Your booking has been created successfully and you will receive a confirmation email shortly.");
                    setShowPaymentModal(false);
                }
                setShowModal(false);
            }

        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const userBookings = async () => {
            try {
                const response = await axios.post(`https://moversandpackers.onrender.com/api/userBookings/${user.data.email}`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                console.log("userBookings", response.data)
                localStorage.setItem('userBookings', JSON.stringify(response.data));
                setUserBookings(response.data);
                setRecentBookings(response.data.data);
                toast.success("User bookings fetched successfully!");
            } catch (error) {
                console.error('Error fetching user bookings:', error);
            }
        }
        userBookings();
        const ongoingBookings = async () => {
            try {
                const response = await axios.post(`https://moversandpackers.onrender.com/api/userBookings/${user.data.email}`, {}, {
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
    const handleShowTracking = () => {
        setShowTrackingModal(true);
        setShowBookings(true)
    }
    const trackOrder = async (bookingId) => {
        setShowBookings(false);

        const trackingResponse = await axios.post(
            `https://moversandpackers.onrender.com/api/getStatus/${bookingId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );

        const trackingStatus = trackingResponse.data;
        console.log("trackingStatus", trackingResponse.data)
        setTrackingStatus(trackingStatus);

        if (trackingResponse.status === 200) {
            toast.success("Tracking information fetched successfully!");
        } else {
            toast.error("Failed to fetch tracking information.");
        }

        const fetchCoords = async () => {
            const zip = trackingStatus?.data?.serviceDetails?.pickupAddress?.zipCode;

            try {
                const res = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        postalcode: zip,
                        country: 'INDIA',
                        format: 'json',
                        addressdetails: 1,
                        limit: 1,
                    },
                    headers: { 'Accept-Language': 'en' },
                });

                if (res.data.length > 0) {
                    const { lat, lon } = res.data[0];
                    console.log("lat", lat, "lon", lon)
                    setPickUpAddressCoords([parseFloat(lat), parseFloat(lon)]);
                } else {
                    console.warn('No coordinates found for the given ZIP code.');
                }
            } catch (err) {
                console.error('Geocoding error:', err);
            }
        };

        if (trackingStatus?.data?.serviceDetails?.pickupAddress?.zipCode) fetchCoords();
    };
    const cancelOrder = async (bookingId,userEmail) => {
        const confirm = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirm) return;
        try {
            const cancelResponse = await axios.post(
                `https://moversandpackers.onrender.com/api/cancelBooking/${bookingId}`,
                {
                    userEmail,
                    reason:"user cancelled"
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            if (cancelResponse.status === 200) {
                toast.success("Booking canceled successfully!");
                console.log("userBookings", userBookings.data)
                const updatedBookings = userBookings.data.filter(booking => booking._id !== bookingId);
                setUserBookings({ ...userBookings, data: updatedBookings });
                setOngoingBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
            toast.error("Failed to cancel booking. Please try again.");
        }
    }
    const editUser = async () => {
        setShowUserEditModal(true);
    }
    const handleSave = async () => {
        const updatedUser = {
            name: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
        };

        localStorage.setItem('user', JSON.stringify({ ...user, data: updatedUser }));

        try {
            const userEditResponse = await axios.post(
                `https://moversandpackers.onrender.com/api/editUser`,
                {
                    email: updatedUser.email,
                    name: updatedUser.name,
                    phoneNumber: updatedUser.phoneNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            if (userEditResponse.status === 200) {
                toast.success('User information updated successfully!');
            } else {
                toast.error('Failed to update user information.');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('An error occurred while updating user information.');
        }

        setShowUserEditModal(false);
    };
    const handleLogOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/signuporlogin';
    }
    const CloseCurrentModal = () => {
        setShowBookings(true);
    }

    return (
        <div className={styles.dashboardWrapper}>
            <ToastContainer />
            <Container className="py-5">
                <h2 className={`text-center fw-bold mb-5 ${styles.heading}`}>Welcome back, {username} 👋</h2>
                <div className="text-center mb-4">
                    <Button variant="primary" onClick={() => setShowModal(true)}>Create Booking</Button>
                    <Button variant="primary" style={{ marginLeft: '20px' }} onClick={() => handleShowTracking()}>Track Booking</Button>
                    <Button variant="danger" style={{ marginLeft: '20px' }} onClick={() => handleLogOut()}>Logout</Button>
                </div>
                <Row className="g-4">
                    {/* Profile Card */}
                    <Col md={12} sm={12} lg={4}>
                        <Card className={`${styles.glassCard} text-start p-3 shadow-lg border-0 h-100`}>
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column align-items-start">
                                    <FaUserCircle size={60} className="text-primary mb-2" />
                                    <Card.Title className="fs-5 fw-semibold mb-1">{username}</Card.Title>
                                    <Card.Text className={`mb-2 ${styles.subtext}`}>
                                        <strong>Email:</strong> {email}
                                    </Card.Text>
                                    <Button variant="primary" size="sm" onClick={editUser}>Edit Profile</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Active Deliveries Card */}
                    <Col md={12} sm={12} lg={4}>
                        <Card className={`${styles.glassCard} text-center p-4 shadow-lg border-0 h-100`}>
                            <Card.Body>
                                <FaTruck size={50} className="mb-3 text-info" />
                                <Card.Title className="fs-5 fw-semibold">Active Deliveries</Card.Title>
                                <Card.Text className={`${styles.subtext} fs-6`}>
                                    {ongoingBookings?.length} ongoing deliveries
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Total Orders Card */}
                    <Col md={12} sm={12} lg={4}>
                        <Card className={`${styles.glassCard} text-center p-4 shadow-lg border-0 h-100`}>
                            <Card.Body>
                                <FaClipboardList size={50} className="mb-3 text-success" />
                                <Card.Title className="fs-5 fw-semibold">Total Orders</Card.Title>
                                <Card.Text className={`${styles.subtext} fs-6`}>
                                    {userBookings?.data?.length} orders placed
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mb-4 mt-2 g-4">
                    <Col>
                        <Card className={`${styles.glassCard} shadow-lg border-0`}>
                            <Card.Header className={`fw-semibold fs-5 bg-transparent border-bottom ${styles.cardHeader}`}>
                                📌 Recent Activity
                            </Card.Header>
                            <Card.Body className="p-4">
                                <ul className={`list-group list-group-flush ${styles.activityList}`}>
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                                        {recentBookings.length > 0 ? <span>Order <strong>#{recentBookings[0]._id}</strong> {recentBookings[0].status}</span> : <span>No recent bookings</span>}
                                        <span className="text-muted">🚚</span>
                                    </li>
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
                        <Form onSubmit={proceedToPayment}>
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
                                    <p style={{ color: 'red' }}>Please wait for a few seconds for the suggestions to show for the street</p>
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
                                        <p style={{ color: 'red' }}>Please wait for a few seconds for the suggestions to show for the street</p>
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
                                    Proceed To Payment
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={showTrackingModal}
                    onHide={() => setShowTrackingModal(false)}
                    size="lg"
                    centered
                    scrollable
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delivery Tracking</Modal.Title>
                    </Modal.Header>
                    {showBookings === true ? (
                        <div className="bg-light p-3" style={{overflowY:'auto', maxHeight:'500px'}}>
                            <h5 className="mb-3">Your Bookings</h5>
                            <ul className="list-group">
                                {userBookings?.data?.map((booking, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>Order ID:</strong> {booking._id} <br />
                                            <strong>Status:</strong> {booking.status}
                                        </div>
                                        <Button variant="primary" onClick={() => trackOrder(booking._id)}>Track</Button>
                                        <Button variant="danger" disabled={booking.status === 'Delivered'} onClick={() => cancelOrder(booking._id,email)}>Cancel</Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : <Modal.Body>
                        <div className="mb-4">
                            <h5 className="mb-3"><FaArrowLeft
                                style={{ cursor: 'pointer' }}
                                size={20}
                                onClick={() => CloseCurrentModal()}
                            />  Delivery Progress</h5>

                            <div className="progress" style={{ height: '25px' }}>
                                <div
                                    className={`progress-bar ${trackingStatus.status === 'Cancelled' ? 'bg-danger' : 'bg-success'}`}
                                    role="progressbar"
                                    style={{
                                        width:
                                            trackingStatus.status === 'Scheduled'
                                                ? '10%'
                                                : trackingStatus.status === 'In Transit'
                                                    ? '60%'
                                                    : trackingStatus.status === 'Pending'
                                                        ? '0%'
                                                        : '100%',
                                    }}
                                    aria-valuenow="60"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    {trackingStatus.status}
                                </div>

                            </div>
                            <br />
                            {pickUpAddressCoords ? (
                                <DeliveryTrackingMap pickUpAddressCoords={pickUpAddressCoords} />
                            ) : (
                                <p>Loading coordinates...</p>
                            )}
                        </div>

                        {/* Tracking Info */}
                        <div className="mb-4">
                            <h5 className="mb-3">Tracking Details</h5>
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <strong>Tracking ID:</strong> {trackingStatus?.data?.serviceDetails?._id}
                                </li>
                                <li className="list-group-item">
                                    <strong>Sender:</strong> {trackingStatus?.data?.serviceDetails?.customerName}
                                </li>
                                <li className="list-group-item">
                                    <strong>Pickup Address:</strong><br />
                                    {trackingStatus?.data?.serviceDetails?.pickupAddress?.street}<br />
                                    {trackingStatus?.data?.serviceDetails?.pickupAddress?.city}, {trackingStatus?.data?.serviceDetails?.pickupAddress?.state} {trackingStatus?.data?.serviceDetails?.pickupAddress?.zipCode}
                                </li>
                                <li className="list-group-item">
                                    <strong>Delivery Address:</strong><br />
                                    {trackingStatus?.data?.serviceDetails?.deliveryAddress?.street}<br />
                                    {trackingStatus?.data?.serviceDetails?.deliveryAddress?.city}, {trackingStatus?.data?.serviceDetails?.deliveryAddress?.state} {trackingStatus?.data?.serviceDetails?.deliveryAddress?.zipCode}
                                </li>
                            </ul>
                        </div>

                        {/* Location History */}
                        <div>
                            <h5 className="mb-3">Shipment History</h5>
                            <ul className="timeline list-unstyled">
                                <li className="mb-2">
                                    <strong>April 12 -</strong> Package left the Kollam facility
                                </li>
                                <li className="mb-2">
                                    <strong>April 10 -</strong> Shipment booked
                                </li>
                            </ul>
                        </div>
                    </Modal.Body>}


                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowTrackingModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showUserEditModal} onHide={() => setShowUserEditModal(false)} size="lg" centered scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={username}
                                    placeholder="Enter your username"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    defaultValue={email}
                                    placeholder="Enter your email"
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={phoneNumber}
                                    placeholder="Enter your phone number"
                                />
                            </Form.Group>

                            {/* <Form.Group className="mb-3" controlId="address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={address}
                                    placeholder="Enter your address"
                                />
                            </Form.Group> */}

                            {/* <Form.Group className="mb-3" controlId="joinDate">
                                <Form.Label>Join Date</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={joinDate}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="role">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={role}
                                    disabled
                                />
                            </Form.Group> */}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUserEditModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg" centered scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">Complete Your Payment</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <h5 className="mb-4 text-primary">Select Payment Method</h5>

                        <div className="payment-options d-flex gap-3 mb-4 flex-wrap">
                            {paymentOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className={`payment-option border rounded p-3 px-4 d-flex align-items-center shadow-sm ${selectedPayment === option.value ? 'border-primary bg-light' : 'border-secondary'
                                        }`}
                                    style={{ cursor: 'pointer', minWidth: '160px' }}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={option.value}
                                        checked={selectedPayment === option.value}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="me-2"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>

                        <div className="mb-4">
                            <p><strong>Pickup Address:</strong> {`${booking?.pickupAddress?.street}, ${booking?.pickupAddress?.city}, ${booking?.pickupAddress?.zipCode}`}</p>
                            <p><strong>Delivery Address:</strong> {`${booking?.deliveryAddress?.street}, ${booking?.deliveryAddress?.city}, ${booking?.deliveryAddress?.zipCode}`}</p>
                            <p><strong>Total Amount:</strong> ₹{booking?.finalPrice}</p>
                            <p><strong>Payment Status:</strong> <span className="text-danger">Pending</span></p>
                        </div>

                        <hr className="my-4" />

                        <form onSubmit={handleSubmit}>
                            {selectedPayment === 'card' ? (
                                <div className="mb-4">
                                    <label htmlFor="card-element" className="form-label fw-semibold mb-2">Card Information</label>
                                    <div style={{ border: "1px solid #ced4da", borderRadius: "8px", padding: "12px", background: "#f9f9f9" }}>
                                        <CardElement
                                            id="card-element"
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#424770',
                                                        '::placeholder': {
                                                            color: '#aab7c4',
                                                        },
                                                    },
                                                    invalid: {
                                                        color: '#9e2146',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="alert alert-info">You selected <strong>Cash on Delivery</strong>. Click <strong>Book</strong> to proceed.</div>
                            )}

                            <Button type="submit" variant="primary" className="w-100" disabled={!stripe || !elements || loading}>
                                {selectedPayment === "card" ? 'Pay' : 'Book'} ₹{booking?.finalPrice}
                            </Button>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </div>
    );
};

export default UserDashboard;
