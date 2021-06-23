const board = require('../models/board');
const express = require('express');
const router = express.Router();

router.get("/", async (req, res, next) => {
	const list = await board.getLatest('photo', '분류1', 10, true);
	console.log(list);
	res.render("main/index");
});

module.exports = router;