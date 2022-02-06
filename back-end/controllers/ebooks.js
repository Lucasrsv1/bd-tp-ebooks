const { body, param } = require("express-validator");

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
			SELECT e.id_ebook AS "idEbook", e.capa, e.num_paginas AS "numPaginas", e.qtd_downloads AS "downloads", e.sinopse, e.ano_publicacao AS "anoPublicacao", e.preco, e.titulo, g.nome AS "genero", a.nome AS "autor", a.id_autor AS "idAutor", g.id_genero AS "idGenero"
			FROM ebooks e
			JOIN autores a ON e.id_autor = a.id_autor
			JOIN generos g ON e.id_genero = g.id_genero;
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
			INSERT INTO ebooks (titulo, ano_publicacao, num_paginas, preco, sinopse, capa, id_autor, id_genero)
			VALUES ('${req.body.titulo}', ${req.body.anoPublicacao}, ${req.body.numPaginas}, ${req.body.preco}, '${req.body.sinopse}', '${req.body.capa}', ${req.body.idAutor}, ${req.body.idGenero})
			RETURNING id_ebook AS "idEbook", titulo
		`);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

// TODO: Precisa de mais validations
insert.validations = [
	ensureAuthorizedEmployee,
	body("titulo").isString().withMessage("Nome inválido.")
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		const result = await db.execute(`
			UPDATE ebooks SET titulo = '${req.body.titulo}', ano_publicacao = ${req.body.anoPublicacao}, num_paginas = ${req.body.numPaginas}, preco = ${req.body.preco}, sinopse = '${req.body.sinopse}', capa = '${req.body.capa}', id_autor = ${req.body.idAutor}, id_genero = ${req.body.idGenero}
			WHERE id_ebook = ${req.body.idEbook}
			RETURNING id_ebook AS "idEbook", titulo
		`);

		if (result.rowCount > 0)
			res.status(200).json(result.rows[0]);
		else
			res.status(404).json({ message: "Ebook não encontrado." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

// TODO: Precisa de mais validations
update.validations = [
	ensureAuthorizedEmployee,
	body("titulo").isString().withMessage("Nome inválido."),
	body("idEbook").isNumeric().withMessage("O ID do ebook é inválida.").toInt()
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function remove (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		const result = await db.execute(`
			DELETE FROM ebooks
			WHERE id_ebook = ${req.params.idEbook}
		`);

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
	param("idEbook").isNumeric().withMessage("O ID do ebook é inválida.").toInt()
];

module.exports = { getAll, insert, update, remove };
