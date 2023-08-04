const { Router } = require("express")

const tagsRoutes = Router()

const TagsController = require("../controllers/TagsController.js")

const tagsController = new TagsController()

const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")

tagsRoutes.get("/", ensureAuthenticated, tagsController.index)

module.exports = tagsRoutes