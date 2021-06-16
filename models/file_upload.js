const fs = require('fs').promises;
const constants = require('fs').constants;
const logger = require('../lib/logger');
const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const path = require('path');

/**
* 파일 업로드 
*
*/
const fileUpload = {
	/**
	* 파일 정보 저장 
	*
	* @params Object params 업로드 된 파일 정보
	* @return Object - 추가된 idx와 현재 업로드될 폴더 경로 
	*/
	registerFileInfo : async function(params) {
		try {
			if (!params.gid) {
				throw new Error('gid 누락');
			}
			
			const sql = "INSERT INTO filedata (gid, fileName, mimeType) VALUES (:gid, :fileName, :mimeType)";
			const replacements = {
					gid : params.gid,
					fileName : params.originalname, 
					mimeType : params.mimetype,
			};
			
			const result = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			const idx = result[0];
			const folder = "public/upload/" + (idx % 10);
		
			return { idx, folder };
		} catch (err) {
			logger(err.stack, 'error');
			return {};
		}
	},
	/**
	* 파일 삭제 
	*
	* @param Integer idx 파일 등록 번호
	* @return Boolean 
	*/ 
	delete : async function (idx) {
		try {
			const sql = "DELETE FROM filedata WHERE idx = ?";
			await sequelize.query(sql, {
				replacements : [idx],
				type : QueryTypes.DELETE,
			});
			const filePath = path.join(__dirname, "../public/upload/" + (idx % 10) + "/file_" + idx);
			await fs.unlink(filePath);
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 파일 정보 추출 
	*
	* @param Integer idx 
	* @return Object
	*/
	get : async function (idx) {
		try {
			const sql = "SELECT * FROM filedata WHERE idx = ?";
			const rows = await sequelize.query(sql, {
				replacements : [idx],
				type : QueryTypes.SELECT,
			});
			
			const data = rows[0] || {};
			if (data) {
				data.fileUrl = "/upload/file_" + data.idx;
				data.filePath = path.join(__dirname, "../public/upload/file_" + data.idx);
			}
			
			return data;
		} catch (err) {
			logger(err.stack, 'error');
			return {};
		}
	},
};

module.exports = fileUpload;