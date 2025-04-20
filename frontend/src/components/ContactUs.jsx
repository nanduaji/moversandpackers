import React from 'react';
import styles from './ContactUs.module.css';

function ContactUs() {
  return (
    <div className={styles.contactWrapper}>
      <h2 className={styles.heading}>Contact Us</h2>

      <div className={styles.contactContainer}>
        <div className={styles.formSection}>
          <h3>Get in Touch</h3>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="text" placeholder="Subject" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className={styles.mapSection}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.3658262445983!2d76.59206881480122!3d8.893211093616934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05fdd5ae00d9a1%3A0x7ef4d3c6f3a8cb6b!2sKollam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1713634290900!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>
      </div>
    </div>
  );
}

export default ContactUs;
