var uploader;
function couponUpload() {
	//初始化Web Uploader
	uploader = WebUploader.create({
	    auto: true,
	    swf: 'http://css.celunwen.com/assets_v2/js/common/Uploader.swf',
	    server: $CONFIG['agent_domain'] + '/upload_share_img',
	    pick: '#filePicker',
	    method: 'POST',
	    formData: {"check_type":$CONFIG['check_type']},
	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
	        mimeTypes: 'image/*'
	    },
	    duplicate :true,
	    fileSingleSizeLimit:10485760,
	});
	uploader.on('fileQueued', function(file) {
		if(document.cookie.indexOf('user_id')<0 || document.cookie.indexOf('unionid')<0) {
			alert('请先登录，再上传分享截图领取优惠券');
			$('.close').trigger('click');
			setTimeout(function(){
				$('#coupon_img_right').trigger('click');
			},600);
			return false;
		}else{
			$('#filePicker').addClass('schedule').find('.webuploader-pick').html('等待上传');
			$('.coupon_error').html("");
		}
	
	});
	uploader.on('error', function(type) {
	    if (type === 'F_EXCEED_SIZE') {
	    	$('.coupon_error').html('图片过大，上传图片大小不超过10M');
	    } else if (type === 'Q_TYPE_DENIED') {
	        $('.coupon_error').html('图片格式不正确');
	    }
	});
	//文件上传过程中创建进度条实时显示。
	uploader.on('uploadProgress', function(file, percentage) {
		if(document.cookie.indexOf('user_id')<0 || document.cookie.indexOf('unionid')<0) {
			return false;
		}else{
		    $('#filePicker').find('.webuploader-pick').html((parseInt(percentage)*100)+'%');
		    if(parseInt(percentage)*100 == 100) {
		    	$('#filePicker').removeClass("schedule").addClass("success").find('.webuploader-pick').text('已上传');
		    }
		}
	});
	uploader.on('uploadSuccess', function( file,response) {
		if(!response.status) {
			$('#filePicker').removeClass("success").find('.webuploader-pick').text('开始上传');
			alert(response.info);
			return false;
		}else{
			if($('.uploader-list-paper').find('.item').hasClass('item')){
				$('.uploader-list-paper').find('.item').remove();
			}
			$('.uploader-list-paper').append('<div id="' + file.id + '" class="item">' +
		            '<p class="info"><span class="paperDoc">'+file.name+'</span>' +
		            '<a  class="cancel cancelCoupon"><img src="//css.celunwen.com/assets_v2/images/right/del.png" /></a></p>'+
		            '</div>');
			$('.cancelCoupon').bind('click', function(){
				$('.uploader-list-paper').find('.item').remove();
				$('#filePicker').removeClass("success").find('.webuploader-pick').text('上传分享截图');
			});
			var auto_audit_time = $CONFIG['auto_audit_time'];
			if(auto_audit_time > 0) {
				alert('上传分享截图后大约'+auto_audit_time+'分钟后会通过审核，而后提交检测会立减。');
			}else{
				alert('上传分享截图后大约几分钟后会通过审核，而后提交检测会立减。');
			}
		}
	});
}
couponUpload();