import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './Quotes.module.css';
import { FaWhatsapp } from 'react-icons/fa';

function Quotes() {
  const [quoteDetails,setQouteDetails] = useState({
    name:'',
    phoneNumber:'',
    email:'',
    serviceType:'',
    pickupAddress:'',
    deliveryAddress:''
  });
  const sendQuote = () => {
    console.log(quoteDetails);
    const message = `Hello, I'm ${quoteDetails.name}.\n\nI would like to request a quote for the following service:\n\n` +
    `📞 Phone: ${quoteDetails.phoneNumber}\n📧 Email: ${quoteDetails.email}\n🛠 Service Type: ${quoteDetails.serviceType}\n` +
    `📦 Pickup Address: ${quoteDetails.pickupAddress}\n📬 Delivery Address: ${quoteDetails.deliveryAddress}`;

  const encodedMessage = encodeURIComponent(message);
  const recipientNumber = '919074925424'; 

  window.open(`https://wa.me/${recipientNumber}?text=${encodedMessage}`, '_blank');
  }
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
            <input type="text" placeholder="Your Name" className={styles.inputField} onChange={(e)=>setQouteDetails({...quoteDetails,name:e.target.value})}/>
            <input type="text" placeholder="Phone Number" className={styles.inputField} onChange={(e)=>setQouteDetails({...quoteDetails,phoneNumber:e.target.value})}/>
            <input type="email" placeholder="Email Address" className={styles.inputField} onChange={(e)=>setQouteDetails({...quoteDetails,email:e.target.value})}/>
            
            <select className={styles.inputField} onChange={(e)=>setQouteDetails({...quoteDetails,serviceType:e.target.value})}>
              <option value="">Select Service Type</option>
              <option value="house">House Shifting</option>
              <option value="office">Office Relocation</option>
              <option value="cargo">Cargo Transport</option>
              <option value="packing">Packing & Moving</option>
            </select>

            <input type="text" placeholder="Pickup Location" className={styles.inputField} onChange={(e)=>setQouteDetails({...quoteDetails,pickupAddress:e.target.value})}/>
            <input type="text" placeholder="Delivery Location" className={styles.inputField} onChange={(e)=>setQouteDetails({...quoteDetails,deliveryAddress:e.target.value})}/>

            <button className={styles.quoteBtn} onClick={sendQuote}><FaWhatsapp style={{ marginRight: '8px', color:'green' }} />Request a Quote</button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Quotes;
