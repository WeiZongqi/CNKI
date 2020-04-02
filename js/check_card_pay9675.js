var webUrl = $CONFIG['agent_domain'];
var chktype = $CONFIG['check_type'];
var myPayType = '';
var tid = '';
var inputVal = '';
var cardId = '';
var cardItem = '';
var totle = '';
var card_type = '';
var original_price = "";
var payMethodBtnObj = '';
var page_id = $CONFIG['page_id'];
var ITEM_CARD = 1;
try{
	var card_id = getUrlParam('card_id').replace(/\s/g,"");
}catch(e){
	var card_id = getUrlParam('card_id');
}
var tb_buy_card_url = $CONFIG['buy_card_tb_url'];
var PAY_TYPE_TAOBAO = 0;
var qrcode ,
    timerSet = -1,
    timerInt = -1,
    timerRefresh = -1,
    startTime = $CONFIG['pay_query_start_time'], //二维码生成之后几秒查询
    expireTime = $CONFIG['qrcode_expire_time'], //二维码多长时间过期
    payInterval = $CONFIG['pay_query_interval'];//查询支付情况;

$(".already-buy").css('left',($(window).width() - $(".already-buy").outerWidth()) / 2 +'px');
$(".already-buy").css('top',($(window).height() - $(".already-buy").outerHeight()) /3 +'px');

