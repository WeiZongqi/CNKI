/**
 * Created by Administrator on 2017/6/27.
 */
$(function(){
    var tid = getCookie('tid');
    if(tid != null) {
        $('.right-container').css('height', 'auto');
        $('.right-container').css('background', 'white');
    }

    MOD.tabChange($(".btnCont li"),".btnCont",$(".modelCont"));
    MOD.closeFn($(".closeBtn"));
    MOD.closeFn($(".layModel .btn"));
    MOD.tabChangeByHover($(".pointTitle span"),".pointTitle",$(".pointOutImg"));
    var getWebUrl=$CONFIG['agent_domain'];
    var overCount = 0;
    var first = true;
    var timer=null,
        tidInt="",
        timeInt= $CONFIG['report_query_interval'];
   $('.inquireBtn').bind('click', function() {
        overCount = 0;
        first = true;
        tidInt = $.trim($('#orderNum').val())
        getSearchData(tidInt);
        deleteList();
        getFooterPos();
        $('.tabBar.tesTabBar').find('ul').find('li').removeClass('selected');
    	$('.down_report').addClass('selected');
    	$('.tabBar').find('ul').find('li').removeClass('selected');
        $('.down_report').addClass('selected');
        // 清除绝对高度
        $('.fm_input').css('position','relative');
        $('.right-container').css('height', 'auto');
        $('.right-container').css('background', 'white');

   })
 $(".reloadBtn,#submitCh").bind("click",function(){
	 tidInt = $.trim($('#orderNum').val())
     $("#mask,.changeModel").fadeOut();
     getSearchData(tidInt);
     deleteList();
     getFooterPos();
 })
   //删除
  function deleteList(){
        $(".deleteRes").bind("click",function(){
        	if(confirm("确认删除吗？删除后无法恢复")==false) return;
            var parentInt=$(this).parents(".information");
            var sid=parentInt.attr("sid"),
                tid=parentInt.attr("tid"),
                obj={"tid":tid,"sid":sid};
            $.ajax({"url":$CONFIG['agent_domain']+"/ajax_del_report", "type":"get", "cache": false, "data":obj,
                success:function(jsondata){
                    jsondata=eval('(' + jsondata + ')');
                    /*jsondata=MOD.JSONparse(jsondata);*/
                    var msg=jsondata.info;
                    if(jsondata.status){
                        MOD.alertFn4("提示",msg,"确定");
                    }else{
                        MOD.alertFn("提示",msg,"关闭");
                    }
                }
            })
        })
    }

   function getSearchData(tid){
	   if($('.selected').length > 0){
		   $('.selected').removeClass('selected');
	   }
	   $('.tabBar.tesTabBar').find('ul').find('li').removeClass('selected');
	   $('.down_report').addClass('selected');
	   $('.tabBar').find('ul').find('li').removeClass('selected');
	   $('.down_report').addClass('selected');
       var resultHtml=$(".resultCont").html("");
       var device_id = $("#device_id").val();
       var script_url = $("#script_url").val();
       $.ajax({
           "url":$CONFIG['agent_domain']+"/ajax_search_order",
           "type":"get",
           "async": false,
           "timeout":30000,
           "data":{'tid':tid, device_id:device_id, script_url:script_url},
           error:function(){
	           alert("请求超时,请重试");
	           window.location.reload();
           },
           success:function(jsondata){
               jsondata=eval('(' + jsondata + ')');
               if(jsondata.status){
            	   if(jsondata.info == 'jump_to') {
            		   window.location.href = jsondata.data;
            		   return;
            	   }
                   if(jsondata.info == 1) {
                       $("#cashback_img").show();
                   }
                   var dataList=jsondata.data;
                   var isHaveNoOver = false;

                   for(var i = 0; i < dataList.length;i++){
                       if(dataList[i].status.num != 1 && dataList[i].status.num != 2 && dataList[i].status.num != 5 && dataList[i].status.num != 6){
                           isHaveNoOver = true;
                           break;
                       }
                   }
                   var count = 0;
                   var preCount = overCount;
                   for(var j = 0; j < dataList.length;j++){
                       if(dataList[j].status.num == 1 || dataList[j].status.num == 2 || dataList[j].status.num == 5 || dataList[j].status.num == 6){
                           count +=1;
                       }
                   }
                   overCount = count;
                   if(!first && preCount < overCount){
                       document.getElementById('noticeSound').play();
                   }else{
                       first = false;
                   }
                   bindSearchData(dataList);
                   setTimeout(function(){
                       var new_element=document.createElement('script');
                       new_element.setAttribute('type','text/javascript');
                       new_element.setAttribute('src','//css.celunwen.com/assets_v2/js/uploadPaper.js?v=3');
                       document.body.appendChild(new_element);
                   },1000);
                   $.ajax({
                       "url":$CONFIG['agent_domain']+"/ajax_search_order_common",
                       "type":"get",
                       "async": false,
                       "data":{'tid':dataList[0].tid},
                       "timeout":30000,
                       error:function(){
                    	   alert("请求超时，请重试");
                    	   window.location.reload();
                       },
                       success:function(jsondata_common){
                    	   jsondata_common=eval('(' + jsondata_common + ')');
                    	   if(jsondata_common.status){
	                           $.ajax({
	                               url:$CONFIG['agent_domain']+"/get_site_info_common",
	                               type:"post",
	                               dataType:'json',
	                               async: false,
	                               data:{uid:jsondata_common.data[0].uid,type:jsondata_common.data[0].chk_type},
	                               success:function(res){
	                            	   if(res.status) {
	                            		   $('.jiance_domain').attr('href', res.data.service_domain);
	                            		   var report_wxqrcode_show = false;
	                            		   if($('.report_wxqrcode').hasClass('report_wxqrcode')){
	                            			   report_wxqrcode_show = true;
	                            		   }
	                            		   var miji_item_bool = false;
	                            		   if($('.miji_img').hasClass('miji_img')){
	                            			   miji_item = $('.miji_img');
	                            			   miji_item_bool =true;
	                            		   }
	                            		   $('.p_tp20.p_lf40').find('li').each(function(){
	                            			   if($('#get_help').attr('id')){
	                            				   if($(this).index()>1){
	                                				   $(this).remove();
	                                			   }
	                                		   }else{
	                                			   $(this).remove();
	                                		   }
	                            		   });
	                            		   if(!res.data.qq && !res.data.wangwang){
	                            			   var phone_item = $('<li>手机：'+res.data.phone_num+'</li>');
	                            			   if(!report_wxqrcode_show){
	                            				   $('.p_tp20.p_lf40').append(phone_item);
	                            			   }else{
	                            				   $('.report_wxqrcode').before(phone_item);
	                            			   }
	                            		   }else{
	                            			   if(res.data.wangwang) {
	                            				   $('.contact_wangwang_rq').html('<a style="color:#3EABE1;font-weight: unset;text-decoration: underline; font-size: 12px;" href="//www.taobao.com/webww/ww.php?ver=3&amp;touid='+res.data.wangwang+'&amp;siteid=cntaobao&amp;status=2&amp;charset=utf-8"><img src="/images/wangwanglogo.jpg" width="15px" height="17px"/>旺旺在线客服</a>');
	                            			       var wangwang_itme = $('<li><p>旺旺：</p><a href="//www.taobao.com/webww/ww.php?ver=3&amp;touid='+res.data.wangwang+'&amp;siteid=cntaobao&amp;status=2&amp;charset=utf-8"><img border="0" src="//amos.alicdn.com/realonline.aw?v=2&amp;uid='+res.data.wangwang+'&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" alt="点击这里给我发消息" title="点击这里给我发消息"></a></li>');
	                            			       if(!report_wxqrcode_show){
	                            			    	   $('.p_tp20.p_lf40').append(wangwang_itme);
		                            			   }else{
		                            				   $('.report_wxqrcode').before(wangwang_itme);
		                            			   }
	                            			   }
	                            			   if(res.data.qq) {
	                            				   var data_qq = res.data.qq.split(',');
	                            				   $('.contact_qq_rq').html('<a style="color:#3EABE1;font-weight: unset;text-decoration: underline; font-size: 12px;" href="//wpa.qq.com/msgrd?v=3&amp;uin='+data_qq[0]+'&amp;site=qq&amp;menu=yes" target="_blank" ><img src="/images/qqlogo.png" width="15px" height="17px"/>QQ在线客服</a>');
	                            				   var qq_text = '';
	                            				   $.each(data_qq, function(i,n){
	                            					   if(i==0){
	                            						   qq_text = 'QQ&nbsp;：';
	                            					   }else{
	                            						   qq_text = '&nbsp;';
	                            					   }
	                                				   var qq_item = $('<li><p style="width:40px">'+qq_text+'</p><a target="_blank" href="//wpa.qq.com/msgrd?v=3&amp;uin='+n+'&amp;site=qq&amp;menu=yes"><img src="//css.celunwen.com/assets_v2/images/qq_kefu.gif" alt="点击这里给我发消息" title="点击这里给我发消息"></a></li>');
	                                				   if(!report_wxqrcode_show){
	                                					   $('.p_tp20.p_lf40').append(qq_item);
			                            			   }else{
			                            				   $('.report_wxqrcode').before(qq_item);
			                            			   }
	                            				   });
	                            			   }
	                            		   }
	                            		   if(miji_item_bool){
	                            			   if(report_wxqrcode_show){
		                            			   $('.report_wxqrcode').after(miji_item);
	                            			   }else{
	                            				   $('.p_tp20.p_lf40').append(miji_item);
	                            			   }
	                            		   }
	                            		   if(res.data.wxqrcode_report_path) {
	                            			   $(".report_wxqrcode").attr("style","");
	                            			   $(".report_wxqrcode").attr("src",res.data.wxqrcode_report_path);
	                            		   } else {
	                            			   $(".report_wxqrcode").attr("style","display:none");
	                            		   }
	                            	   }
	                               }
	                           });
                    	   }
                       }
                   });
                   window.clearTimeout(timer);
                   if(isHaveNoOver){
                       timer=window.setTimeout(function(){
                           getSearchData(tid);
                       },timeInt*1000);
                   }
               }else{
                   var msge=jsondata.info;
                   delCookie('tid');
                   $(".layModel .mdTitle").html("查询结果");
                   $(".layModel .modelCont").html(msge);
                   $(".close_btn").html("关闭");
                   $("#mask,.layModel").fadeIn();
               }
           }
       })
   }

   //绑定数据
   function bindSearchData(dataList){
       $.each(dataList,function(i,item){
           var str="",
           titleList="",
           authorList="",
           listStr="",
           reportStr="",
           tid=item.tid,
           sid=item.sid,
           statusData=item.status,
           color=statusData.color,
           num=statusData.num,
           report=statusData.is_report_expire,
           change=statusData.is_change_paper,
           stateStr=statusData.str;
           
           var reduce_guide = item.reduce_guide;
           if(reduce_guide==false || reduce_guide=='undefined') reduce_guide = '';
           
           if(num==1){
              if(report==1){
                  reportStr='<div class="expired"><span class="resBtn disableBtn">报告已过期</span>'
                  +'<a target="_blank" href="//'+item.check_url+'" class="linkText back">去检测论文</a>'
                  +'<p>因已超过7天，服务器将不再保存文件！</p></div>';
              }else{
                  if($CONFIG['is_cnki'] == 0){
                      reportStr='<div class="report">'
                          +'<span class="resBtn loadBtn resBtn_text"><a href="'+getWebUrl+"/report/tid/"+tid+"/sid/"+sid+'">下载报告</a></span>' +
                          '<span class="resBtn loadBtn deleteRes resBtn_text">删除报告及原文</span>'+
                          '</div>';
                  }else{
                	  reportStr='<div class="report">'
                          +'<span class="resBtn loadBtn "><a href="'+getWebUrl+"/report/tid/"+tid+"/sid/"+sid+'">下载报告</a></span>' +
                          '<span class="resBtn loadBtn deleteRes ">删除报告及原文</span>'+
                          '</div>';
                      if(item.chk_type == 10 || item.chk_type == 11) {
                    	  reportStr='<div class="report">'
                              +'<span class="resBtn loadBtn "><a href="'+getWebUrl+"/report/tid/"+tid+"/sid/"+sid+'">下载报告</a></span>' +
                              '<span class="resBtn loadBtn deleteRes ">删除报告</span>'+
                              '</div>';
                      }
                      
                  }

              }
           }else if(num==6){
               stateStr=statusData.str+'('+statusData.extra+')';
               var changeStr = '';
               if(change==1){
            	   changeStr = '<li><div class="tb clearfix" style="margin-top: 32px;">'+
	                   '<label class="ico01">论文题目：</label>'+
	                   '<div class="fm_input">'+
	                       '<input type="text" class="paper-title" value="'+item.title+'" style="border-color: rgb(69, 181, 73);width: 279px;">'+
	                       '<p class="tishi"></p>'+
	                   '</div>'+
	                   '<div class="fm_input check-ok check-title" style="display: none;"></div>'+
                   '</div>'+
                   '<div class="tb clearfix">'+
	                   '<label class="ico02">文章作者：</label>'+
	                   '<div class="fm_input">'+
	                       '<input type="text" value="'+item.author+'" style="width:279px;" placeholder="作者真实姓名，多作者用英文逗号分隔" class="paper-author">'+
	                       '<p class="tishi"></p>'+
	                   '</div>'+
	                   '<div class="fm_input check-ok check-author"></div>'+
                   '</div><div class="tb clearfix"><label class="ico03">更换论文：</label>'+
                   '<div class="again" style="margin-left: 108px;margin-top:0px;">'+
	               	'<div class="fm_input">'+
	                   	'<div class="lb_box uploader">'+
	                   		'<div id="thelist" class="uploader-list" style="width:167px;"></div>'+
	                   	'</div>'+
	                   	'<p class="tishi"></p>'+
	               	'</div>'+
	               	'<div class="btns" style="margin-left: 2px;">'+
	               		'<div class="resBtn loadBtn redBtn picker" style="margin-left: 20px;">再次上传</div>'+
	               	'</div>'+
                  '</div></div></li>';
               }
           }else if(num==2){
               stateStr=statusData.str+'('+statusData.extra+')';
           }
           if($.trim(item.title).length>0 && change!=1){
               titleList='<li><i>标题 :</i><span>'+item.title+'</span></li>';
           }
           if($.trim(item.author).length>0 && $.trim(item.author)!= 'NO|NO' && change!=1){
               authorList='<li><i>作者 :</i><span>'+item.author+'</span></li>';
           }
           listStr+='<div class="inforList"><li><i>订单编号 :</i><span>'+tid+'</span></li>'
           +'<li><i>类型 :</i><span>'+item.type+'</span></li>'
           +titleList +authorList
           +'<li><i>上传时间 :</i><span>'+item.add_date+'</span></li>'
           +'<li><i>状态 :</i><span style="color:'+color+'">'+stateStr+reduce_guide+'</span></li>'
           +'<li><i>联系客服 :</i><span style="color:#3EABE1;font-weight: unset;text-decoration: underline; font-size: 12px;" class="contact_qq_rq"></span><span style="color:#3EABE1;text-decoration: underline; font-size: 12px;font-weight: unset;padding-left: 17px;" class="contact_wangwang_rq"></span></li>';
           if(num == 1) {
               listStr+='<li><i>完成时间 :</i><span>'+item.report_date+'</span></li>'
           }
           listStr+='</div>';
           if(change==1){
        	   listStr += '<li><i></i><span style="color:'+color+'">'+changeStr+'</span></li></div>';
           }
           str='<div class="information" sid="'+sid+'" tid="'+tid+'" num="'+num+'">'+listStr+reportStr+'</div>';
           $(".resultCont").append(str);
       })
   }

    var getTid = $("#orderNum").val();
    if(getTid != "") {
        getSearchData(getTid);
 	   	deleteList();
    }
})