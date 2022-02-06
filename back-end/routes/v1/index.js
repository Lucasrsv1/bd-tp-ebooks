const { Router } = require("express");

const autoresRouter = require("./autores");
const loginRouter = require("./login");
const generosRouter = require("./generos");
const usuariosRouter = require('./usuarios');

const router = Router();

// ============= Rotas ============= //

router.use("/autores", autoresRouter);

router.use("/generos", generosRouter);

router.use("/usuarios", usuariosRouter);


router.use(loginRouter);

module.exports = router;
