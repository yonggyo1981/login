const express = require('express');
const multer = require('multer');
const fileUpload = require('../models/file_upload');
const logger = require('../lib/logger');
const { alert } = require('../lib/common');
const path = require('path');
const fs = require('fs').promises;
const constants = require('fs').constants;
const { fileTypeCheck } = require("../middlewares/file_validator");
const router = express.Router();

/* 
* filedata에 추가된 idx 번호가 파일명
* 폴더는 생성된 idx번호 뒷자리
*  
*/
const upload = multer({
		storage : multer.diskStorage({
				destination : async (req, file, done) => {
						file.gid = req.params.gid;
						const result = await fileUpload.registerFileInfo(file);
						file.idx = result.idx;
						req.fileInfo = result;
						fs.access(result.folder, constants.F_OK | constants.W_OK | constants.R_OK)
							.then(() => {
								// 폴더 있음 
								done(null, result.folder);
							})
							.catch((err) => {
								return fs.mkdir(result.folder);
							})
							.then(() => {
								done(null, result.folder);
							})
							.catch((err) => {
								// 폴더 생성 실패 
								logger(err.stack, 'error');
							});
				},
				filename : (req, file, done) => {
					done(null, "file_" + file.idx);
				},
		}),
		limits : { fileSize : 20 * 1024 * 1024 }, // 20메가로 제한 
});


router.route('/upload/:gid')
	.get((req, res, next) => {
		const data = {
			gid : req.params.gid,
			mode : req.query.mode,
			isAttached : req.query.isAttached?1:0,
		};
		return res.render("file/form", data);
	})
	.post(upload.single('file'), fileTypeCheck, async (req, res, next) => {
		// 파일 업로드 완료 처리 
		await fileUpload.finish(req.file.idx);
		
		// 파일 업로드 콜백 처리 
		let fileInfo = await fileUpload.get(req.file.idx);
		fileInfo = JSON.stringify(fileInfo);
		const script = `
			<script>
			if (typeof parent.fileUploadCallback == 'function') {
				parent.fileUploadCallback(${fileInfo});
			} else {
				alert('파일 업로드 성공');
			}				
			</script>`;
		return res.send(script);
	});

/**
* 파일 삭제 
*
*/
router.get("/delete/:idx", async (req, res, next) => {
	const idx = req.params.idx;
	const result = await fileUpload.delete(idx);
	
	return res.json({isSuccess : result});
});

module.exports = router;