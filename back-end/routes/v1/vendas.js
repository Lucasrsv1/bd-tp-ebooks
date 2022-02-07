const { Router } = require("express");
const { ensureAuthorized, ensureAuthorizedEmployee } = require("../../controllers/login");

const vendasController = require("../../controllers/vendas");

const router = Router();

router.get("/", ensureAuthorizedEmployee, vendasController.getAll);

router.get("/usuario", ensureAuthorized, vendasController.getMyPurchases);

module.exports = router;
