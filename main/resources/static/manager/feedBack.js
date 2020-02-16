$(function(){
	/*初始化*/
	//时间插件初始化
	$('.input-daterange').datepicker({
		autoclose: true,
		format: 'yyyy-mm-dd'
	});
	//分页信息设置
	htmlPage('page-info', 1, 0, 'queryData', 10);
	//查询反馈信息
	system_noti_page(1);
});

//查询反馈信息
function system_noti_page(page) {
	AjaxMethod.ajax('feedbackController/queryFeedBackInfo', {
		'page' : page,
		'feedBack_context' : $("#feedBack_context").val(),
		'feedBack_user' : $("#feedBack_user").val(),
		'feedBack_state' : $("#feedBack_state").val(),
		'startTime' : $("#startTime").val(),
		'endTime' : $("#endTime").val()
	}).then(function (result){
		$("#feed_Back_List").empty();
    	var msg_arr = result.objectList;
        if (msg_arr && msg_arr.length > 0) {
        	var noti_html = '';
            for (var i in msg_arr) {
            	var msg = msg_arr[i];
            	noti_html += join_system_noti(msg_arr[i].fbackId, msg_arr[i].fbackTime, msg_arr[i].fbackPerson, msg_arr[i].fbackContent, msg_arr[i].fbackSolve, msg_arr[i].replyMsg);
            }	
            $("#feed_Back_List").html(noti_html);
        }
        // 拼接页码
        if (result.total > 1){
        	var page_html = '<li><a onclick="system_noti_page('+ result.priorPage +')">&laquo;</a></li>';
    		for (var i = 1; i <= result.totalPage; i++){
    			if (i == page){
    				page_html += '<li class="active"><a>' + i + '</a></li>';
    			}
//    			else {
//    				page_html += '<li onclick="system_noti_page('+ i +')"><a>' + i + '</a></li>';
//    			}
    		}
    		page_html += '<li><a onclick="system_noti_page('+ result.nextPage +')">&raquo;</a></li>';
        	$('#system_noti_page').html(page_html);
        }
	});
}

//拼接日志消息html
function join_system_noti(fbackId, fbackTime, fbackPerson, fbackContent, fbackSolve, replyMsg) {
	if (isOver(fbackSolve) == "已采纳") {
		return "<tr>"
		  +  "<td class='center'>" + changeDate(fbackTime)
		  +  "</td>"
		  +  "<td class='center'>" + getNameById(fbackPerson)
		  +  "</td>" 
		  +  "<td class='' style='word-wrap: break-word; word-break: break-all;width: 300px; overflow-y: hidden;'>" + fbackContent
		  +  "</td>" 
		  +  "<td class='' style='word-wrap: break-word; word-break: break-all;width: 150px; overflow-y: hidden;'>" + (replyMsg == null ? "无" : replyMsg) 
		  +  "</td>" 
		  +  "<td class='center'>" + changestate(fbackSolve)
		  +  "</td>" 
		  +  "<td class='center'><input id='"+fbackId+"' type='button' disabled='disabled' value='"+isOver(fbackSolve)+"' onclick='feedBack_updata(\""+fbackId+"\", \""+fbackPerson+"\")' />"
		  +  "<input style='margin-left:5px;' type='button' value='回复' onclick='replyModelWindow(\""+fbackId+"\")' /></td>" 
		  +  "</tr>"
	} else {
		return "<tr>"
		+  "<td class='center'>" + changeDate(fbackTime)
		+  "</td>"
		+  "<td class='center'>" + getNameById(fbackPerson)
		+  "</td>" 
		+  "<td class='' style='word-wrap: break-word; word-break: break-all;width: 300px; overflow-y: hidden;'>" + fbackContent
		+  "</td>" 
		+  "<td class='' style='word-wrap: break-word; word-break: break-all;width: 150px; overflow-y: hidden;'>" + (replyMsg == null ? "--" : replyMsg) 
		+  "</td>" 
		+  "<td class='center'>" + changestate(fbackSolve)
		+  "</td>" 
		+  "<td class='center'><input id='"+fbackId+"' type='button' value='"+isOver(fbackSolve)+"' onclick='feedBack_updata(\""+fbackId+"\", \""+fbackPerson+"\")' />"
		+  "<input style='margin-left:5px;' type='button' value='回复' onclick='replyModelWindow(\""+fbackId+"\")' /></td>" 
		+  "</tr>" 
	}
}

//回复信息弹窗
function replyModelWindow(reply_Id) {
	$('#reply_Id').val(reply_Id);
	$('#replyModal').modal('show');
}

//反馈状态切换
function feedBack_updata(fbackId, fbackPerson) {
	AjaxMethod.ajax('feedbackController/updatefeedback', {
		'fbackId' : fbackId
	}).then(function (result){
		if(result){
	        JqdeBox.message('success', '修改成功！！');
	        // sendIntegral(fbackPerson, "3", "fengxian", "issue_1", "");
	        system_noti_page(1);
		}
	});
}

//积分传递
function sendIntegral(uid, sourceScore, sourceType, sourceDetail) {
	$.ajax({
		url: 'http://10.12.97.30:8080/newnewcosim-master_war/coin/add.ht?uid='+uid+'&sourceScore='+sourceScore+'&sourceType='+sourceType+'&sourceDetail='+sourceDetail+'&updTime=0',
		type: 'post',
		dataType: 'jsonp',
		jsonp:"callback",
		success: function (data) {
//			JqdeBox.message('success', data.message);
		},
		error: function(err){
		}
	});
}

//添加回复信息
function reply_updata() {
	AjaxMethod.ajax('feedbackController/updateReply', {
		'fbackId' : $('#reply_Id').val(), 
		'replyContext' : $('#replyContext').val()
	}).then(function (result){
		if(result){
	        JqdeBox.message('success', '添加成功！！');
	        $('#replyModal').modal('hide');
	        system_noti_page(1);
		}
	});
}

//反馈意见状态显示
function changestate(state) {
	var stateName = ""
	if (state == "1") {
		stateName = "采纳";
	} else {
		stateName = "未采纳";
	}
	return stateName;
}

//是否解决状态切换
function isOver(state) {
	var stateName = ""
	if (state == "1") {
		stateName = "已采纳";
	} else {
		stateName = "未采纳";
	}
	return stateName;
}

//姓名转换
function getNameById(creater) {
	var fullName = "";
	$.ajax({
		type : 'post',
		url : '/homeController/queryUserInfo',
		data : {
			'userId' : creater
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			fullName = msg.fullname;
		},	
		error : function() {
		}
	});
	return fullName;
}

//时间格式转换
function changeDate (date_str){
    var date = new Date(date_str);
    var year = date.getFullYear();
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + '/' + month + '/' + day + '&nbsp;' + hour + ':' + (minute < 10 ? "0" + minute : minute) + ':' + second;
}

//导出反馈
function feedBackOut() {
	feedBackExcel_("/feedbackController/feedBackExcelData",JSON.stringify(({})));
}

