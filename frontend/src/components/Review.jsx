import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './Review.module.css';

function Review() {
  return (
    <div className={styles.quotesWrapper}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2 className={styles.quoteHeading}>What Our Customers Say</h2>
            <p className={styles.quoteSubText}>Real experiences. Real stories. Real satisfaction.</p>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={4}>
            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>
                "TruckXpress made my moving experience effortless and stress-free."
              </p>
              <h5 className={styles.quoteAuthor}>- Sarah Johnson</h5>
            </div>
          </Col>
          <Col md={4}>
            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>
                "Professional service with timely delivery. Truly a 5-star logistics partner!"
              </p>
              <h5 className={styles.quoteAuthor}>- Michael Lee</h5>
            </div>
          </Col>
          <Col md={4}>
            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>
                "Their dedication and support throughout the process was amazing!"
              </p>
              <h5 className={styles.quoteAuthor}>- Priya Sharma</h5>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Review;
