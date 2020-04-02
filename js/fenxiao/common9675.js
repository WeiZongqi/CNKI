var el = $jq('#login_script');
var fx_uid = el.attr('fx_uid');
var priv_style_path = el.attr('priv_style_path');
//是否打开登录弹层
var is_force_open_login = el.attr('is_force_open_login');
//是否可以手工关闭
var is_hand_close_login = el.attr('is_hand_close_login');
//首页不会自动触发登录
var no_trigger_fx_login = el.attr('no_trigger_fx_login');

var st_timeout = null;
var flag_click = false;

//是否是电脑端
var isPc = IsPC();
if(!isPc) {
	$jq('.login-btn-fx').hide();
}
if(is_hand_close_login!=1){
	$jq('head').append('<style>.close-icon{display:none;}</style>');
}
$jq(".login-btn-fx").on('click', function(event) {
	if(flag_click == true){
		return false;
	}
    event.preventDefault();
    /* Act on the event */
    //自定页
    dialog_page();
	flag_click = true;
});
//分销uid
var fx_uid_obj = $jq('<div id="fx_uid_hidden" style="display:none;">'+fx_uid+'</div>');
$jq('body').append(fx_uid_obj);

if(is_force_open_login==1 && isPc && no_trigger_fx_login!=1){
	dialog_page();
}
function dialog_page() {
	$jq.ajax({
		url:'/create_weixin_concern_qrcode',
		type:'post',
		dataType:'json',
		data:{fuid:fx_uid,'unionid_page_id':$jq('#unionid_page_id').html()},
		success:function(res){
			if(!res.status){
				alert(res.info);
				return false;
			}
			layer.open({
	            type: 1,
	            skin: 'my-login', //样式类名
	            closeBtn: 0, //不显示关闭按钮
	            anim: 0,
	            title: false,
	            resize: false,
	            isOutAnim: false,
	            area: ['600px', '700px'],
	            shadeClose: true, //开启遮罩关闭
	            content: '<div class="login-box"><div class="close-icon"><a style="cursor:pointer;"><img src="'+priv_style_path+'/assets_v2/images/fenxiao/close_icon.png" alt=""></a></div><div class="login-cont"><div class="cont-title">手机扫码 安全登录</div> <div class="cont-img"><img src="'+res.data.get_img_url+'" width="296" height="296" alt=""></div> <div class="cont-btn"><img src="'+priv_style_path+'/assets_v2/images/fenxiao/wx_login_btn.jpg" width="300" height="50" alt=""></div> </div></div>',
	            success: function(dom, index) {
	            	if(is_hand_close_login==1){
		                $jq(".close-icon").click(function(event) {
		                    /* Act on the event */
		                    layer.close(index);
		                    flag_click = false;
		                    clearInterval(st_timeout);
		                });
	            	}else{
	            		$jq(".close-icon").hide();
	            		$('.layui-layer-shade').removeAttr('id');
	            		$('#layui-layer-shade1').unbind('click');
	            	}
					var login_box_width = $jq('.layui-layer-content').width()/2;
					var fram_width = $jq('.j_minilogin_iframe_fx').width()/2;
					var login_box_height = $jq('.layui-layer-content').height()/2;
					var fram_height = $jq('.j_minilogin_iframe_fx').height()/2;
					$jq('.j_minilogin_iframe_fx').css('left', login_box_width-fram_width);
					$jq('.j_minilogin_iframe_fx').css('top', login_box_height-fram_height+40);
					$jq('.j_minilogin_iframe_fx').show();
	            },
	            end:function(){
	            	$jq('.layui-layer-shade').unbind('click');
	            	flag_click = false;
	            }
	        });
		}

	});
}
function login_verify(){
	/* Act on the event */
	st_timeout = setTimeout(function(){
    	$jq.ajax({
    		url:'/login_verify',
    		type:'post',
    		data:{'unionid_page_id':$jq('#unionid_page_id').html()},
    		dataType:'json',
    		success:function(res){
    			if(res.status){
    				if(st_timeout) {
    					clearTimeout(st_timeout);
    				}
    				location.href = location.href;
    			}else{
    				login_verify();
    			}
    		},
    		error:function(){
    			login_verify();
    		}
    	});
	}, 2000);
}
if(is_force_open_login == 1 && isPc){
	login_verify();
}

//判断设备是否是电脑端 没有则不需要登录分销系统
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}