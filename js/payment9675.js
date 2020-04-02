/**
 * Created by Administrator on 2017/6/27.
 */
var origin_html_upload = $('.upload_img_input');
var checkHandle = -1;
var myPayType = '';
var ITEM_CHECK = 0;
var coupon_code="";
var coupon_money="";
var is_have_coupon="";
var is_admit_coupon="";
var is_paper_type=0;
var paper_type;
var alt_text = "";
var is_reduce_check = false;
var hide_tid1 = $("#hide_tid").val();
var hide_tid = '';
if(hide_tid1 != undefined) hide_tid = hide_tid1;
if($CONFIG['check_type']==101) is_reduce_check = true;
var is_paper_file_check_type = 0;
$(function(){
	switch(parseInt($CONFIG['check_type'])){
		case 6:
		case 10:
		case 11:
		case 22:
		case 23:
		case 24:
		case 26:
		case 27:
		case 28:
		case 33:
		case 34:
		case 35:
		var is_paper_file_check_type = 1;
		break;
	}

    /*MOD.tabChange($(".btnCont li"),".btnCont",$(".modelCont"));*/
    MOD.closeFn($(".closeBtn"));
    MOD.closeFn($(".layModel .btn"));
    var webUrl=$CONFIG['agent_domain'],//网址
        payType=$CONFIG['pay_list'],//默认有哪几种支付方式
        defDisplay=$CONFIG['default_pay_type'],//是否展开
        pageId=$CONFIG['page_id'],//网页唯一码
        startTime=$CONFIG['pay_query_start_time'],//二维码生成之后几秒查询
        expireTime=$CONFIG['qrcode_expire_time'],//二维码多长时间过期
        payInterval=$CONFIG['pay_query_interval'],//查询支付情况
        amount=0,///支付的时候的总价
        tid="",//订单编号
        tid2="",
        tid3="",
        isTid='',
        //myPayType='',//用户自己选择的哪种支付方式
        timerSet=null,
        timerInt=null,
        timerRefresh=null,
        timerPage = null,
        qrcode,
        addInputNum= 1,
        submitObj={},
        remainMoney = 0,
        timerPageForOne = -1,
        notice=$CONFIG['notice'],
        isConfirmNotice=$CONFIG['is_confirm_notice'],
        isflag=false,
        typePage = '',
        chkType = JSON.parse($CONFIG['ver_chktype']) ? JSON.parse($CONFIG['ver_chktype'])[0] : '';
        alertMsg = "请支付";
        typePage=$("#typePage").attr("pageType");
        payType=JSON.parse(payType);
        defDisplay=defDisplay.split(",");
       defaultPay();
       /*getTestTip($("#tb_order1"));
       getTestTip($(".input_hit"));*/
      if(typePage==1){
          MOD.tabChange($(".tabBar li"),".tabBar",$(".tabContent"));
          MOD.scollList($(".inforCements"));
      }
      if(typePage==2){
    	  paper_type = 1;
    	  var is_paper_file_check_type = 0;
      }
      if($CONFIG['default_pay_type'] != "") {
          $("#input_words").removeClass();
          $("#input_words").attr("style","position:relative;right:-130px;color:#09b863;");
          $("#is_show_piece").show();
      }
      if($CONFIG['is_display_price'] == 1) {
    	  $("#is_display_unit_price").show();
          $(".check_price").html($CONFIG['price']+"元 / "+$CONFIG['unit']+$CONFIG['unit_name']);
      } else {
    	  $("#is_display_unit_price").hide();
      }

    if(payType.length==0) {
        $("#pay_methods").hide();
        $("#get_help2").hide();
        $("#subbtn").hide();
        $("#is_display_unit_price").hide();
    }
    //默认进入页面的时候显示哪种支付方式以及默认的哪种方式被展开
    function defaultPay(){
        if(payType.length==1){
            if(payType[0]==0){
                $(".payMethod span:eq("+payType[0]+"),.zf_cont:eq("+payType[0]+")").siblings().remove();
            }else{
                $(".payMethod span:eq("+(payType[0]-1)+"),.zf_cont:eq("+(payType[0]-1)+")").siblings().remove();
            }
        }else if(payType.length==2){
            if(payType.indexOf(0)>-1){
                if(payType.indexOf(2)>-1){
                    $(".payMethod span[payList='3'],.zf_cont[payList='3']").remove();
                }else if(payType.indexOf(3)>-1){
                    $(".payMethod span[payList='2'],.zf_cont[payList='2']").remove();
                }
            }else{
                $(".payMethod span[payList='0'],.zf_cont[payList='0']").remove();
            }

        }
        if(defDisplay.length>0){
             myPayType=defDisplay[0];
             $(".payMethod span[payList='"+defDisplay[0]+"'] a,.zf_cont[payList='"+defDisplay[0]+"']").addClass("selected");
             if(myPayType == 0){
                 getTestTip($("#tb_order1"));
             }
        }
    }

    $('.reloadBtn').bind('click', function() {
        location.reload();
    })

    $("#report_demo").attr('href','//example.celunwen.com/'+[$CONFIG['chk_flag']]);

//时间控制方法
  function countDown(){
        timerSet=window.setTimeout(function(){
            timeCountDown(Number(payInterval),function(){//倒计时几秒检测是否支付了
                getPayResult();
            })
        },Number(startTime)*1000)//10秒之后开始计时
    }

    function checkType() {
        if (typePage == 1) {
          if ($CONFIG['check_type'] == 0) {
            changeTBRules();
          } else {
            var txt = $('#paper-content').val();
            var price = $CONFIG['price']; //单价
            var unit_num = $CONFIG['unit']; //几篇或者几百字
            var length = txtLength(txt);
            var num = Math.ceil(length / unit_num) * Number(price);
            $(".varn_words").html(length);
            $("#varn_nums").html(num);
            getTimerPage();
          }
        }
        if (typePage == 2) {
          if ($CONFIG['check_type'] == 0) {
            changeTBRules();
          } else {
            var moneyTotal = $CONFIG['price'];
            moneyTotal = Math.round(moneyTotal * 100) / 100;
            $("#storage_type").val(moneyTotal);
            $("#varn_nums").html(moneyTotal);
            clearTimeout(timerSet);
            clearInterval(timerInt);
            clearTimeout(timerRefresh);
            amount = $("#storage_type").val();
            amount = Math.round(amount * 100) / 100;

            var objData = {
              "item_type":ITEM_CHECK,
              "type":$CONFIG['check_type'],
              "total_fee": amount,
              "pay_type": myPayType,
              "page_id": pageId
            };

            if(is_reduce_check) {
            	objData.reduce_type = $('#reduce_type_hidden').text();
            	objData.reduce_taskid = $('#taskId').text();
            }

            scanPayment($(".refreshPay"), objData);
            countDown();
          }
        }
        if (typePage == 4) {
          if ($CONFIG['check_type'] == 0) {
            changeTBRules();
          } else {
            var money = $('.item').length * (Number($CONFIG['price']) * 1000) / 1000;
            $("#storage_type").val(money);
            $("#varn_nums").html(money);
          }
        }
      }
$(".type").on('click', function() {
	if($(this).hasClass('active')){
		return true;
	}

	$('#qrcodeMp').hide();

	var origin_chktype = $CONFIG['check_type'];
	var hrefHost_pay = location.href;
    if(hrefHost_pay.substr(hrefHost_pay.length-1,1) != '/'){
    	hrefHost_pay = hrefHost_pay+'/';
    }
	localStorage.setItem(hrefHost_pay+'type-index', $(this).index());
    $(".type").removeClass('active');
    $(this).addClass('active');
    chkType = $(this).attr('data');

    if(chkType == 1) {
        $("#type_tishi").html('因万方1.0已停止收录学术比对库，故常出现0%情况，建议在初检后选择万方升级版2.0版本');
    } else {
    	$("#type_tishi").html('');
    }
    var that = $(this);
    $.ajax({
      type: "post",
      url: $CONFIG['agent_domain'] + '/ajax_get_config',
      async:false,
      data: {
        type: chkType
      },
      success: function(jsondata) {
        var data = JSON.parse(jsondata);
        if (data.status) {
          var config = data.data;
          $CONFIG['uid'] = config.uid;
          $CONFIG['check_type'] = config.check_type;
          $CONFIG['type_desc'] = config.type_desc;
          $CONFIG['ver_chktype'] = config.ver_chktype;
          $CONFIG['price'] = config.price;
          $CONFIG['unit'] = config.unit;
          $CONFIG['is_display_price'] = config.is_display_price;
          $CONFIG['unit_name'] = config.unit_name;
          $CONFIG['title_min'] = config.title_min;
          $CONFIG['title_max'] = config.title_max;
          $CONFIG['auther_min'] = config.auther_min;
          $CONFIG['auther_max'] = config.auther_max;
          $CONFIG['content_min'] = config.content_min;
          $CONFIG['content_max'] = config.content_max;
          $CONFIG['file_max_size'] = config.file_max_size;
          $CONFIG['file_type'] = config.file_type;
          $CONFIG['is_check_file_wordnum'] = config.is_check_file_wordnum;
          $CONFIG['file_max_wordnum'] = config.file_max_wordnum;
          //webUrl = config.agent_domain;
          $CONFIG['page_id'] = config.page_id;
          $CONFIG['agent_domain'] = config.agent_domain;
          $CONFIG['pay_list'] = config.pay_list;
          $CONFIG['default_pay_type'] = config.default_pay_type;
          $CONFIG['notice'] = config.notice;
          $CONFIG['is_confirm_notice'] = config.is_confirm_notice;
          $CONFIG['pay_query_start_time'] = config.pay_query_start_time;
          $CONFIG['pay_query_interval'] = config.pay_query_interval;
          $CONFIG['qrcode_expire_time'] = config.qrcode_expire_time;
          $CONFIG['report_query_interval'] = config.report_query_interval;
          $CONFIG['is_cnki'] = config.is_cnki;
          $CONFIG['check_type'] = config.check_type;
          $CONFIG['is_open_coupon'] = config.is_open_coupon;
          $CONFIG['is_have_coupon_rule'] = config.is_have_coupon_rule;
          $CONFIG['is_have_card_rules'] = config.is_have_card_rules;
          $CONFIG['chk_flag'] = config.chk_flag;
          $CONFIG['guide_url'] = config.guide_url;
          webUrl = $CONFIG['agent_domain'];

          $("#report_demo").attr('href','//example.celunwen.com/'+$CONFIG['chk_flag']);

          var payWayList = JSON.parse($CONFIG['pay_list']);
          if(payWayList.length == 0) {
        		$('#get_help').hide();
        		$('#get_help2').hide();
          }
          var document_database = config.check_paper_library_desc_new;
          var logo_url = config.logo_url;

          $("#logo_pic").attr("src",logo_url);
          chk_type=$CONFIG['check_type'];
          $("#original_database").empty();
          var info = "";
          for(var i=0; i < document_database.length; i++){
              info += "<li>"+document_database[i]+"</li>";
          }
          $("#original_database").html(info);
          if($CONFIG['is_display_price'] == 1) {
        	  $("#is_display_unit_price").show();
              $(".check_price").html($CONFIG['price']+"元 / "+$CONFIG['unit']+$CONFIG['unit_name']);
          } else {
        	  $("#is_display_unit_price").hide();
          }
          $(".zf_tab").html('');
          checkType();
          insertPayBtn();
          insertPayList();
          bindPayMethod();
          $('#pay_methods').show();

          if($CONFIG['check_type'] == 24) {
              $("#publish_date_area").show();
          } else {
              $("#publish_date_area").hide();
          }

          if($CONFIG['is_check_file_wordnum'] == 1){
              if(typePage != 1){
                if(uploader.isInProgress()){
                  checkHandle = setInterval(function(){
                    if(!uploader.isInProgress()){
                      clearInterval(checkHandle);
                      checkFileSize();
                    }
                  },200);
                }else{
                    checkFileSize();
                }
              }else{
                var length = txtLength($("#paper-content").val());
                if(length > $CONFIG['file_max_wordnum']){
                  $(".errorTrip").html('字数超出检测类型最大字数');
                }else{
                  $(".errorTrip").html('');
                }
              }
            }
            changeTBRules();
            $('.Smohan_Layer_box').hide();
            if($CONFIG['is_open_coupon'] != 1 || $CONFIG['is_have_coupon_rule'] != 1) {
            	$('#share_guide').hide();
            	if($('#share_guide').hasClass('selected')) {
            		$('#share_guide').removeClass('selected');
            		$('.tabBar.tesTabBar').find('ul').find('li').first().addClass('selected');
            	}
            	if($('#coupon_container').css('display') == 'block') {
            		$('#coupon_img').trigger('click');
            		var timer_num = 0;
            		var timer = setInterval(function(){
            			if($('#coupon_container').css('display') == 'none'){
            				++timer_num;
            				$("#right_navigation_bar").animate({right:"-100",opacity:1},1000,function(){
                    			$(this).css({display:"none"})
                    		});
            			}
            			if(timer_num == 1){
            				clearTimeout(timer);
            			}
            		},100);
            	}else{
            		$("#right_navigation_bar").animate({right:"-100",opacity:1},1000,function(){
            			$(this).css({display:"none"})
            		});
            	}
            	$('#coupon_img_right').hide();
            }else{
            	$('#conpon_a_url').find('a').remove();
            	$.each(coupon_list_data,function(i,j){
            		var check_type_dom = j.find('.check_type_num').html();
            		if(check_type_dom == $CONFIG['check_type'] || check_type_dom == 0){
                		$('#conpon_a_url').append(j);
            		}
            	});
            	$('.coupon_border_selected').css('border','none');
            	$('.mui-mbarp-asset-coupon-border-top').css('background-image', '//css.kuailelunwen.com/assets_v2/images/coupon/coupon_border_background.png');
            	$('.mui-mbarp-asset-coupon-border-top').css('background-position','0px -2px');
            	$('.mui-mbarp-asset-coupon-border-top').css('background-repeat', 'repeat-x');
            	$('.selected_icon').hide();
            	$('#conpon_a_url').find('a').show();
            	uploader.retry();
            	$('#share_guide').show();
            	$('.upload_img_input').remove();
            	$('.tb_doc_title').after(origin_html_upload);
            	$('.tb_doc_title').next().css('z-index','-1');
                couponUpload();
                if($('#right_navigation_bar').css('display') == 'none'){
                	$('#right_navigation_bar').show();
	        		$('#coupon_img_right').show();
                }
                if(origin_chktype != that.attr('data')) {
                }
                $("#right_navigation_bar").show();
                $("#right_navigation_bar").animate({right:"0",opacity:1},1000,function(){

        		});
            }
            $("#hidden_params").attr("coupon-money",0);
            var payWay = JSON.parse($CONFIG['pay_list']);
      	  	for (i = 0; i < payWay.length; i++) {
      	  		$('.way_0'+payWay[i]).remove();
      	  	}
      	  	$(".zf_tab").find('.zf_cont').remove();
            insertPayBtn();
            insertPayList();
            bindPayMethod();
            $('.socket_coupon').click(function(){
                coupon_code = $(this).find('.code_coupon').html();
                coupon_money = $(this).find('.money_coupon').html();
                is_admit_coupon=$("#hidden_params").attr("is_admit_coupon");
                if(is_admit_coupon != "") {
                    useCoupon(coupon_code,coupon_money);
                }
            });
          }
          show_pay_help();
        },
      error: function() {
        alert("ajax错误")
      }
    });
  });
$('.upload_type_tb').find('.upload_type').click(function(){
	$('.upload_type_tb').find('.upload_type').removeClass('active');
	$(this).addClass('active');
	var type=$(this).attr('type');
	paper_type = type;
	$('.payMethod').find('a').removeClass('selected');
	$('.zf_cont').removeClass('selected');
	$('.maskLayer').hide();
	bindPayMethod();
	if(type==1){
		$('#file_type_form').hide();
		$('.textarea-div').show();
		$('.tb_doc_title').show();
		$('.tb_doc_author').show();
		paper_type = 0;
	}else if(type==2){
		$('#file_type_form').show();
		$('.textarea-div').hide();
		if($('#paper_file_picker').attr('upload_file_md5')==''){
			$('.tb_doc_title').hide();
			$('.tb_doc_author').hide();
		}
		paper_type = 1;
		uplode_paper_file();
	}
});

if($CONFIG['check_type']==10 || $CONFIG['check_type']==11){
	$('.upload_type_tb').find('.upload_type[type=2]').trigger('click');
}

if($CONFIG['check_type']==6 || $CONFIG['check_type']==22 || $CONFIG['check_type']==23 || $CONFIG['check_type']==24 || $CONFIG['check_type']==27 || $CONFIG['check_type']==33 || $CONFIG['check_type']==34 || $CONFIG['check_type']==35){
	paper_type = 1;
	uplode_paper_file();
}

function checkFileSize(){
    var errorText = '';
    var deleteArray = [];
    for(var i = 0 ; i < fileNumArray.length ; i++){
      if(fileNumArray[i].count > $CONFIG['file_max_wordnum']){
        errorText += fileNumArray[i].name + ' 字数超出最大值 <br />';
        deleteArray.push({id:fileNumArray[i].id,name:fileNumArray[i].name});  //单文件上传用id删除，多文件上传用name循环对比删除
      }
    }
    if(errorText.length > 0){
        $("#thelist").parent().find('.tishi').html(errorText);
        if(typePage != 4){
          for(var i = 0; i < deleteArray.length ; i ++){
            var file = uploader.getFile(deleteArray[i].id);
            setTimeout(function(){
              uploader.removeFile(file);
            },1000);
          }
        }else{
          removeMoreFile(deleteArray);
        }
      }
      console.log(fileNumArray);
    }
    function removeMoreFile(deleteArray){
      var itemList = $('#thelist').find('.item');
      var id = '';
      if(itemList.length > 0){
        for(var j=0;j<itemList.length;j++){
          for(var x = 0 ; x < deleteArray.length; x++){
            if($(itemList[j]).attr('upname').split('/')[1] == deleteArray[x].name){
              id = $(itemList[j]).attr('id');
            }
            if(id){
              break;
            }
          }
          if(id){
            break;
          }
        }
        if(id){
          var file = uploader.getFile(id);
          uploader.removeFile(file);
          id = '';
          removeMoreFile(deleteArray);
        }
      }
    }
function bindPayMethod() {
    MOD.tabChange3($(".whatOrder span"), ".whatOrder", ".whatDes");
    $(".payBtn li a").unbind('click');
    $("#submitAgain").unbind('click');
    $(".submitBtn,.submitUpload").unbind('click');
    $(".refreshPay").unbind('click');
    $('.payMethod a').unbind('click');
    $('.add').unbind('click');
    addInputNum = 1;
    //添加表单
    getTestTip($("#tb_order2"));
    getTestTip($("#tb_order3"));
    getTestTip($("#jd_order2"));
    getTestTip($("#jd_order3"));
    //支付方式tab
    $('.payMethod a').bind('click', function() {
    	$('#subbtn').show();
    	$('.rules').hide();
        clearTimeout(timerSet);
        clearInterval(timerInt);
        clearTimeout(timerRefresh);
        tid="";
        submitObj={};
        $('#paper-content').focus();
        var _that=$(this);
        $(".payMethod a").removeClass("selected")
        $(".zf_cont").removeClass("selected");
        $(".testTip").css('border-color', '#e6e6e6').val("");
        $(".rules").html("");
        changeTBRules();
        $(".promptText").hide();
        $(".promptText").children().hide();
        myPayType= $(this).parents("span").attr("payList");
        if(typePage==2){
      	  submitObj['paper_type'] = paper_type;
        }
        
        //选择检测卡支付帮助提示修改
        if(myPayType==1){
        	var help_text = '检测卡';
        	if($CONFIG['wx_is_open_coupon'] == 1) help_text+='／微信优惠券';
        	$('#get_help2').html(help_text+'提交失败，可直接用卡号进行二次提交');
        	$("#get_help2").addClass('canotclick');
        }else{
        	$('#get_help2').html('微信或支付宝已支付，但论文提交失败怎么办？');
        	$("#get_help2").removeClass('canotclick');
        }
        //默认适配优惠券
        var max_price = 0;
        var max_price_index = 0;
        //分销fx_uid
        var fx_uid = $('#fx_uid_hidden').html();
        var is_pc = IsPC();
        if((fx_uid=='0' || fx_uid)){
        	submitObj['fx_uid'] = 0;
        	submitObj['fuid'] = fx_uid;
        }
        if(myPayType == 0 || myPayType == 2 || myPayType == 3){
        	$('#payLessAlert').hide();
       	    $('#payMethodId').hide();
       	    $('#qrcodeMp').hide();
        }

    	if((myPayType == 2 || myPayType == 3) && ($CONFIG['wx_is_open_coupon'] == 1 && $CONFIG['wx_is_have_coupon_rule']== 1)) {
    		$('#conpon_a_url').find('.socket_coupon').each(function(){
    			if($(this).css('display') == 'block'){
        			var total_moneye = $(this).find('.total_money_coupon').html();
        			if(total_moneye>max_price) {
        				max_price_index = $(this).index();
        				selected_border_fun($(this));
        				$(this).trigger('click');
        			}
    			}
    		});
    	}
        var payCont=$(".zf_cont[payList='"+myPayType+"']");
        var li_a=payCont.find(".scanCodeBtn");
        var left_bar=payCont.find(".codeLeftBar");
        if(myPayType!=0 && myPayType!=1 && myPayType!=4){
        	alertMsg = 'NOTPAY';
            li_a.siblings(".maskLayer").show();
            if(typePage==4){//多篇 微信和支付宝
                amount=$("#storage_type").val();
                amount = Math.round(amount * 100) / 100;
                var uploadTmpname=$("#uploadTmpname").val();
                if(uploadTmpname && amount>=0){
                    $(this).parent().siblings().find(".maskLayer").hide();
                    $(this).parent().find(".maskLayer").show();
                    _that.addClass("selected");
                    payCont.addClass("selected");
                    var objData={"item_type":ITEM_CHECK,"type":$CONFIG['check_type'],"total_fee":amount,"pay_type":myPayType,"page_id":pageId};
                    scanPayment(_that,objData);
                    countDown();
                    getTimerPage2();
                }else{
                	alt_text = "请上传要检测的论文文件";
                	if(is_reduce_check) alt_text = "请上传要降重的报告文件";
                     MOD.alertFn("提示",alt_text,"关闭");
                }
            }else{//单篇和文本 微信和支付宝
                coupon_code = $("#hidden_params").attr("coupon-code");
                coupon_money= $("#hidden_params").attr("coupon-money");

                is_admit_coupon=$("#hidden_params").attr("is_admit_coupon");
                if(is_admit_coupon != "") {
                	useCoupon(coupon_code,coupon_money);
                }
                sizeFormVal();
                if(!isflag){
                    return false;
                }
                left_bar.eq(0).addClass("selected").siblings().removeClass("selected");
                li_a.addClass("selected").parents("li").siblings().find("a").removeClass("selected");
                if(typePage==1){
                	if(paper_type==1 && is_paper_file_check_type == 1){
                		//切换版本时重新计算价格
                		var money_num = Math.ceil(parseInt($('#paper_nums_hidden').text())/$CONFIG['unit']) * Number($CONFIG['price']);
			            $("#paper_pay_nums").html(money_num);
			            //计算淘宝应拍件数
			            var buy_nums = Math.ceil((Number($('#paper_nums_hidden').text())/$CONFIG['unit']));
			            $('.tb-rules').html('应拍' + buy_nums + '件');

	                    amount=$("#paper_pay_nums").html();
	                    var varn_words=$(".paper_file_word_num").html();
                	}else{
                		var content = $("#paper-content").val();
                		res = checkContent(content);
          	            if(res.code == 0){
          	                MOD.alertFn("提示",res.msg,"关闭");
          	                return false;
          	            }
	                    amount=$("#varn_nums").html();
	                    var varn_words=$(".varn_words").html();
                	}
                	amount = Math.round(amount * 100) / 100;
                    if(amount>=0 && varn_words>0){
                        $(this).parent().siblings().find(".maskLayer").hide();
                        $(this).parent().find(".maskLayer").show();
                        _that.addClass("selected");
                        payCont.addClass("selected");
                        $("#storage_type").val(amount);
                        var objData={"item_type":ITEM_CHECK,"type":$CONFIG['check_type'],"total_fee":amount,"pay_type":myPayType,"page_id":pageId};
                        scanPayment(_that,objData);
                        countDown();
                        getTimerPage();
                    }else{
                    	alt_text = "内容不能为空";
                    	if(paper_type==1 && is_paper_file_check_type == 1){
                    		alt_text = "请上传要检测的论文文件";
                    	}
                    	if(is_reduce_check) alt_text = "请上传要降重的报告文件";
                         MOD.alertFn("提示",alt_text,"关闭");
                    }
                }else if(typePage==2){
                    amount=$("#storage_type").val();
                    amount = Math.round(amount * 100) / 100;
                    var uploadTmpname=$("#uploadTmpname").val();
                    if(uploadTmpname && amount>=0){
                        $(this).parent().siblings().find(".maskLayer").hide();
                        $(this).parent().find(".maskLayer").show();
                        _that.addClass("selected");
                        payCont.addClass("selected");
                        var objData={"item_type":ITEM_CHECK,"type":$CONFIG['check_type'],"total_fee":amount,"pay_type":myPayType,"page_id":pageId};
                        if(is_reduce_check) {
                        	objData.reduce_type = $('#reduce_type_hidden').text();
                        	objData.reduce_taskid = $('#taskId').text();
                        }
                        scanPayment(_that,objData);
                        countDown();
                    }else{
                    	alt_text = "请上传要检测的论文文件";
                    	if(is_reduce_check) alt_text = "请上传要降重的报告文件";
                        MOD.alertFn("提示",alt_text,"关闭");
                    }
                }
            }
        }else{
        	scanTaobaoQrcode();
            clearInterval(timerPage);
            $(this).parent().siblings().find(".maskLayer").hide();
             _that.addClass("selected");
             payCont.addClass("selected");
            if(myPayType == 0) {
                getTestTip($("#tb_order1"));
            } else if(myPayType == 4) {
                getTestTip($("#jd_order1"));
            }else {
                //检测卡自己添加开始
                var cardobj = $("#cardAccount");
                cardobj.unbind("textchange");
                cardobj.bind("textchange",function(){
                    cardobj.on('blur', function() {
	                	if($('#qrcodeMp').length==1 && $("#payMethodId").length==1){
	                		$('#qrcodeMp').remove();
	                		$('#payMethodId').remove();
	                		$('#subbtn').show();
	                		for(var i = 1; i < 100; i++) {
	                			clearInterval(i);
	                		}
	                	}
                        checkCardAccount();
                    });
                })
                var cardpwdobj = $("#cardPassword");
                cardpwdobj.unbind("textchange");
                cardpwdobj.bind("textchange",function(){
                    cardpwdobj.on('blur', function() {
                        checkCardPassword();
                    });
                });
                //检测卡自己添加结束
            }


        }

        if(myPayType == 0 || myPayType == 4) {
            $("#input_words").removeClass();
            $("#input_words").attr("style","position:relative;right:-130px;color:#09b863;");
            $("#is_show_piece").show();
        } else {
            $("#is_show_piece").hide();
            $("#input_words").attr("style","");
            $("#input_words").addClass("rightTrip");
        }
        var hrefHost_pay = location.href;
        if(hrefHost_pay.substr(hrefHost_pay.length-1,1) != '/'){
        	hrefHost_pay = hrefHost_pay+'/';
        }
        localStorage.setItem(hrefHost_pay+'tab-selected', $(this).parent().attr('class'));

        if($CONFIG['uid']==13 || $CONFIG['uid'] == 1710 || $CONFIG['uid'] == 1737){
        	if(myPayType == 2 || myPayType == 3){
        		var border_el = $('<div style="width:100px;height:100px;border:1px solid red;position:absolute;top: -10px;left: -10px;border-radius: 5px;height: 70px;width: 82px;" class="add_border_el"></div>');
                $('.payMethod a').css('border','none');
                $('.add_border_el').remove();
                $('#pay_methods').css('overflow','unset');
                $('.fm_input').css('position','relative');
                $(this).before(border_el);
        	}
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
      if (typePage == 1) {
    	if(paper_type==1 && is_paper_file_check_type == 1){
    		amount=$("#paper_pay_nums").html();
        	var varn_words=$(".paper_file_word_num").html();//字数
    	}else{
    		amount = $("#varn_nums").html();
            var varn_words = $(".varn_words").html();
    	}
    	amount = Math.round(amount * 100) / 100;
      } else if (typePage == 2) {
        amount = $("#storage_type").val();
        amount = Math.round(amount * 100) / 100;
      }

    var objData={"item_type":ITEM_CHECK,"type":$CONFIG['check_type'],"total_fee":amount,"pay_type":myPayType,"page_id":pageId};
    if(is_reduce_check) {
    	objData.reduce_type = $('#reduce_type_hidden').text();
    	objData.reduce_taskid = $('#taskId').text();
    }
    scanPayment(_that,objData);
    countDown();
});

//提交按钮
$(".submitBtn,.submitUpload").bind("click", function() {
    getFormVal();
});
  //提交按钮
$("#submitAgain").bind("click", function() {
  getFormVal();
});
//提交按钮
$("#submitAgain").bind("click", function() {
  $(".noticeLayer").fadeOut();
  submitAgain();
});

//支付方式:扫码支付按钮
$(".payBtn li a").bind("click", function() {
  clearTimeout(timerSet);
  clearTimeout(timerRefresh);
  clearInterval(timerInt);
  clearInterval(timerPage);

  $('.rules').hide();
  var _that = $(this);
  var parentsCont = _that.parents(".zf_cont");
  var parentC = _that.parents("li[paylist='" + myPayType + "']");
  if (_that.hasClass("scanCodeBtn")) {
    _that.siblings(".maskLayer").show();
    parentsCont.find("input").css('border-color', '#e6e6e6').val("");
    parentsCont.find(".rules").html("");
    parentsCont.find(".codeLeftBar").eq(0).addClass("selected").siblings().removeClass("selected");
    amount = $("#storage_type").val();
    amount = Math.round(amount * 100) / 100;
    var objData = {
      "item_type":ITEM_CHECK,
      "type":$CONFIG['check_type'],
      "total_fee": amount,
      "pay_type": myPayType,
      "page_id": pageId
    };

    if(is_reduce_check) {
    	objData.reduce_type = $('#reduce_type_hidden').text();
    	objData.reduce_taskid = $('#taskId').text();
    }

    scanPayment(_that, objData);
    countDown();
    if (typePage == 1) {
      getTimerPage();
    } else if (typePage == 4) {
      getTimerPage2();
    }
  } else {
    $(".promptText").hide();
    $(".promptText").children().hide();
    _that.parents("li").siblings().find(".maskLayer").hide();
    parentsCont.find(".codeLeftBar").eq(1).addClass("selected").siblings().removeClass("selected");
    var input_hit = parentsCont.find(".input_hit");
    getTestTip(input_hit);
  }
  
  _that.addClass("selected").parents("li").siblings().find("a").removeClass("selected");
});
}
bindPayMethod();
 //生成二维码
function scanPayment(ele,obj2){
    coupon_money = $("#hidden_params").attr("coupon-money");
    var is_can_use_coupon = false;
    if(coupon_money > 0) {
        is_can_use_coupon = true;
    }
    if(is_can_use_coupon) {
    	if(coupon_money > 0 && obj2.total_fee > coupon_money) {
    		obj2.total_fee = obj2.total_fee - coupon_money;
    		obj2.total_fee = obj2.total_fee.toFixed(2);
    	} else {
    		var money2 = obj2.total_fee;
    		obj2.total_fee = '0.01';
    	}
    }

    $.ajax({type:"post",url:webUrl+"/make_pay_qrcode",data:obj2,
        success:function(jsondata){
           var amount=obj2.total_fee;
           amount = Math.round(amount * 100) / 100;
           jsondata=JSON.parse(jsondata);
            var contEle=$(".zf_cont[payList='"+myPayType+"']");
          if(jsondata.status){
              var dataList=jsondata.data;
              var qrcodeId=contEle.find(".qrCodeView")[0];
              var qrCodeUrl=dataList.qrcode_url;
              var amountId=contEle.find(".amountTotal").html("￥"+amount+"元");
              isTid=dataList.tid;
              if(is_can_use_coupon) {
                  if(obj2.total_fee == '0.01') {
                	  $("#storage_type").val(money2);
                  } else {
                	  $("#storage_type").val(amount*1 + coupon_money*1);
                  }

              } else {
                  $("#storage_type").val(amount);
              }

              //清除上次二维码
              if(qrcode){
                  qrcode.clear();
              }
              //生成二维码
              qrcode = new QRCode(qrcodeId, {
                  width : 164,//设置宽高
                  height : 164
              });
              qrcode.makeCode(qrCodeUrl);
              timerRefresh=window.setTimeout(function(){
                  clearTimeout(timerSet);
                  clearInterval(timerInt);
                  contEle.find(".promptText").children().hide();
                  contEle.find(".promptText,.refreshPay").show();
              },Number(expireTime)*1000)
          }else{
              clearTimeout(timerSet);
              clearTimeout(timerRefresh);
              clearInterval(timerInt);
              clearInterval(timerPage);
              $(".payError").html(jsondata.info);
              contEle.find(".promptText,.faultPay").show();
          }
        },
        error:function(){
            alert("ajax错误")
        }
    })
}
 // 查询支付结果
  function getPayResult(){
      var objData={"tid":isTid,"pay_type":myPayType}
      $.ajax({type:"post",cache:false, url:webUrl+"/check_pay_result", data:objData,
          success:function(jsondata){
              var contEle=$(".zf_cont[payList='"+myPayType+"']");
              jsondata=JSON.parse(jsondata);
              var msg=jsondata.info;
              alertMsg=msg;
              if(jsondata.status){
                  if(jsondata.data.pay_status == "SUCCESS") { //状态为成功时，清楚定时任务等操作
                      tid=isTid;
                      clearTimeout(timerRefresh);
                      clearTimeout(timerSet);
                      clearInterval(timerInt);
                      clearInterval(timerPage);
                      contEle.find(".refreshPay,.faultPay").hide();
                      contEle.find(".promptText,.successPay").show();
                      getFormVal();
                      _hmt.push(['_trackOrder', {
                          "orderId": isTid,
                          "orderTotal": $('#varn_nums').text(),
                          "item": [
                              {
                                  "skuId": "无",
                                  "skuName": $CONFIG['chk_desc'],
                                  "category": $CONFIG['uid']+'-'+$CONFIG['check_type'],
                                  "Price": $('#varn_nums').text(),
                                  "Quantity": 1
                              }
                          ]}
                      ]);
                  } else {
                      alertMsg="NOPAY";
                      timeCountDown(Number(payInterval),function(){ //倒计时几秒检测是否支付了
                          getPayResult();
                      });
                  }
              }else{
                  //此处封装好的弹层显示错误信息，我写的是alert（测试）
                  clearTimeout(timerRefresh);
                  clearTimeout(timerSet);
                  clearInterval(timerInt);
                  /*clearInterval(timerPage);*/
                  contEle.find(".promptText,.refreshPay").hide();
                  contEle.find(".promptText,.faultPay").show().find("h2").html(msg);
              }
          }
      })
  }
  //对前标题和作者的校正
   function sizeFormVal(){
	   if(paper_type==1 && is_paper_file_check_type==1){
		   var file_amount=$("#paper_pay_nums").html();
	       var file_amount = Math.round(file_amount * 100) / 100;
	       var file_varn_words=$(".paper_file_word_num").html();
	       var words_length = parseInt($('#paper_nums_hidden').text());
	       var res = checkNoCnkiFileContent(words_length);
	       if(res.code==0){
	    	   MOD.alertFn("提示",res.msg,"关闭");
	    	   isflag=false;
               return isflag;
	       }
	       if(!(file_amount>=0 && file_varn_words>0)){
	    	   MOD.alertFn("提示","请上传要检测的论文文件","关闭");
	    	   isflag=false;
               return isflag;
	       }
	       isflag=true;
	   }

       var res;
       //标题检验
       if($("#paper-title").size() > 0){
           var title = $.trim($("#paper-title").val());
           res = checkTitle(title);
           if(res.code == 0){
               MOD.alertFn("提示",res.msg,"关闭");
               isflag=false;
               return isflag;
           }
           submitObj["paper_title"]=title;
           isflag=true;
       };
       //作者检验
       if($("#paper-author").size() > 0){
           var author = $.trim($("#paper-author").val());
           if($CONFIG['check_type'] != 10 && $CONFIG['check_type'] != 11){
        	   res = checkAuthor(author);
               if(res.code == 0){
                   MOD.alertFn("提示",res.msg,"关闭");
                   isflag=false;
                   return isflag;
               }
               submitObj["paper_author"] = author;
           }
           isflag=true;
       };
   }
  function getFormVal(){
      var share_uid = $("input[name=share_uid]").val();
      if(share_uid != "") {
          submitObj["share_uid"] = share_uid;
      }
      coupon_code = $("#hidden_params").attr("coupon-code");
      if(coupon_code != "") {
          submitObj["coupon_code"] = coupon_code;
      }

      submitObj["ver_chktype"] = $CONFIG['check_type'];
      var card_account1 = $("#cardAccount").val();
      var card_password1 = $("#cardPassword").val();

      if(typePage!=4){
          sizeFormVal();
          if(!isflag){
              return false;
          }
      }else{
          /*getMoreSizeVal();*/
          //submitObj["paper_title"]="多篇自定义title";
          //submitObj["paper_author"] = "多篇自定义作者";
      }

      // 学生证
      var aid = $("#hidden_params").attr('agent');
      var stuaid = $("#hidden_params").attr('stuaid');
      if(aid == stuaid && ($CONFIG['check_type'] == 29 || $CONFIG['check_type'] == 30)) {
          submitObj['stu_idcard_tmpname'] = $("#hidden_params").attr('stu_idcard_tmpname');
      }

      // 维普职称
      if($CONFIG['check_type'] == 24) {
          submitObj['publish_date'] = $("#publish_date").val();
      }

      //内容校正
      if(typePage==1){
          var content = $("#paper-content").val();
          if(paper_type==1 && is_paper_file_check_type==1){
        	  submitObj['upload_file_name'] = $('#upload_file_name_input').val();
        	  submitObj['upload_file_tmpname'] = $('#upload_file_tmpname_input').val();
        	  submitObj['upload_file_md5'] = $('#upload_file_md5_input').val();
        	  submitObj['paper_type'] = paper_type;
          }else{
        	  res = checkContent(content);
	          if(res.code == 0){
	              MOD.alertFn("提示",res.msg,"关闭");
	              return false;
	          }else{//
	        	  submitObj["paper_content"] = content;
	          }
          }
      }else if(typePage==2||typePage==4){//单/多篇
    	  paper_type = 1;
    	  if(typePage==4) {
    		  submitObj['multiple'] = true;
    	  }
          var uploadTmpname=$("#uploadTmpname").val();
          var uploadName=$("#uploadName").val();
          var uploadMd5=$("#uploadMd5").val();
          if(uploadTmpname&&uploadTmpname&&uploadMd5){
              submitObj["upload_file_name"] = uploadName;
              submitObj["upload_file_tmpname"] = uploadTmpname;
              submitObj["upload_file_md5"] = uploadMd5;
              submitObj['paper_type'] = paper_type;
          }else{
              alt_text = "请上传要检测的论文文件";
          	  if(is_reduce_check) alt_text = "请上传要降重的报告文件";
              MOD.alertFn("提示",alt_text,"关闭");

              return false;
          }
      }
          submitObj["pay_type"]=myPayType;

          if($('#card_recharge_tid').length==1 && $('#card_recharge_tid').html()!=''){
        	  submitObj["card_recharge_tid"] = $('#card_recharge_tid').html();
          }
//          if(!tid){
//              MOD.alertFn("提示",alertMsg,"关闭");
//              return false;
//          }
          submitObj["orderId1"]=tid;

          if(myPayType == 0 || myPayType == 4){
              submitObj["orderId2"]=tid2;
              submitObj["orderId3"]=tid3;
          }

          if(card_account1) {
              submitObj["pay_type"] = 1;
              submitObj["orderId1"] = card_account1;
              if(card_password1) {
                  submitObj["orderId1"] = card_account1+':'+card_password1;
              }
          }
          $('#submit_btn_mask').show();

          if (Number($CONFIG['is_confirm_notice']) == 1) {
              MOD.alertFn5("提示", $CONFIG['notice'], "确定", "取消",
                function() {
                  submitAgain();
                },
                function() {
                  $(".submitBtn").removeAttr("disabled");
                });
          } else {
              submitAgain();
          }
  }
 //提交表单
 function submitAgain(){
     if(!submitObj.orderId1) submitObj["orderId1"]=hide_tid;
     var device_id = $("#device_id").val();
     submitObj.device_id = device_id;
     var script_url = $("#script_url").val();
     submitObj.script_url = script_url;
     if(is_reduce_check) {
		 submitObj.reduce_type = $('#reduce_type_hidden').text();
		 submitObj.reduce_taskid = $('#taskId').text();
	 }
     $.ajax({type:"post",xhrFields:{withCredentials: true},async:false,cache:false, url:webUrl+"/submit", data:submitObj,
         success:function(jsondata){
        	 $('#submit_btn_mask').hide();
        	 if(submitObj.pay_type==1 || submitObj.pay_type==5){
        		 $('#card_recharge_tid').remove();
        	 }
             jsondata=JSON.parse(jsondata);
             var msg=jsondata.info;
             if(jsondata.status){
                 localStorage.clear();
                 var dataList=jsondata.data;
                 var tidOrder=dataList.tid;
                 var succ_tip = "恭喜你，论文已经提交成功！<br>凭此订单号：<span style='font-size:18px;'>"+tidOrder+"</span> 下载报告，请妥善保存";

                 if(dataList.is_show_cashback == 1) {
                     var domain = "//"+window.location.host+"/yh?chktype="+$CONFIG['check_type'];
                     succ_tip = succ_tip+"<br>收到报告后24小时内，点这里“<a href='"+domain+"' target='_blank' style='color:red'>领红包</a>”";
                 }
                 var is_login = $("#hidden_params").attr("is_login");
                 var is_notice_paper_status = $("#hidden_params").attr("is_notice_paper_status");
                 if(is_notice_paper_status*1) {
                	 $('.modelCont2').remove();
                     if(!is_login*1) {
                         var unionid_page_id = $("#hidden_params").attr('unionid_page_id');
                         var fuid = $("#hidden_params").attr('f');
                         get_mp_qrcode({saleid:dataList.paper_id, fuid:fuid, unionid_page_id:unionid_page_id});
                         var mp_qrcode_url = $("#hidden_params").attr('mp_qrcode_url');
                         if(mp_qrcode_url) {
                             var inf = '<div class="modelCont2"><img style="width:150px" src="'+mp_qrcode_url+'"><br><span style="position:relative;left:23%">关注公众号</span><br><span style="margin-left:5px">检测完成后就会通知您</span></div>';
                             $(".modelCont").after(inf);
                         }
                         
                         
                     } else {
                         var inf = '<div class="modelCont2" style="margin-top:0px;width:80%;font-size:15px"><span>检测完成后会通过公众号推送消息给您</span></div>';
                         $(".modelCont").after(inf);
                     }
                 }
                 MOD.alertFn2("提示",succ_tip,"去下载报告","再检测一篇");
                 $(".dbLayModel .btn").click(function(){
                     var nIndex=$(this).index();
                     if(nIndex==0){//去下载报告
                    	 location.href=webUrl+"/report/tid/"+tidOrder;
                     }else{
                         location.reload();//刷新页面
                     }
                 });
                 $('.model.dbLayModel').prepend($("<div class='del-alert-btn'>x</div>"));
                 $('.del-alert-btn').css("position",'absolute');
                 $('.del-alert-btn').css('cursor','pointer');
                 $('.del-alert-btn').css('right','20px');
                 $('.del-alert-btn').css('top','10px');
                 $('.del-alert-btn').css('font-size','25px');
                 $('.del-alert-btn').click(function(){
                	 $('#mask').fadeOut();
                	 $('.model.dbLayModel').fadeOut();
                 });
                 setTimeout(function(){
                	 $('#mask').click(function(){
                    	 $('#mask').fadeOut();
                    	 $('.model.dbLayModel').fadeOut();
                    	 $('#mask').unbind('click');
                     });
                 },200);

             }else{
            	 if(msg.indexOf("检测卡支付金额不足")==-1){
                     MOD.alertFn("提示",msg,"关闭");
                 }else{
                	 if(submitObj.pay_type==1 && $("#qrcodeOutter").css('display')!='block'){
	                	 if($("#payLessAlert").length>0){
		                	 $('#payLessAlert').remove();
		                	 $('#payMethodId').remove();
		                	 $('#qrcodeMp').remove();
		                	 $('.buy-way').remove();
	                	 }
	                	 var flagnum = 2;
	                	 var flagStr = "微信";
	                	 if($CONFIG['pay_list'].toString().indexOf('2') == -1){
	                		 flagnum = 3;
	                		 flagStr = "支付宝";
	                	 }

	                	 $('#subbtn').before("<div id='payLessAlert' style='display: none;padding-left: 14px;color:blue;width:598px;border-radius:5px;background-color:#ddf4fb;height:60px;line-height:19px;padding-top:11px;box-sizing:border-box;font-size:12px;margin-bottom:20px;'><span id='moneyOutter' style='color:red;'>"+msg.split('。')[0]+"。</span><p></p>充值只允许充值一次,是本次检测检测卡余额不够,而充值的剩余支付部分</div>");
	                	 var moneyNum = $('#moneyOutter').find('span').text();
	                	 $('#payLessAlert').after('<div id="payMethodId" class="buy payMethod card-item" style="display: none;margin-bottom:34px;margin-top: 14px;width: 200px;height:50px;"></div><div class="buy-way" data="2" style="display:none;float: left; margin: auto 12px; line-height: 0; width: 40px;"><div><img class="wx-btn" src="//css.celunwen.com/assets_v2/images/right/wx_hover.png"></div><div class="name wx-name" style="color: rgb(5, 180, 17);     height: 27px;     line-height: 27px;     padding-left: 4px;color: rgb(5, 180, 17);">微信</div><img class="jiantou" style="width: 40px;" src="//css.celunwen.com/assets_v2/images/card/jiantou.png" style="display: inline;"></div><div class="buy-way" data="3" style="display:none;float: left; margin: auto 12px; line-height: 0; width: 40px; /* height: 40px; */"> 										<div><img class="zfb-btn" src="//css.celunwen.com/assets_v2/images/right/zfb.png"></div> 										<div class="name zfb-name" style="color: rgb(5, 180, 17);     height: 27px;     line-height: 27px;color: rgb(173, 173, 173);">支付宝</div><img class="jiantou" style="width: 40px;display:none;" src="//css.celunwen.com/assets_v2/images/card/jiantou.png" style="display: none;"></div></div>');
	                	 $("#payMethodId").after(""+
	                			 "<div id='qrcodeMp' style='overflow: hidden;margin-bottom:20px;width:599px;border-radius: 5px;height:130px;background-color: rgb(238,238,238);'>"+
		                			 "<div class='errorInfo' style='background: rgba(0,0,0,0.68);width:90px;height:90px;margin-top:20px;margin-left:20px;float:left;display:none;'>"+
		                			 	"<img style='width: 40px; margin-left: 25px; margin-top: 10px;' src='//css.celunwen.com/assets_v2/images/right/jing.png'>"+
		                			 	"<h2 style='height: 18px;line-height: 18px;color: white;text-align: center;'>支付异常</h2>"+
		                			 	"<p class='payError' style='height: 19px;  line-height: 17px !important;  color: white; text-align: center;'>请勿频繁操作</p>"+
		                			 "</div>"+
		                			 "<div id='qrcodePos' style='position:relative;'>"+
			                			 "<div id='qrcodeOutter' style='margin-left: 100px;position:relative;width:90px;height:90px;margin-top:20px;margin-left:96px;float:left;'>"+
			                			 	"<div style='position:absolute;width:25px;height:25px;top:32.5px;left:32.5px;'>"+
			                			 		"<img style='display:none;' id='payLogoImg' src='' width='100%' height='100%'/>"+
			                			 	 "</div>"+
			                			 	"<div id='paySuccessAlt' style='display:none;color:#70B838;position:absolute;width:177px;height:18px;top:105.5px;padding-left:30px;font-size:15px;padding-top:2px;left:-0.5px;background:url(//css.celunwen.com/assets_v2/images/pay_success.png) 20px no-repeat;background-position:1px -24px;background-size:20px;'>"+
		                			 		"支付成功，正在提交论文...</div>"+
			                			 "</div>"+
		                			 "</div>"+
		                			 "<div style='line-height: 1.5;float: left;width: 130px;margin-top: 20px;margin-left: 50px;width: 295px;'>"+
		                			 	"<div style='color: rgb(167,167,167);font-size: 15px;text-align: center;'>检测卡余额不足，需要补交金额</div>"+
		                			 	"<div style='font-size: 28px;color:rgb(252,91,93);text-align:center;}'>"+moneyNum+" 元</div>"+
		                			 	"<div style='color: rgb(167,167,167);font-size: 15px;text-align: center;'>"+flagStr+"扫码支付</div>"+
	                			 	  "</div>"+
	                			 	  "<input id='is_recharge' value='1' type='hidden'/>"+
	                			  "</div>");
	                	 bindEventCheckCard();

	                	 $('#subbtn').hide();
	                	 $('.buy-way').each(function(){
	                		 var dataNum = $(this).attr('data');
	                		 if(dataNum==flagnum){
	                			 $(this).trigger('click');
	                		 }
	                	 });
                	 }
                 }
                 $('.model.layModel').find('.down_report_a').click(function(){
                	 if(msg.indexOf("class='down_report_a'")>-1){
                     	$(".model.layModel").find('.modelCont').click(function(){
                     		window.open(location.href+'/report?tid='+$('.testTip.input_hit.hitTip').val());
                     	});
                     }
                 });

                 if(msg.indexOf("文件不正确")>-1){
                	 localStorage.clear();
            		 $('.btn.selected').click(function(){
            			 window.location.reload();
            		 });
            	 }
             }
         },
         error:function(){
        	 $('#submit_btn_mask').hide();
         }
     })
     $(".submitBtn").removeAttr("disabled");
 }
var submit_btn_mask_timer = setInterval(function(){
	 if($('#submit_btn_mask').css('display')=='block'){
		 $('#submit_btn_mask').fadeOut(2000);
	 }
}, 100);
//故障订单的编号
 function getTestTip(ele){
        ele.unbind("textchange");
        ele.bind("textchange",function(){
            var inputVal= $.trim(ele.val());
            var objData={};
            var _that=ele;
            if(_that.hasClass("hitTip")){
                if(inputVal.length < 17) {
                    MOD.faultTid(_that,inputVal);
                } else if(inputVal.length >= 17) {
                    objData={"pay_type":myPayType,"tid":inputVal};
                    mytestTip(_that,objData)
                }
            }else{
                if(myPayType == 0 && MOD.taobaoTid(_that,inputVal)) {
                    var objData={"pay_type":myPayType,"tid":inputVal};
                    mytestTip(_that,objData)
                }

                if(myPayType == 4 && MOD.jingdongTid(_that,inputVal)) {
                    var objData={"pay_type":myPayType,"tid":inputVal};
                    mytestTip(_that,objData)
                }
            }
            if($('.rules_order_num').css('display') == 'block'){
                $('.tb-rules-test').css('margin-top','-5px');
            }else{
            	$('.tb-rules-test').css('margin-top','15px');
            }
        })
    }

//多篇
 function getTimerPage2() {
	    clearInterval(timerPage);
	    timerPage = setInterval(function() {
	      if(!uploader.isInProgress()){
	        var _that = $('.payMethod a[payList="' + myPayType + '"]');
	        var storage_type = $("#storage_type").val();
	        storage_type = Math.round(storage_type * 100) / 100;
	        if (amount != storage_type) {
	          amount = storage_type;
	          amount = Math.round(amount * 100) / 100;
	          $(".promptText").hide();
	          $(".promptText").children().hide();
	          clearTimeout(timerSet);
	          clearTimeout(timerRefresh);
	          clearInterval(timerInt);
	          var objData = {
	            "item_type":ITEM_CHECK,
	            "type":$CONFIG['check_type'],
	            "total_fee": amount,
	            "pay_type": myPayType,
	            "page_id": pageId
	          };
	          if(objData.total_fee > 0 ){
	            scanPayment(_that, objData);
	          }else{
	            $(".zf_cont[paylist!='0']").removeClass("selected");
	            $(".zf_cont[paylist!='0'] input").val("");
	            var paretEle = $(".payMethod span[paylist!='0']");
	            paretEle.find("a").removeClass("selected");
	            paretEle.find(".maskLayer").hide();
	          }
	          countDown();
	        }
	      }
	    }, 400)
	  }

// blur的时候 对页面进行刷新
    clearInterval(timerPage);
    /*if(myPayType!=0){
        if(typePage==1){
            getTimerPage()
        }
    }*/
    function getTimerPage(){
        timerPage = setInterval(function(){
            var _that=$('.payMethod a[payList="'+myPayType+'"]')
            if(paper_type==1 && is_paper_file_check_type == 1){
            	var varn_nums=$("#paper_pay_nums").html();
            	var varn_words=$(".paper_file_word_num").html();//字数
            }else{
            	var varn_nums=$("#varn_nums").html();
            	var varn_words=$(".varn_words").html();//字数
            }

            varn_nums = Math.round(varn_nums * 100) / 100;
            var storage_type = $("#storage_type").val();
            storage_type = Math.round(storage_type * 100) / 100;
            if(storage_type != varn_nums && storage_type != 0 && varn_words != 0){
                $(".promptText").hide();
                $(".promptText").children().hide();
                clearTimeout(timerSet);
                clearTimeout(timerRefresh);
                clearInterval(timerInt);
                $("#storage_type").val(varn_nums);
                var objData={"item_type":ITEM_CHECK,"type":$CONFIG['check_type'],"total_fee":varn_nums,"pay_type":myPayType,"page_id":pageId};

                if(is_reduce_check) {
                	objData.reduce_type = $('#reduce_type_hidden').text();
                	objData.reduce_taskid = $('#taskId').text();
                }

                scanPayment(_that,objData);
                countDown();
            }
        },500);
    }


  //订单号有效性
    function mytestTip(ele,objData){
    	var device_id = $("#device_id").val();
    	objData.device_id = device_id;
    	var script_url = $("#script_url").val();
    	objData.script_url = script_url;
        $.ajax({type:"get", cache:false, url:webUrl+"/ajax_check_order", data:objData,
            success:function(jsondata){
            	$('.zf_cont').each(function(){
            		if($(this).hasClass('selected')) {
                    	myPayType = $(this).attr('paylist');
            		}
            	});
                jsondata=JSON.parse(jsondata);
                var mesg=jsondata.info;
                alertMsg=mesg;
                if(myPayType==0){
                    if(ele.attr("id")=="tb_order1"){
                        tid=objData.tid;
                    }else if(ele.attr("id")=="tb_order2"){
                        tid2=objData.tid;
                    }else if(ele.attr("id")=="tb_order3"){
                        tid3=objData.tid;
                    }
                }else if(myPayType==4){
                    if(ele.attr("id")=="jd_order1"){
                        tid=objData.tid;
                    }else if(ele.attr("id")=="jd_order2"){
                        tid2=objData.tid;
                    }else if(ele.attr("id")=="jd_order3"){
                        tid3=objData.tid;
                    }
                } else {
                    tid=objData.tid;
                }
                if(jsondata.status){
                    ele.css("border-color","#45b549");
                    $(".zf_cont[payList='" + myPayType + "']").find(".rules").hide().html('');
                }else{
                    ele.css("border-color","#ff9900");
                }
                if(!jsondata.status) {
                    $(".zf_cont[payList='" + myPayType + "']").find(".rules").show().html(jsondata.info);
                    if(jsondata.info.indexOf("class='down_report_a'")>-1){
                    	$(".zf_cont[payList='" + myPayType + "']").find('.down_report_a').click(function(){
                    		window.open(location.href+'/report?tid='+objData.tid);
                    	});
                    }
                }
            }
        })
    }
//DOM的筛选
/*function getQrcode(ele){
    for(var i=0;i<ele.length;i++){
        var curEle=ele[i];
        if(curEle.getAttribute("payList")==2){
            return document.getElementsByClassName("qrCodeView")[0];
        }else{
            return document.getElementsByClassName("qrCodeView")[1];
        }
    }
}*/
 //倒计时
 function timeCountDown(seconds,cb2){
     timerInt = setInterval(function(){
    	    seconds--;
            if(seconds == 0){
                clearInterval(timerInt);
                cb2();
            }
        },1000);
    }
   /*function evalJSON(src) {
        if (typeof (JSON) == 'object' && JSON.parse)
            return eval("[" + src + "]")[0];
        return eval("(" + src + ")");

    };*/
   /* var $list=$(".fileCont");
    var  state = 'pending';
    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,
        // swf文件路径
        swf: '/js/Uploader.swf',
        // 文件接收服务端。
        server: '//webuploader.duapp.com/server/fileupload.php',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '.startText',
        // 只允许选择图片文件。
        resize: false
    });
    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {
        $list.find("input").attr("id",file.id).addClass("item").val(file.name)
    });

    uploader.on( 'uploadSuccess', function( file ) {
        $btn.text('暂停上传');
    });

    uploader.on( 'uploadError', function( file ) {
        $btn.text('暂停上传');
    });

    /!*uploader.on( 'uploadComplete', function( file ) {
     $( '#'+file.id ).find('.progress').fadeOut();
     });*!/

    uploader.on( 'all', function( type ) {
        if ( type === 'startUpload' ) {
            state = 'uploading';
        } else if ( type === 'stopUpload' ) {
            state = 'paused';
        } else if ( type === 'uploadFinished' ) {
            state = 'done';
        }

        if ( state === 'uploading' ) {
            $btn.text('暂停上传');
        } else {
            $btn.text('开始上传');
        }
    });*/



    /*// 文件上传过程中创建进度条实时显示。
     uploader.on( 'uploadProgress', function( file, percentage ) {
     var $li = $( '#'+file.id ),
     $percent = $li.find('.progress .progress-bar');

     // 避免重复创建
     if ( !$percent.length ) {
     $percent = $('<div class="progress progress-striped active">' +
     '<div class="progress-bar" role="progressbar" style="width: 0%">' +
     '</div>' +
     '</div>').appendTo( $li ).find('.progress-bar');
     }

     $li.find('p.state').text('上传中');

     $percent.css( 'width', percentage * 100 + '%' );
     });
     $btn.on( 'click', function() {
     if ( state === 'uploading' ) {
     uploader.stop();
     } else {
     uploader.upload();
     }
     });
     */

    function useCoupon(coupon_code,coupon_money) {
        var info="";
        var info2="";
        var appent = "";
        $("#hidden_params").attr("coupon-code",coupon_code);
        $("#hidden_params").attr("coupon-money",coupon_money);

        //insertPayList();
        if(myPayType == 0) {
            scanTaobaoQrcode();
        }else if(myPayType == 2 || myPayType == 3) {
            var coupon_login_cookie = $("#hidden_params").attr("coupon-login-cookie");
            coupon_code = $("#hidden_params").attr("coupon-code");
            coupon_money = $("#hidden_params").attr("coupon-money");
            var is_open_coupon = $CONFIG['is_open_coupon']; // 是否开启优惠券
            var is_have_coupon_rule = $CONFIG['is_have_coupon_rule']; // 是否有优惠券规则
            is_have_coupon = $("#hidden_params").attr("is_have_coupon");

            if(coupon_login_cookie != "") {                    // 登录
                if(is_have_coupon == 1) {                      // 有优惠券
                    if(coupon_money && coupon_code) {          // 使用
                    	var conpon_text_color = 'red';
                    	var conpon_text_content = '优惠券已立减'+coupon_money+'元';
                    	var conpon_text_class = '';
                    	var style_pointer = '';
                    	if(coupon_money == 0){
                    		conpon_text_color = 'blue';
                    		conpon_text_content = '点击此处选择优惠券';
                    		conpon_text_class = 'p-select-share-coupon-btn';
                    		style_pointer = 'cursor:pointer;';
                    	}
                        info = '<p style="'+style_pointer+'color:'+conpon_text_color+'" class="'+conpon_text_class+'" >'+conpon_text_content+'</p>';
                        info2= '<label class="'+conpon_text_class+'" style="'+style_pointer+'line-height:20px;height:20px;color:'+conpon_text_color+'">'+conpon_text_content+'</label>';
                        appent = '还';


                        var storage_money = $("#storage_type").val();
                        if(storage_money > coupon_money) {
                        	storage_money = storage_money - coupon_money;
                        	storage_money = storage_money.toFixed(2);
                        } else {
                        	storage_money = "0.01";
                        }
                    } else {                                   // 不使用
                        info = '<p style="color:blue;cursor:pointer;" class="p-select-share-coupon-btn">点击此处选择优惠券</p>';
                        info2= '<label style="line-height:20px;height:20px;color:blue;cursor:pointer;" class="p-select-share-coupon-btn">点击此处选择优惠券</label>';
                    }
                } else {
                    if(is_open_coupon == 1) {                  // 开启优惠券
                        if(is_have_coupon_rule == 1) {         // 有优惠券规则
                            info = '<p style="color:blue;cursor:pointer;" class="share-no-coupon-btn">点击此处上传分享截图得优惠券</p>';
                            info2= '<label style="line-height:20px;height:20px;color:blue;cursor:pointer;" class="share-no-coupon-btn">点击此处上传分享截图得优惠券</label>';
                        }
                    }
                }
            } else {
                if(is_open_coupon == 1) {                  // 开启优惠券
                    if(is_have_coupon_rule == 1) {         // 有优惠券规则
                        info = '<p style="color:blue;cursor:pointer;" class="login-share-btn">点击此处登录分享可得优惠券立减</p>';
                        info2= '<label style="line-height:20px;height:20px;color:blue;cursor:pointer;" class="login-share-btn">点击此处登录分享可得优惠券立减</label>';
                    }
                }
            }
            if($CONFIG['is_open_coupon'] != 1 || $CONFIG['is_have_coupon_rule'] != 1) {
            	info = '';
            	info2 = '';
            }
            info += appent+'<p>需支付金额<b class="amountTotal">￥'+storage_money+'</b></p>';
            $("#decrease_money_2").html(info);
            $("#decrease_des_2").html(info2);
            $("#decrease_money_3").html(info);
            $("#decrease_des_3").html(info2);
            $(".login-share-btn").bind("click",function(){
            	$('#coupon_img_right').trigger('click');
            });
            $(".p-select-share-coupon-btn").bind("click",function(){
            	$('#coupon_img').trigger('click');
            });
            $(".share-no-coupon-btn").bind("click",function(){
            	$('#share_guide').find('span').trigger('click');
            });
            var _that = $(".refreshPay");
            _that.hide();
            _that.parents('.promptText').hide();
            clearTimeout(timerSet);
            clearInterval(timerInt);
            clearTimeout(timerRefresh);
            if (typePage == 1) {
            	if(paper_type==1 && is_paper_file_check_type == 1){
            		amount=$("#paper_pay_nums").html();
                	var varn_words=$(".paper_file_word_num").html();//字数
                }else{
                	amount = $("#varn_nums").html();
                    var varn_words = $(".varn_words").html();
                }
            	amount = Math.round(amount * 100) / 100;
            } else if (typePage == 2) {
                amount = $("#storage_type").val();
                amount = Math.round(amount * 100) / 100;
            }

            var objData={
                "item_type": ITEM_CHECK,
                "type"     : $CONFIG['check_type'],
                "total_fee": amount,
                "pay_type" : myPayType,
                "page_id"  : pageId
            };

            if(is_reduce_check) {
            	objData.reduce_type = $('#reduce_type_hidden').text();
            	objData.reduce_taskid = $('#taskId').text();
            }

            scanPayment(_that,objData);
            countDown();
        }
    }

    $('.socket_coupon').click(function(){
        coupon_code = $(this).find('.code_coupon').html();
        coupon_money = $(this).find('.money_coupon').html();
        is_admit_coupon=$("#hidden_params").attr("is_admit_coupon");
        if(is_admit_coupon != "") {
            useCoupon(coupon_code,coupon_money);
        }
    });

    if(hide_tid != "undefined" && hide_tid != null && hide_tid != ""){
        var ele = $("#tb_order1");
        var inputVal= $.trim(ele.val());
        if(myPayType == 0 && MOD.taobaoTid(ele,inputVal)) {
            mytestTip(ele,{"pay_type":myPayType,"tid":inputVal})
        }

        var top='15px';
        if($('.rules_order_num').css('display') == 'block') top = '-5px';
        $('.tb-rules-test').css('margin-top',top);
    }
})

function changeTBRules(){
    $("#purchases_piece").html(Math.ceil((Number($(".varn_words").text())/$CONFIG['unit'])));
    var paper_file_word_num = Math.ceil(Number($('.paper_file_word_num').text())/$CONFIG['unit']);
    var buy_paper_file = Math.ceil((Number($(".varn_words").text())/$CONFIG['unit']));
    if(paper_file_word_num>0){
    	buy_paper_file = paper_file_word_num;
    	$("#purchases_piece").html(paper_file_word_num);
    }
    if(is_reduce_check){
    	var buy_nums = Math.ceil((Number($('#repeatWordCount').text())/$CONFIG['unit']));
        $('.tb-rules').html('应拍' + buy_nums + '件');
    }else{
    	$('.tb-rules').html('应拍' + $('.item').length + '件');
    }
    $('.tb-rules-test').html('应拍<span style="font-size:18px;">' + buy_paper_file + '</span>件（'  + $CONFIG['unit'] + $CONFIG['unit_name'] + ' / ' + $CONFIG['unit_piece'] + '件)' );
}
function insertPayBtn() {
	  var payWay = JSON.parse($CONFIG['pay_list']);
	  var con = [];
      var pay_tuiguang_class = '';
      var wx_coupon_status = $CONFIG['wx_is_open_coupon'];
	  if($CONFIG['uid']==13 || $CONFIG['uid']==1710 || $CONFIG['uid']==1737){
		  pay_tuiguang_class = "a_tuiguang";
	  }
	  for (i = 0; i < payWay.length; i++) {
	    if (payWay[i] == 0) {
	      con.push('<span class="way_00" payList="0"><a href="javascript:;">淘宝订单<i></i></a><div class="maskLayer"></div></span>');
	    }
	    if (payWay[i] == 2) {
	      con.push('<span class="way_02" payList="2"><a class="'+pay_tuiguang_class+'" href="javascript:;">微信<i></i></a><div class="maskLayer"></div></span>');
	    }
	    if (payWay[i] == 3) {
	      con.push('<span class="way_03" payList="3"><a class="'+pay_tuiguang_class+'" href="javascript:;">支付宝<i></i></a><div class="maskLayer"></div></span>');
        }
        // 配置检测卡和微信卡包
        var copuon_label = "检测卡 ";
        if (wx_coupon_status == 1) copuon_label += "/ 微信优惠券";
	    if (payWay[i] == 1) {
		  con.push('<span class="way_01" payList="1"><a href="javascript:;">'+copuon_label+'<i></i></a><div class="maskLayer"></div></span>');
		}
	    if (payWay[i] == 4) {
		  con.push('<span class="way_04" payList="4"><a href="javascript:;">京东订单<i></i></a><div class="maskLayer"></div></span>');
		}
	  }
	  $(".payMethod").html(con.join(''));
	}

function insertPayList() {
  var payWay = $CONFIG['pay_list'];
  var con = [];
  for (i = 0; i < payWay.length; i++) {
    if (payWay[i] == 0) {
      con.push('<div class="zf_cont" payList="0">');
      con.push('<div class="pad clearfix">');
      con.push('<label class="bianhao">订单编号：</label>');
      con.push('<div class="search" style="position:relative;">');
      con.push('<div class="list_01" style="overflow: hidden;">');
      if($CONFIG['guide_url']){
    	  con.push('<div class="copyTbRules" style="position:relative;left:11px">淘宝APP扫码拍单</div>');
      }
      con.push('<div class="orderAll">');
      con.push('<input type="text" style="line-height:34px" class="testTip" id="tb_order1" value="'+hide_tid+'" placeholder="'+hide_tid+'"/>');
      con.push('<input type="text" style="line-height:34px" class="testTip" id="tb_order2" />');
      con.push('<input type="text" style="line-height:34px" class="testTip" id="tb_order3" />');
      con.push('</div>');
      con.push('</div>');
      con.push('<div id="qrcode" style="float:right;position:relative;top:-103px;left:30px"></div>');
      con.push('<p class="trip" style="margin-top:15px">一个订单号不够时，可补拍，最好一个订单拍够</p>');
      con.push('<p class="trip" style="margin-bottom:10px">系统按累计金额计算，最多支持3个订单号。</p>');
      con.push('<div class="rules rules_order_num">');
      con.push('</div>');
      if ($("#typePage").attr("pageType") == 1) {
          con.push('<div class="tb-rules-test" style="margin-top:15px;">');
        } else {
          con.push('<div class="tb-rules" style="margin-top:15px">');
        }
      con.push('<div style="height:12px"></div>');
      con.push('</div>');

      //con.push('<div class="schBtn" style="position:relative;left:70%;top:20px">');
      if($CONFIG['guide_url']){
          con.push('<a id="guide_url" href="'+$CONFIG['guide_url']+'" target="_blank"><p class="resBtn taoOrder" style="position:absolute;left:325px;top:200px;z-index:999">电脑拍单</p></a>');
      }
      //con.push('</div>');

      con.push('<div class="whatOrder" style="position:relative;bottom:11px">');
      con.push('<div style="height:12px"></div>');
      con.push('<span>什么是订单编号？</span>');
      con.push('<p class="whatDes">');
      con.push('<img src="//css.celunwen.com/assets_v2/images/right/tb_tips.jpg"/>');
      con.push('</p>');
      con.push('</div>');
      con.push('</div>');
      con.push('</div>');


      con.push('</div>');
    }
    if (payWay[i] == 2) {
      con.push('<div class="zf_cont" payList="2">');
      con.push('<div class="wx_zf clearfix">');
      con.push('<div class="codeLeftBar scanCode selected">');
      con.push('<div class="qrCode">');
      con.push('<div class="qrCodeView" id="qrCodeView1"></div>');
      con.push('<div class="promptText">');
      con.push('<div class="successPay">');
      con.push('<img src="//css.celunwen.com/assets_v2/images/right/zf_cg.png" />');
      con.push('<h2>支付成功</h2>');
      con.push('</div>');
      con.push('<div class="refreshPay">');
      con.push('<img src="//css.celunwen.com/assets_v2/images/right/shuaxin.png" />');
      con.push('<h2>刷新重试</h2>');
      con.push('</div>');
      con.push('<div class="faultPay">');
      con.push('<img src="//css.celunwen.com/assets_v2/images/right/jing.png" />');
      con.push('<h2>支付异常</h2>');
      con.push('<p class="payError">支付异常</p>');
      con.push('</div>');
      con.push('</div>');
      con.push('</div>');
      con.push('<div id="decrease_money_2" class="moeny">');
      con.push('<p>需支付金额<b class="amountTotal"></b></p>');
      con.push('<p>扫码支付后会自动提交</p>');
      con.push('</div>');
      con.push('</div>');
      con.push('<div class="codeLeftBar order_rules left">');

      con.push('<div id="decrease_des_2"></div>');

      con.push('<label>请输入订单编号</label>');
      con.push('<input type="text" style="line-height:34px" class="testTip input_hit hitTip" />');
      con.push('<div class="rules" style="margin-top:28px;">');
      con.push('提示说明，有则显示，无则不显示，XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      con.push('</div>');
      con.push('<label class="trip" style="margin-top:10px;width:300px;height:20px;line-height:20px;">什么是微信订单号?</label>');
      con.push('<label class="trip" style="margin-top:3px;width:300px;height:20px;line-height:20px;">1.微信列表中找到微信支付</label>');
      con.push('<label class="trip" style="margin-top:3px;width:300px;height:20px;line-height:20px;">2.找到支付的订单，点击查看详情</label>');
      con.push('<label class="trip" style="margin-top:3px;width:300px;height:20px;line-height:20px;">3.找到商户单号，就是微信订单号</label>');
      con.push('</div>');
      con.push('<div class="payBtn right">');
      con.push('<li payList="2">');
      con.push('<a href="javascript:;" class="scanCodeBtn selected">');
      con.push('<span>扫码支付</span>');
      con.push('</a>');
      con.push('<p class="maskLayer"></p>');
      con.push('</li>');
      con.push('<li>');
      con.push('<a href="javascript:;" class="faultBtn">');
      con.push('<span>故障订单处理</span>');
      con.push('</a>');
      con.push('<p class="maskLayer"></p>');
      con.push('</li>');
      con.push('</div>');
      con.push('</div>');
      con.push('</div>');
    }
    if (payWay[i] == 3) {
      con.push('<div class="zf_cont" payList="3">');
      con.push('<div class="zfb_zf clearfix">');
      con.push('<div class="codeLeftBar scanCode selected">');
      con.push('<div class="qrCode">');
      con.push('<div class="qrCodeView"></div>');
      con.push('<div class="promptText">');
      con.push('<div class="successPay">');
      con.push('<img src="//css.celunwen.com/assets_v2/images/right/zf_cg.png" />');
      con.push('<h2>支付成功</h2>');
      con.push('</div>');
      con.push('<div class="refreshPay">');
      con.push('<img src="//css.celunwen.com/assets_v2/images/right/shuaxin.png" />');
      con.push('<h2>刷新重试</h2>');
      con.push('</div>');
      con.push('<div class="faultPay">');
      con.push('<img src="//css.celunwen.com/assets_v2/images/right/jing.png" />');
      con.push('<h2>支付异常</h2>');
      con.push('<p class="payError">支付异常</p>');
      con.push('</div>');
      con.push('</div>');
      con.push('</div>');

      con.push('<div id="decrease_money_3" class="moeny">');
      con.push('<p>需支付金额<b class="amountTotal"></b></p>');
      con.push('<p>扫码支付后会自动提交</p>');
      con.push('</div>');

      con.push('</div>');

      con.push('<div class="codeLeftBar order_rules left">');

      con.push('<div id="decrease_des_3"></div>');

      con.push('<label>请输入订单编号</label>');
      con.push('<input type="text" style="line-height:34px" class="testTip input_hit hitTip" />');
      con.push('<div class="rules" style="margin-top:28px;">');
      con.push('提示说明，有则显示，无则不显示，XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      con.push('</div>');
      con.push('<label class="trip" style="margin-top:10px;width:300px;height:20px;line-height:20px;">什么是支付宝订单号?</label>');
      con.push('<label class="trip" style="margin-top:3px;width:300px;height:20px;line-height:20px;">1.支付宝列表中找到支付助手</label>');
      con.push('<label class="trip" style="margin-top:3px;width:300px;height:20px;line-height:20px;">2.找到支付的订单，点击查看详情</label>');
      con.push('<label class="trip" style="margin-top:3px;width:300px;height:20px;line-height:20px;">3.找到商户订单号，就是支付宝订单号</label>');
      con.push('</div>');
      con.push('<div class="payBtn right">');
      con.push('<li payList="3">');
      con.push('<a href="javascript:;" class="scanCodeBtn selected">');
      con.push('<span>扫码支付</span>');
      con.push('</a>');
      con.push('<p class="maskLayer"></p>');
      con.push('</li>');
      con.push('<li>');
      con.push('<a href="javascript:;" class="faultBtn">');
      con.push('<span>故障订单处理</span>');
      con.push('</a>');
      con.push('<p class="maskLayer"></p>');
      con.push('</li>');
      con.push('</div>');
      con.push('</div>');
      con.push('</div>');
    }
    if (payWay[i] == 1) {
      var info='';
      if($('#fx_login_openid').html()!=''){
    	  info = "<div href='javascript:void(0)' id='get_checkcard_list'><p class='resBtn' style='position:absolute;top:40px;right:10px;background-color:rgb(66,128,255)'>我的检测卡</p></div>";
      }
      info += "<a href='//"+document.location.host+"/reward/card_rule_list?type="+$CONFIG['check_type']+"' target='_blank'><p class='resBtn' style='position:absolute;right:10px;background-color:rgb(66,128,255)'>购买检测卡</p></a>";
      if($CONFIG['is_have_card_rules'] == 0) info = "";
      // 配置微信卡包的 placeholder
      wx_coupon_label = "请输入检测卡号密码";
      if($CONFIG['wx_is_open_coupon'] == 1) wx_coupon_label = "如使用微信优惠券，密码留空";
      var check_card_placeholder = '请输入检测卡号';
      if($CONFIG['wx_is_open_coupon'] == 1) check_card_placeholder+='／微信优惠券卡号';
  
      con.push('<div class="zf_cont" payList="1">');
      con.push('<div class="pad clearfix">');
      con.push('<div class="tb clearfix">');
      con.push('<div style="position:relative">');
      con.push(info);
      con.push('</div>');
      con.push('<div class="fm_input" style="height:40px">')
      con.push('<label style="width:50px">卡号：</label>');
      con.push('<input type="text" style="line-height:20px" class="testTip" id="cardAccount" placeholder="'+check_card_placeholder+'" />');
      con.push('</div>');
      con.push('<div class="fm_input check-ok check-account"></div>');
      con.push('<br/>');
      con.push('<div class="fm_input">');
      con.push('<label style="width:50px">密码：</label>');
      con.push('<input type="password" style="line-height:20px" class="testTip" id="cardPassword" placeholder="'+wx_coupon_label+'" />');
      con.push('</div>');
      con.push('<div class="fm_input check-ok check-password"></div>');
      con.push('</div>');
      con.push('<p id="tishi" class="tishi" style="position:relative;left:76px"></p>');
      con.push('</div>');
      con.push('</div>');
    }

    if (payWay[i] == 4) {
        con.push('<div class="zf_cont" payList="4">');
        con.push('<div class="pad clearfix">');
        con.push('<label class="bianhao">订单编号：</label>');
        con.push('<div class="search" style="position:relative;">');
        con.push('<div class="list_04" style="overflow: hidden;">');
        if($CONFIG['guide_url']){
      	  con.push('<div class="copyTbRules" style="position:relative;left:11px">京东APP扫码拍单</div>');
        }
        con.push('<div class="orderAll">');
        con.push('<input type="text" style="line-height:34px" class="testTip" id="jd_order1" />');
        con.push('<input type="text" style="line-height:34px" class="testTip" id="jd_order2" />');
        con.push('<input type="text" style="line-height:34px" class="testTip" id="jd_order3" />');
        con.push('</div>');
        con.push('</div>');
        con.push('<div id="qrcode" style="float:right;position:relative;top:-103px;left:30px"></div>');
        con.push('<p class="trip" style="margin-top:15px">一个订单号不够时，可补拍，最好一个订单拍够</p>');
        con.push('<p class="trip" style="margin-bottom:10px">系统按累计金额计算，最多支持3个订单号。</p>');
        con.push('<div class="rules rules_order_num">');
        con.push('</div>');
        if ($("#typePage").attr("pageType") == 1) {
            con.push('<div class="tb-rules-test" style="margin-top:15px;">');
          } else {
            con.push('<div class="tb-rules" style="margin-top:15px">');
          }
        con.push('<div style="height:12px"></div>');
        con.push('</div>');

        //con.push('<div class="schBtn" style="position:relative;left:70%;top:20px">');
        if($CONFIG['guide_url']){
            con.push('<a id="guide_url" href="'+$CONFIG['guide_url']+'" target="_blank"><p class="resBtn jdOrder" style="position:absolute;left:325px;top:200px;z-index:999">电脑拍单</p></a>');
        }
        //con.push('</div>');

        con.push('<div class="whatOrder" style="position:relative;bottom:11px">');
        con.push('<div style="height:12px"></div>');
        con.push('<span>什么是订单编号？</span>');
        con.push('<p class="whatDes">');
        con.push('<img src="//css.celunwen.com/assets_v2/images/right/jd_tips.png"/>');
        con.push('</p>');
        con.push('</div>');
        con.push('</div>');
        con.push('</div>');


        con.push('</div>');
      }
  }
  $(".zf_tab").html(con.join(''));
}
insertPayBtn();
insertPayList();
	$("#is_use_card").click(function() {
        if($("#is_use_card").is(":checked")){
            $("#zf_tab").hide();
            $("#test_card").show();
            $("#pay_methods").hide();
        }else{
        	$("#zf_tab").show();
            $("#test_card").hide();
            $("#pay_methods").show();
        }
    })

    $('.addinput').click(function(){
        $("#test_card2").show();
        $(".addinput").hide();
        $(".decreaseinput").show();
    });
    $(".decreaseinput").click(function() {
        $("#test_card2").hide();
        $(".decreaseinput").hide();
        $(".addinput").show();
    });


function scanTaobaoQrcode() {
	// 淘宝二维码
	if($("#qrcode").attr('id') == 'qrcode') {
		if($CONFIG['guide_url']){
		  var tb_qrcode;
		  $("#qrcode").empty();
		  //生成二维码
		  tb_qrcode = new QRCode('qrcode', {
		      width : 150,
		      height : 150
		  });
		  tb_qrcode.makeCode($CONFIG['guide_url']);
		}
	}
}
scanTaobaoQrcode();
$("#get_help").click(function(){
	$("#get_help2").trigger('click');
});
$("#close_help").click(function(){
    $("#check_help").hide();
});
var payWayList = JSON.parse($CONFIG['pay_list']);
if(payWayList.length == 0) {
	$('#get_help').hide();
	$('#get_help2').hide();
}
$("#get_help2").click(function(){
	if($(this).hasClass('canotclick')) return true;

	if(payWayList.length != 0){
		if(payWayList.length == 1) {
			payTypeBar(payWayList[0]);
		}else{
			$('.pay_type_item').remove();
			var background_url = '';
			$('#pay_explain_bar').find('a').remove();
			$.each(payWayList,function(i,j){
				if(j==3 || j==2){
					$('#pay_explain_bar').append('<li class="pay_type_item" id="pay_type_item_0'+j+'" payitem= "'+j+'" style="cursor:pointer;"></li>');
				}
			});
			$.each(payWayList,function(i,j){
				if(j==3 || j==2){
					document.querySelector('#pay_type_item_0'+j).onclick = function(){
	                    var paytype_val = $(this).attr('payitem');
	                    $('.zf_cont').find('.testTip.input_hit.hitTip').val('');
	                    $('.zf_cont').find('.testTip.input_hit.hitTip').css('border-color','white');
	    				payTypeBar(paytype_val);
	                    document.querySelector("#payMethod_id_item").scrollIntoView(true);
	                }
				}
			});
			$('.pay_type_item').css('float','left').width('46px').height('46px').css('margin-left','10px');
			$('.pay_type_item[payitem=3]').css('background','url(//css.celunwen.com/assets_v2/images/right/zfb_hover.png) no-repeat center top');
			$('.pay_type_item[payitem=2]').css('background','url(//css.celunwen.com/assets_v2/images/right/wx_hover.png) no-repeat center top');
			$("#check_help").show();
		}
		var itex_width = $('#pay-itext-content').width()/2;
		var check_help_width = $('#check_help').width()/2;
		var itex_height = $('#pay-itext-content').height();
		var check_help_height = $('#check_help').height()/2;
		$('#pay-itext-content').css('left',check_help_width-itex_width);
		$('#pay-itext-content').css('top',check_help_height+34);
		$('#pay_explain_bar').css('margin-left', check_help_width-$('.pay_type_item').length*46/2-20);
	}
});

function payTypeBar(paytype) {
	myPayType = paytype;
	$('.zf_cont').removeClass('selected');
	$('.zf_cont[paylist='+paytype+']').addClass('selected');
	$('li[payList='+paytype+']').next().find('span').trigger('click');
	$('.payMethod').find('a').removeClass('selected');
	$('.payMethod').find('.way_0'+paytype).find('a').addClass('selected');
	$("#check_help").hide();
}
function show_pay_help() {
	var pay_list_arr = JSON.parse($CONFIG['pay_list']);
	var is_show = false;
	$.each(pay_list_arr,function(i,j){
		if(j==2 || j==3) {
			is_show = true;
		}
	});
	if(is_show === true){
		$('#get_help2').show();
	}
}
show_pay_help();
//校验内容
function checkNoCnkiFileContent(length) {
    if ($CONFIG['content_min'] > 0) {
        if (length < $CONFIG['content_min']){
            return {
               "code": 0,
               "msg": "论文内容字数不够"
           };
       }
    }
    if ($CONFIG['content_max'] > 0) {
        if (length > $CONFIG['content_max']){
            return {
                "code": 0,
                "msg": "论文内容字数超长"
            };
        }
    }

    return {
        "code": 1
    };
}
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
pos();
$(window).resize(function(){
	pos();
});
function pos(){
	$('.userListBodyLevel').css('top',$(window).height()/2-$('.userListBodyLevel').height()/2-50);
	$('.userListBodyLevel').css('right',$(window).width()/2-$('.userListBodyLevel').width()/2);
}

$('#get_checkcard_list').click(function(){
	$.ajax({
		url:'/ajax_get_buyer_card_list',
		type:'post',
		dataType:'json',
		data:{check_type:$CONFIG['check_type']},
		success:function(res){
			if(!res.status){
			    alert("您还没有检测卡，请点击购买检测卡购买");
			    return false;
			}
			$('.check_card_inf_tr').remove();
			pos();
			$.each(res.data, function(k,v){
				$('#check_card_tbody').append('<tr class="level_info_append check_card_inf_tr"><td class="trt level_txt" style="border-bottom:1px solid #e7e7eb;">'+v.card_id+'</td><td style="border-bottom:1px solid #e7e7eb;"><div class="jzy_boy_5 fs_14 cr_h_0" style="color:black;cursor: pointer;">'+v.card_password+'</div></td><td class="use_check_card" style="border-bottom: 1px solid #e7e7eb;color:blue;cursor:pointer;">使用</td></tr>');
			});
			user_checkcard();
			$('.userListBodyLevel').show();
		}
	});
});
$('.fx_info_detial_close').click(function(){
	$('.userListBodyLevel').hide();
});

function user_checkcard(){
	$('.use_check_card').click(function(){
		var card_id = $(this).parent().find('td').eq(0).html();
		var card_password = $(this).parent().find('td').eq(1).find('div').html();
		$('#cardAccount').val(card_id);
		$('#cardPassword').val(card_password);
		$('.userListBodyLevel').hide();
	});
}

function get_mp_qrcode(params) {
	$.ajax({
		url:"/create_weixin_concern_qrcode",
		type:'post',
		data:params,
		dataType:"json",
		async : false,
		success:function(data){
			if(data.status == true) {
				$("#hidden_params").attr("mp_qrcode_url", data.data.get_img_url);
			}
		},
		error:function(){
			alert("请求失败");
		}
	});
}