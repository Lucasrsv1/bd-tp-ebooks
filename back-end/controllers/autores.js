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
		const dados = await db.findAll(`
			SELECT A.id_autor AS "idAutor", A.nome, E.titulo
			FROM autores A
			LEFT OUTER JOIN ebooks E ON E.id_autor = A.id_autor
			ORDER BY E.titulo ASC;
		`);

		const map = {};
		for (const dado of dados) {
			if (!map[dado.idAutor]) {
				map[dado.idAutor] = {
					idAutor: dado.idAutor,
					nome: dado.nome,
					titulos: []
				};
			}

			if (dado.titulo)
				map[dado.idAutor].titulos.push(dado.titulo);
		}

		const autores = [];
		for (const idAutor in map)
			autores.push(map[idAutor]);

		autores.sort((a, b) => a.nome < b.nome ? -1 : (a.nome > b.nome ? 1 : 0));
		res.status(200).json(autores);
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
			INSERT INTO autores (nome)
			VALUES ($1)
			RETURNING id_autor AS "idAutor", nome;
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
			UPDATE autores SET nome = $1
			WHERE id_autor = $2
			RETURNING id_autor AS "idAutor", nome;
		`, [req.body.nome, req.body.idAutor]);

		if (result.rowCount > 0)
			res.status(200).json(result.rows[0]);
		else
			res.status(404).json({ message: "Autor não encontrado." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

update.validations = [
	ensureAuthorizedEmployee,
	body("nome").isString().withMessage("Nome inválido."),
	body("idAutor").isNumeric().withMessage("A ID do autor é inválida.").toInt()
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function remove (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		const result = await db.execute(`
			DELETE FROM autores
			WHERE id_autor = $1;
		`, [req.params.idAutor]);

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
	param("idAutor").isNumeric().withMessage("A ID do autor é inválida.").toInt()
];

module.exports = { getAll, insert, update, remove };
