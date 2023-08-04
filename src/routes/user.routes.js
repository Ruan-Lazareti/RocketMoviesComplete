const { Router } = require("express")

const userRoutes = Router()

const UserController = require("../controllers/UserController.js")

const userController = new UserController()

const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")
 
userRoutes.post("/", userController.create)
userRoutes.put("/",  ensureAuthenticated, userController.update)

module.exports = userRoutes