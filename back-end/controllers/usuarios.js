const { body } = require("express-validator");
const { sha512 } = require("js-sha512");
const { sign } = require("jsonwebtoken");

const db = require("../database");
const { ensureAuthorized } = require("./login");
const { isRequestInvalid } = require("../utils/http-validation");

const KEY_TOKEN = "!*conV*dgzaSx!KGraV22eTofP1O697I";
const EXPIRATION_TIME = 3 * 24 * 60 * 60;

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function insert (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		// Faz o hash da senha antes de fazer o cadastro
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
async function update (req, res) {
	if (isRequestInvalid(req, res)) return;

	if (!res.locals.user.idUsuario)
		return res.status(400).json({ message: "A ID do usuário não foi identificada." });

	const setUser = [];
	if (req.body.nome)
		setUser.push(`nome = '${req.body.nome}'`);

	if (req.body.email)
		setUser.push(`email = '${req.body.email}'`);

	if (req.body.senha) {
		// Faz o hash da senha antes de fazer a atualização
		const senha = sha512(req.body.senha);
		setUser.push(`senha = '${senha}'`);
	}

	if (!setUser.length)
		return res.status(400).json({ message: "Nenhum valor foi especificado para atualização." });

	try {
		const result = await db.execute(`
			UPDATE usuarios SET ${setUser.join(", ")}
			WHERE id_usuario = ${res.locals.user.idUsuario}
			RETURNING id_usuario AS "idUsuario", nome, email, funcionario
		`);

		if (result.rowCount > 0) {
			const token = sign(result.rows[0], KEY_TOKEN, { expiresIn: EXPIRATION_TIME });
			res.status(200).json({ token });
		} else {
			res.status(404).json({ message: "Usuario não encontrado." });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

update.validations = [
	ensureAuthorized,
	body("nome").optional().isString().withMessage("Nome inválido."),
	body("email").optional().isEmail().withMessage("E-mail inválido.").normalizeEmail(),
	body("password").optional().isString().withMessage("Senha inválida.")
];

module.exports = { insert, update };
