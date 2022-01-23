/**
 * @type {import("pg").PoolConfig}
 */
module.exports = {
	user: "postgres",
	password: "root",
	database: "bd_tp_ebooks",
	host: "127.0.0.1",
	port: 5432,
	max: 20,
	min: 0
};
