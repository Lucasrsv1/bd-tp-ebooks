const { Router } = require("express");

const { getAll, insert, remove, update } = require("../../controllers/funcionarios");
const { ensureAuthorizedEmployee } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorizedEmployee, getAll);

router.post("/", insert.validations, insert);

router.put("/", update.validations, update);

router.delete("/:idFuncionario", remove.validations, remove);

module.exports = router;
