var files;
$(function(){
	//获取系统消息
	qSysMsg();
})

// 分页查询系统消息
function qSysMsg(page) {
	AjaxMethod.ajax('sysController/qSysMsg').then(function (result){
		$("#sys_info").empty();
		var sysInfo = result.sysInfo;
		var page_html = "";
		for (var i = 0 ; i < sysInfo.length; i++){
			var contents = sysInfo[i].msgContent;
			if (sysInfo[i].msgType == "all") {
				page_html += '<div class="list-group-item">' 
				page_html += '	<span style="cursor: pointer;" onclick="data_xq(\'' + sysInfo[i].msgTitle + '\', \'' + contents + '\')"><a>'+ sysInfo[i].msgTitle + '</a></span>'
				page_html += '	<span style="float:right;">'+ changeDate(sysInfo[i].sendTime)
				page_html += '		<input type="button" value="刪除" onclick="del(\'' + sysInfo[i].notificationId + '\')" />';
				page_html += '	</span>';
				page_html += '</div>';
			} 
		}
		$("#sys_info").html(page_html);
	});
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

//刪除系統消息
function del(sysId) {
	$.ajax({
		type : 'post',
		url : '/sysController/delSysInfo',
		data : {
			'sysId' : sysId
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			if (msg.success) {
				qSysMsg();
			}
		},	
		error : function() {
		}
	});
}

//添加系統消息
function add_sysinfo() {
	$("#sys_model").modal();
}

//提交系統消息
function add() {
	var sys_title = $("#sys_title").val();
	var context = $("#msg-content").val();
	$.ajax({
		type : 'post',
		url : '/sysController/addSysInfo',
		data : {
			'title' : sys_title,
			'context' : context
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			if (msg.success) {
				$("#msg-content").val("");
				location.reload();
			}
		},	
		error : function() {
		}
	});
}

//消息详情
function data_xq(msgTitle, contents) {
	var page_info = '';
    page_info +=  '<div class="title" style="text-align: center;font-weight: bold;">'+ msgTitle +'</div>';
    page_info +=  '<div><p style="text-indent:2em;word-wrap: break-word; word-break: normal;">'+ contents +'</p></div>';
    document.getElementById('show').innerHTML = page_info;
    $("#sysInfo").modal();
}
