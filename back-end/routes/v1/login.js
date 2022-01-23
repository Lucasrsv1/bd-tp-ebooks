const { Router } = require("express");

const LoginController = require("../../controllers/login");

const router = Router();

router.post("/login", LoginController.login.validations, LoginController.login);

module.exports = router;
