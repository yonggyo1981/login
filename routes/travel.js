const { alert, go } = require("../lib/common");
const express = require('express');
const travel = require('../models/travel');
const router = express.Router();

/** 여행 예약하기 */
router.route("/reservation")
		.post(async (req, res, next) => {
			try {
				goodsCd = req.body.goodsCd;
				if (!goodsCd) {
					throw new Error('잘못된 접근입니다.');
				}
				
				const data = await travel.get(goodsCd);
				if (!data.goodsCd) {
					throw new Error('등록되지 않은 여행 상품입니다.');
				}
				
				if (!data.pack) {
					throw new Error('마감된 여행상품 입니다.');
				}
				
				data.adult = req.body.goodsCnt_adult || 1;
				data.child = req.body.goodsCnt_child || 0;
				data.infant = req.body.goodsCnt_infant || 0;
				
				data.packages = await travel.getPackages(goodsCd);
				console.log(data.packages);
				data.addCss = ['travel'];
				data.addScript = ['travel'];
				return res.render("travel/form", data);
			} catch (err) {
				return alert(err.message, res, -1);
			}
		});

/** 여행 상품 상세 */
router.route("/:goodsCd")
		/** 상품 상세 */
		.get(async (req, res, next) => {
			const goodsCd = req.params.goodsCd;
			const data = await travel.get(goodsCd);
			
			data.addCss = ["travel"];
			data.addScript = ["travel"];
			console.log(data);
			return res.render("travel/goods", data);
		});
		

module.exports = router;