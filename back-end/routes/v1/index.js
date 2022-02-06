const { Router } = require("express");

const autoresRouter = require("./autores");
const loginRouter = require("./login");
const generosRouter = require("./generos");
const usuariosRouter = require('./usuarios');
const ebooksRouter = require('./ebooks');


const router = Router();

// ============= Rotas ============= //

router.use("/autores", autoresRouter);

router.use("/generos", generosRouter);

router.use("/usuarios", usuariosRouter);

router.use("/ebooks",ebooksRouter);

router.use(loginRouter);



module.exports = router;