function bindEventCheckCard(){
	$(".buy-way").unbind('click');
    $(".buy-way").on('click',function(){
    	
    	$('.tb-btn').attr('src','http://css.celunwen.com/assets_v2/images/right/tb.png');
        $('.wx-btn').attr('src','http://css.celunwen.com/assets_v2/images/right/wx.png');
        $('.zfb-btn').attr('src','http://css.celunwen.com/assets_v2/images/right/zfb.png');
        $('.tb-name').css('color','rgb(173,173,173)');
        $('.wx-name').css('color','rgb(173,173,173)');
        $('.zfb-name').css('color','rgb(173,173,173)');

        payMethodBtnObj = this;
        tid = '';
        cardItem = $(this).parents('.card-item');
        cardItem.find(".promptText").hide();
        cardItem.find(".promptText").children().hide();
        clearTimeout(timerRefresh);
        clearTimeout(timerSet);
        clearInterval(timerInt);
        if(typeof(timerPage) != undefined) {
        	try{clearInterval(timerPage);}catch(err){}
        }
        
        for(var i = 1; i < 100; i++) {
			clearInterval(i);
		}

        cardId = $(this).parents('.card-item').attr('id');
        $(".jiantou").hide();
        $(".pay-card-item").hide();
        $(this).find('.jiantou').show();
        if($(this).attr('data') == 0){
        	 $(this).find('.tb-btn').attr('src','http://css.celunwen.com/assets_v2/images/right/tb_hover.png');
             $(this).find('.tb-name').css('color','#ff5500');
            myPayType = 0;
            $(this).parents('.card-item').find('.tb').show();
        }
        if($(this).attr('data') == 2){
        	$(this).find('.wx-btn').attr('src','http://css.celunwen.com/assets_v2/images/right/wx_hover.png');
            $(this).find('.wx-name').css('color','#05b411');
            myPayType = 2;
            totle = $('#moneyOutter').find('span').text();
            card_type = $(this).parents('.card-item').find('.wx .money .card_type').text();
            original_price = $(this).parents('.card-item').find('.wx .money .original_price').text();
            var objData = {
                "item_type": ITEM_CARD,
                "type":card_type,
                "pay_type": myPayType,
                "total_fee": totle,
                "page_id": page_id,
                "total_money":original_price,
            };
            checkMoneyIsEnough(this,objData);
            $(this).parents('.card-item').find('.wx').show();
        }
        if($(this).attr('data') == 3){
        	$(this).find('.zfb-btn').attr('src','http://css.celunwen.com/assets_v2/images/right/zfb_hover.png');
            $(this).find('.zfb-name').css('color','#009fe8');
            myPayType = 3;
            totle = $('#moneyOutter').find('span').text();
            card_type = $(this).parents('.card-item').find('.wx .money .card_type').text();
            original_price = $(this).parents('.card-item').find('.wx .money .original_price').text();
            var objData = {
                "item_type": ITEM_CARD,
                "type":card_type,
                "pay_type": myPayType,
                "total_fee": totle,
                "page_id": page_id,
                "total_money":original_price,
                
            };
            checkMoneyIsEnough(this,objData);
            $(this).parents('.card-item').find('.zfb').show();
        }
    });
//还差一个点击刷新的二维码的时候，刷新二维码
    $(".refreshPay").bind("click", function() {
        var _that = $(this);
        _that.hide();
        _that.parents('.promptText').hide();
        clearTimeout(timerSet);
        clearInterval(timerInt);
        clearTimeout(timerRefresh);

        var objData = {
            "item_type": ITEM_CARD,
            "type":card_type,
            "pay_type": myPayType,
            "total_fee": totle,
            "page_id": page_id,
            "total_money":original_price,
        };
        checkMoneyIsEnough(payMethodBtnObj, objData);
        countDown();
    });
    
//故障订单的编号
    $(".testTip").on("keyup",function(e){
        inputVal= $.trim($(this).val());
        if(MOD.taobaoTid($(this),inputVal)){
            var obj={"pay_type":myPayType,"tid":inputVal};
            testTip($(this),obj)
            $(this).css("border-color", "rgb(69, 181, 73)");
        }else{

            $(this).parents(".pay-card-item").find(".rules").show().html("请输入17位故障订单编号")
        }
    });

//故障订单的编号
    $(".byCardSubmit").on("click",function(e){
        var obj = {};
        obj['id'] = cardId;
        obj['pay_type'] = myPayType;
        obj['tid'] = tid;
        obj['card_id'] = card_id;
        buyCard(obj);
    });
    $(".searchCardBtn").on('click',function(){
        searchCard();
    });
    $(".i-know").on('click',function(){
        $('.already-buy').hide();
        $('#mask').hide();
    });
}
bindEventCheckCard();
function showOrderExample(obj){

	if($(obj).parent().parent().parent().find('.tb-tip').is(":hidden")){
		$(obj).parent().parent().parent().find('.tb-tip').show();
	}else{
		$(obj).parent().parent().parent().find('.tb-tip').hide();	
	}
}
function searchCard(){
    var obj = {};
    obj['tid'] = $("#searchCarId").val();
    var url = webUrl+"/reward/get_card_info";
    $.ajax({type:"post",async:true,cache:false, url:url, data:obj,
        success:function(jsondata){

            var jsondata = JSON.parse(jsondata);
            if(jsondata.status){
                var data = jsondata.data;
                insertSearchUI(data);
                $('.already-buy').show();
                $('#mask').show();
            }else{
                MOD.alertFn3("提示", jsondata.info, "确定");
            }
        },
        error : function(){
            MOD.alertFn3("提示", '查询失败', "确定");
        }
    })
}
function insertSearchUI(data){
    var info=data.type;
    if(data.card_type == 0) info="全局";
    
    var check_price = "实时价格";
    if(data.unit_num >0 && data.unit_price > 0) {
        check_price = data.unit_price+"元 / "+data.unit_num+data.unit_name;
    }
    
    var con = [];
    con.push('<div class="already-item">');
    con.push('<div class="img">');
    con.push('<img src="http://css.celunwen.com/assets_v2/images/card/card.png">');
    con.push('</div>');
    con.push('<div class="text">');
    con.push('<div class="test-card-title">'+info+'检测卡</div>');
    con.push('<div class="description" style="color:rgb(252,90,92);">面额： '+data.total_money+ '元 / 余额:'+data.remain_money+'元</div>');
    con.push('<div class="" style="color:rgb(252,90,92);font-size:16px">优惠价格： '+check_price+'</div>');
    con.push('<div class="date">有效期至'+data.expire_time+'</div>');
    con.push('</div>');
    con.push('<div class="password-dev">');
    con.push('<div class="already-money">已购买：'+data.pay_money+'元</div>');
    con.push('<div class="account">账号：'+data.card_id+'</div>');
    con.push('<div class="password">密码：'+data.card_password+'</div>');
    con.push('</div>');
    con.push('</div>');
    $("#mask").css("z-index",8);

    $('.already-buy-list').html(con.join(''));
}
function getUrlParam(paramname) {
    //构造一个含有目标参数的正则表达式对象
    var reg=new RegExp("(^|&)"+ paramname +"=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg); 
    //返回参数值
    if (r!=null) return unescape(r[2]); return null; 
}
function buyCard(obj){
    var is_recharge = $("#is_recharge").val();
    var pay_money = $("#need_recharge_money").html();
    try{
    	var card_id = getUrlParam('tid').replace(/\s/g,"");
    }catch(e){
    	var card_id = getUrlParam('tid');
    }
    if(is_recharge) {
        obj['card_id'] = $('#cardAccount').val().replace(/\s/g,"");
        obj['is_recharge'] = is_recharge;
        obj['need_recharge'] = $('#moneyOutter').find('span').text();
        var url = webUrl+"/reward/card_recharge";
        $.ajax({
            type:"post",
            async:true,
            cache:false,
            url:url, 
            data:obj,
            success:function(jsondata){
              var jsondata = JSON.parse(jsondata);
              var data = jsondata.data;
              if(jsondata.status){
            	  $('#qrcodeMp').height('130px');
              	  $('#paySuccessAlt').hide();
            	  $('#card_recharge_tid').remove();
            	  $('body').append('<div style="display:none;" id="card_recharge_tid">'+obj.tid+'</div>');
            	  
            	  $('#payLessAlert').remove();
             	  $('#payMethodId').remove();
             	  $('#qrcodeMp').remove();
             	  if(chktype==3 || chktype==4 || chktype==8 || chktype==9 || chktype==25) {
             		 $('.submitUpload').trigger('click');
             	  } else {
             		 $('.submitBtn').trigger('click');
             	  }
             	  $('.model.dbLayModel1').css('visibility', 'hidden');
             	  $('.btn.selected.btnSelected').trigger('click');
             	  $('.model.dbLayModel1').css('visibility', 'unset');
             	  $('#subbtn').show();
              }else{
            	  $('#qrcodeMp').height('167px');
            	  $('#paySuccessAlt').html(jsondata.info);
              	  $('#paySuccessAlt').show();

            	   MOD.alertFn("提示",jsondata.info,"<span id='buyCardBtnSpErr' style='display:inline-block;width:100%;height:100%;'>确定</span>");
                   MOD.alertFn3("提示", jsondata.info, "确定");
                    $("#buyCardBtnSpErr").on('click',function(){
              			$("#mask,.model").fadeOut();
              		});
              }
              
              clearTimeout(timerRefresh);
              clearTimeout(timerSet);
              clearInterval(timerInt);
              
              if(typeof(timerPage) != undefined) {
              	try{clearInterval(timerPage);}catch(err){}
              }
              
              
            },
            error : function(){
            	clearTimeout(timerRefresh);
                clearTimeout(timerSet);
                clearInterval(timerInt);
                if(typeof(timerPage) != undefined) {
                	try{clearInterval(timerPage);}catch(err){}
                }
            }
        });
    } else {
        var url = webUrl+"/reward/buy_card";
        $.ajax({type:"post",async:true,cache:false, url:url, data:obj,
            success:function(jsondata){
              var jsondata = JSON.parse(jsondata);
              var data = jsondata.data;
              if(jsondata.status){
                  if(jsondata.data.pay_type == PAY_TYPE_TAOBAO) {
                      MOD.alertFn3("提示", "淘宝拍单需先确认收货,再根据订单号查询检测卡信息", "确定");
                  } else {
                      $(".testTip").val('');
                      $(".byCardSubmit").addClass('disabled');
                      $(".byCardSubmit").attr("disabled",'true');
                      insertSearchUI(data);
                      $('.already-buy').show();
                      $('#mask').show();
                  }
              }else{
                  MOD.alertFn3("提示", jsondata.info, "确定");
              }
            },
            error : function(){
                
            }
        })
    }
    
}

 //生成二维码
function scanPaymentCheckCard(ele,obj2){
    obj2.cardid = $("#cardAccount").val();
    obj2.type = chktype;

    var is_recharge = $("#is_recharge").val();
	if(is_recharge) {
	    obj2.card_id = $('#cardAccount').val().replace(/\s/g,"");
	    obj2.need_recharge = $('#moneyOutter').find('span').text();
	}
    $.ajax({type:"post",async:true,cache:false, url:webUrl+"/make_pay_qrcode", data:obj2,
        success:function(jsondata){
          jsondata=JSON.parse(jsondata);
          var contEle=$(".zf_cont[payList='"+myPayType+"']");
          if(jsondata.status){
        	  $('.errorInfo').hide();
        	  $('#qrcodeOutter').show();
              var dataList=jsondata.data;
              var qrcodeId=getQrcode(ele);
              var qrCodeUrl=dataList.qrcode_url;
              tid=dataList.tid;
              //清除上次二维码
              if(qrcode){
                  qrcode.clear();
              }
              //生成二维码
              qrcode = new QRCode('qrcodeOutter', {
            	  render : "canvas",
                  width : 90,//设置宽高
                  height : 90,
                  text:qrCodeUrl,
                  src: 'http://www.celunwen.com/images/zhifubao_logo.jpg',
              });
              //payLogoImg
              if(obj2.pay_type==2){
            	  $('#payLogoImg').attr('src', '/images/weixin_zhifu_logo.jpg');
              }else if(obj2.pay_type==3){
            	  $('#payLogoImg').attr('src', '/images/zhifubao_logo.jpg'); 
              }
              $('#payLogoImg').show();
              countDown();
              timerRefresh = window.setTimeout(function() {
                  clearTimeout(timerSet);
                  clearInterval(timerInt);
                  $(ele).parents('.card-item').find(".promptText").children().hide();
                  $(ele).parents('.card-item').find(".promptText,.refreshPay").show();
                  //MOD.alertFn3("提示", '超时', "确定");
              }, Number(expireTime) * 1000)
          }else{
        	  $('#qrcodeOutter').hide();
        	  $('.payError').html(jsondata.info)
        	  $('.errorInfo').show();
          }
        }
    })
}

// 查询支付结果
function getPayResultCrad(){
    var objData={"tid":tid,"pay_type":myPayType};
    $.ajax({
        type: "post",
        cache: false,
        url: webUrl + "/check_pay_result",
        data: objData,
        success: function (jsondata) {
            var contEle = $(".zf_cont[payList='" + myPayType + "']");
            jsondata = JSON.parse(jsondata);
            var msg = jsondata.info;
            alertMsg = msg;
            if (jsondata.status) {
                if (jsondata.data.pay_status == "SUCCESS") { //状态为成功时，清楚定时任务等操作
                    // tid = isTid;
                	$('#qrcodeMp').height('167px');
                	$('#paySuccessAlt').show();
                	setTimeout(function(){
                		clearTimeout(timerRefresh);
                        clearTimeout(timerSet);
                        clearInterval(timerInt);
                        for(var i=1;i<100;i++) {
                			clearInterval(i);
                		}
                        cardItem.find(".refreshPay,.faultPay").hide();
                        cardItem.find(".promptText,.successPay").show();
                        
                        $('#qrcodeMp').height('130px');
                        $('#paySuccessAlt').hide();
                  	  	$('#card_recharge_tid').remove();
                  	  	$('body').append('<div style="display:none;" id="card_recharge_tid">'+tid+'</div>');
                  	  
                  	  	$('#payLessAlert').remove();
                  	  	$('#payMethodId').remove();
                  	  	$('#qrcodeMp').remove();
                  	  	if(chktype==3 || chktype==4 || chktype==8 || chktype==9 || chktype==25) {
                  	  		$('.submitUpload').trigger('click');
                  	  	} else {
                  	  		$('.submitBtn').trigger('click');
                  	  	}
                  	  	$('.model.dbLayModel1').css('visibility', 'hidden');
                  	  	$('.btn.selected.btnSelected').trigger('click');
                  	  	$('.model.dbLayModel1').css('visibility', 'unset');
                  	  	$('#subbtn').show();
                	}, 1000);
                } else {
                	$('#qrcodeMp').height('130px');
                	$('#paySuccessAlt').hide();
                    alertMsg = "NOPAY";
                    timeCountDown(Number(payInterval), function () { //倒计时几秒检测是否支付了
                        getPayResultCrad();
                    });
                }
            } else {
                //此处封装好的弹层显示错误信息，我写的是alert（测试）
                clearTimeout(timerRefresh);
                clearTimeout(timerSet);
                clearInterval(timerInt);
                
                $('#qrcodeOutter').hide();
          	    $('.payError').html(jsondata.info)
          	    $('.errorInfo').show();
            }
        }
    })
}


//订单号有效性
function testTip(ele,obj){
 $.ajax({type:"get", cache:false, url:webUrl+"/reward/ajax_check_order", data:obj,
     success:function(jsondata){
         jsondata=JSON.parse(jsondata);
         if(jsondata.status){
            tid=inputVal;
            $(".byCardSubmit").removeClass('disabled');
            $(".byCardSubmit").removeAttr('disabled');
			ele.parents(".pay-card-item").find(".rules").hide().html("");
         }else{
         	$(".byCardSubmit").addClass('disabled');
            $(".byCardSubmit").attr("disabled",'true');
            var msg=jsondata.info;
            ele.parents(".pay-card-item").find(".rules").html(msg);
         }
     }
 })
}
//DOM的筛选
function getQrcode(ele){
    if(myPayType==2){
        return ele.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('qrCodeView')[0];
    }else{
        return ele.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('qrCodeView')[1];
    }
}
//时间控制方法
function countDown() {
    timerSet = window.setTimeout(function() {
        timeCountDown(Number(payInterval), function() { //倒计时几秒检测是否支付了
            getPayResultCrad();
        })
    }, Number(startTime) * 1000) //10秒之后开始计时
}
//倒计时
function timeCountDown(seconds, cb2) {
    timerInt = setInterval(function() {
        seconds--;
        if (seconds == 0) {
            clearInterval(timerInt);
            cb2();
        }
    }, 1000);
}

function getUrlParam(paramname) {
    //构造一个含有目标参数的正则表达式对象
    var reg=new RegExp("(^|&)"+ paramname +"=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg); 
    //返回参数值
    if (r!=null) return unescape(r[2]); return null; 
}

function checkMoneyIsEnough(ele,obj2) {
	var money = obj2.total_money;
    $.ajax({
        url:"/reward/agent_is_enough_money",
		type:'post',
		data:{money:money},
		dataType:"json",			
		success:function(data){
			if(data.status == true) {
				scanPaymentCheckCard(ele,obj2);
			} else {
				alert(data.info);
				return false;
			}
		},
		error:function(){
			alert("请求失败");
		}
	});
}

if(tb_buy_card_url != "") {
    $("#tb_buy_button").show();
    $("#tb_buy_card_url").attr('href',tb_buy_card_url);
} else {
	$("#tb_buy_button").attr("style","display:none");
}

