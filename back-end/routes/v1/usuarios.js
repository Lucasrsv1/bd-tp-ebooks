const { Router } = require("express");

const usuariosController = require("../../controllers/usuarios");

const router = Router();

router.post("/", usuariosController.insert.validations, usuariosController.insert);

router.put("/", usuariosController.update.validations, usuariosController.update);

module.exports = router;
