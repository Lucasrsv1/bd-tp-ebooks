const { body, param } = require("express-validator");

const db = require("../database");
const { ensureAuthorizedEmployee } = require("./login");
const { isRequestInvalid } = require("../utils/http-validation");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll (req, res) {
	try {
		const result = await db.findAll(`
			SELECT G.id_genero AS "idGenero", G.nome, COUNT(E.id_ebook) AS "qtdEbooks"
			FROM generos G
			LEFT OUTER JOIN ebooks E ON E.id_genero = G.id_genero
			GROUP BY G.id_genero
			ORDER BY G.nome ASC;
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
		const result = await db.execute(`
			INSERT INTO generos (nome) VALUES ($1)
			RETURNING id_genero AS "idGenero", nome;
		`, [req.body.nome]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

insert.validations = [
	ensureAuthorizedEmployee,
	body("nome").isString().withMessage("Nome inválido.")
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		const result = await db.execute(`
			UPDATE generos SET nome = $1
			WHERE id_genero = $2
			RETURNING id_genero AS "idGenero", nome;
		`, [req.body.nome, req.body.idGenero]);

		if (result.rowCount > 0)
			res.status(200).json(result.rows[0]);
		else
			res.status(404).json({ message: "Gênero não encontrado." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

update.validations = [
	ensureAuthorizedEmployee,
	body("nome").isString().withMessage("Nome inválido."),
	body("idGenero").isNumeric().withMessage("O ID do genero é inválida.").toInt()
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function remove (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		const result = await db.execute(`
			DELETE FROM generos
			WHERE id_genero = $1;
		`, [req.params.idGenero]);

		if (result.rowCount > 0)
			res.status(200).json(result.rowCount);
		else
			res.status(404).json({ message: "Autor não encontrado." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

remove.validations = [
	ensureAuthorizedEmployee,
	param("idGenero").isNumeric().withMessage("O ID do gênero é inválida.").toInt()
];

module.exports = { getAll, insert, update, remove };
