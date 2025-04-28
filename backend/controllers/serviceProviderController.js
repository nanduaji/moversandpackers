const ServiceProvider = require('../models/serviceProviderModel');
const Services = require('../models/serviceModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const serviceProviderController = {
    addServiceProvider: async (req, res) => {
        try {
            const { name, email, password,phoneNumber,services,location } = req.body;
            console.log("name, email, password,phoneNumber,services,location",name, email, password,phoneNumber,services,location)
            // Check if required fields are present
            if (!name || !email || !password || !phoneNumber || !services || !location) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Name, email,password, phoneNumber and services are required',
                    data: null
                });
            }

            // Check if user already exists
            const existingUser = await ServiceProvider.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'ServiceProvider with this email already exists',
                    data: null
                });
            }

            // Encrypt password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new ServiceProvider({ name, email, password: encryptedPassword,phoneNumber,services,location });
            await newUser.save();

            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'ServiceProvider added successfully',
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
    serviceProviderLogin: async (req, res) => {
            try {
                const { email, password } = req.body;
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
                const user = await ServiceProvider.findOne({ email });
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
                    data: { id: user._id, name: user.name, email: user.email,role:user.role,status:user.status,phoneNumber:user.phoneNumber,services:user.services,location:user.location,verified:user.verified,availability:user.availability,ratings:user.ratings,totalReviews:user.totalReviews,earnings:user.earnings }
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
    getMyBookings: async (req, res) => {
        try {
            const { providerId } = req.params;
            console.log("providerId",providerId)
            // Check if providerId is provided
            if (!providerId) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Provider ID is required',
                    data: null
                });
            }

            // Find bookings for the provider
            const bookings = await Services.find({ serviceProviderId: providerId });
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Bookings retrieved successfully',
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
    updateServiceProviderStatus: async (req, res) => {
        try {
            const { providerId } = req.params;
            const { status } = req.body;
            // Check if providerId and status are provided
            if (!providerId || !status) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Provider ID and status are required',
                    data: null
                });
            }

            // Update service provider status
            const updatedProvider = await ServiceProvider.findByIdAndUpdate(providerId, { status }, { new: true });
            if (!updatedProvider) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: 'Service Provider not found',
                    data: null
                });
            }

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Service Provider status updated successfully',
                data: updatedProvider
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
    // Add more methods as needed
    
}
module.exports = serviceProviderController;