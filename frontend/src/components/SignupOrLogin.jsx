import React, { useState } from 'react';
import styles from './SignupOrLogin.module.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
const SignupOrLogin = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        try {
            const userLoginResponse = await axios.post('http://localhost:3001/api/userLogin', {
                email,
                password
            });
            const data = userLoginResponse.data;
            console.log(data);
            if (data.success) {
                console.log("success",data)
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                toast.success('Login Successful!');
            } else {
                console.log("fail")
                toast.error(data.message || 'Login Failed!');
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error('Login Failed!');
        }
    }
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
            console.log(data);
            if (data.success) {
                console.log("success")
                toast.success('Registration Successful!');
                handleClose();
            } else {
                console.log("fail")
                toast.error(data.message || 'Registration Failed!');
            }
        } catch (error) {
            console.error("Registration error:", error.response.data.message);
            toast.error(`Registration Failed!${error.response.data.message}`);
        }
    }
    return (
        <Container
            fluid
            className={`min-vh-100 d-flex align-items-center justify-content-center `}
        >
            <Row className="w-100 shadow-lg rounded-4 overflow-hidden">

                {/* Left Side - Hidden on small screens */}
                <Col xs={12} md={6} className={`d-none d-md-flex justify-content-center align-items-center ${styles.leftside}`}>
                    <div className="text-center">
                        <h1 className="fw-bold">Welcome to TruckXpress</h1>
                        <p>Delivering your goods with speed and reliability.</p>
                    </div>
                </Col>

                {/* Right Side - Login Form */}
                <Col xs={12} md={6} className="bg-white p-5">
                    <Card.Body>
                        <h2 className="mb-4 fw-bold text-center">Login to your Account</h2>

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
                                Login
                            </Button>

                            <div className="text-center">
                                <small>Don't have an account? <a onClick={handleShow} className={`${styles.anchortag}`}>Sign up</a></small>
                            </div>
                        </Form>
                    </Card.Body>
                </Col>

            </Row>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>User Registration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="number" placeholder="Enter phone number" required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmPassword">
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
