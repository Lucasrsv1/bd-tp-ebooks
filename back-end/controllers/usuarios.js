const { body } = require("express-validator");
const { sha512 } = require("js-sha512");
const { sign } = require("jsonwebtoken");

const db = require("../database");
const { ensureAuthorized } = require("./login");
const { isRequestInvalid } = require("../utils/http-validation");
const { verify } = require("jsonwebtoken");

const KEY_TOKEN = "!*conV*dgzaSx!KGraV22eTofP1O697I";
const EXPIRATION_TIME = 3 * 24 * 60 * 60;

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function insert(req, res) {
    if (isRequestInvalid(req, res)) return;

    try {
        // Faz o hash da senha antes de fazer o login
        const password = sha512(req.body.senha);

        const result = await db.execute(`
			INSERT INTO usuarios (nome, email, senha, funcionario)
			VALUES ('${req.body.nome}', '${req.body.email}', '${password}', false)
			RETURNING id_usuario AS "idUsuario", nome, email, funcionario
		`);

        const token = sign(result.rows[0], KEY_TOKEN, { expiresIn: EXPIRATION_TIME });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error });
    }
}

insert.validations = [
    body("nome").isString().withMessage("O nome do usuário é inválido."),
    body("email").isString().withMessage("O e-mail do usuário é inválido."),
    body("senha").isString().withMessage("A senha do usuário é inválido.")
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update(req, res) {
    if (isRequestInvalid(req, res)) return;
    const token = req.header("x-access-token");
    verify(token, KEY_TOKEN, (error, user) => {
        if (user.idUsuario != req.user.idUsuario) {
            res.status(403).json({
                message: "Acesso não autorizado. A sessão do usuário é inválida.",
            });
        }
    });
    var user = req.body
    var setUser = ''
    if (user.nome) {
        setUser += `nome = \'${user.nome}\',`
    }
    if (user.email) {
        setUser += `email = \'${user.email}\',`
    }
    if (user.senha) {
        var senha = sha512(user.senha)
        setUser += `senha = \'${senha}\' `
    }
    setUser = setUser.slice(0, -1);

    try {
        const result = await db.execute(`
			UPDATE usuarios SET ${setUser}
			WHERE id_usuario = ${req.body.idUsuario}
			RETURNING id_usuario AS "idUsuario", nome
		`);

        if (result.rowCount > 0)
            res.status(200).json(result.rows[0]);
        else
            res.status(404).json({ message: "Usuario não encontrado." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error });
    }
}

update.validations = [
    ensureAuthorized,
    body("nome").isString().withMessage("Nome inválido."),
    body("idUsuario").isNumeric().withMessage("A ID do usuario é inválida.").toInt()
];

module.exports = { insert, update };
