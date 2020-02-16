$(function(){
	//分页信息设置
	htmlPage('page-info', 1, 0, 'queryData', 10);
	//查询反馈信息
	system_noti_page(1);
});

//查询反馈信息
function system_noti_page(page) {
	var fileName = $("#fileName").val();
	if (fileName) {
		fileName = getUserByName($("#fileName").val());
	}
	AjaxMethod.ajax('userController/getUserByOnline', {
		'page' : page,
		'fileName' : fileName
	}).then(function (result){
		$("#userFile_List").empty();
		var msg_arr = result.objectList;
		var total = result.total;
		$("#onLineCount").html(total == 0 ? 0:total);
        if (msg_arr && msg_arr.length > 0) {
        	var noti_html = '';
            for (var i in msg_arr) {
            	var msg = msg_arr[i];
            	noti_html += join_system_noti(msg_arr[i].fullname, msg_arr[i].orgId);
            }	
            $("#userFile_List").html(noti_html);
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
function join_system_noti(fileName, orgId) {
		return "<tr>"
		  +  "<td class='center'>" + fileName
		  +  "</td>"
		  +  "<td class='center'>" + getGroupNameById(orgId)
		  +  "</tr>"
}

//文件下载
function download(path, fileName) {
    $.downloadByPath(path, fileName);
}

//groupId转汉字
function getGroupNameById(groupid) {
	var groupName = "";
	$.ajax({
		type : 'post',
		url : '/addressController/getOrgById',
		data : {
			'orgId' : groupid
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			console.log(msg);
			groupName = msg.orgName;
		},	
		error : function() {
		}
	});
	return groupName;
}

//转编码
function getUserByName(fileName) {
	var userId = "";
	$.ajax({
		type : 'post',
		url : '/upDownLoadController/turnNameToId',
		data : {
			'fileName' : fileName
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			userId = msg.userId;
		},	
		error : function() {
		}
	});
	return userId;
}

//时间格式转换
function changeDate (date_str){
    var date = new Date(date_str);
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    return month + '-' + day;
}

//一键下线
function allUnline() {
	AjaxMethod.ajax('userController/allUnline').then(function (result){
		//查询反馈信息
		system_noti_page(1);
	});
}