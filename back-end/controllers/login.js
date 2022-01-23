const { body } = require("express-validator");
const { sha512 } = require("js-sha512");
const { sign, verify } = require("jsonwebtoken");

const db = require("../database");
const { isRequestInvalid } = require("../utils/http-validation");

const KEY_TOKEN = "!*conV*dgzaSx!KGraV22eTofP1O697I";
const EXPIRATION_TIME = 3 * 24 * 60 * 60;

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function ensureAuthorized (req, res, next) {
	const token = req.headers["x-access-token"];
	if (!token) {
		res.status(403).json({ message: "Acesso não autorizado. A sessão do usuário é inválida." });
		return res.end();
	}

	verify(token, KEY_TOKEN, (error, user) => {
		if (error) {
			res.status(403).json({
				message: "Acesso não autorizado. A sessão do usuário é inválida.",
				expired: error.name === "TokenExpiredError",
				error
			});
			return res.end();
		}

		res.locals.user = user;
		next(null);
	});
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function ensureAuthorizedEmployee (req, res, next) {
	ensureAuthorized(req, res, () => {
		if (res.locals.user.funcionario)
			return next(null);

		res.status(403).json({ message: "Acesso não autorizado. O usuário não é um funcionário." });
		res.end();
	});
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function login (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		// Faz o hash da senha antes de fazer o login
		const password = sha512(req.body.password);

		const user = await db.findOne(`
			SELECT id_usuario AS "idUsuario", nome, email, funcionario
			FROM usuarios
			WHERE email = '${req.body.email}' AND senha = '${password}'
		`);

		if (!user)
			return res.status(403).json({ message: "E-mail ou senha incorretos." });

		const token = sign(user, KEY_TOKEN, { expiresIn: EXPIRATION_TIME });
		res.status(200).json({ token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Erro ao fazer login.", error });
	}
}

login.validations = [
	body("email").isEmail().withMessage("E-mail inválido.").normalizeEmail(),
	body("password").isString().withMessage("Senha inválida.")
];

module.exports = {
	ensureAuthorized,
	ensureAuthorizedEmployee,
	login
};
