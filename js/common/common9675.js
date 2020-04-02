if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/ ) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        var T, A, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A;
    };
}
var MOD={
    //AJAX
    ajax:function(type, async ,cache,url,dataType, params, beforeFunc,successFunc, completeFunc,errorFunc) {
        $.ajax({
            type: type,
            async: async,
            cache:cache,
            url:$CONFIG['agent_domain'] + url,
            dataType: dataType,
            data: params,
            beforeSend: beforeFunc,
            success: successFunc,
            complete: completeFunc,
            error: errorFunc
        });
    },
    getJson:function(url, paramsObj,callbackFunc){
        $.getJSON($CONFIG['agent_domain']+url,paramsObj,callbackFunc,'json');
    },
    //close关闭
    closeFn:function(ele){
            ele.click(function(){
                if($(this).html()=="关闭"||$(this).html()==""){
                    $("#mask,.model").fadeOut();
                }
            })

    },
    //close关闭
    closeFn1:function(ele){
        ele.click(function(){
            if($(this).html()=="关闭"||$(this).html()==""){
                $("#mask,.model").hide();
            }
        })

    },
    //弹出框
    alertFn:function(msg1,msg2,msg3){
        $("#mask,.layModel").fadeIn();
        $(".layModel .mdTitle").html(msg1);
        $(".layModel .modelCont").html(msg2);
        $(".layModel .btn").html(msg3);
    },
    //弹出框
    alertFn1:function(msg1,msg2,msg3){
        $("#mask,.layModel").show();
        $(".layModel .mdTitle").html(msg1);
        $(".layModel .modelCont").html(msg2);
        $(".layModel .btn").html(msg3);
    },
    //弹出框
    alertFn2:function(msg1,msg2,msg3,msg4){
        $("#mask,.dbLayModel").fadeIn();
        $(".dbLayModel .mdTitle").html(msg1);
        $(".dbLayModel .modelCont").html(msg2);
        $(".dbLayModel .btn").eq(0).html(msg3);
        $(".dbLayModel .btn").eq(1).html(msg4);
    },
    //弹出框
    alertFn3:function(msg1,msg2,msg3){
        $("#mask,.noticeLayer").fadeIn();
        $(".noticeLayer .mdTitle").html(msg1);
        $(".noticeLayer .modelCont").html(msg2);
        $(".noticeLayer .btn").html(msg3);
    },
    //弹出框
    alertFn4:function(msg1,msg2,msg3){
        $("#mask,.changeModel").fadeIn();
        $(".changeModel .mdTitle").html(msg1);
        $(".changeModel .modelCont").html(msg2);
        $(".changeModel .btn").html(msg3);
    },
    //弹出框
    alertFn5: function(msg1, msg2, msg3, msg4, fun1, fun2) {
        $("#mask,.dbLayModel1").fadeIn();
        $(".dbLayModel1 .mdTitle").html(msg1);
        $(".dbLayModel1 .modelCont").html(msg2);
        $(".dbLayModel1 .btn").eq(0).html(msg3);
        $(".dbLayModel1 .btn").eq(1).html(msg4);
        $(".dbLayModel1 .btn").eq(0).unbind('click');
        $(".dbLayModel1 .btn").eq(1).unbind('click');
        $(".dbLayModel1 .btn").eq(0).bind('click', function() {
            $("#mask,.dbLayModel1").hide();
            fun1();
        });
        $(".dbLayModel1 .btn").eq(1).bind('click', function() {
            $("#mask,.dbLayModel1").hide();
            fun2();
        });
    },
    //弹出框
    alertFn6: function(msg1, msg2, msg3) {
        $("#mask,.noticeLayer1").fadeIn();
        $(".noticeLayer1 .mdTitle").html(msg1);
        $(".noticeLayer1 .modelCont").html(msg2);
        $(".noticeLayer1 .btn").html(msg3);
    },
    //tab切换
    tabChange:function(ele,parentsEle,contEle){
        ele.click(function(){
            var nIndex=$(this).index();
            var contentEle=$(this).parents(parentsEle).siblings(contEle);
            $(this).addClass("selected").siblings().removeClass("selected");
            contentEle.children().eq(nIndex).addClass("selected").siblings().removeClass("selected");
        })
    },
    //tab切换2
    tabChange2:function(ele,parentsEle,contEle){
        ele.bind("click",function(){
            var nIndex=$(this).index();
            var contentEle=$(this).parents(parentsEle).siblings(contEle);
            var heit=contentEle.children().eq(nIndex).height();
            if($(this).hasClass("selected")){
                if($(this).index() != 0 && $(document).height()<828){
                    $('.rightSide').css('position','static');
                }
                $('#wangwang-item').css('z-index','9999999999999');
                $('#get_help').css('z-index','9999999999999');
                $(this).removeClass("selected");
                contentEle.children().eq(nIndex).removeClass("selected");
                $(".resultCont").height("auto");
                $('.resultCont').css('z-index','9999999999999');
            }else{
                if($(this).index() != 0 && $(document).height()<828){
                    $('.rightSide').css('position','relative');
                }
                $('#wangwang-item').css('z-index','-1');
                $('#get_help').css('z-index','-1');
                $(".resultCont").css("height",parseFloat(heit)+50);
                $('.resultCont').css('z-index','9999999999999');
                $(this).siblings().removeClass("selected");
                contentEle.children().removeClass("selected");
                $(this).addClass("selected");
                contentEle.children().eq(nIndex).addClass("selected");
                getFooterPos();

            }
        })
    },
    // 鼠标悬停事件
    tabChangeByHover:function(ele,parentsEle,contEle){
        ele.bind("mouseover",function(){
            // 获取订单 ID
            var tid = getCookie('tid');
            var nIndex=$(this).index();
            var contentEle=$(this).parents(parentsEle).siblings(contEle);
            var heit=contentEle.children().eq(nIndex).height();
            if($(this).index() != 0 && $(document).height()<828){
                $('.rightSide').css('position','relative');
            }
            $('#wangwang-item').css('z-index','-1');
            $('#get_help').css('z-index','-1');
            $(".resultCont").css("height",parseFloat(heit)+50);
            $('.resultCont').css('z-index','9999999999999');
            if(tid != null) {
                $('.right-container').css('height', 'auto');
                $('.right-container').css('background', 'white');
            }else {
                $('.right-container').css('height', '300px');
                $('.right-container').css('background', 'white');
                $('.fm_input').css('position', 'absolute');
                $('.fm_input').css('z-index', '9999999999');
            }
            $(this).siblings().removeClass("selected");
            contentEle.children().removeClass("selected");
            $(this).addClass("selected");
            contentEle.children().eq(nIndex).addClass("selected");
            getFooterPos();
        });
        ele.bind("mouseout",function(){
            var nIndex=$(this).index();
            var contentEle=$(this).parents(parentsEle).siblings(contEle);
            if($(this).index() != 0 && $(document).height()<828){
                $('.rightSide').css('position','static');
            }
            $('#wangwang-item').css('z-index','9999999999999');
            $('#get_help').css('z-index','9999999999999');
            $(this).removeClass("selected");
            contentEle.children().eq(nIndex).removeClass("selected");
            $(".resultCont").height("auto");
            $('.resultCont').css('z-index','9999999999999');
        });
    },
    //tab切换3
    tabChange3:function(ele,parentsEle,contEle){
        ele.bind("click",function(){
            var contEleCur=$(this).parents(parentsEle).find(contEle);
            contEleCur.toggle();
        })

        /*ele.mouseenter(function(){
            var contentEle=$(this).parents(parentsEle);
            contentEle.find(contEle).show();
        }).mouseleave(function(){
            var contentEle=$(this).parents(parentsEle);
            contentEle.find(contEle).hide();
        })*/
    },
    //滚动效果
    scollList:function(ele){
        var _wrap = ele;
        var _interval = 3000;
        var _moving;
        _wrap.hover(function(){
            clearInterval(_moving);
        },function(){
            _moving = setInterval(function(){
                var _field = _wrap.find("li:first");
                var _h = _field.height();
                _field.animate({marginTop:-_h+'px'},600,function(){
                    _field.css('marginTop',0).appendTo(_wrap);
                })
            },_interval)
        }).trigger('mouseleave');
    },
    errorFun:function (jqueryObj, Msg) {
        jqueryObj.css('border-color', '#ff9900');
        jqueryObj.siblings(".tishi").html(Msg)
        return false;
    },
    infoFun:function (jqueryObj, Msg) {
        jqueryObj.css('border-color', '#45b549');
        jqueryObj.siblings(".tishi").html(Msg)
        return false;
    },

    rightFun:function (jqueryObj) {
        jqueryObj.css('border-color', '#45b549');
        jqueryObj.siblings(".tishi").html("");
        return true;
    },
    errorTextarea:function (jqueryObj,msg) {
        jqueryObj.css('border-color', '#ff9900');
        jqueryObj.parents(".textCont").siblings(".textTitle").find(".errorTrip").html(msg)
        return false;
    },

    rightTextarea:function (jqueryObj,num) {
        jqueryObj.css('border-color', '#45b549');
        jqueryObj.parents(".textCont").siblings(".textTitle").find(".errorTrip").html("");
        return true;
    },
    //正则校正故障订单编号位数
    faultTid:function(ele,tid){
        if(tid.length==17){
            return true;
        }else{
            ele.css("border-color","#ff9900");
            ele.next().show().html("请输入17位故障订单编号");
            return false;
        }
    },
    //正则校正淘宝订单编号位数
    taobaoTid:function(ele,tid){
        if(tid.length > 18 || tid.length < 13){
            ele.parents(".search").find(".rules").show().html("请输入13-18位订单编号")
            ele.css("border-color","#ff9900");
            return false;
        }else{
            return true;
        }
    },
    //正则校正京东订单编号位数
    jingdongTid:function(ele,tid){
        if(tid.length >12 || tid.length <11){
            ele.parents(".search").find(".rules").show().html("请输入11-12位订单编号")
            ele.css("border-color","#ff9900");
            return false;
        }else{
            return true;
        }
    },
    //时间倒数
    timeCountDown:function(seconds,cb2){
        timer = setInterval(function(){
            seconds--;
            if(seconds == 0){
                clearInterval(timer);
                cb2();
            }
        },1000);
    },
    JSONparse:function (str) {
        if (window.JSON) {
                return JSON.parse(str);
        }else{
            // 兼容ie6 7 8
            return eval('(' + str + ')');
        }
    }
}
function getFooterPos(){
    var heit=parseFloat($(".leftSide ").height()),
        heir=parseFloat($(".rightSide").height()),
        ritCont=parseFloat($(".rightCont").height()),
        ritFoot=parseFloat($(".rightFooter").height()),
        docmentH=parseFloat($(window).height());
    if(heit>heir){
        $(".rightCont").css("height",heit+5);
        /*$(".rightFooter").css({"position":"absolute","bottom":0})*/
    }else{
        $(".rightCont").css("height","auto");
    }
}
$(function(){
    IEVersion();
    MOD.closeFn($(".closeBtn"));
    MOD.closeFn($(".layModel .btn"));
    getFooterPos();
    function getFooterPos(){
        var heit=parseFloat($(".leftSide ").height()),
        heir=parseFloat($(".rightSide").height()),
        ritCont=parseFloat($(".rightCont").height()),
        ritFoot=parseFloat($(".rightFooter").height()),
        docmentH=parseFloat($(window).height());
        if(heit>heir){
            $(".rightCont").css("min-height",heit+5);
            /*$(".rightFooter").css({"position":"absolute","bottom":0})*/
        }else{
            $(".rightCont").css("min-height",heir+5);
        }
    }


    //判断是否是IE浏览器，包括Edge浏览器
    function IEVersion() {
        var browser = navigator.appName
        if (browser == "Microsoft Internet Explorer") {
            var b_version = navigator.appVersion
            var version = b_version.split(";");
            var trim_Version = version[1].replace(/[ ]/g, "");
            var msg01 = "提示",
                msg02 = "当前浏览器为" + trim_Version + "请下载新版本IE或者用chrome浏览器浏览",
            msg03 = "关闭";

            if (trim_Version == "MSIE6.0") {
                MOD.alertFn1(msg01, msg02, msg03);
            } else if (trim_Version == "MSIE7.0") {
                MOD.alertFn1(msg01, msg02, msg03);
            }
        }
    }
})
    var chk_type=$CONFIG['check_type'];
    /////////////表单相关///////////////////////////
    var WANFANG = 1;
    var WANFANG2 = 29;
    var WANFANG2BK = 32;
    var WANFANG2_SHBO = 30;
    var PAPERPASS = 2;
    var GOCHECK = 5;
    var WEIPU = 6;
    var WIDE_WEIPU = 22;
    var GRAD_WEIPU = 23;
    var PROF_WEIPU = 24;
    var EDIT_WEIPU = 27;
    var PAPERRATER = 7;
    var TURNITIN = 10;
    var TURNITINUK = 11;
    var COPYPASS = 12;
    var PAPERYY = 13;
    var DAYA = 14;
    var CHACHONGBAO = 18;
    var PAPERBOX = 19;
    var GRAMMARLY = 20;
    var DAYA_ZY = 2; //大雅默认摘要段数
    var COPYCHECK = 26;
    var EASE_COPYCHECK = 28;

    var RefeshTime = new Array();
    RefeshTime[WANFANG] = 10000;
    RefeshTime[WANFANG2] = 10000;
    RefeshTime[WANFANG2BK] = 10000;
    RefeshTime[WANFANG2_SHBO] = 10000;
    RefeshTime[PAPERPASS]=60000;
    RefeshTime[GOCHECK]=30000;
    RefeshTime[WEIPU]=30000;
    RefeshTime[WIDE_WEIPU]=30000;
    RefeshTime[GRAD_WEIPU]=30000;
    RefeshTime[PROF_WEIPU]=30000;
    RefeshTime[EDIT_WEIPU]=30000;
    RefeshTime[PAPERRATER]=30000;
    RefeshTime[TURNITINUK]=20000;
    RefeshTime[TURNITIN]=20000;
    RefeshTime[COPYPASS]=30000;
    RefeshTime[CHACHONGBAO]=30000;
    RefeshTime[PAPERYY]=30000;
    RefeshTime[PAPERBOX]=30000;
    RefeshTime[COPYCHECK]=30000;
    RefeshTime[EASE_COPYCHECK]=30000;

    var VCODE_LEN = 5;

    var CHECK_SUCC = 1;
    var DEL_REPORT = 5;
    var CHECK_PAUSE = 6;
    var CHECK_STOP = 2;

    var PAY_BY_TB = 0;
    var PAY_TYPE_WEIXIN = 2;
    var RETRY_SUBMIT_PAPER = 86;

    var email_reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var title_reg = /^([\u2400-\u27ff|\u2e80-\u2eff|\u3000-\u32ff|\u4e00-\u9fff|\uac00-\ud7af]|[A-Za-z0-9]|[ ])+$/;
    var price=$CONFIG['price'], //单价
    unit_num=$CONFIG['unit'] //几篇或者几百字
    //计算文本长度
    function txtLength(txt){
        if(chk_type == WANFANG || chk_type == WANFANG2 || chk_type == WANFANG2_SHBO || chk_type == WANFANG2BK) {
            var content = txt.replace(/\s/g,'');
            return content.length;
        }
        if(chk_type == DAYA || chk_type == PAPERPASS || chk_type == PAPERYY || chk_type == CHACHONGBAO || chk_type == COPYCHECK || chk_type == EASE_COPYCHECK){//paperpass
            var content = txt.replace(/\s/g,'');
            return content.length;
        }
        if(chk_type == TURNITIN || chk_type == TURNITINUK || chk_type == GRAMMARLY){//TURNITIN(UK)
            txt = $.trim(txt);
            if(txt == "") return 0;

            var content = txt.split(/\s+/g);
            var len = 0;
            for (var i = content.length - 1; i >= 0; i--) {
                var part = content[i].replace(/[^\u2400-\u27ff|\u2e80-\u2eff|\u3000-\u32ff|\u4e00-\u9fff|\uac00-\ud7af|\uff00-\uff40]+/g, ' ').split(' ');
                for (var j = part.length - 1; j >= 0; j--) {
                    len += part[j].length;
                };
                //前后有字母
                var bais = 0
                if(part[0] == "") {
                    len ++; bais ++;
                }
                if(part[part.length - 1] == ""){
                    len ++; bais ++;
                }
                len += (part.length - 1 - bais);
            };
            return len;
        }
        if(chk_type == WEIPU || chk_type == PAPERBOX || chk_type==WIDE_WEIPU || chk_type==GRAD_WEIPU || chk_type==PROF_WEIPU || chk_type==EDIT_WEIPU) {
        	return parseInt($('#paper_nums_hidden').text())+0;
        }
        if(chk_type == PAPERRATER){//paperrater
            return txt.length;
        }
        /*if(chk_type == DAYA){//daya
            var loc1 = txt.indexOf('摘要');
            var loc2 = txt.indexOf('关键');
            if(loc1 == -1 || loc2 == -1 || loc2 < loc1) {
                return ChsWordNum(txt);
            }
            var duan = str_repeat(txt.substr(0,loc2),'\n');
            if(duan > DAYA_ZY) {
                var loc = 0;
                for (var num=0; num < DAYA_ZY; num ++) {
                    loc = txt.indexOf('\n',loc+1);
                }
                return ChsWordNum(txt.substr(loc));
            } else {
                return ChsWordNum(txt.substr(loc2));
            }
            //duan = txt.match(/'关键'/gi).length;
            //return duan;
        }*/
        var content = txt.replace(/\n/g,'\r\n').replace(/^[\n\r\f\t\v\x20]+/, '').replace(/[\n\r\f\t\v\x20]+$/, '');
        return content.length;
    }
    $('input,textarea').focus(function() {
        $(this).siblings('.tishi').html("");
        $(this).css('border-color', '#45b549');
    })

    function str_repeat(str,sub) {
        var k=0,sum=0;
        k=str.indexOf(sub);
        while(k>-1) {
            sum ++;
            k=str.indexOf(sub,k+1);
        }
        return sum;
    }

    //校验标题
    function checkTitle(title){
        if($CONFIG['title_min']>0){
            if(title.length<$CONFIG['title_min']) {
                $(".check-title").hide();
                return {
                    "code": 0,
                    "msg": "论文标题字数不够"
                };
            }
        }
        if($CONFIG['title_max']>0){
            if(title.length>$CONFIG['title_max']) {
                $(".check-title").hide();
                return {
                    "code": 0,
                    "msg": "论文标题字数超长"
                };
            }
        }
        $(".check-title").show();
        return {"code": 1};
    }
    //校验作者
    function checkAuthor(author) {
        if ($CONFIG['auther_min'] > 0) {
            if (author.length < $CONFIG['auther_min']) {
                $(".check-author").hide();
                return {
                    "code": 0,
                    "msg": "论文作者字数不够"
                };
            }
        }
        if ($CONFIG['auther_max'] > 0) {
            if (author.length > $CONFIG['auther_max']) {
                $(".check-author").hide();
                return {
                    "code": 0,
                    "msg": "论文作者字数超长"
                };
            }
        }
        $(".check-author").show();
        return {
            "code": 1
        };
    }

    //校验内容
    function checkContent(content) {
        var length = txtLength(content);

        if ($CONFIG['content_min'] > 0) {
            if (length < $CONFIG['content_min']){
                $(".check-content").hide();
                return {
                   "code": 0,
                   "msg": "论文内容字数不够"
               };
           }
        }
        if ($CONFIG['content_max'] > 0) {
            if (length > $CONFIG['content_max']){
                $(".check-content").hide();
                return {
                    "code": 0,
                    "msg": "论文内容字数超长"
                };
            }
        }
        $(".check-content").show();
        return {
            "code": 1
        };
    }

