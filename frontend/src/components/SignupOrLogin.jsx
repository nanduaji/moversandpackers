import React, { useEffect, useState } from 'react';
import styles from './SignupOrLogin.module.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import ServiceProviderDashboard from './ServiceProviderDashboard';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SignupOrLogin = () => {
    const [show, setShow] = useState(false);
    const [role, setRole] = useState('user');
    const [loggedInAs, setLoggedInAs] = useState('');
    const [loading, setLoading] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
            setLoggedInAs(user.data.role);
        }
    }, []);
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        console.log('role', role)
        try {
            const userLoginResponse = await axios.post(
                `https://moversandpackers.onrender.com/api/${role === 'user'
                    ? 'userLogin'
                    : role === 'admin'
                        ? 'adminLogin'
                        : 'serviceProviderLogin'
                }`,
                {
                    email,
                    password
                }
            );

            const data = userLoginResponse.data;
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                toast.success('Login Successful!');
                setLoggedInAs(role);
            } else {
                toast.error(data.message || 'Login Failed!');
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(`Login Failed! ${error?.response?.data?.message || ''}`);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        const name = event.target[1].value;
        const email = event.target[2].value;
        const phoneNumber = event.target[3].value;
        const services = event.target[4]?.value || null;
        const location = event.target[5]?.value || null;
        const password = !event.target[4]? event.target[6].value: event.target[4].value;
        const confirmPassword = !event.target[4]? event.target[7].value: event.target[5].value;

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {
            const endPoint = role === 'user' ? 'addUser' : role === 'admin' ? 'addAdmin' : 'addServiceProvider';
            
            const userRegisterResponse = await axios.post(`https://moversandpackers.onrender.com/api/${endPoint}`, {
                name,
                email,
                password,
                phoneNumber,
                services,
                location
            });

            const data = userRegisterResponse.data;
            if (data.success) {
                toast.success('Registration Successful!');
                handleClose();
            } else {
                toast.error(data.message || 'Registration Failed!');
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(`Registration Failed! ${error?.response?.data?.message || ''}`);
        }
    };


    if (loggedInAs === 'user') {
        return (
            <Elements stripe={stripePromise}>
            <Container className="text-center mt-5">
                {/* <h1>Welcome to the User Dashboard</h1> */}
                <UserDashboard />
            </Container>
            </Elements>
        );
    }

    if (loggedInAs === 'admin') {
        return (
            <Container className="text-center mt-5">
                {/* <h1>Welcome to the Admin Dashboard</h1> */}
                <AdminDashboard />
            </Container>
        );
    }
    if (loggedInAs === 'service-provider') {
        return (
            <Container className="text-center mt-5">
                {/* <h1>Welcome to the Service Provider Dashboard</h1> */}
                <ServiceProviderDashboard />
            </Container>
        );
    }

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100 shadow-lg rounded-4 overflow-hidden">

                {/* Left Side */}
                <Col xs={12} md={6} className={`d-none d-md-flex justify-content-center align-items-center ${styles.leftside}`}>
                    <div className="text-center">
                        <h1 className="fw-bold">Welcome to TruckXpress</h1>
                        <p>Delivering your goods with speed and reliability.</p>
                    </div>
                </Col>

                {/* Right Side */}
                <Col xs={12} md={6} className="bg-white p-5">
                    <Card.Body>
                        <h2 className="mb-4 fw-bold text-center">Login to your Account</h2>

                        <Form.Group controlId="roleSelect" className="mb-4">
                            <Form.Label>Select Role</Form.Label>
                            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="service-provider">Service Provider</option>
                            </Form.Select>
                        </Form.Group>
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Login to {role === 'user' ? 'User' : role === 'admin' ? 'Admin' : 'Service Provider'} Dashboard
                            </Button>

                            <div className="text-center">
                                <small>
                                    Don't have an account? <a onClick={handleShow} className={`${styles.anchortag}`} role="button">Sign up</a>
                                </small>
                            </div>
                        </Form>
                    </Card.Body>
                </Col>
            </Row>

            {/* Registration Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>User Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegister}>
                        <Form.Group controlId="roleSelect" className="mb-4">
                            <Form.Label>Select Role</Form.Label>
                            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="service-provider">Service Provider</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="number" placeholder="Enter phone number" required />
                        </Form.Group>
                        {role === 'service-provider' && (
                            <><Form.Group className="mb-3">
                                <Form.Label>Services</Form.Label>
                                <Form.Select required>
                                    <option value="">Select a service</option>
                                    <option value="Packing">Packing</option>
                                    <option value="Loading">Loading</option>
                                    <option value="Unloading">Unloading</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Full-Service Moving">Full-Service Moving</option>
                                </Form.Select>
                            </Form.Group><Form.Group className="mb-3">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your location" required />
                                </Form.Group></>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" required />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Register
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-center" autoClose={2000} />
        </Container>
    );
};

export default SignupOrLogin;
