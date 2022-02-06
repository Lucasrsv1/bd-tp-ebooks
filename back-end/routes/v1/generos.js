const { Router } = require("express");

const generosController = require("../../controllers/generos");

const router = Router();

router.get("/", generosController.getAll, generosController.getAll);

router.post("/", generosController.insert.validations, generosController.insert);

router.put("/", generosController.update.validations, generosController.update);

router.delete("/:idGenero", generosController.remove.validations, generosController.remove);

module.exports = router;
