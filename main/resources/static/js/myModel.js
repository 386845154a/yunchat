$(function () {
	$('#nav_ul').find('.active').removeClass('active');
	$('#nav_ul li').eq(5).addClass('active');
	//获取当前登录人
	query_now_person_info();
	//获取任务栏参数
	get_task_info();
});

//获取当前用户信息
function query_now_person_info() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		var ifa = "http://10.12.97.30:8080/newnewcosim-master_war/loginiwork.ht?id="+now_ID+"&type="+2;
		JSInteraction.topage(2);
		$("#myframe_").attr("src",ifa);
		//获取未读系统信息
		query_sys_total(now_ID);
	});
}

//获取未读系统信息
function query_sys_total(now_ID) {
	AjaxMethod.ajax('homeController/querySystemNotification', {}).then(function (result){
		if (result){
			var msg_arr = result.objectList;
			var contents = [];
			var count = 0;
	        if (msg_arr && msg_arr.length > 0) {
	        	var noti_html = '';
	            for (var i in msg_arr) {
	            	var msg = msg_arr[i];
	            	contents = msg_arr[i].msgContent.split(",");
	            	if (now_ID == contents[1]) {
	            		count++;
	            	}
	            }
	        }
	        $("#totalCount").html(count);
		}
	});
}

//版本信息
function version_info(this_, href) {
	$("#head-div").hide();
	$('#nav_ul').find('.active').removeClass('active');
	$(this_).addClass('active');
	
	// 切换显示内容
	$('.chat-body').hide();
	$('.content-body').show();
	$.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href':href},
        dataType: 'html',
        cache: false, 
        success: function(result) {
        	$('#content-body').html(result);
    	},
    	error: function(err) {
    		alert("加载出错！");
    	}
    });
}

