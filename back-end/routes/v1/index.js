const { Router } = require("express");

const loginRouter = require("./login");
const autoresRouter = require("./autores");
const ebooksRouter = require("./ebooks");
const generosRouter = require("./generos");

const router = Router();

// ============= Rotas ============= //

router.use("/generos", generosRouter);

router.use("/ebooks", ebooksRouter);

router.use("/autores", autoresRouter);

router.use(loginRouter);

module.exports = router;
