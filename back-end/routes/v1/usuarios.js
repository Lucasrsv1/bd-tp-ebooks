const { Router } = require("express");

const usuariosController = require("../../controllers/generos");
const { ensureAuthorizedEmployee } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorizedEmployee, usuariosController.getAll);

router.post("/", usuariosController.insert.validations, usuariosController.insert);

router.put("/", usuariosController.update.validations, usuariosController.update);

router.delete("/:idGenero", usuariosController.remove.validations, usuariosController.remove);

module.exports = router;
