const Service = require('../models/serviceModel');

const serviceController = {
    createService: async (req, res) => {
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
            console.log("createService", req.body);
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
    }
}
module.exports = serviceController