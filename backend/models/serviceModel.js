const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, unique: true },
    customerPhone: { type: String, required: true },
    
    serviceType: { 
        type: String, 
        enum: ["House Shifting", "Office Relocation", "Vehicle Transport", "Storage Service"], 
        required: true 
    },

    pickupAddress: { 
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },

    deliveryAddress: { 
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },

    itemsDescription: { type: String }, 
    estimatedWeight: { type: Number, required: true }, // in kg

    pickupDate: { type: Date, required: true },
    deliveryDate: { type: Date },

    priceEstimate: { type: Number, required: true },
    finalPrice: { type: Number },

    status: { 
        type: String, 
        enum: ["Pending", "Scheduled", "In Transit", "Delivered", "Cancelled"], 
        default: "Pending" 
    },

    paymentStatus: { 
        type: String, 
        enum: ["Unpaid", "Paid", "Partial Payment"], 
        default: "Unpaid" ,
        required: true
    },
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
      },
      

    createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
