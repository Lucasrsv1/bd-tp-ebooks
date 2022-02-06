const { body, param } = require("express-validator");

const db = require("../database");
const { ensureAuthorizedEmployee } = require("./login");
const { isRequestInvalid } = require("../utils/http-validation");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll(req, res) {
    try {
        const dados = await db.findAll(`
			SELECT id_usuario,nome,email,funcionario
			FROM usuarios
		`);

        const map = [];
        for (const dado of dados) {
            map.push({
                id: dado.id_usuario,
                email: dado.email,
                nome: dado.nome,
                funcionario: dado.funcionario
            });
        }
        res.status(200).json(map);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error });
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function insert(req, res) {
    if (isRequestInvalid(req, res)) return;
    var user = req.body;
    try {
        const result = await db.execute(`
			INSERT INTO usuarios (nome,email,senha,funcionario)
			VALUES ('${user.nome}','${user.email}','${user.senha}','${user.funcionario}')
			RETURNING id_usuario AS "idUsuario"
		`);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error });
    }
}

insert.validations = [
    ensureAuthorizedEmployee,
    body("nome").isString().withMessage("Usuario inválido.")
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update(req, res) {
    if (isRequestInvalid(req, res)) return;

    try {
        const result = await db.execute(`
			UPDATE usuarios SET nome = '${req.body.nome}'
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
    ensureAuthorizedEmployee,
    body("nome").isString().withMessage("Nome inválido."),
    body("idUsuario").isNumeric().withMessage("A ID do usuario é inválida.").toInt()
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function remove(req, res) {
    if (isRequestInvalid(req, res)) return;

    try {
        const result = await db.execute(`
			DELETE FROM usuarios
			WHERE id_usuario = ${req.params.idUsuario}
		`);

        if (result.rowCount > 0)
            res.status(200).json(result.rowCount);
        else
            res.status(404).json({ message: "Usuario não encontrado." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error });
    }
}

remove.validations = [
    ensureAuthorizedEmployee,
    param("idUsuario").isNumeric().withMessage("A ID do usuario é inválida.").toInt()
];

module.exports = { getAll, insert, update, remove };