//内容校验
$("#paper-content").on('blur',function(){
    var content = $(this).val();
    var res = checkContent(content);
    if(res.code == 0){
        MOD.errorTextarea($(this),res.msg)
    } else if(res.code == 1){
        MOD.rightTextarea($(this))
    }
}).on('keyup blur mouseup paste', function(ev){
    var $this = $(this);
    var price = $CONFIG['price'], //单价
    unit_num = $CONFIG['unit']; //几篇或者几百字
    timerBlur=setTimeout(function(){
        var txt = $this.val();
        var length = txtLength(txt);
        var num = (Math.ceil(length / unit_num) * 100) * (Number(price) * 100) / 10000;
        $(".varn_words").html(length);
        $("#purchases_piece").html(Math.ceil((Number($(".varn_words").text())/$CONFIG['unit'])));
        $("#varn_nums").html(num);
    }, 20);
});

$("#paper-content").keyup();
// 标题校正
function paper_title_blur(){
	$("#paper-title").on('blur', function(){
	    var title = $.trim($(this).val());
	    $(this).val(title);
	    var res = checkTitle(title);
	    if (res.code == 0) {
	            MOD.errorFun($(this),res.msg)
	    } else if (res.code == 1) {
	           MOD.rightFun($(this));
	    }
	});
}
paper_title_blur();

