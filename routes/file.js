const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const router = express.Router();

const upload = multer({
		storage : multer.diskStorage({
				destination : async (req, file, done) => {
					console.log("req", req.body);
					console.log("file", file);
					done(null, 'public/upload/');
				},
				filename : (req, file, done) => {
					/* 
					* filedata에 추가된 idx 번호가 파일명
					* 폴더는 생성된 idx번호 뒷자리
					*  
					*/
				},
		}),
		limits : { fileSize : 20 * 1024 * 1024 }, // 20메가로 제한 
});


router.route('/upload/:gid')
	.get((req, res, next) => {
		const data = {
			gid : req.params.gid,
		};
		return res.render("file/form", data);
	})
	.post(upload.single('file'), (req, res, next) => {
		
		return res.send("");
	});

module.exports = router;