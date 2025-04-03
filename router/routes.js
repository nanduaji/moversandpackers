const { createService } = require("../controllers/servicesController");
const { addUser, userLogin, getUsers,editUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const routes = require("express").Router();

routes.post("/addUser", addUser);
routes.post("/getUsers", authMiddleware, getUsers); 
routes.post("/editUser", authMiddleware, editUser); 
routes.post("/createService", authMiddleware, createService);
routes.post("/userLogin", userLogin);

module.exports = routes;
