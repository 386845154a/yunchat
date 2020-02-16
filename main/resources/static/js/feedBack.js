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
})

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
	return "<tr>"
		  +  "<td class='center'>" + changeDate(fbackTime)
		  +  "</td>"
		  +  "<td class='center'>" + getNameById(fbackPerson)
		  +  "</td>" 
		  +  "<td class='' style='word-wrap: break-word; word-break: break-all;width: 300px; overflow-y: hidden;'>" + fbackContent
		  +  "</td>" 
		  +  "<td class='' style='word-wrap: break-word; word-break: break-all;width: 150px; overflow-y: hidden;'>" + (replyMsg == null ? "无" : replyMsg) 
		  +  "</td>"
		  +  "<td class='center'><input type='button' value='删除' onclick='feedBack_del(\""+fbackId+"\")' />"
		  +  "</td>" 
		  +  "</tr>" 
}


//是否解决状态转换
function changestate(state) {
	var stateName = ""
	if (state == "1") {
		stateName = "解决";
	} else {
		stateName = "未解决";
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

//打开弹窗
function open_window(flag) {
	if (flag == "0") {
		$('#addModal').modal('show');
	} else if (flag == "1") {
		$('#updataModal').modal('show');
	}
}

//新增反馈信息
function feedBack_add() {
	var content = $('#feedBackContext').val();
	AjaxMethod.ajax('feedbackController/savefeedback', {'content' : content}).then(function (result){
		if(result){
	        JqdeBox.message('success', '添加成功！！');
	        $('#addModal').hide();
            $.ajax({
                type: "GET",
                url: 'loadPath',
                data: {'href': 'modules/feedBack/feedBack'},
                dataType: 'html',
                cache: false,
                async: false,
                success: function(result) {
                    $('#main-content').html("").html(result);
                },
                error: function(err) {
                    alert("加载出错！");
                }
            });
		}
	});
}

//删除反馈信息
function feedBack_del(fbackId) {
	AjaxMethod.ajax('feedbackController/delfeedback', {'fbackId' : fbackId}).then(function (result){
		if(result){
	        JqdeBox.message('success', '删除成功！！');
            system_noti_page(1);
		}
	});
}