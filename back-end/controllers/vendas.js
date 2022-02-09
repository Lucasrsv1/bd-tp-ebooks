const { body } = require("express-validator");

const db = require("../database");
const { ensureAuthorized } = require("./login");
const { isRequestInvalid } = require("../utils/http-validation");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll (req, res) {
	try {
		const result = await db.findAll(`
			SELECT V.id_venda AS "idVenda", V.data_compra AS "dataCompra", U.nome AS "nomeComprador", E.titulo AS "ebookTitulo", V.preco_pago AS "precoPago"
			FROM vendas V
			INNER JOIN usuarios U ON U.id_usuario = V.id_usuario_comprador
			INNER JOIN ebooks E ON E.id_ebook = V.id_ebook;
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
async function getMyPurchases (req, res) {
	try {
		if (!res.locals.user || !res.locals.user.idUsuario)
			return res.status(400).json({ message: "Usuário não identificado." });

		const result = await db.findAll(`
			SELECT V.id_venda AS "idVenda", V.data_compra AS "dataCompra", E.titulo AS "ebookTitulo", V.preco_pago AS "precoPago"
			FROM vendas V
			INNER JOIN ebooks E ON E.id_ebook = V.id_ebook
			WHERE V.id_usuario_comprador = $1;
		`, [res.locals.user.idUsuario]);

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
async function buy (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		if (!res.locals.user || !res.locals.user.idUsuario)
			return res.status(400).json({ message: "Usuário não identificado." });

		const now = new Date();
		const date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDay().toString().padStart(2, "0")}`;

		const result = await db.execute(`
			INSERT INTO vendas (id_usuario_comprador, id_ebook, data_compra, preco_pago)
				VALUES ($1, $2, $3, $4);
		`, [res.locals.user.idUsuario, req.body.idEbook, date, req.body.preco]);

		res.status(200).json(result.rowCount > 0);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

buy.validations = [
	ensureAuthorized,
	body("idEbook").isNumeric().withMessage("A ID do eBook é inválida.").toInt(),
	body("preco").isNumeric().withMessage("O preço do eBook é inválido.").toFloat()
];

module.exports = { getAll, getMyPurchases, buy };
