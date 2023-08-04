const { Router } = require("express")

const notesRoutes = Router()

const NotesController = require("../controllers/NotesController.js")

const notesController = new NotesController()

const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")

notesRoutes.use(ensureAuthenticated)

notesRoutes.post("/", notesController.create)
notesRoutes.get("/:id", notesController.show)
notesRoutes.get("/", notesController.index)
notesRoutes.delete("/:id", notesController.delete)

module.exports = notesRoutes