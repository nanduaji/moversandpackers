import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';


const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [allUsers, setAllUsers] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [allServiceProviders, setAllServiceProviders] = useState([]);
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [showServiceProvidersModal, setShowServiceProvidersModal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${user.token}`,
                };

                const [usersRes, bookingsRes, providersRes] = await Promise.all([
                    axios.post('http://localhost:3001/api/getUsers', {}, { headers }),
                    axios.post('http://localhost:3001/api/getAllBookings', {}, { headers }),
                    axios.post('http://localhost:3001/api/getAllServiceProviders', {}, { headers }),
                ]);

                const users = usersRes.data;
                const bookings = bookingsRes.data;
                const providers = providersRes.data;

                console.log("Users:", users.data);
                console.log("Bookings:", bookings.data);
                console.log("Service Providers:", providers.data);
                setAllUsers(users.data);
                setAllBookings(bookings.data);
                setAllServiceProviders(providers.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const handleLogOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/signuporlogin';
    }
    const handleUsersClick = () => {
        setShowUsersModal(true)
    }
    const handleOrdersClick = () => {
        setShowBookingsModal(true)
    }
    const handleServiceProvidersClick = () => {
        setShowServiceProvidersModal(true)
    }
    const handleToggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === "enabled" ? "disabled" : "enabled";
    }
    const handleUpdateStatus = async (bookingId, currentStatus, customerEmail) => {
        try {
            const bookingStatusUpdateResponse = await axios.post(
                `http://localhost:3001/api/updateBookingStatus/${bookingId}`,
                {
                    status: currentStatus,
                    customerEmail: customerEmail
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            const updatedStatus = bookingStatusUpdateResponse.data.status || currentStatus;

            setAllBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: updatedStatus }
                        : booking
                )
            );
            toast.success("Booking status updated");
        } catch (error) {
            console.error("Error updating booking status:", error);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">Admin Dashboard</h2>
            <Button variant="danger" style={{ marginLeft: '20px' }} onClick={() => handleLogOut()}>Logout</Button>
            <div className="row g-4"  >
                <div className="col-md-4" style={{ cursor: 'pointer' }} onClick={() => handleUsersClick()}>
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title">Total Users</h5>
                            <p className="card-text display-6 fw-bold text-primary">{allUsers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4" onClick={() => handleOrdersClick()} style={{ cursor: 'pointer' }}>
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title">Active Orders</h5>
                            <p className="card-text display-6 fw-bold text-success">{allBookings.length}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4" onClick={() => handleServiceProvidersClick()} style={{ cursor: 'pointer' }}>
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title">Service Providers</h5>
                            <p className="card-text display-6 fw-bold text-warning">{allServiceProviders.length}</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row mt-5">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title">Recent Bookings</h5>
                            <p className="text-muted"></p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title">User Activity</h5>
                            <p className="text-muted"></p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showUsersModal} onHide={() => setShowUsersModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>All Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={user.status === "enabled"}
                                                onChange={() => handleToggleUserStatus(user._id, user.status)}
                                            />
                                            <label className="form-check-label">
                                                {user.status === "enabled" ? "Enabled" : "Disabled"}
                                            </label>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
            <Modal show={showBookingsModal} onHide={() => setShowBookingsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>All Bookings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>User</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allBookings.map((booking, index) => (
                                <tr key={index}>
                                    <td>{booking._id}</td>
                                    <td>{booking.customerName}</td>
                                    <td>
                                        <select
                                            className="px-3 py-1 rounded-lg border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            value={booking.status}
                                            onChange={(e) => handleUpdateStatus(booking._id, e.target.value, booking.customerEmail)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="In Transit">In Transit</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
            <Modal show={showServiceProvidersModal} onHide={() => setShowServiceProvidersModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>All Service Providers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allServiceProviders.map((provider, index) => (
                                <tr key={index}>
                                    <td>{provider.name}</td>
                                    <td>{provider.email}</td>
                                    <td>{provider.phoneNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default AdminDashboard;
