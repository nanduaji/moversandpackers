import React from 'react';
import styles from './Footer.module.css';  

function Footer() {
  return (
    <div className={styles.footer}> 
      <div className={styles.footerContent}> 
        <p style={{color:'white'}}>&copy; 2025 TruckXpress. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="/aboutus" className={styles.footerLink}>
            About Us
          </a>
          <a href="/contactus" className={styles.footerLink}>
            Contact
          </a>
          <a href="/privacy" className={styles.footerLink}>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
