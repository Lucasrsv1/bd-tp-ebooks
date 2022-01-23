const { Router } = require("express");

const autoresRouter = require("./autores");
const loginRouter = require("./login");

const router = Router();

// ============= Rotas ============= //

router.use("/autores", autoresRouter);

router.use(loginRouter);

module.exports = router;
