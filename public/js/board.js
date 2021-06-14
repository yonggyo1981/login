$(function() {
	if ($("#contents").length > 0) { // contents textarea가 존재하는 경우 에디터 로딩 
		CKEDITOR.replace("contents");
		CKEDITOR.config.height = 350;
	}
	
	/** 게시글 삭제 */
	$(".post_delete").click(function() {
		const idx = $(this).data('idx');
		if (!idx) 
			return;
		
		axios.delete("/board/" + idx)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.error(err);
				});
	});
});