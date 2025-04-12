import React from "react";
import { Button } from "react-bootstrap";


const AdminDashboard = () => {
    const handleLogOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/signuporlogin';
    }
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>
      <Button variant="danger" style={{ marginLeft: '20px' }} onClick={() => handleLogOut()}>Logout</Button>
      {/* Cards Row */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-6 fw-bold text-primary">1,024</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Active Orders</h5>
              <p className="card-text display-6 fw-bold text-success">312</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Revenue</h5>
              <p className="card-text display-6 fw-bold text-warning">$23,450</p>
            </div>
          </div>
        </div>
      </div>

      {/* More Content Row */}
      <div className="row mt-5">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Recent Bookings</h5>
              <p className="text-muted">This section can show latest bookings in a table/list view.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">User Activity</h5>
              <p className="text-muted">You can integrate charts or recent login history here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
