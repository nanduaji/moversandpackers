const { addAdmin, adminLogin } = require("../controllers/adminController");
const { addServiceProvider, serviceProviderLogin } = require("../controllers/serviceProviderController");
const { bookService, getServices, getStatus } = require("../controllers/userController");
const { addUser, userLogin, getUsers,editUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const routes = require("express").Router();

// USER ROUTES
routes.post("/addUser", addUser); 
routes.post("/userLogin", userLogin);
routes.post("/getUsers", authMiddleware, getUsers); 
routes.post("/editUser", authMiddleware, editUser); 
routes.post("/bookService", authMiddleware, bookService);
routes.post("/getServices", authMiddleware, getServices);
routes.post("/getStatus/:id", authMiddleware, getStatus);


// ADMIN ROUTES
routes.post("/addAdmin", addAdmin);
routes.post("/adminLogin", adminLogin);

// SERVICE PROVIDER ROUTES
routes.post("/addServiceProvider", authMiddleware, addServiceProvider);
routes.post("/serviceProviderLogin", serviceProviderLogin);
module.exports = routes;
