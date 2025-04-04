const User = require('../models/userModel');
const Service = require('../models/serviceModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    addUser: async (req, res) => {
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
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'User with this email already exists',
                    data: null
                });
            }

            // Encrypt password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new User({ name, email, password: encryptedPassword,role:"user",phoneNumber });
            await newUser.save();

            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'User added successfully',
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
    getUsers: async (req, res) => {
        try {

            const users = await User
                .find({})
                .lean();

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Users fetched successfully",
                count: users.length,
                data: users,
            });

        } catch (err) {
            console.log("error: ", err);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    },
    userLogin: async (req, res) => {
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
            const user = await User.findOne({ email });
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
                data: { id: user._id, name: user.name, email: user.email,role:user.role }
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
    editUser: async (req, res) => {
        try {
            const { email, name, password, phoneNumber, role } = req.body;
    
            // Check if email is provided
            if (!email) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Email is required for updating user details",
                    data: null
                });
            }
    
            // Find the user by email
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "User not found",
                    data: null
                });
            }
    
            // Update fields
            if (name) user.name = name;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (role) user.role = role;
    
            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }
    
            // Save the updated user
            await user.save();
    
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "User updated successfully",
                data: user
            });
    
        } catch (err) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Server error",
                error: err.message
            });
        }
    },
    bookService: async (req, res) => {
        try {
            const { 
                customerName, 
                customerEmail, 
                customerPhone, 
                serviceType, 
                pickupAddress: { street: pickupStreet, city: pickupCity, state: pickupState, zipCode: pickupZipCode }, 
                deliveryAddress: { street: deliveryStreet, city: deliveryCity, state: deliveryState, zipCode: deliveryZipCode }, 
                estimatedWeight, 
                pickupDate, 
                priceEstimate, 
                paymentStatus,
                itemsDescription,
                deliveryDate,
                finalPrice,
                status,
             } = req.body
            const newService = new Service({
                customerName, 
                customerEmail, 
                customerPhone, 
                serviceType, 
                pickupAddress: { street: pickupStreet, city: pickupCity, state: pickupState, zipCode: pickupZipCode }, 
                deliveryAddress: { street: deliveryStreet, city: deliveryCity, state: deliveryState, zipCode: deliveryZipCode }, 
                estimatedWeight, 
                pickupDate, 
                priceEstimate, 
                paymentStatus,
                itemsDescription,
                deliveryDate,
                finalPrice,
                status,
            });
            await newService.save();
            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'Product added successfully',
                data: newService
            });
        } catch (error) {
            console.log("error", error);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: error.message
            });
        }
    },
    getServices: async (req, res) => {
        try {

            const services = await Service
                .find({})
                .lean();

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Services fetched successfully",
                count: services.length,
                data: services,
            });

        } catch (err) {
            console.log("error: ", err);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    },
    getStatus : async (req, res) => {
        try {
            const requestId = req.params.id;
            const service = await Service.findById(requestId);
    
            if (!service) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "Service not found",
                    data: null
                });
            }
    
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Service status fetched successfully",
                status: service.status,
                data: {
                    serviceDetails: service
                },
            });
        } catch (err) {
            console.error("Error in getStatus:", err);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
    
    
};

module.exports = userController;
