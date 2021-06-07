const querystring = require('querystring');
/**
* 네이버 로그인 
*
*/
const naverLogin = {
	clientId : 'P78Vj1Hp_UBEisn_PtLq',
	secret : 'gUFQ5V8mFP',
	redirectUri = 'http://code-factory.co.kr:3000/member/login_callback';
	
	/** 
	* code 발급 요청 URL 
	*
	*/
	getCodeUrl : function() {
		const params = {
			response_type : 'code',
			client_id : this.clientId,
			redirect_uri : this.redirectUri,
			state : new Date().getTime(),
		};
		
		const url = "https://nid.naver.com/oauth2.0/authorize?" + querystring.stringify(params);
	
		return url;
	},
};

module.exports = naverLogin;