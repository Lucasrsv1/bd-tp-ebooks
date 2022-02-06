const { Router } = require("express");

const vendasController = require("../../controllers/vendas");

const router = Router();

router.get("/", vendasController.getAll, vendasController.getAll);

module.exports = router;
