import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './Quotes.module.css';

function Quotes() {
  return (
    <div className={styles.quoteWrapper}>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className={styles.quoteTextSection}>
            <h2 className={styles.heading}>Get a Free Quote</h2>
            <p className={styles.subText}>
              Fill in your details and let us provide the best solution for your moving needs.
            </p>
          </Col>

          <Col md={6} className={`text-center ${styles.formSection}`}>
            <input type="text" placeholder="Your Name" className={styles.inputField} />
            <input type="text" placeholder="Phone Number" className={styles.inputField} />
            <input type="email" placeholder="Email Address" className={styles.inputField} />
            
            <select className={styles.inputField}>
              <option value="">Select Service Type</option>
              <option value="house">House Shifting</option>
              <option value="office">Office Relocation</option>
              <option value="cargo">Cargo Transport</option>
              <option value="packing">Packing & Moving</option>
            </select>

            <input type="text" placeholder="Pickup Location" className={styles.inputField} />
            <input type="text" placeholder="Delivery Location" className={styles.inputField} />

            <button className={styles.quoteBtn}>Request a Quote</button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Quotes;
