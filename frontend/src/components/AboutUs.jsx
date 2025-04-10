import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './AboutUs.module.css';
import ReactPlayer from 'react-player'

function AboutUs() {
    const [loading, setLoading] = useState(true);
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
                        <button className={styles.exploreBtn}>Know More</button>
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
            </Container>
        </div>
    )
}

export default AboutUs;
