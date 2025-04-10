import React from 'react'
import styles from './Header.module.css'
function Header() {
    return (
        <div>
            <nav className={`navbar navbar-expand-lg navbar-light p-1 ${styles.header}`}>
                <a className="navbar-brand d-flex align-items-center gap-2" href="/">
                    <img
                        src="logo.png"
                        alt="Company Logo"
                        width="100"
                        height="100"
                        className="d-inline-block align-text-top"
                    />
                    <span className="fw-bold fs-5">TruckXpress</span>
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav  ms-auto">
                        <a className={`nav-item nav-link ${styles.headerItem}`} href="/">
                            Home
                        </a>
                        <a className={`nav-item nav-link ${styles.headerItem}`} href="/aboutus">About Us</a>
                        <a className={`nav-item nav-link ${styles.headerItem}`} href="/services">Services</a>
                        <a className={`nav-item nav-link ${styles.headerItem}`} href="/contactus">Contact</a>
                        <a className={`nav-item nav-link ${styles.headerItem}`} href="#">SignUp/Login</a>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header
