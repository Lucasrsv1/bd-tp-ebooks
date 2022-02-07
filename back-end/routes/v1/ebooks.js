const { Router } = require("express");

const ebooksController = require("../../controllers/ebooks");
const { ensureAuthorized } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorized, ebooksController.getAll);

router.post("/", ebooksController.insert.validations, ebooksController.insert);

router.put("/", ebooksController.update.validations, ebooksController.update);

router.delete("/:idEbook", ebooksController.remove.validations, ebooksController.remove);

module.exports = router;
