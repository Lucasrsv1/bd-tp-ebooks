const { Router } = require("express");

const autoresController = require("../../controllers/ebooks");
const { ensureAuthorizedEmployee } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorizedEmployee, autoresController.getAll);

router.post("/", autoresController.insert.validations, autoresController.insert);

router.put("/", autoresController.update.validations, autoresController.update);

router.delete("/:idEbook", autoresController.remove.validations, autoresController.remove);

module.exports = router;
