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
			SELECT G.id_genero AS "idGenero", G.nome, E.titulo
			FROM generos G
			LEFT OUTER JOIN ebooks E ON E.id_genero = G.id_genero
			ORDER BY E.titulo ASC
		`);

		const map = {};
		for (const dado of dados) {
			if (!map[dado.idGenero]) {
				map[dado.idGenero] = {
					idGenero: dado.idGenero,
					nome: dado.nome,
					titulos: []
				};
			}

			if (dado.titulo)
				map[dado.idGenero].titulos.push(dado.titulo);
		}

		const generos = [];
		for (const idGenero in map)
			generos.push(map[idGenero]);

		res.status(200).json(generos);
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
			INSERT INTO genero (nome)
			VALUES ('${req.body.nome}')
			RETURNING id_genero AS "idGenero", nome
		`);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

insert.validations = [
	ensureAuthorizedEmployee,
	body("nome").isString().withMessage("Genero inválido.")
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		const result = await db.execute(`
			UPDATE generos SET nome = '${req.body.nome}'
			WHERE id_genero = ${req.body.idGenero}
			RETURNING id_genero AS "idGenero", nome
		`);

		if (result.rowCount > 0)
			res.status(200).json(result.rows[0]);
		else
			res.status(404).json({ message: "Genero não encontrado." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

update.validations = [
	ensureAuthorizedEmployee,
	body("nome").isString().withMessage("Nome inválido."),
	body("idGenero").isNumeric().withMessage("A ID do genero é inválida.").toInt()
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
			WHERE id_genero = ${req.params.idGenero}
		`);

		if (result.rowCount > 0)
			res.status(200).json(result.rowCount);
		else
			res.status(404).json({ message: "Genero não encontrado." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

remove.validations = [
	ensureAuthorizedEmployee,
	param("idGenero").isNumeric().withMessage("A ID do genero é inválida.").toInt()
];

module.exports = { getAll, insert, update, remove };
