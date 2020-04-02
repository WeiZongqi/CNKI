/*
弹出插件 AND 分享插件
autho：smohan
http://www.smohan.net
*/

//这是弹出层，IE9以下无法圆角
;(function($){$.fn.SmohanPopLayer=function(options){var Config={Shade:true,Event:"click",Content:"Content",Title:"Smohan.net"};var options=$.extend(Config,options);var layer_width=$('#'+options.Content).outerWidth(true);var layer_height=$('#'+options.Content).outerHeight(true)+80;
var layer_top=(layer_height+40)/2;if($(document).width() >=2037){var resize_width=500;}else if($(document).width()<2037 && $(document).width() >=1695){var resize_width=400;}else if($(document).width() <1507 && $(document).width()>=1056){var resize_width=280;}else if($(document).width() <1695 && $(document).width()>=1507){var resize_width=200;}else{var resize_width=155;} var layer_left=(layer_width+40)/2;var load_left=(layer_width-36)/2;var load_top=(layer_height-100)/2;var layerhtml="";if(options.Shade==true){layerhtml+='<div class="Smohan_Layer_Shade" style="display:none;"></div>';}
layerhtml+='<div class="Smohan_Layer_box" style="width:'+(layer_width+resize_width+20)+'px;height:'+(layer_height+40)+'px; margin-top:-'+layer_top+'px;margin-left:-'+layer_left+'px;display:none;" id="layer_'+options.Content+'">';layerhtml+='<h3><b class="text">'+options.Title+'</b><a href="javascript:void(0)" class="close"></a></h3>';layerhtml+='<div class="layer_content">';layerhtml+='<div class="loading" style="display:none;left:'+load_left+'px;top:'+load_top+'px;"></div>';layerhtml+='<div id="'+options.Content+'" style="display:block;">'+$("#"+options.Content).html()+'</div>';layerhtml+='</div>';layerhtml+='</div>';$('body').prepend(layerhtml);if(options.Event=="unload"){$('#layer_'+options.Content).animate({opacity:'show',marginTop:'-'+layer_top+'px'},"slow",function(){$('.Smohan_Layer_Shade').show();$('.Smohan_Layer_box .loading').hide();});}else{$(document).on(options.Event,'.share',function(e){shared();if($('#Share').css('display') == 'none'){$('#Share').show();$('.upload_img_input').hide();};$('#layer_'+options.Content).animate({opacity:'show',marginTop:'-'+layer_top+'px'},"slow",function(){$('.Smohan_Layer_Shade').show();$('.Smohan_Layer_box .loading').hide();});});}
$('.Smohan_Layer_box .close').click(function(e){$('.Smohan_Layer_box').animate({opacity:'hide',marginTop:'-300px'},"slow",function(){$('.Smohan_Layer_Shade').hide();$('.Smohan_Layer_box .loading').show();/*alert(123);*/});});};})(jQuery);

