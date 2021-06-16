$(function() {
	if ($("#contents").length > 0) { // contents textarea가 존재하는 경우 에디터 로딩 
		CKEDITOR.replace("contents");
		CKEDITOR.config.height = 350;
	}
	
	/** 게시글 삭제 */
	$(".post_delete").click(function() {
		if (!confirm('정말 삭제하시겠습니까?')) {
			return;
		}
		
		const idx = $(this).data('idx');
		if (!idx) 
			return;
		
		axios.delete("/board/" + idx)
				.then((res) => {
					if (res.data.redirect) {
						location.href= res.data.redirect;
					} else if (res.data.error) {
						alert(res.data.message);	
					} else {
						location.href='/board/list/' + res.data.boardId;
					}
				})
				.catch((err) => {
					console.error(err);
				});
	});
	
	/** 댓글 수정 */
	$(".comment_list .update").click(function() {
		const idx = $(this).closest("li").data("idx");
		if (!idx) {
			return;
		}
		
		const url = "/board/comment/" + idx;
		layer.popup(url, 450, 450);
	});
	
	/** 이미지 업로드 */
	$(".upload_image").click(function() {
		var obj = $(this).closest("form").find("input[name='gid']");
		if (obj.length == 0) return;
		
		const gid = obj.val();
		if (gid == '') return;
		
		
		const url = `/file/upload/${gid}?mode=image`;
		layer.popup(url, 320, 250);
	});
	
	/** 이미지 에디터에 첨부 */
	$("body").on("click", ".file_box .addContents", function() {
		const fileUrl = $(this).closest(".file_box").data("url");
		const tag = `<img src='${fileUrl}'>`;
		CKEDITOR.instances.contents.insertHtml(tag);
	});
	
	/** 파일 삭제 */
	$("body").on("click", ".file_box .remove", function() {
		if (!confirm('정말 삭제하시겠습니까?')) {
			return;
		}
		
		const idx = $(this).closest(".file_box").data("idx");
		axios.get("/file/delete/" + idx)
			  .then((res) => {
				  console.log(res);
			  })
			  .catch((err) => {
				 console.error(err); 
			  });
	});
	
});

/**
* 파일 업로드 콜백 
*
* @params Object data 파일 업로드 후 데이터 
*/
function fileUploadCallback(data) {
	if (data) {
		if (data.mimeType.indexOf('image') != -1 && $("#contents").length > 0 && !data.isAttached) { // 에디터에 이미지 첨부 
			const tag = `<img src='${data.fileUrl}'>`;
			CKEDITOR.instances.contents.insertHtml(tag);
			
			const html = `<span class='file_box' data-idx='${data.idx}' data-url='${data.fileUrl}'>
						<a href='/file/download/${data.idx}' target='ifrmHidden'>${data.fileName}</a>
						<i class='remove xi-file-remove'></i>
						<i class='addContents xi-upload'></i>
						</span>`;

			$(".uploaded_images").append(html);
			
			layer.close();
		}
	}
}