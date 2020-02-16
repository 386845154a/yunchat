$(function () {
	$('#nav_ul').find('.active').removeClass('active');
	$('#nav_ul li').eq(3).addClass('active');
	//获取当前登录人
	newPersonName();
	//获取任务栏参数
	get_task_info();
	//读取未读信息
	updateNotRead('lately');
});

//主页
function chang_menu() {
	window.location.href = "home";
}

//控制工具
function go_controls() {
	window.location.href = "controls";
}

//最近联系人
function discussion(disFlag) {
	if (disFlag) {
		window.location.href = "discussion?disFlag="+disFlag;
	} else {
		window.location.href = "discussion";
	}
	
}

//联系人
function person() {
	window.location.href = "person";
}

//去工作
function go_work() {
	window.location.href = "mytask";
}

//讨论组
function recently() {
	window.location.href = "recently";
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

//更新未读消息提示
function updateNotRead(type) {
    // 获得当前列表所有未读
	AjaxMethod.ajax('homeController/notReadCount', {'type' : type}).then(function (result){
		if (result) {
            not_read = result;
            var count = Object.keys(not_read).length;
            if (count) {
            	$("#red_dot").show();
            } else {
            	$("#red_dot").hide();
            }
            // 循环人员或者组列表
            $('#user-list').find('li').each(function (i, value) {
                var li_id = $(value).attr('id');
                var id = li_id.substring(li_id.lastIndexOf('_') + 1);
                // 查询是否有未读
                if (not_read[id]) {
                    $(value).append('<span class="badge">' + not_read[id] + '</span>');
                }
            });
        }
	});
}

//显示人员信息
function user_info(userId) {
	$('#group-user-modal').modal('show');
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_Id = result.Id;
		AjaxMethod.ajax('homeController/queryUserInfo', {'userId' : now_Id}).then(function (result){
			if (result){
//				$('#guser-lastname').html(result.fullname.substring(0,1));
				headPerson("info");
				$('#guser-name').html(result.fullname);
				$('#guser-org').html(result.orgName);
				$('#guser-mobile').html(result.mobile || '无');
				$('#guser-phone').html(result.phone || '无');
				$('#guser-email').html(result.email || '无');
			}
		});
	});
}

