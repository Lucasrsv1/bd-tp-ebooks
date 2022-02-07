const db = require("../database");

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
			WHERE V.id_usuario_comprador = ${res.locals.user.idUsuario}
		`);

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

module.exports = { getAll, getMyPurchases };
