import React from 'react';
import styles from './SignupOrLogin.module.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SignupOrLogin = () => {
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        const userLoginResponse = await fetch('http://localhost:3001/api/userLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await userLoginResponse.json(); 
        console.log(data); 
        if (data.success) {
            console.log("success")
            toast.success('Login Successful!');
        } else {
            console.log("fail")
            toast.error(data.message || 'Login Failed!');
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
                                <small>Don't have an account? <a href="#">Sign up</a></small>
                            </div>
                        </Form>
                    </Card.Body>
                </Col>

            </Row>
            <ToastContainer position="top-center" autoClose={2000} />
        </Container>
    );
};

export default SignupOrLogin;
