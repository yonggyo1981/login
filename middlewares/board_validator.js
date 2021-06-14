const { alert } = require("../lib/common");
const logger = require('../lib/logger');
const board = require('../models/board');
/**
* 게시판 유효성 검사 미들웨어
*
*/

/** 게시글 작성 - POST, 수정 - PATCH */
module.exports.writeValidator = (req, res, next) => {
	const required = {
		id : '잘못된 접근입니다', 
		subject : '제목을 입력해 주세요.',
		poster : '작성자를 입력해 주세요.',
		contents : '내용을 입력해 주세요.',
	};
	
	// 글 수정시 추가 필수 컬럼
	if (req.method == "PATCH") {
		required.idx = "잘못된 접근입니다.";
	}
	
	// 비회원은 수정, 삭제 비밀번호가 필수 항목 */
	if (!req.isLogin) {
		required.password = '게시글 수정, 삭제 비밀번호를 입력하세요.';
	}
	
	try {
		for (column in required) {
			if (!req.body[column]) {
				throw new Error(required[column]);
			}
		}
	} catch(err) {
		return alert(err.message, res);
	}
	
	next();
};

/** 
* 게시글 수정, 삭제 권한 체크 
* - 회원인 경우는 본인이 작성한 게시글(회원 번호가 같은 경우)
* - 비회원인 경우는 수정, 삭제 비밀번호 확인이 된 경우 
*/
module.exports.permissionCheck = async (req, res, next) => {
	try {
		const idx = req.params.idx || req.query.idx || req.body.idx;
		
		if (!idx) {
			throw new Error('게시글 번호가 없습니다.');
		}
		
		const data = await board.get(idx);

		if (!data.idx) {
			throw new Error('존재하지 않는 게시글입니다.');
		}
		if (data.memNo) { // 회원이 쓴 게시글인 경우는 로그인한 회원번호가 일치 하는지 체크 
			if (data.memNo != req.session.memNo) {
				let msg = "";
				if (req.method == 'GET' || req.method == 'PATCH') { // 수정 
					msg = "수정 권한이 없습니다.";
				} else if (req.method == "DELETE") { // 삭제 
					msg = "삭제 권한이 없습니다.";
				}
				throw new Error(msg);
			}
		} else { // 비회원인 경우는 req.session[board_qna_게시글 번호] = true 면 비밀번호 인증 완료
		    const key = `board_qna_${idx}`;
			const keyUrl = key+"_url";
			if (!req.session[key]) { // 비밀번호 인증이 안된 경우는 게시글 비밀번호 확인
				/**
					비밀번호 인증 후 수정 -> 게시글 보기 
					비밀번호 인증 후 삭제 -> 게시글 목록 
				*/
				if (req.method == 'GET' || req.method == 'PATCH') { // 게시글 수정 
					req.session[keyUrl] = '/board/view/' + idx;
				} else if (req.method == 'DELETE') { // 게시글 삭제 
					req.session[keyUrl] = '/board/list/' + data.boardId;
				}
				
			 	return res.redirect("/board/password/" + idx);
			}
		}
		
	} catch (err) {
		logger(err.stack, 'error');
		return alert(err.message, res, -1);
	}
	
	next();
};

/**
* 비회원 게시글만 수정, 삭제시 비밀번호 확인이 필요하므로
* 비회원 게시글인지 체크 
*
*/
module.exports.guestOnly = async (req, res, next) => {
	try {
		const idx = req.params.idx || req.query.idx || req.body.idx;
		const data = await board.get(idx);
		if (data.memNo > 0) {
			
		}
	
	} catch (err) {
		logger(err.stack, 'error');
		return alert(err.message);
	}
	next();
};