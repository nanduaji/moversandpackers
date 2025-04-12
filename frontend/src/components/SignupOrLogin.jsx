import React, { useEffect, useState } from 'react';
import styles from './SignupOrLogin.module.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

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
            console.log("user",user)
            console.log("token",token)
            setLoggedInAs(user.data.role);
        }
    }, []);
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;

        try {
            const userLoginResponse = await axios.post(`http://localhost:3001/api/${role === 'user' ? 'userLogin' : 'adminLogin'}`, {
                email,
                password
            });

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
        const name = event.target[0].value;
        const email = event.target[1].value;
        const phoneNumber = event.target[2].value;
        const password = event.target[3].value;
        const confirmPassword = event.target[4].value;

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {
            const userRegisterResponse = await axios.post('http://localhost:3001/api/addUser', {
                name,
                email,
                password,
                phoneNumber
            });

            const data = userRegisterResponse.data;
            if (data.success) {
                toast.success('Registration Successful!');
                handleClose();
            } else {
                toast.error(data.message || 'Registration Failed!');
            }
        } catch (error) {
            toast.error(`Registration Failed! ${error?.response?.data?.message || ''}`);
        }
    };

    
    if (loggedInAs === 'user') {
        return (
            <Container className="text-center mt-5">
                {/* <h1>Welcome to the User Dashboard</h1> */}
                <UserDashboard/>
            </Container>
        );
    }

    if (loggedInAs === 'admin') {
        return (
            <Container className="text-center mt-5">
                {/* <h1>Welcome to the Admin Dashboard</h1> */}
                <AdminDashboard/>
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

                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label={`Switch to ${role === 'user' ? 'Admin' : 'User'} Login`}
                            checked={role === 'admin'}
                            onChange={(e) => setRole(e.target.checked ? 'admin' : 'user')}
                            className="mb-4"
                        />

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
                                Login to {role === 'user' ? 'User' : 'Admin'} Dashboard
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
