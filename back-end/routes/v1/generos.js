const { Router } = require("express");

const { getAll, insert, remove, update } = require("../../controllers/generos");
const { ensureAuthorized } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorized, getAll);

router.post("/", insert.validations, insert);

router.put("/", update.validations, update);

router.delete("/:idGenero", remove.validations, remove);

module.exports = router;
