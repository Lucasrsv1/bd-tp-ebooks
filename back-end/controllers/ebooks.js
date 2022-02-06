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
			SELECT *
			FROM ebooks
		`);
        res.status(200).json(dados);
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
    var ebook = req.body;
    try {
        const result = await db.execute(`
			INSERT INTO ebooks (titulo,ano_publicacao,num_paginas,preco,sinopse,capa,id_genero,id_autor)
			VALUES ('${ebook.titulo}','${ebook.ano_publicacao}','${ebook.num_paginas}','${ebook.preco}','${ebook.sinopse}','${ebook.capa}','${ebook.id_genero}','${ebook.id_autor}')
			RETURNING id_ebook AS "idEbook"
		`);
        console.log(result)
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error });
    }
}

insert.validations = [
    body("titulo").isString().withMessage("Titulo inválido.")
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update(req, res) {
    if (isRequestInvalid(req, res)) return;

    try {
        const result = await db.execute(`
			UPDATE ebooks SET preco = '${req.body.preco}'
			WHERE id_ebook = ${req.body.idEbook}
			RETURNING id_ebook AS "idEbook", titulo, preco
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

update.validations = [
    ensureAuthorizedEmployee,
    body("idEbook").isNumeric().withMessage("A ID do ebook é inválida.").toInt()
];

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function remove(req, res) {
    if (isRequestInvalid(req, res)) return;
console.log(req.params.idUsuario)
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
    param("idEbook").isNumeric().withMessage("A ID do ebook é inválida.").toInt()
];

module.exports = { getAll, insert, update, remove };
