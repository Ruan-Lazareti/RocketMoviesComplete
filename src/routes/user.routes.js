const { Router } = require("express")
const userRoutes = Router()
const multer = require("multer")
const uploadConfig = require("../configs/upload.js")

const UserController = require("../controllers/UserController.js")
const UserAvatarController = require("../controllers/UserAvatarController.js")
const userController = new UserController()
const userAvatarController = new UserAvatarController()

const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")

const upload = multer(uploadConfig.MULTER)
 
userRoutes.post("/", userController.create)
userRoutes.put("/",  ensureAuthenticated, userController.update)
userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)

module.exports = userRoutes