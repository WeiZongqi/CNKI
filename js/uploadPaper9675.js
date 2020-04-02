/**
 * Created by Administrator on 2017/6/27.
 */
var fileNumArray = [];
var uploader = '';
var remainMoney = 0;
var checkCardFlag = 0;
var isUserCheckCard = false;
$(function() {
    var uploadSuccess,
        uploadName,
        uploadTmpname,
        uploadMd5,
        moneyTotal = $CONFIG['price'],
        fileMaxSize = $CONFIG['file_max_size'],
        file_name = "",
        file_tmpname = "",
        file_md5="",
        moneyMoreUpload = 0,
        typePage = $("#typePage").attr("pageType"),
        uploadTimer = null;
    var fileType = $CONFIG['file_type']; //上传文件类型
    fileType = JSON.parse(fileType).join("").replace(/\./g, "");
    var pickObj = '';
    if (typePage == 2) {
        pickObj = {
            id: '#btns',
            multiple: false
        }
    } else {
        pickObj = '.picker';
    }
    uploader = WebUploader.create({
        auto: true,

        // swf文件路径
        swf: 'http://css.celunwen.com/assets_v2/js/common/Uploader.swf',
        //runtimeOrder: 'flash',
        // 文件接收服务端。
        server: $CONFIG['agent_domain'] + '/upload_file',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: pickObj,
        accept: [{
            title: 'doc',
            extensions: JSON.parse($CONFIG['file_type']).map(function(item) {
                return item.replace('.', '');
            }).join(',')
        }],
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        // 上传文件名
        fileVal: 'paper_file',
        formData: {
            'paper_file': $CONFIG['unit_name'],
            'ver_chktype' : $CONFIG['check_type'],
            'paper_type' : 1
        },
        fileSingleSizeLimit: Number(fileMaxSize) || 52428800
    });
    
    uploader.on('uploadBeforeSend', function (obj, data, headers) {

        data.paper_file = $CONFIG['unit_name'];
        data.ver_chktype = $CONFIG['check_type'];

    });
    
    // 当有文件被添加进队列的时候
    uploader.on('fileQueued', function(file) {
    	var local_host = location.href;
    	if(typePage==2){
    		var idEle = '#'+file.id;
    		var tmpName = $(idEle).attr("tmpName");
            var curEle = $(idEle + "[flag='" + tmpName + "']");
            curEle.parents(".information").find("#thelist").parent().find('.tishi').html('');
    	}else{
    		$("#thelist").parent().find('.tishi').html('');
    	}
    	
        window.clearTimeout(uploadTimer);
        if ($("#typePage").attr("pageType") == 2) {
        	$('.uploader-list').html('');
        	localStorage.setItem('file_name'+local_host, file.name);
        	localStorage.setItem('file_id'+local_host, file.id);
            $('.uploader-list').append('<div id="' + file.id + '" class="item">' +
                '<p class="info"><span class="paperDoc">' + file.name + '</span>' +
                '<a  class="cancel cancelBtn"><img src="//css.celunwen.com/assets_v2/images/right/del.png" /></a></p>' +
                '<p class="state startBtn schedule">等待上传</p>' +
                '</div>');
            var $li = $('#' + file.id);
            $li.parents(".uploader").find('.tishi').html("");
            $(".btns").css('width','0px').css('overflow','hidden');
            $li.parents(".uploader").find(".state").css("left", "300px");
        } else {
            $('.uploader-list').append('<div id="' + file.id + '" class="item">' +
                '<p class="info"><span class="paperDoc">' + file.name + '</span>' +
                '<p class="state startBtn schedule">等待上传</p>' +
                '</div>');
            var $li = $('#' + file.id);
            $li.parents(".uploader").find('.tishi').html("");
            $(".btns").css('width','0px').css('overflow','hidden');
            if(typePage==3){
            	$li.parents(".uploader").find(".state").css("left", "194px");
            }else{
            	$li.parents(".uploader").find(".state").css("left", "300px");
            }
        }

    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function(file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');
        // // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }
        if(percentage!=1){
	        $li.find('p.state').text(parseInt(percentage * 100) + '%');
	        $percent.css('width', percentage * 100 + '%');
        }
    });
    uploader.on('uploadSuccess', function(file, response) {
        $('#' + file.id).find('p.state').removeClass("schedule").addClass("success").text('已上传');
        
        var infoMsg = response.info;
        if (response.status) {
            uploadSuccess = true;
            $('.uploader .tishi').html("");
            var dataList = response.data;
            uploadTmpname = dataList.upload_file_tmpname;
            uploadName = dataList.upload_file_name;
            uploadMd5 = dataList.upload_file_md5;
            var fileNumObj = {
                name:file.name,
                count : dataList.upload_file_wordnum,
                id:file.id
            }
            fileNumArray.push(fileNumObj);
            $('#' + file.id).attr({
                "flag": uploadTmpname,
                "tmpName": uploadTmpname,
                "upName": uploadName,
                "upMd5": uploadMd5
            })
            if ($("#typePage").attr("pageType") == 3) {
                getUpload('#' + file.id);
            } else if ($("#typePage").attr("pageType") == 2) { //单篇上传
            	$('#' + file.id).find('.cancelBtn').unbind();
                changeTBRules();
                moneyTotal = $CONFIG['price'];
                if(checkCardFlag == 1){
                    if(moneyTotal > Number(remainMoney)){
                        moneyTotal = moneyTotal - Number(remainMoney);
                    }else{
                        moneyTotal = 0;
                    }
                }
                $("#storage_type").val(moneyTotal);
                $("#varn_nums").html(moneyTotal);
                $("#uploadTmpname").val(uploadTmpname);
                localStorage.setItem('uploadTmpname'+local_host, uploadTmpname);
                localStorage.setItem('storage_type'+local_host, moneyTotal);
                localStorage.setItem('storage_price'+local_host, $CONFIG['price']);
                localStorage.setItem('upload_name'+local_host, uploadName);
                localStorage.setItem('upload_md5'+local_host, uploadMd5);
                $("#uploadName").val(uploadName);
                $("#uploadMd5").val(uploadMd5);
                $('#' + file.id).find('.cancelBtn').bind("click", function() {
                    var $ele = $(this);
                    var id = $ele.parents(".item").attr("id");
                    var file = uploader.getFile(id);
                    uploader.removeFile(file);
                });
            }
        }else {
            $('#' + file.id).find('p.state').removeClass("schedule").addClass("erron").text('上传出错');
            $('.tishi').css('color','red').css('font-size','14px');
            $('.uploader .tishi').html(infoMsg);
            uploadSuccess = false;
            
            localStorage.clear();
            $('.erron').addClass('error_file_'+file.id);
            $('.cancel.cancelBtn').addClass('cancel_'+file.id);
            
            $('.error_file_'+file.id).click(function(){
            	$('#'+file.id).remove();
                $('.uploader .tishi').html("");
                uploader.removeFile(file);
                uploader.refresh();
                $(this).removeClass('error_file_'+file.id);
            });
            
            $('.cancel_'+file.id).click(function(){
            	$('#'+file.id).remove();
                $('.uploader .tishi').html("");
                uploader.removeFile(file);
                uploader.refresh();
                $(this).removeClass('cancel_'+file.id);
            });
            
            window.setTimeout(function() {
                $('#' + file.id).remove();
                $('.uploader .tishi').html("");
                uploader.removeFile(file);
                uploader.refresh();
            }, 20000);

            if(typePage==3){
        		var idEle = '#'+file.id;
        		var tmpName = $(idEle).attr("tmpName");
                var curEle = $(idEle + "[flag='" + tmpName + "']");
                curEle.parents(".information").find("#thelist").removeClass("uploadDel");
        	}else{
        		$('#thelist').removeClass("uploadDel");
        	}
        }
    });
    
    uploader.on('uploadError', function(file) {
    	$('#' + file.id).find('.cancelBtn').bind("click", function() {
            var $ele = $(this);
            var id = $ele.parents(".item").attr("id");
            var file = uploader.getFile(id);
            uploader.removeFile(file);
        });
        $('#' + file.id).find('p.state').removeClass("schedule").addClass("erron").text('上传出错');
        $('.uploader .tishi').html("");
        uploadSuccess = false;
        uploader.removeFile(file);
        uploader.refresh();
    });
    uploader.on('uploadComplete', function(file) {
        $('#' + file.id).find('.progress').fadeOut();
    });
    uploader.on('error', function(type) {
        uploadSuccess = false;
        if (type === 'F_EXCEED_SIZE') {
            $('.uploader .tishi').html('文件超限！文件大小不得超过' + (Number(fileMaxSize) / 1024 / 1024 || 30) + 'M');
        } else if (type === 'Q_TYPE_DENIED') {
            $('.uploader .tishi').html('文件格式不正确');
        }

    });

    //删除时执行的方法
    uploader.on('fileDequeued', function(file) {
        removeFileNum(file.name);
        uploadTmpname = "";
        uploadName = "";
        uploadMd5 = "";
        moneyTotal = "";
        $("#storage_type").val("");
        $("#varn_nums").html("");
        $("#uploadTmpname").val(uploadTmpname);
        $("#uploadName").val(uploadName);
        $("#uploadMd5").val(uploadMd5);
        $('#' + file.id).remove();
        if(typePage==3){
    		var idEle = '#'+file.id;
    		var tmpName = $(idEle).attr("tmpName");
            var curEle = $(idEle + "[flag='" + tmpName + "']");
            curEle.parents(".information").find("#thelist").removeClass("uploadDel");
    	}else{
    		$('#thelist').removeClass("uploadDel");
    	}
        $(".zf_cont[paylist!='0']").removeClass("selected");
        $(".zf_cont[paylist!='0'] input").val("");
        var paretEle = $(".payMethod span[paylist!='0']");
        paretEle.find("a").removeClass("selected");
        paretEle.find(".maskLayer").hide();
        $(".btns").css('width','130px').css('overflow','hidden');
        var $li = $('#' + file.id);
        $li.parents(".uploader").find(".state").remove();
        changeTBRules();
    });

    function getUpload(idEle) {
        var tmpName = $(idEle).attr("tmpName");
        var curEle = $(idEle + "[flag='" + tmpName + "']");
        var upName = curEle.attr("upName");
        var upMd5 = curEle.attr("upMd5");
        var sid = curEle.parents(".information").attr("sid");
        var tid = curEle.parents(".information").attr("tid");
        var paper_author = curEle.parents(".information").find('.paper-author').val();
        var paper_title = curEle.parents(".information").find('.paper-title').val();
        var obj = {
            "tid": tid,
            "sid": sid,
            "paper_author": paper_author,
            "paper_title": paper_title,
            "upload_file_name": upName,
            "upload_file_tmpname": tmpName,
            'upload_file_md5':upMd5
        }
        changePage(obj);
    }

    function changePage(obj) {        
        $.ajax({
            type: "post",
            cache: false,
            url: $CONFIG['agent_domain'] + "/ajax_change_paperfile",
            data: obj,
            success: function(jsondata) {
                jsondata = JSON.parse(jsondata);
                var msg = jsondata.info;
                if (jsondata.status) {
                    MOD.alertFn4("提示", msg, "确定");
                    $('#submitCh').click(function(){
                    	window.location.reload();
                    });
                } else {
                    MOD.alertFn("提示", msg, "关闭");
                }
                
                if($('.tabBar.tesTabBar').css('background')){
                	$('.btn').css('background', $('.tabBar.tesTabBar').css('background'));
                }else{
                	$('.btn').css('background', '#4ac711');
                }
                $('.btn').css('color', 'white');
            },
            error: function() {
                alert("ajax错误")
            }
        })
    }
    $(".btnSelected1").on('click',function(){
        $("#mask,.model").fadeOut();
    });
    $("#checkCard").on('click',function(){
        checkCardFun();
    });
    function checkCardFun(){
        var account = $.trim($('#cardAccount').val());
        var password = $.trim($('#cardPassword').val());
        if(!checkCardAccount()){
            return false;
        }
        if(!checkCardPassword()){
            return false;
        }
        var obj = {
            account : account,
            password : password
        };
        var url = "http://www.celunwen.com/reward/check_up_card";
        $.ajax({
            type: "post",
            url: url,
            async:true,cache:false,
            data: obj,
            success: function(jsondata) {
                if(jsondata.status){
                    var data = jsondata.data;
                    if(data.status == true){
                        checkCardFlag = 1;
                        remainMoney = data.remain_money;
                        if(!isUserCheckCard){
                            if($("#storage_type").val()){
                                if(Number($("#storage_type").val()) > Number(remainMoney)){
                                    var money = Number($("#storage_type").val()) -  Number(remainMoney);
                                    $("#storage_type").val(money);
                                    $("#storage_type").text(money);
                                    $(".amountTotal").text(money);
                                }else{
                                    $("#storage_type").val(0);
                                    $("#storage_type").text(0);
                                }
                            }
                            isUserCheckCard = true;
                        }
                        var contEle = $(".zf_cont[payList='" + myPayType + "']");
                        contEle.find(".promptText").children().hide();
                        contEle.find(".promptText,.refreshPay").show();
                        MOD.alertFn6('提示','检测卡可用','确定');
                    }else{
                        MOD.alertFn6('提示','检测卡不可用','确定');
                    }
                }
            },
            error: function() {
                alert("ajax错误")
            }
        })
    }
})