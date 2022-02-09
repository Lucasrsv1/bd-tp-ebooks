const { body, param } = require("express-validator");
const { sha512 } = require("js-sha512");

const db = require("../database");
const { isRequestInvalid } = require("../utils/http-validation");
const { ensureAuthorizedEmployee } = require("./login");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll (req, res) {
	try {
		const result = await db.findAll(`
			SELECT id_usuario AS "idFuncionario", nome, email
			FROM usuarios
			WHERE funcionario = true;
		`);

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function insert (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		// Faz o hash da senha antes de fazer o login
		const password = sha512(req.body.senha);

		const result = await db.execute(`
			INSERT INTO usuarios (nome, email, senha, funcionario) VALUES ($1, $2, $3, true)
			RETURNING id_usuario AS "idFuncionario", nome, email;
		`, [req.body.nome, req.body.email, password]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

insert.validations = [
	ensureAuthorizedEmployee,
	body("nome").isString().withMessage("Nome inválido."),
	body("email").isString().withMessage("Email inválido."),
	body("senha").isString().withMessage("Senha inválida.")
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		const result = await db.execute(`
			UPDATE usuarios SET nome = $1, email = $2
			WHERE id_usuario = $3
			RETURNING id_usuario AS "idFuncionario", nome, email;
		`, [req.body.nome, req.body.email, req.body.idFuncionario]);

		if (result.rowCount > 0)
			res.status(200).json(result.rows[0]);
		else
			res.status(404).json({ message: "Ebook não encontrado." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

update.validations = [
	ensureAuthorizedEmployee,
	body("nome").isString().withMessage("Nome inválido."),
	body("email").isString().withMessage("Email inválido.")
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function remove (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		const result = await db.execute(`
			DELETE FROM usuarios
			WHERE id_usuario = $1;
		`, [req.params.idFuncionario]);

		if (result.rowCount > 0)
			res.status(200).json(result.rowCount);
		else
			res.status(404).json({ message: "Ebook não encontrado." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

remove.validations = [
	ensureAuthorizedEmployee,
	param("idFuncionario").isNumeric().withMessage("O ID do funcionario é inválida.").toInt()
];

module.exports = { getAll, insert, update, remove };
