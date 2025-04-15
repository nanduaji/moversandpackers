const { addAdmin, adminLogin,getAllBookings,getAllServiceProviders,updateBookingStatus } = require("../controllers/adminController");
const { addServiceProvider, serviceProviderLogin,getMyBookings } = require("../controllers/serviceProviderController");
const { bookService, getServices, getStatus,getUserBookings,cancelBooking } = require("../controllers/userController");
const { addUser, userLogin, getUsers,editUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const routes = require("express").Router();

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


// SERVICE PROVIDER ROUTES
routes.post("/addServiceProvider", addServiceProvider);
routes.post("/serviceProviderLogin", serviceProviderLogin);
routes.post("/getMyBookings/:providerId", authMiddleware, getMyBookings);
 
module.exports = routes;
