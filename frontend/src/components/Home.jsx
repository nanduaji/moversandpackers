import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './Home.module.css';

function Home() {
    const texts = ['HOUSE?', 'OFFICE?', 'CAR?', 'SHOP?', 'STORAGE?'];
    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(true);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % texts.length);
                setAnimate(false);
            }, 500);
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className={styles.homeWrapper}>
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className={styles.textSection}>
                        <h3 className={styles.headingFirst}>DO YOU NEED HELP</h3>
                        <h1 className={styles.headingSecond}>MOVING</h1>
                        <h1 className={`${styles.headingSecond} ${animate ? styles.animate : ''}`}>
                            {texts[index]}
                        </h1>
                        <p className={styles.subText}>
                            TruckXpress is your trusted logistics partner, committed to safe, fast, and reliable transportation solutions tailored to your needs.
                        </p>
                        <button className={styles.exploreBtn}>Explore More</button>
                    </Col>
                    <Col md={6} className="text-center">
                        <img
                            src="moving_01.jpg"
                            alt="TruckXpress"
                            className={styles.image}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;