//作者校验
function paper_author_blur(){
	$("#paper-author").on('blur', function(){
	    var author = $.trim($(this).val());
	    $(this).val(author);
        var res = checkAuthor(author);
	    if(res.code == 0){
            MOD.errorFun($(this),res.msg)
            $('#info').css('color', '#ff5929');
	    } else if(res.code == 1 && $('#info').length < 1){
            //  $('#info') 仅在知网检测服务中可以选择到 dom 元素，以此来判断当前页面是否是提供知网服务的页面
            if($('#info').length < 1) MOD.rightFun($(this));
            if($('#info').length >= 1) {
                $('#info').css('color', 'gray');
                MOD.infoFun($(this),'此文发表过或引用了自己发表的文章，请填写作者真实姓名');
            }
        }
    });
    // $('#info') 判断依据同上
    if($('#info').length >= 1) {
        $("#paper-author").on('focus', function(){
            $('#info').css('color', 'gray');
            MOD.infoFun($(this),'此文发表过或引用了自己发表的文章，请填写作者真实姓名');
        });
    }
}
paper_author_blur();
function checkCardAccount(){
    var account = $.trim($("#cardAccount").val());
    $("#cardAccount").val(account);
    if (account.length != 17 && account.length != 12) {
        //$("#cardAccount").parents('.fm_input').find(".tishi").html("请输入16位账号");
        //自己修改开始
        $("#tishi").empty();
        $("#cardPassword").css("border-color", "");
        $("#tishi").html("请输入17位账号或12位账号");
        //自己修改结束
        $("#cardAccount").css("border-color", "#ff9900");
        $(".check-account").hide();
        return false;
    } else {
        //$("#cardAccount").parents('.fm_input').find(".tishi").html("");
        //自己修改开始
        $("#tishi").html("");
        //自己修改结束
        $("#cardAccount").css("border-color", "rgb(69, 181, 73)");
        $(".check-account").show();
        return true;
    }
}
function checkCardPassword(){
    var account = $.trim($("#cardPassword").val());
    $("#cardPassword").val(account);
    if (account.length != 6 && $("#cardAccount").val().length!=12) {
        //$("#cardPassword").parents('.fm_input').find(".tishi").html("请输入6位密码");
        //自己修改开始
        $("#tishi").empty();
        $("#cardAccount").css("border-color", "");
        $("#tishi").html("请输入6位密码");
        //自己修改结束
        $("#cardPassword").css("border-color", "#ff9900");
        $(".check-password").hide();
        return false;
    } else {
        //$("#cardPassword").parents('.fm_input').find(".tishi").html("");
        //自己修改开始
        $("#tishi").html("");
        //自己修改结束
        $("#cardPassword").css("border-color", "rgb(69, 181, 73)");

        $(".check-password").show();
        $(".check-password").next().css('margin-left','10px');
        return true;
    }
}
//$("#cardAccount").on('blur', function() {
//    alert($("#cardAccount").val());
//    checkCardAccount();
//});
//$("#cardPassword").on('blur', function() {
//    alert($("#cardPassword").val());
//    checkCardPassword();
//});

