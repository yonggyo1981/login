const express = require('express');
const multer = require('multer');
const fileUpload = require('../models/file_upload');
const logger = require('../lib/logger');
const { alert } = require('../lib/common');
const path = require('path');
const router = express.Router();

/* 
* filedata에 추가된 idx 번호가 파일명
* 폴더는 생성된 idx번호 뒷자리
*  
*/
const upload = multer({
		storage : multer.diskStorage({
				
				destination : async (req, file, done) => {
					try {
						file.gid = req.params.gid;
						const result = await fileUpload.registerFileInfo(file);
				
						if (!result.folderExists) {
							throw new Error('업로드할 폴더 생성 실패');
						}
						
						file.idx = result.idx;
						result.folder += "/";
						done(null, result.folder);
					} catch (err) {
						logger(err.stack, 'error');
					}
				},
				filename : (req, file, done) => {
					/*
					console.log("file", file);
					const ext = path.extname(file.originalname);
					done(null, file.originalname);
					*/
					done(null, "test");
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