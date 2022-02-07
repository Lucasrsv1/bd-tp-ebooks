const { Router } = require("express");

const funcionarioController = require("../../controllers/funcionarios");
const { ensureAuthorizedEmployee } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorizedEmployee, funcionarioController.getAll);

router.post("/", funcionarioController.insert.validations, funcionarioController.insert);

router.put("/", funcionarioController.update.validations, funcionarioController.update);

router.delete("/:idFuncionario", funcionarioController.remove.validations, funcionarioController.remove);

module.exports = router;
