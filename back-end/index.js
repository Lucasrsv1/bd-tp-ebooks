// Configura variáveis de ambiente o mais cedo possível
require("dotenv").config();

// Configura estampa de tempo dos logs
require("console-stamp")(console, { pattern: "yyyy-mm-dd HH:MM:ss.l" });

const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const { closeConnection } = require("./database");


const routes = require("./routes");

const port = process.env.PORT || 3000;
const app = express();


app.set("port", port);
app.use(logger("[:date[clf]] :method :url :status :response-time ms - :res[content-length]"));
app.use(express.json());


app.use(express.urlencoded({ extended: false }));
app.use(cors({
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: true,
	optionsSuccessStatus: 200
}));

app.use("/api", routes);

app.use(express.static(path.join(__dirname, "public")));

// Manda todos as outras requisições para o index.html
app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
	console.log(`O servidor está online na porta ${port}`);
});

// Destrói processos ao finalizar o servidor
[
	"SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT",
	"SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"
].forEach(sig => {
	process.on(sig, async () => {
		await closeConnection();
		process.exit(1);
	});
});

process.on("beforeExit", async () => {
	await closeConnection();
	process.exit(0);
});
