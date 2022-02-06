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
			SELECT v.id_venda AS "idVenda", v.data_compra AS "dataCompra", u.nome AS "nomeComprador", e.titulo AS "ebookTitulo", v.preco_pago AS "precoPago"
			FROM vendas v
			JOIN usuarios u ON u.id_usuario = v.id_usuario_comprador
			JOIN ebooks e ON e.id_ebook = v.id_ebook
		`);

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

module.exports = { getAll };
