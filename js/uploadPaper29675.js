/**
 * Created by Administrator on 2017/6/27.
 */
var fileNumArray = [];
var uploader = '';
var remainMoney = 0;
var checkCardFlag = 0;
var isUserCheckCard = false;
$(function (){
      var uploadSuccess,
          uploadName,
          uploadTmpname,
          uploadMd5,
          fileMaxSize=$CONFIG['file_max_size'],
          file_name="",
          file_tmpname="",
          file_md5="",  
          moneyMoreUpload= 0,
          uploadTimer=null,
          $btn = $('.ctlBtn'),
          state = 'pending';
      var fileType=$CONFIG['file_type'];//上传文件类型
          fileType=JSON.parse(fileType).join("").replace(/\./g,"");

      uploader = WebUploader.create({
        auto: true,
        // 不压缩image
        resize: false,

        // swf文件路径
        swf: 'http://css.celunwen.com/assets_v2/js/common/Uploader.swf',

        // 文件接收服务端。
        server: $CONFIG['agent_domain'] + '/upload_file',

        pick: '.morBtns',
        accept: [{
            title: 'doc',
            extensions:  JSON.parse($CONFIG['file_type']).map(function (item) {
                return item.replace('.', '');
            }).join(',')
        }],
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        // 上传文件名
        fileVal: 'paper_file',
        formData: {
            'paper_type' : 1
        },
        fileSingleSizeLimit: Number(fileMaxSize) || 52428800
    });
      
      uploader.on('uploadBeforeSend', function (obj, data, headers) {
          data.paper_file = $CONFIG['unit_name'];
          data.ver_chktype = $CONFIG['check_type'];
      });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function( file ) {
    	$("#thelist").parent().find('.tishi').html('');
        window.clearTimeout(uploadTimer);
        $('#thelist').append('<div id="' + file.id + '" class="item">' +
        '<p class="info"><span class="paperDoc">' + file.name + '</span>'+
        '<div class="cancel cancelBtn"><img src="//css.celunwen.com/assets_v2/images/right/del.png" /></div></p>' +
        '<p class="state startBtn schedule">等待上传</p>' +
        '</div>');
        $('#thelist').addClass("uploadDel")
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function( file, percentage ) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');
        // // 避免重复创建
        /*if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
            '</div>' +
            '</div>').appendTo( $li ).find('.progress-bar');
        }*/
        $li.find('p.state').text( parseInt(percentage * 100) + '%');
        $percent.css('width', percentage * 100 + '%');
    });

    uploader.on('uploadSuccess', function( file,response) {
        var infoMsg=response.info;
        if(response.status){
        	var moneyTotal = Number($CONFIG['price']);
            moneyMoreUpload = Number($("#storage_type").val());
            changeTBRules();
            $('#' + file.id).find('p.state').removeClass("schedule").addClass("success").text('已上传');
            uploadSuccess = true;
            $('.uploader .tishi').html("");
            var dataList=response.data;
            uploadTmpname=dataList.upload_file_tmpname;
            uploadName=dataList.upload_file_name;
            var fileNumObj = {
                name:file.name,
                count : dataList.upload_file_wordnum,
                id:file.id
            }
            fileNumArray.push(fileNumObj);
            uploadMd5=dataList.upload_file_md5;
            $('#' + file.id).attr({"flag":uploadTmpname,"tmpName":uploadTmpname,"upName":uploadName,"upMd5":uploadMd5})
            file_name+=uploadName+";";
            file_tmpname+=uploadTmpname+";";
            file_md5+=uploadMd5+";";
            moneyMoreUpload = (moneyTotal * 100 + moneyMoreUpload * 100) / 100;
            if(checkCardFlag == 1 && !isUserCheckCard){
                if(moneyMoreUpload > Number(remainMoney)){
                    moneyMoreUpload = moneyMoreUpload - Number(remainMoney);
                }else{
                    moneyMoreUpload = 0;
                }
                isUserCheckCard = true;
            }
            $("#storage_type").val(moneyMoreUpload);
            $("#varn_nums").html(moneyMoreUpload);
            $("#uploadTmpname").val(file_tmpname);
            $("#uploadName").val(file_name);
            $("#uploadMd5").val(file_md5);  
            $('#' + file.id).find('.cancelBtn').bind("click", function () {
                var $ele = $(this);
                var id = $ele.parent().attr("id");
                var file = uploader.getFile(id);
                uploader.removeFile(file);
            });
        }else{
            $('#' + file.id).find('p.state').removeClass("schedule").addClass("erron").text('上传出错');
            $('.uploader .tishi').html(infoMsg);
            uploadSuccess = false;
                window.setTimeout(function(){
                    $('#' + file.id).remove();
                    $('.uploader .tishi').html("");
                },3000)
            $('#thelist').removeClass("uploadDel")
        }
    });

    uploader.on('uploadError', function( file ) {
    	$('#' + file.id).find('.cancelBtn').bind("click", function() {
            var $ele = $(this);
            var id = $ele.parents(".item").attr("id");
            var file = uploader.getFile(id);
            uploader.removeFile(file);
            $('#thelist').removeClass("uploadDel");
        });
        $('#' + file.id).find('p.state').removeClass("schedule").addClass("erron").text('上传出错');
        $('.uploader .tishi').html("");
        uploadSuccess = false;
    });

    uploader.on( 'uploadComplete', function( file ) {
        $('#' + file.id).find('.progress').fadeOut();
    });
    uploader.on('error', function (type) {
        uploadSuccess = false;
        if (type === 'F_EXCEED_SIZE') {
            $('.uploader .tishi').html('文件超限！文件大小不得超过' + (Number(fileMaxSize) / 1024 / 1024 || 30) + 'M');
        } else if (type === 'Q_TYPE_DENIED') {
            $('.uploader .tishi').html('文件格式不正确');
        }

    });

//删除时执行的方法
    uploader.on('fileDequeued', function (file) {
    	removeFileNum(file.name);
        var aryfile_tmpname=file_tmpname.split(";");
        var aryfile_name=file_name.split(";");
        var aryfile_md5=file_md5.split(";");
        var curtmpName=$('#' + file.id).attr("tmpName");
        var curfileName=$('#' + file.id).attr("upName");
        var curfileMd5=$('#' + file.id).attr("upMd5");
        if($.inArray(curtmpName,aryfile_tmpname)>-1){
        	var n=$.inArray(curtmpName,aryfile_tmpname);
            aryfile_tmpname=delArray(aryfile_tmpname,n);
        }
        if($.inArray(curfileName,aryfile_name)>-1){
        	var m=$.inArray(curfileName,aryfile_name);
            aryfile_name=delArray(aryfile_name,m);
        }
        if($.inArray(curfileMd5,aryfile_md5)>-1){
        	var o=$.inArray(curfileMd5,aryfile_md5);
        	aryfile_md5=delArray(aryfile_md5,o);
        }
        if(aryfile_tmpname.length>0){
        	file_tmpname=aryfile_tmpname.join(";");
            file_name=aryfile_name.join(";");
            file_md5=aryfile_md5.join(";");
        }
        moneyTotal = Number($CONFIG['price']);
        moneyMoreUpload = Number($("#storage_type").val());
        moneyMoreUpload = (Number(moneyMoreUpload) * 100 - Number(moneyTotal) * 100) / 100;
        $("#storage_type").val(moneyMoreUpload);
        $("#varn_nums").html(moneyMoreUpload);
        $("#uploadTmpname").val(file_tmpname);
        $("#uploadName").val(file_name);
        $("#uploadMd5").val(file_md5); 

        if(n==0){
            $('#' + file.id).remove();
            $('#thelist').removeClass("uploadDel");
        }else{
            $('#' + file.id).remove();
        }
        changeTBRules();

    })
    function delArray(ary,n) {
        return ary.slice(0,n).concat(ary.slice(n+1,ary.length));
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
        var url = webUrl + "/check_card";
        // var url = './js/data/search_card.json';
        $.ajax({
            type: "post",
            url: url,
            async:true,cache:false,
            data: obj,
            success: function(jsondata) {
                if(jsondata.status){
                    var data = jsondata.data;
                    if(data.status == 1){
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

   /* function removeByValue(arr, val) {
        for(var i=0; i<arr.length; i++) {
            var lastVal=arr[arr.length-1];
            if(arr[i]!=lastVal){
                if(arr[i]==val){
                    arr[i] = arr[arr.length - 1];
                    arr.length -= 1;
                    break;
                }
            }else{
                arr.length -= 1;
                break;
            }
        }
    }*/

})