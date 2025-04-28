import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './AboutUs.module.css';
import ReactPlayer from 'react-player'
import { Button, Modal } from 'react-bootstrap';
import CountUp from 'react-countup';
const Stats = () => {
    const statsData = [
      { label: 'Clients Served', end: 1500 },
      { label: 'Kms Moved', end: 25000 },
      { label: 'Boxes Packed', end: 100000 },
      { label: 'Happy Families', end: 1200 },
    ];
  
    return (
      <div className={styles.statsWrapper}>
        {/* <h2 className={styles.heading}>Our Achievements</h2> */}
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <h3>
                <CountUp end={stat.end} duration={3} separator="," />
              </h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
function AboutUs() {
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className={styles.aboutWrapper}>
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className={styles.textSection}>
                        <h1 className={styles.headingMain}>ABOUT TRUCKXPRESS</h1>
                        <p className={styles.subText}>
                            At TruckXpress, we believe moving should be stress-free. With years of experience in the logistics industry, we specialize in delivering personalized moving solutions designed to meet your every need.
                        </p>
                        <p className={styles.subText}>
                            Our mission is simple — Safe. Fast. Reliable. Whether it's home shifting, office relocation, or long-distance transportation, TruckXpress ensures top-notch service with utmost care.
                        </p>
                        <button className={styles.exploreBtn} onClick={handleShow}>Know More</button>
                    </Col>

                    <Col md={6} className={`text-center ${styles.video}`}>
                        <div className={styles.videoWrapper}>
                            {loading && <div className={styles.skeleton}></div>}

                            <ReactPlayer
                                url="https://www.youtube.com/watch?v=Z10dm0NsPTw"
                                controls={true}
                                width="100%"
                                height="100%"
                                className={styles.reactPlayer}
                                onReady={() => setLoading(false)}
                            />
                        </div>

                    </Col>
                </Row>
                <Modal show={show} onHide={handleClose} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: '#f97316' }}>About Us</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem' }}>
                        <section style={{ marginBottom: '1.5rem' }}>
                            <h4 className="mb-3" style={{color:"#f97316"}}>Who We Are</h4>
                            <p className="text-muted">
                                At <strong style={{color:"green"}}>TRUCKXPRESS</strong>, we take the hassle out of your relocation journey.
                                With over a decade of experience in the moving industry, we have earned the trust of thousands of
                                customers by providing fast, safe, and reliable moving services across the country.
                            </p>
                        </section>

                        <section style={{ marginBottom: '1.5rem' }}>
                            <h4 className="mb-3" style={{color:"#f97316"}}>Our Mission</h4>
                            <p className="text-muted">
                                Our mission is simple: to deliver peace of mind through high-quality packing, careful handling, and timely transportation.
                                We believe moving to a new place should be exciting — not stressful.
                                Our professional team is committed to making your move smooth and seamless.
                            </p>
                        </section>

                        <section style={{ marginBottom: '1.5rem' }}>
                            <h4 className="mb-3" style={{color:"#f97316"}}>What We Offer</h4>
                            <ul className="list-unstyled">
                                <li className="mb-2">✅ Packing</li>
                                <li className="mb-2">✅ Loading</li>
                                <li className="mb-2">✅ Unloading</li>
                                <li className="mb-2">✅ Transportation</li>
                                <li className="mb-2">✅ Full Service Moving</li>
                                <li className="mb-2">✅ 24/7 Customer Support</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '1.5rem' }}>
                            <h4 className="mb-3" style={{color:"#f97316"}}>Why Choose Us?</h4>
                            <Stats/>
                            <p className="text-muted">
                                We are passionate about providing a personalized moving experience.
                                Our team treats your belongings with the same care as if they were our own.
                                With affordable pricing, dedicated move coordinators, and transparent communication,
                                we guarantee satisfaction every step of the way.
                            </p>
                        </section>

                        <section>
                            <h4 className="mb-3" style={{color:'#f97316'}}>Contact Us</h4>
                            <p className="text-muted">
                                📞 Ready to move? Our experts are just a call away. Reach out to us today and let's plan your next move together!
                            </p>
                            <button className={styles.exploreBtn} onClick={()=>window.location.href = "/contactus"}>Contact Us</button>
                        </section>
                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <Button variant="primary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </div>
    )
}

export default AboutUs;
