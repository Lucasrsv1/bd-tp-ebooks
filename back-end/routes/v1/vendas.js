const { Router } = require("express");

const { ensureAuthorized, ensureAuthorizedEmployee } = require("../../controllers/login");
const { getAll, getMyPurchases, buy } = require("../../controllers/vendas");

const router = Router();

router.get("/", ensureAuthorizedEmployee, getAll);

router.get("/usuario", ensureAuthorized, getMyPurchases);

router.post("/", buy.validations, buy);

module.exports = router;
