const { Router } = require("express");

const v1 = require("./v1");

const router = Router();

// ============= Geral ============= //

router.get("/", (_, res) => {
	res.json({ message: "Loja de eBooks - API" });
});

router.get("/timestamp", (_, res) => {
	res.status(200).json({ timestamp: Date.now() });
});

// ============= Versões ============= //

router.use("/v1", v1);

module.exports = router;
