const { sequelize, Sequelize : { QueryTypes } } = require("./index");
const { parseDate } = require('../lib/common'); // 날짜 분해 
const logger = require("../lib/logger");
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const pagination = require('pagination');

/**
* 게시판 Model
*
*/
const board = {
	/** 처리할 데이터 */
	params : {},
	
	/** 처리할 세션 데이터 */
	session : {},
	
	/**
	* 게시판 생성 
	*
	* @param String id 게시판아이디 
	* @param String boardNm 게시판명 
	* 
	* @return Boolean 생성 성공시 true
	*/
	create : async function(id, boardNm) {
		try {
			const sql = "INSERT INTO board (id, boardNm) VALUES (:id, :boardNm)";
			await sequelize.query(sql, {
				replacements : { id, boardNm },
				type : QueryTypes.INSERT,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시판 목록 
	*
	* @return Array
	*/
	getBoards : async function() {
		try {
			const sql = "SELECT * FROM board ORDER BY regDt DESC";
			const rows = await sequelize.query(sql, {
					type : QueryTypes.SELECT,
			});
			
			return rows;
		} catch (err) {
			logger(err.stack, 'error');
			return [];
		}
	},
	/**
	* 게시판 설정 조회 
	*
	* @params String id 게시판 아이디 
	* @return Object
	*/
	getBoard : async function(id) {
		try {
			const sql = "SELECT * FROM board WHERE id = ?";
			const rows = await sequelize.query(sql, {
				replacements : [id],
				type : QueryTypes.SELECT,
			});

			const data = rows[0]?rows[0]:{};
			if (rows.length > 0) {
				data.categories = data.category?data.category.split("||"):[];
				if (data.categories.length > 0) {
					data.category = data.categories.join("\r\n");
				}
				
				data.skins = await this.getSkins(); // 게시판 스킨
				data.skin = data.skin || data.skins[0];
				
				const skinPath = path.join(__dirname, `../views/board/skins/${data.skin}`);
				data.skinPath = {
					list : skinPath + "/_list.html",
					form : skinPath + "/_form.html",
					view : skinPath + "/_view.html",
				};
			}
			
			return data;
		} catch(err) {
			logger(err.stack, 'error');
			return {};
		}
	},
	/**
	* 게시판 설정 저장 
	*
	* @params Object params 
	* @return Boolean 
	*/
	save : async function (params) {
		try {
			if (!params.id || !params.boardNm) {
				throw new Error('게시판 아이디와 게시판명 누락');
			}
			
			let category = [];
			if (params.category) {
				params.category.split("\r\n")
									.forEach((v) => {
										v = v.trim();
										if (v) {
											category.push(v);
										}
									});
				category = category.join("||");
			}
			
			const sql = `UPDATE board 
								SET 
									boardNm = :boardNm,
									category = :category,
									accessType = :accessType,
									useImageUpload = :useImageUpload,
									useFileUpload = :useFileUpload,
									skin = :skin 
								WHERE 
									id = :id`;
			const replacements = {
				boardNm : params.boardNm,
				category,
				accessType : params.accessType,
				useImageUpload : params.useImageUpload?1:0,
				useFileUpload : params.useFileUpload?1:0,
				skin : params.skin,
				id : params.id,
			};
			
			await sequelize.query(sql, {
				replacements,
				type : QueryTypes.UPDATE,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시판 스킨 
	*
	* @return Array
	*/
	getSkins : async function() {
		try {
			const files = await fs.readdir(path.join(__dirname, "/../views/board/skins"));
			return files;
		} catch (err) {
			logger(err.stack, 'error');
			return [];
		}
	},
	/**
	* 처리할 데이터 설정 
	*
	* @param Object params 처리할 데이터 
	* @param Object session - req.session에 있는 데이터 
	*
	* @return this
	*/
	data : function(params, session) {
		this.params = params;
		this.session = session;
		
		return this;
	},
	/**
	*  글 작성 
	*
	* @return Integer|Boolean 성공시는 게시글 등록번호(idx), 실패시에는 false
	*/
	write : async function() {
		try {
			const sql = `INSERT INTO boarddata (boardId, memNo, poster, subject, contents, password) 
										VALUES (:boardId, :memNo, :poster, :subject, :contents, :password)`;
			
			
			const memNo = this.session.memNo || 0;
			let hash = "";
			if (!memNo && this.params.password) { // 비회원인 경우는 비밀번호 해시 처리 
				hash = await bcrypt.hash(this.params.password, 10);
			}
			
			const replacements = {
				boardId : this.params.id,
				memNo,
				poster : this.params.poster,
				subject : this.params.subject,
				contents : this.params.contents,
				password : hash,
			};		

			const result = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			return result[0]; // 게시글 등록 번호(idx)
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 수정 
	*
	* @return Boolean
	*/
	update : async function() {
		try {
			let hash = "";

			if (!this.session.member && this.params.password) {
				hash = await bcrypt.hash(this.params.password, 10);
			}
		
			
			const sql = `UPDATE boarddata 
									SET 
										poster = :poster,
										subject = :subject,
										contents = :contents,
										password = :password,
										modDt = :modDt
									WHERE 
										idx = :idx`;
			const replacements = {
					poster : this.params.poster,
					subject : this.params.subject,
					contents : this.params.contents,
					password : hash,
					modDt : new Date(),
					idx : this.params.idx,
			};
			
			await sequelize.query(sql, {
				replacements,
				type : QueryTypes.UPDATE,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 삭제 
	*
	* @param Integer idx 게시글 번호 
	* @return Boolean 
	*/
	delete : async function(idx) {
		try {
			const sql = "DELETE FROM boarddata WHERE idx = ?";
			await sequelize.query(sql, {
				replacements : [idx],
				type : QueryTypes.DELETE,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 조회 
	*
	* @param Integer idx 게시글 번호 
	* @return Object
	*/
	get : async function(idx) {
		try {
			const sql = `SELECT a.*, b.memId, b.memNm FROM boarddata AS a 
										LEFT JOIN member AS b ON a.memNo = b.memNo 
								WHERE 
										a.idx = ?`;
			const rows = await sequelize.query(sql, {
					replacements : [idx],
					type : QueryTypes.SELECT,
			});
			
			const data = rows[0] || {};
			if (rows.length > 0) {
				data.id = data.boardId;
				
				// 게시판 설정 추가 
				data.config = await this.getBoard(data.boardId);
				const date = parseDate(data.regDt);
				data.regDt = date.datetime;
			}
			
			return data;
		} catch (err) {
			logger(err.stack, 'error');
			return {};
		}
	},
	/**
	* 게시글 목록 
	*
	* @param String boardId 게시판아이디
	* @param Integer page 페이지 번호, 기본값은 1 
	* @param Integer limit 1페이지당 출력 레코드 수 
	*
	* @return Object
	*/
	getList : async function(boardId, page, limit) {
		/*
		var pagination = require('pagination');
		var paginator = pagination.create('search', {prelink:'/', current: 1, rowsPerPage: 200, totalResult: 10020});
		console.log(paginator.render());
		*/
		
		page = page || 1;
		limit = limit || 20;
		
		const offset = (page - 1) * limit;
		let prelink = "/board/list/" + boardId;
		
		const replacements = {
			boardId,
		};
		let sql = `SELECT COUNT(*) as cnt FROM boarddata AS a 
								LEFT JOIN member AS b ON a.memNo = b.memNo 
							WHERE a.boardId = :boardId`;
		let rows = await sequelize.query(sql, {
			replacements, 
			type : QueryTypes.SELECT,
		});
		
		const totalResult = rows[0].cnt;
		const paginator = pagination.create('search', {prelink, current: page, rowsPerPage: limit, totalResult });
		
		
		replacements.offset = offset;
		replacements.limit = limit;
		sql = `SELECT a.*, b.memNm, b.memId FROM boarddata AS a 
							LEFT JOIN member AS b ON a.memNo = b.memNo 
						WHERE a.boardId = :boardId LIMIT :offset, :limit`;
		const list  = await sequelize.query(sql, {
			replacements,
			type : QueryTypes.SELECT,
		});	
		
		list.forEach((v, i, _list) => {
			_list[i].regDt = parseDate(v.regDt).datetime;
		});
		
		const result = {
			pagination : paginator.render(),
			list,
			offset, 
			page,
			totalResult,
			limit,
		};
		console.log(result);
		return result;
	},
};

module.exports = board;