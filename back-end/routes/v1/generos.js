const { Router } = require("express");

const generosController = require("../../controllers/generos");
const { ensureAuthorized } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorized, generosController.getAll);

router.post("/", generosController.insert.validations, generosController.insert);

router.put("/", generosController.update.validations, generosController.update);

router.delete("/:idGenero", generosController.remove.validations, generosController.remove);

module.exports = router;
