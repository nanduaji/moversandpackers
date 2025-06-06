const { addAdmin, adminLogin,getAllBookings,getAllServiceProviders,updateBookingStatus,updateUserStatus } = require("../controllers/adminController");
const { addServiceProvider, serviceProviderLogin,getMyBookings,updateServiceProviderStatus,editServiceProvider } = require("../controllers/serviceProviderController");
const { bookService, getServices, getStatus,getUserBookings,cancelBooking } = require("../controllers/userController");
const { addUser, userLogin, getUsers,editUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const nodemailer = require('nodemailer');
const routes = require("express").Router();
const express = require('express');
const cors = require('cors');
const app = express();

// Allow CORS for frontend origin
app.use(cors({
  origin: 'https://moversandpackers-frontend.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// USER ROUTES
routes.post("/addUser", addUser); 
routes.post("/userLogin", userLogin); 
routes.post("/editUser", authMiddleware, editUser); 
routes.post("/bookService", authMiddleware, bookService);
routes.post("/getServices", authMiddleware, getServices);
routes.post("/getStatus/:id", authMiddleware, getStatus);
routes.post("/userBookings/:userId", authMiddleware, getUserBookings); 
routes.post("/cancelBooking/:bookingId", authMiddleware, cancelBooking);

// ADMIN ROUTES
routes.post("/addAdmin", addAdmin);
routes.post("/adminLogin", adminLogin);
routes.post("/getUsers", authMiddleware, getUsers);
routes.post("/getAllBookings", authMiddleware, getAllBookings);
routes.post("/getAllServiceProviders", authMiddleware, getAllServiceProviders); 
routes.post("/updateBookingStatus/:bookingId", authMiddleware, updateBookingStatus);
routes.post("/updateUserStatus/:userId",authMiddleware,updateUserStatus )


// SERVICE PROVIDER ROUTES
routes.post("/addServiceProvider", addServiceProvider);
routes.post("/serviceProviderLogin", serviceProviderLogin);
routes.post("/getMyBookings/:providerId", authMiddleware, getMyBookings);
routes.post("/updateServiceProviderStatus/:providerId", authMiddleware, updateServiceProviderStatus);
routes.post("/editServiceProvider/:providerId", authMiddleware, editServiceProvider);


// PAYMENT ROUTES
routes.post("/createPaymentIntent",authMiddleware, (req, res) => {
    const { amount } = req.body;
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "inr",
        automatic_payment_methods: {
            enabled: true,
        },
    })
    .then((paymentIntent) => {
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
})

// Send Contact Us Email
routes.post("/sendContactEmail", async (req, res) => {
    const { name, email, subject, message } = req.body.formData;
  
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS 
        }
      });
  
      const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: email, 
        subject: subject || 'New Enquiry',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007BFF;">📩 New Enquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007BFF;">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p style="margin-top: 20px;"><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #007BFF;">
            <p style="white-space: pre-line; margin: 0;">${message}</p>
          </div>
          <p style="margin-top: 30px;">Regards,<br/>Your Website Contact Form</p>
        </div>
        `
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Email sending failed:", error);
      res.status(500).json({ success: false, message: "Email sending failed", error: error.message });
    }
  });
module.exports = routes;
