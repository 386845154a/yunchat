$(function(){
	//分页信息设置
	htmlPage('page-info', 1, 0, 'queryData', 10);
	//查询反馈信息
	system_noti_page(1);
});

//查询反馈信息
function system_noti_page(page) {
	var msgName = "", sendUser = "", msgLevels = "";
	if ($("#sendUser").val()) {
		sendUser = getUserByName($("#sendUser").val());
	} else if ($("#msgLevels").val()) {
		msgLevels = changeLevelNameToId($("#msgLevels").val());
	} else if ($("#msgName").val()) {
		msgName = $("#msgName").val();
	}
	AjaxMethod.ajax('privateMsgController/privateMsgsList', {
		'page' : page,
		'msgName' : msgName,
		'sendUser' : sendUser,
		'msgLevels' : msgLevels
	}).then(function (result){
		$("#userFile_List").empty();
    	var msg_arr = result.objectList;
        if (msg_arr && msg_arr.length > 0) {
        	var noti_html = '';
            for (var i in msg_arr) {
            	var msg = msg_arr[i];
            	if (msg_arr[i].levels == "1") {
            		noti_html += join_system_noti(msg_arr[i].msg, msg_arr[i].msgSender, msg_arr[i].msgReceiver, msg_arr[i].levels, msg_arr[i].sendTime);
            	}
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
    		}
    		page_html += '<li><a onclick="system_noti_page('+ result.nextPage +')">&raquo;</a></li><span style="position: relative; top: 5px;">共'+result.totalPage+'页/共'+result.total+'条<span>';
        	$('#system_noti_page').html(page_html);
        }
	});
}

//拼接日志消息html
function join_system_noti(msg, msgSender, msgReceiver, levels, sendTime) {
	var receiverName = (getGroupNameById(msgReceiver) == null ? getNameById(msgReceiver) : getGroupNameById(msgReceiver));
	var receiverLevel = (changeLevelIdToName(getGroupNameById(msgReceiver, "1")) == null ? changeLevelIdToName(getLevels(msgReceiver)) : changeLevelIdToName(getGroupNameById(msgReceiver, "1")));
	return "<tr>"
	  +  "<td class='center' style='word-wrap: break-word; word-break: break-all;'>" + msg
	  +  "</td>"
	  +  "<td class='center'>" + getNameById(msgSender) + "(" + changeLevelIdToName(getLevels(msgSender)) + ")"
	  +  "</td>" 
	  +  "<td class='center'>" + (receiverName == null || receiverName == "" ? "无" : receiverName) + "(" + (receiverLevel == null ? "无" : receiverLevel) + ")"
	  +  "</td>" 
	  +  "<td class='center'>" + (changeLevelIdToName(levels) == undefined ? "非密" : changeLevelIdToName(levels))
	  +  "</td>" 
	  +  "<td class='center'>" + changeDate(sendTime)
	  +  "</td>" 
	  +  "</tr>"
}

//文件下载
function download(path, fileName) {
    $.downloadByPath(path, fileName);
}

//userId转汉字
function getNameById(Id) {
	var fullName = "";
	$.ajax({
		type : 'post',
		url : '/homeController/queryUserInfo',
		data : {
			'userId' : Id
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

//发送人和接收人密级
function getLevels(Id) {
	var levels = "";
	$.ajax({
		type : 'post',
		url : '/homeController/queryUserInfo',
		data : {
			'userId' : Id
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			levels = msg.levels;
		},	
		error : function() {
		}
	});
	return levels;
}

//密级id转名称
function changeLevelIdToName(levelId) {
	if (levelId) {
		var levelName = "";
		$.ajax({
			type : 'post',
			url : '/levelController/getLevelInfoById',
			data : {
				'levelId' : levelId
			},
			dataType : 'text',
			async: false,
			success : function(msg) {
                levelName = msg;
			},	
			error : function() {
			}
		});
		return levelName;
	}
}

//密级名称转ID
function changeLevelNameToId(levelName) {
	if (levelName) {
		var levelId = "";
		$.ajax({
			type : 'post',
			url : '/levelController/getLevelInfoByName',
			data : {
				'levelName' : levelName
			},
			dataType : 'text',
			async: false,
			success : function(msg) {
				levelId = msg;
			},	
			error : function() {
			}
		});
		return levelId;
	}
}

//groupId转汉字
function getGroupNameById(groupid, flag) {
	var groupName = "";
	var groupLevels = "";
	$.ajax({
		type : 'post',
		url : '/groupController/queryGroupLevelsByGroupId',
		data : {
			'groupid' : groupid
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			groupName = msg.groupName;
			groupLevels = msg.groupLevels;
		},	
		error : function() {
		}
	});
	if (flag) {
		return groupLevels;
	} else {
		return groupName;
	}
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
    var year = date.getFullYear();
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + '/' + month + '/' + day + '&nbsp;' + hour + ':' + (minute < 10 ? "0" + minute : minute) + ':' + second;
}