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
 * @param {any[]} values
 */
async function findOne (query, values) {
	const res = await pool.query(query, values || []);
	return res.rows[0];
}

/**
 * @param {import("pg").QueryConfig} query
 * @param {any[]} values
 */
async function findAll (query, values) {
	const res = await pool.query(query, values || []);
	return res.rows;
}

/**
 * @param {import("pg").QueryConfig} query
 * @param {any[]} values
 */
function execute (query, values) {
	return pool.query(query, values || []);
}

function closeConnection () {
	console.log("Desconectando do Banco de Dados...");
	return pool.end();
}

module.exports = { findOne, findAll, execute, closeConnection };