//分享	
var sevice_html = "";
$(document).ready(function(e) {
	
	var share_html = "";
	//share_html += '<a href="javascript:void(0)" id="smohan_share" title="分享"></a>';
	share_html += '<div id="Share"><ul>';
	/*share_html += '<li title="分享到QQ空间"><a href="javascript:void(0)" class="share1"></a><span></span></li>';
	share_html += '<li title="分享到微信"><a href="javascript:void(0)" class="share6"></a><span></span></li>';
	share_html += '<li title="分享到新浪微博"><a href="javascript:void(0)" class="share2"></a><span></span></li>';
	share_html += '<li title="分享到人人网"><a href="javascript:void(0)" class="share3" ></a><span></span></li>';
	share_html += '<li title="分享到朋友网"><a href="javascript:void(0)" class="share4"></a><span></span></li>';
	share_html += '<li title="分享到腾讯微博"><a href="javascript:void(0)" class="share5"></a><span></span></li>';
	share_html += '</ul><span style="display: inline-block;text-align: center;width: 100%;margin-top: 12px;font-size:15px;color:#503B3B;cursor :pointer;" id="hasshared" onclick="shared()">分享完成点击这里，上传分享截图领取优惠券。</span></div>';*/
	$('body').prepend(share_html);
  (!!$(".qrcode").length || $('body').append($('<div id="qrcode_img" class="qrcode none"></div>')));
    /*调用方法 start*/

    $('.share').SmohanPopLayer({Shade : true,Event:'click',Content : 'Share', Title : '上传分享截图，领取优惠券.（优惠券仅适用于微信、支付宝支付）'});
    
    /*调用方法 end*/


    $('#Share li').each(function() {
    $(this).hover(function(e) {
	  $(this).find('a').animate({ marginTop: 2}, 'easeInOutExpo');
	  $(this).find('span').animate({opacity:0.2},'easeInOutExpo');
	 },function(){
	  $(this).find('a').animate({ marginTop: 12}, 'easeInOutExpo');
	  $(this).find('span').animate({opacity:1},'easeInOutExpo');
   });
});
var share_url = encodeURIComponent(location.href);
var share_title = encodeURIComponent(document.title);
var share_pic = "http://www.jq22.com/img/cs/500x300b.png";  //默认的分享图片
var share_from = encodeURIComponent("jQuery插件库"); //分享自（仅用于QQ空间和朋友网，新浪的只需更改appkey 和 ralateUid就行）
//Qzone
$('#Share li a.share1').click(function(e) {
    window.open("https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+share_url+"&sharesource=qzone&title="+share_title+"&summary=官网授权，正品保障，职称论文杂志社定稿检测","newwindow");
});	  
//Sina Weibo
$('#Share li a.share2').click(function(e) {
var param = {
    url:share_url ,
    appkey:'678438995',
    title:'官网授权，正品保障，职称论文杂志社定稿检测',
    pic:$('#logo_pic').attr('src'),
    ralateUid:'3061825921',
    rnd:new Date().valueOf()
  }
  var temp = [];
  for( var p in param ){
    temp.push(p + '=' + encodeURIComponent( param[p] || '' ) )
  }
window.open('http://v.t.sina.com.cn/share/share.php?' + temp.join('&'));	
});
//renren
$('#Share li a.share3').click(function(e) {
window.open('http://widget.renren.com/dialog/share?resourceUrl='+share_url+'&title='+share_title+'&images='+share_pic+'','newwindow');
});
//pengyou
$('#Share li a.share4').click(function(e) {
window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url='+$('#logo_pic').attr('src')+'&pics='+share_pic+'&title='+share_title+'&site='+share_from+'','newwindow');
});
//tq
$('#Share li a.share5').click(function(e) {
window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title='+share_title+'&site='+share_from+'&pic='+share_pic+'&url='+share_url+'','newwindow');
});
//kaixin
$('#Share li a.share6').click(function(e) {
    if(!$('#qrcode_img img').length){
      var qrcode = new QRCode(document.getElementById("qrcode_img"), {
        text: decodeURIComponent(share_url),
        width: 180,
        height: 180,
        colorDark : "#7CBDD0",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
    }
    
    !!$('.qrcode_msg').length || $("#qrcode_img").append('<p class="t_c qrcode_msg" style="margin-top:15px;">点击右上角【...】开始分享</p><a class="weixin_close" style="margin-top:15px;" href="javascript:;">暂不分享</a>')
    $('.Smohan_Layer_box').animate({
      'margin-top' : '-200px',
    }).fadeOut(300)
    $("#qrcode_img").fadeIn(0);
}); 
});
$(document).delegate(".weixin_close",'click',function(){
    $('.qrcode,.Smohan_Layer_Shade').fadeOut(300);

});
$('#Share').hide();
function shared() {
	var auto_audit_time = $("#hidden_params").attr("auto_audit_time");
	if(auto_audit_time == 0) {
		var des = "审核通过即得到优惠券！";
	} else {
		var des = auto_audit_time+"分钟可得立减优惠券，然后刷新页面提交可立减。";
	}
	$('.layer_content').after($('.upload_img_input'));
	if($('.upload_img_input').css('display') == 'none') {
		$('.upload_img_input').show();
	}
	$('.upload_img_input').css('z-index', '1');
	$('.upload_img_input').height('100px');
	$('.upload_img_input').find('.ico07').css('background', 'none')
	$('.upload_img_input').css('position', 'absolute');
	$('.upload_img_input').css('left','-3rem');
	$('.upload_img_input').css('top','3rem');
	if(!$('.selected-all').length || $('.Smohan_Layer_box').css('display') == 'none'){
		var share_desc_text = "这家的论文检测价格不贵，能验证真伪，我试了不错："+$CONFIG['agent_domain'];
		if($('#share_desc_text').text() != ''){
			share_desc_text_list = JSON.parse($('#share_desc_text').text());
			var has_dedicated_rule = false;
			$.each(share_desc_text_list,function(key,val){
				if(val.type == $CONFIG['check_type']) {
					has_dedicated_rule = true;
					share_desc_text = val.share_desc;
				}
				if(has_dedicated_rule == false && val.type==0) {
					share_desc_text = val.share_desc;
				}
			});
			if(share_desc_text.indexOf("{money}") >= 0) {
				var reg = new RegExp("{money}","g");
				share_desc_text = share_desc_text.replace(reg,$CONFIG['coupon_rule_money']);
			}
			if(share_desc_text.indexOf("{url}") >= 0) {
				var host_cur = location.href;
				var reg = new RegExp("{url}","g");
				share_desc_text = share_desc_text.replace(reg, host_cur);;
			}
			if(share_desc_text.indexOf("{service}") >= 0) {
				var host_cur = location.href;
				sevice_html = share_desc_text;
				var reg = new RegExp("{service}","g");
				share_desc_text = share_desc_text.replace(reg, $CONFIG['type_desc']);
			}
		}
		$('.copy-succ-text').remove();
		$('.btn-copy').remove();
		$('#copy_text_p').remove();
		$('#share-text').remove();
		$('.layer_content').css('position','relative');
		$('.layer_content').append('<c style="position: absolute;display:none;top:81px;width: 96px;left: 457px;z-index: 99;line-height: 35px;" class="btn copy-succ-text">复制成功</c>');
		$('.layer_content').append('<c style="color: white;position: absolute;top:123px;display:none;width: 96px;z-index: 99;font-size: 15px;line-height: 35px;background: #4ac711;border-radius: 4px;" class="btn btn-copy" data-clipboard-action="copy" data-clipboard-target="#share-text">复制</c>');
		$('.layer_content').append('<p id="copy_text_p" style="text-align: center;margin-top:-99px;font-size:14px;position:absolute;z-index:2;margin-left: 7px;text-align:left;line-height: 20px;">复制下面文字，发到班级群、bbs、贴吧等，截图上传，'+des+'<span style="color:blue;"></span></p>');
		$('.layer_content').append('<textarea  onfocus="focus_textarea()"  rows="6" id="share-text" cols="60" class="selected-all" onclick="selectall(this)" style="padding-left: 9px;padding-right: 5px;padding-top: 5px;position: absolute;letter-spacing: 2px;line-height: 17px;word-wrap:break-word;word-break:break-all;left: 8px;top: 62px;border: 1px solid #e6e6e6;z-index: 36;margin-top: 15px;">'+share_desc_text+'</textarea>');
		var timer = setInterval(function(){
			var left_width_copy_btn = $('textarea').width()+40;
			$('.btn-copy').css('left',left_width_copy_btn+'px');
			$('.btn-copy').show();
			if($('.btn-copy').css('display') == 'block'){
				$('.copy-succ-text').css('left',left_width_copy_btn+'px');
				clearInterval(timer);
			}
		},100);
	}
}
var timer = setInterval(function(){
	var left_width_copy_btn = $('textarea').width()+40;
	$('.btn-copy').css('left',left_width_copy_btn+'px');
	$('.btn-copy').show();
	if($('.btn-copy').css('display') == 'block'){
		$('.copy-succ-text').css('left',left_width_copy_btn+'px');
		clearInterval(timer);
	}
},100);
function focus_textarea(){
	$('#share-text').select();
}
$('.selected-all').click(function(){
    var text=this;
    if(window.getSelection().toString().length>0){
        return false;
    }else{
        if (document.body.createTextRange) {
                var range = document.body.createTextRange();
                range.moveToElementText(text);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(text);
                selection.removeAllRanges();
                selection.addRange(range);
             
            } else {
                alert("none");
            }
    }
    
})

function selectall(obj){
	var text=obj;
    if(window.getSelection().toString().length>0){
        return false;
    }else{
        if (document.body.createTextRange) {
                var range = document.body.createTextRange();
                range.moveToElementText(text);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(text);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                alert("none");
            }
    }
}

setTimeout(function(){
	if(document.cookie.indexOf('user_id')<0 || document.cookie.indexOf('unionid')<0) {
		if($('#share_guide').find('span').hasClass('share')) {
			$('#share_guide').find('span').removeClass('share');
		}
		$('#share_guide').find('span').html('登录分享得优惠券');
	}else{
		$('#share_guide').find('span').addClass('share');
		$('#share_guide').find('span').html('上传分享截图得优惠券');
	}
	if($CONFIG['is_open_coupon'] == 1 && $CONFIG['is_have_coupon_rule']==1) {
		$('#share_guide').show();
	}
}, 200);
$('#share_guide').find('span').click(function(){
    $(window).trigger("resize");
	if(document.cookie.indexOf('user_id')<0 || document.cookie.indexOf('unionid')<0) {
		$('#page_mask').fadeIn();
		$('#coupon_img_right').trigger('click');
	}else{
		var share_desc_text = $('#share_desc_text').text();
		if(sevice_html != ""){
			share_desc_text = sevice_html;
		}
		if(share_desc_text.indexOf("{service}") >= 0) {
			var reg = new RegExp("{service}","g");
			share_desc_text = share_desc_text.replace(reg,$CONFIG['type_desc']);
			$('.selected-all').val(share_desc_text);
		}
	}
});
var clipboard = new Clipboard('.btn');
clipboard.on('success', function(e) {
    $('.copy-succ-text').fadeIn();
    $('.copy-succ-text').fadeOut(2000);
});

clipboard.on('error', function(e) {
    console.log(e);
});