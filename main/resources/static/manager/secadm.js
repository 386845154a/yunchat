var fullName = "";
$(function(){
	//时间插件初始化
	$('.input-daterange').datepicker({
		autoclose: true,
		format: 'yyyy-mm-dd'
	});
	
	htmlPage('page-info', 1, 0, 'queryData', 10);
	system_noti_page(1);
})

// 分页查询日志消息
function system_noti_page(page) {
	AjaxMethod.ajax('logController/querySecadm', {
		'page' : page,
		'logContent' : $("#logContent").val(),
		'startTime' : $("#startTime").val(),
		'endTime' : $("#endTime").val(),
		'fullName' : $("#creater").val()
	}).then(function (result){	
		console.log(JSON.stringify(result));
		var msg_arr = result.objectList;
        if (msg_arr && msg_arr.length > 0) {
        	var noti_html = '';
            for (var i in msg_arr) {
            	var msg = msg_arr[i];
            	console.log(JSON.stringify(msg_arr[i].type))
	            	var turn_name = getNameById(msg_arr[i].creater);
	            	noti_html += join_system_noti(turn_name, msg_arr[i].type, msg_arr[i].content, msg_arr[i].createTime, msg_arr[i].address);
            }	
            $("#org-user-list").html(noti_html);
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
    		page_html += '<li><a onclick="system_noti_page('+ result.nextPage +')">&raquo;</a></li><span style="position: relative; top: 5px;">共'+result.totalPage+'页/共'+result.total+'条<span>';
        	$('#system_noti_page').html(page_html);
        }
	});
}

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

// 拼接日志消息html
function join_system_noti(creater, type, content, createTime, address) {
	return '<tr> \
	<td>' + type + '</td> \
	<td>' + content + '</td> \
	<td>' + changeDate(createTime) + '</td> \
	<td>' + creater + '</td> \
	<td>' + address + '</td> \
	</tr>';
}

//导出日志
function out_files() {
	exprotExcel_("/logController/logExcelData",JSON.stringify(({})));
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