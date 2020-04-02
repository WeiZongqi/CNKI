//缓存过期时间
var storage_expire_time = 600;
if(localStorage.getItem("localStorage")){
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
	            throw new TypeError("浏览器暂不支持localStorage");
	        }
	        var O = Object(this);
	        var len = O.length >>> 0;
	        if (typeof callback !== "function") {
	            throw new TypeError("浏览器暂不支持localStorage");
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
	    };
	}
}
var store_time = localStorage.getItem('store_time');//storage_expire_time
if(store_time) {
	var curr_time = Date.parse(new Date())/1000;
	if((curr_time-store_time)>=storage_expire_time){
		localStorage.clear();
	}
}
var hrefHost = location.href;
if(hrefHost.substr(hrefHost.length-1,1) != '/'){
	hrefHost = hrefHost+'/';
}
var paperTitle   = localStorage.getItem(hrefHost+"paper-title");
var paperAuthor  = localStorage.getItem(hrefHost+"paper-author");
var paperContent = localStorage.getItem(hrefHost+"paper-content");

setLocalStorage("paper-title", paperTitle);
setLocalStorage("paper-author", paperAuthor);
setLocalStorage("paper-content", paperContent);
function setLocalStorage(ele,val){
	if(val) {
		$('#'+ele).val(val);
	}
	$("#"+ele).keyup(function(){
		localStorage.setItem('store_time', Date.parse(new Date())/1000);
		localStorage.setItem(hrefHost+ele, $("#"+ele).val());
	});
}
$(document).ready(function(){
	var is_show_pay = false;
	var timerInt = setInterval(function(){
		if(!is_show_pay) {
			if($('.txt-check-type').hasClass('txt-check-type')){
				var typeIndex = localStorage.getItem(hrefHost+"type-index");
				if(typeIndex && typeIndex!=0){
					$('.txt-check-type').find('div').eq(typeIndex).trigger('click');
					hasCouponBar();
				}
			}
			hasCouponBar();
			is_show_pay = true;
		}else{
			var tabSelected = localStorage.getItem(hrefHost+"tab-selected");
			if(location.href.indexOf('cnki')<0){
				if(tabSelected && paperContent) {
					if($('.'+tabSelected).hasClass(tabSelected)){
						$('.'+tabSelected).find('a').trigger('click');
					}
				}
			}else{
				if(tabSelected) {
					if($('.'+tabSelected).hasClass(tabSelected)){
						$('.'+tabSelected).find('a').trigger('click');
					}
				}
			}
			clearInterval(timerInt);
		}
	}, 100);
});
function hasCouponBar() {
	if($CONFIG['is_open_coupon'] != 1 || $CONFIG['is_have_coupon_rule'] != 1) {
		$('#right_navigation_bar').hide();
		$('#coupon_img_right').hide();
	}else{
		$('#right_navigation_bar').show();
		$('#right_navigation_bar').addClass('animated slideInRight');
		setTimeout(function(){
		    $('#right_navigation_bar').removeClass('slideInRight');
		}, 800);
	}
}