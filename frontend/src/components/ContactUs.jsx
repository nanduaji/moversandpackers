import React, { useState } from 'react';
import styles from './ContactUs.module.css';
import { toast,ToastContainer } from 'react-toastify';
import axios from 'axios';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading,setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contactEmailResponse = await axios.post('https://moversandpackers.onrender.com/api/sendContactEmail', {
        formData,
      });
  
      setFormData({ name: '', email: '', subject: '', message: '' });
      console.log("contactEmailResponse",contactEmailResponse.data)
      toast.success('Message sent successfully');
      setLoading(false);
    } catch (error) {
      toast.error('Failed to send message');
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactWrapper}>
      <ToastContainer/>
      <h2 className={styles.heading}>Contact Us</h2>

      <div className={styles.contactContainer}>
        <div className={styles.formSection}>
          <h3>Get in Touch</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required />
            <button type="submit">{loading === true ?'Loading...':'Send Message'}</button>
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
