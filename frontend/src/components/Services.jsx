import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaTruckMoving, FaBoxes, FaHome, FaWarehouse, FaHandsHelping, FaRegSmile } from 'react-icons/fa';
import styles from './Services.module.css';

function Services() {
  return (
    <div className={styles.serviceWrapper}>
      <h2 className={styles.heading}>Our Services</h2>

      <Container>
        <Row className="gx-4 gy-4">
          <Col md={4} sm={6} xs={12}>
            <div className={styles.serviceCard}>
              <div className={styles.icon}><FaTruckMoving className={`${styles.icon} ${styles.moveTruck}`} /></div>
              <h4>Local Shifting</h4>
              <p>Safe and fast relocation within your city at affordable rates.</p>
            </div>
          </Col>

          <Col md={4} sm={6} xs={12}>
            <div className={styles.serviceCard}>
              <div className={styles.icon}><FaBoxes className={`${styles.icon} ${styles.boxBounce}`} /></div>
              <h4>Packing & Unpacking</h4>
              <p>Professional packing using high-quality materials for utmost safety.</p>
            </div>
          </Col>

          <Col md={4} sm={6} xs={12}>
            <div className={styles.serviceCard}>
              <div className={styles.icon}><FaHome className={`${styles.icon} ${styles.homePulse}`} /></div>
              <h4>Home Relocation</h4>
              <p>Complete house shifting services with zero damage guarantee.</p>
            </div>
          </Col>

          <Col md={4} sm={6} xs={12}>
            <div className={styles.serviceCard}>
              <div className={styles.icon}><FaWarehouse className={`${styles.icon} ${styles.warehouseScale}`} /></div>
              <h4>Storage & Warehousing</h4>
              <p>Secure storage solutions for your valuable belongings.</p>
            </div>
          </Col>

          <Col md={4} sm={6} xs={12}>
            <div className={styles.serviceCard}>
              <div className={styles.icon}><FaHandsHelping className={`${styles.icon} ${styles.helpShake}`} /></div>
              <h4>Corporate Shifting</h4>
              <p>Efficient shifting of office goods with minimum downtime.</p>
            </div>
          </Col>

          <Col md={4} sm={6} xs={12}>
            <div className={styles.serviceCard}>
              <div className={styles.icon}><FaRegSmile className={`${styles.icon} ${styles.smileRotate}`} /></div>
              <h4>Customer Support</h4>
              <p>24x7 dedicated support to assist you throughout the process.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Services;
