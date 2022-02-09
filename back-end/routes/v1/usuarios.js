const { Router } = require("express");

const { insert, update } = require("../../controllers/usuarios");

const router = Router();

router.post("/", insert.validations, insert);

router.put("/", update.validations, update);

module.exports = router;
