const { Router } = require("express");

const usuariosController = require("../../controllers/usuarios");
const { ensureAuthorizedEmployee } = require("../../controllers/login");

const router = Router();

router.get("/",ensureAuthorizedEmployee, usuariosController.getAll);

router.post("/", usuariosController.insert.validations, usuariosController.insert);

router.put("/", usuariosController.update.validations, usuariosController.update);

router.delete("/:idUsuario", usuariosController.remove.validations, usuariosController.remove);

module.exports = router;