function removeFileNum(name){
    var index = -1;
    for(var i = 0;i < fileNumArray.length ; i++){
        if(fileNumArray[i].name == name){
            index = i;
            break;
        }
    }
    if(index != -1){
        fileNumArray.remove(fileNumArray[index]);
        index = -1;
    }
}

function ChsWordNum(txt) {
    var content = txt.replace(/\s/g,'');
    return content.length;
    /*
    txt = $.trim(txt);
    if(txt == "") return 0;

    var content = txt.split(/\s+/g);
    var len = 0;
    for (var i = content.length - 1; i >= 0; i--) {
        var part = content[i].replace(/[^\u2400-\u27ff|\u2e80-\u2eff|\u3000-\u32ff|\u4e00-\u9fff|\uac00-\ud7af|\uff00-\uff40]+/g, ' ').split(' ');
        for (var j = part.length - 1; j >= 0; j--) {
            len += part[j].length;
        };
        //前后有字母
        var bais = 0
        if(part[0] == "") {
            len ++; bais ++;
        }
        if(part[part.length - 1] == ""){
            len ++; bais ++;
        }
        len += (part.length - 1 - bais);
    };
    return len - 1;
    */
}

/**
 *
 * @param {string} name 读取cookie
 */
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
    return null;
}

/**
 *
 * @param {string} name 删除cookie
 */
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

