const { Router } = require("express");

const funcionarioController = require("../../controllers/funcionarios");

const router = Router();

router.get("/", funcionarioController.getAll, funcionarioController.getAll);

router.post("/", funcionarioController.insert.validations, funcionarioController.insert);

router.put("/", funcionarioController.update.validations, funcionarioController.update);

router.delete("/:idFuncionario", funcionarioController.remove.validations, funcionarioController.remove);

module.exports = router;
