const Admin = require('../models/adminModel');
const Services = require('../models/serviceModel');
const ServiceProviders = require('../models/serviceProviderModel');
const User = require("../models/userModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const adminController = {
    addAdmin: async (req, res) => {
        try {
            const { name, email, password,phoneNumber,role } = req.body;
            // Check if required fields are present
            if (!name || !email || !password || !phoneNumber) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Name, email, and password are required',
                    data: null
                });
            }

            // Check if user already exists
            const existingUser = await Admin.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Admin with this email already exists',
                    data: null
                });
            }

            // Encrypt password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new Admin({ name, email, password: encryptedPassword,role:"admin",phoneNumber });
            await newUser.save();

            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'Admin added successfully',
                data: newUser
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: err.message
            });
        }
    },
    adminLogin: async (req, res) => {
            try {
                const { email, password } = req.body;
                console.log("email",email)
                // Check if fields are provided
                if (!email || !password) {
                    return res.status(400).json({
                        success: false,
                        statusCode: 400,
                        message: 'Email and password are required',
                        data: null
                    });
                }
    
                // Find user by email
                const user = await Admin.findOne({ email });
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: 'Invalid email or password',
                        data: null
                    });
                }
    
                // Compare passwords
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: 'Invalid email or password',
                        data: null
                    });
                }
    
                // Generate JWT token
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
                res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: 'Login successful',
                    token,
                    data: { id: user._id, name: user.name, email: user.email,role:user.role,phoneNumber:user.phoneNumber }
                });
            } catch (err) {
                res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: 'Server error',
                    error: err.message
                });
            }
    },
    getAllBookings: async (req, res) => {
        try {
            const bookings = await Services.find()
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Bookings fetched successfully',
                data: bookings
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: err.message
            });
        }
    },
    getAllServiceProviders: async (req, res) => {
        try {
            const serviceProviders = await ServiceProviders.find()
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Service Providers fetched successfully',
                data: serviceProviders
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: err.message
            });
        }
    },
    updateBookingStatus: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const { status,customerEmail } = req.body;

            // Check if bookingId and status are provided
            if (!bookingId || !status) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Booking ID and status are required',
                    data: null
                });
            }

            // Update booking status
            const updatedBooking = await Services.findByIdAndUpdate(bookingId, { status }, { new: true });
            if (!updatedBooking) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: 'Booking not found',
                    data: null
                });
            }

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
                  
                }
              });
              
              const sendBookingUpdateEmail = (customerEmail, bookingId, status) => {
                
                const emailContent = `
                  <h3>Booking Status Update</h3>
                  <p>Dear Customer,</p>
                  <p>Your booking with ID <strong>${bookingId}</strong> has been updated.</p>
                  <p><strong>Status:</strong> ${status}</p>
                  <p>Thank you for choosing us!</p>
                  <p>Best regards, <br />Your Company</p>
                `;
              
                const mailOptions = {
                  from: process.env.EMAIL_USER,
                  to: customerEmail,
                  subject: `Booking Status Update - ${bookingId}`,
                  html: emailContent,  
                };
              
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    return console.log('Error sending email:', error);
                  }
                  console.log('Email sent: ' + info.response);
                });
              };
            sendBookingUpdateEmail(customerEmail, bookingId, status);
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Booking status updated successfully',
                data: updatedBooking
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: err.message
            });
        }
    },
    updateUserStatus: async (req,res) => {
        try {
            const { userId } = req.params;
            const { status } = req.body;
            // Check if bookingId and status are provided
            if (!userId || !status) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'User ID and status are required',
                    data: null
                });
            }

            // Update booking status
            const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true });
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: 'User not found',
                    data: null
                });
            }
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Booking status updated successfully',
                data: updatedUser
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: err.message
            });
        }
    }
}
module.exports = adminController;