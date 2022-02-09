const { body, param } = require("express-validator");
const { resolve } = require("path");

const db = require("../database");
const { isRequestInvalid } = require("../utils/http-validation");
const { ensureAuthorizedEmployee } = require("./login");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll (req, res) {
	try {
		const minReceita = req.query.minReceita ? Number(req.query.minReceita) : null;
		const result = await db.findAll(`
			SELECT
				E.id_ebook AS "idEbook",
				E.capa,
				E.num_paginas AS "numPaginas",
				E.qtd_downloads AS "downloads",
				E.sinopse,
				E.ano_publicacao AS "anoPublicacao",
				E.preco,
				E.titulo,
				G.nome AS "genero",
				A.nome AS "autor",
				A.id_autor AS "idAutor",
				G.id_genero AS "idGenero",
				SUM(V.preco_pago) AS "receita",
				(
					SELECT COUNT(DISTINCT Ve.id_usuario_comprador)
					FROM vendas Ve
					WHERE Ve.id_ebook = E.id_ebook
				) AS "qtdCompradores"
			FROM ebooks E
			INNER JOIN autores A ON E.id_autor = A.id_autor
			INNER JOIN generos G ON E.id_genero = G.id_genero
			LEFT OUTER JOIN vendas V ON V.id_ebook = E.id_ebook
			GROUP BY E.id_ebook, G.id_genero, A.id_autor
			${minReceita > 0 ? "HAVING SUM(V.preco_pago) >= " + minReceita.toString() : ""}
			ORDER BY E.titulo ASC;
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
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id_ebook AS "idEbook", titulo;
		`, [
			req.body.titulo,
			req.body.anoPublicacao,
			req.body.numPaginas,
			req.body.preco,
			req.body.sinopse,
			req.body.capa || null,
			req.body.idAutor,
			req.body.idGenero
		]);

		if (req.files && req.files.cover && req.body.capa) {
			const file = req.files.cover instanceof Array ? req.files.cover[0] : req.files.cover;
			await file.mv(resolve(__dirname, "..", "covers", req.body.capa));
		}

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
			UPDATE ebooks SET
				titulo = $1,
				ano_publicacao = $2,
				num_paginas = $3,
				preco = $4,
				sinopse = $5,
				id_autor = $6,
				id_genero = $7
			WHERE id_ebook = $8
			RETURNING id_ebook AS "idEbook", titulo;
		`, [
			req.body.titulo,
			req.body.anoPublicacao,
			req.body.numPaginas,
			req.body.preco,
			req.body.sinopse,
			req.body.idAutor,
			req.body.idGenero,
			req.body.idEbook
		]);

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
			WHERE id_ebook = $1;
		`, [req.params.idEbook]);

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