var device_is_phone = false;
var userAgentInfo = navigator.userAgent;
var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
        device_is_phone = true;
        break;
    }
}
if(device_is_phone){
    $('.leftSide').css('display', 'none');
    $('.rightCont').css('margin-left', '0px');
    $('.view_kf').css('display', 'block');
    $('.qq_contact_ul').css('margin-bottom','120px');
    $('.wangwang_img_ul').css('position', 'absolute');
    $('.wangwang_img_ul').css('bottom', '100px');
}else{
    $('.leftSide').show();
    $('.rightCont').css('margin-left', '280px');
    $('.view_kf').css('display', 'none');
}

$('.view_kf').click(function(){
    var rightCont_margin_lt = parseInt($(".rightCont").css('margin-left'));
    if(rightCont_margin_lt>0){
        try{
            $(".rightCont").animate({marginLeft:"0px"}, 500);
        }catch(e){
            $(".rightCont").css('margin-left', '0px');
        }
        $('.leftSide').hide();
    }else{
        try{
            $(".rightCont").animate({marginLeft:"280px"}, 500);
        }catch(e){
            $(".rightCont").css('margin-left', '280px');
        }
        $('.leftSide').show();
    }
});

$(document).ready(function(){
	$(window).resize(function() {
		active_pos('.active_fixed_right');
		active_pos('.active_fixed');
	});
	active_pos('.active_fixed_right');
	active_pos('.active_fixed');
});

function active_pos(ele_class){
	if($(ele_class).length>0){
		$(ele_class).css({'top':(($(window).height()/2)-145.5), 'right':'100px'});
		var height_active = $(ele_class).find('.active_qrocde_img').height();
		var text_length_sp = 0;
		var sp_obj = $(ele_class).find('.active_qrocde_text_sp').find('span');
		sp_obj.each(function(){
			text_length_sp += $(this).html().length;
		});
		var sp_height = $(ele_class).find('.active_qrocde_text_sp').height();
		$(ele_class).show();
		var active_height = $(ele_class).height();
		var qrcode_img_height = $(ele_class).find('.active_qrocde_text_sp').height()+10+$('.active_qrocde_img').height();
		var active_img_mgtop = (active_height-qrcode_img_height)/2;
		if(text_length_sp<=60){
			$(ele_class).find('.active_qrocde_img').css('margin-top', active_img_mgtop+'px');
		}
		$(ele_class).show();
	}
}

$('.upload_paper_file_tab').find('.uploader-list').click(function(){
	$('.upload_paper_file_tab').find('.webuploader-element-invisible').trigger('click');
});
