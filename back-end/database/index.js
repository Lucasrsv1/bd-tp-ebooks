const { Pool } = require("pg");

const config = require("./config/config");

const pool = new Pool(config);

pool.query("SELECT NOW() AS now", (err, res) => {
	if (err)
		console.error("Não foi possível conectar ao banco de dados! Erro:", err);
	else
		console.log("Conectado ao Banco de Dados às", res.rows[0].now.toLocaleString());
});

/**
 * @param {import("pg").QueryConfig} query
 */
async function findOne (query) {
	const res = await pool.query(query);
	return res.rows[0];
}

/**
 * @param {import("pg").QueryConfig} query
 */
async function findAll (query) {
	const res = await pool.query(query);
	return res.rows;
}

/**
 * @param {import("pg").QueryConfig} query
 */
function execute (query) {
	return pool.query(query);
}

function closeConnection () {
	console.log("Desconectando do Banco de Dados...");
	return pool.end();
}

module.exports = { findOne, findAll, execute, closeConnection };
