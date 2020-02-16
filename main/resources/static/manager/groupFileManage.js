$(function(){
	//分页信息设置
	htmlPage('page-info', 1, 0, 'queryData', 10);
	//查询反馈信息
	system_noti_page(1);
});

//查询反馈信息
function system_noti_page(page) {
	var sendUser = $("#sendUser").val();
	var fileLevels = $("#fileLevels").val();
	if (sendUser) {
		sendUser = getUserByName($("#sendUser").val());
	} else if (fileLevels) {
		fileLevels = changeLevelNameToId($("#fileLevels").val());
	}
	AjaxMethod.ajax('upDownLoadController/getGroupFileList', {
		'page' : page,
		'fileName' : $("#fileName").val(),
		'sendUser' : sendUser,
		'fileLevels' : fileLevels
	}).then(function (result){
		$("#userFile_List").empty();
    	var msg_arr = result.objectList;
        if (msg_arr && msg_arr.length > 0) {
        	var noti_html = '';
            for (var i in msg_arr) {
            	var msg = msg_arr[i];
            	noti_html += join_system_noti(msg_arr[i].path, msg_arr[i].fileName, msg_arr[i].creator, msg_arr[i].groupId, msg_arr[i].levels, msg_arr[i].createTime);
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
    		page_html += '<li><a onclick="system_noti_page('+ result.nextPage +')">&raquo;</a></li><span style="position: relative; top: 5px;">共'+result.totalPage+'页/共'+result.total+'条<span>';
        	$('#system_noti_page').html(page_html);
        }
	});
}

//拼接日志消息html
function join_system_noti(path, fileName, sender, receiver, levels, sendTime) {
	var receiverName = (getGroupNameById(receiver) == null ? getNameById(receiver) : getGroupNameById(receiver));
	var receiverLevel = (changeLevelIdToName(getGroupNameById(receiver, "1")) == null ? changeLevelIdToName(getLevels(receiver)) : changeLevelIdToName(getGroupNameById(receiver, "1")));
	return "<tr>"
	  +  "<td class='center' style='word-wrap: break-word; word-break: break-all;'>" + fileName
	  +  "</td>"
	  +  "<td class='center'>" + getNameById(sender) + "(" + changeLevelIdToName(getLevels(sender)) + ")"
	  +  "</td>" 
	  +  "<td class='center'>" + (receiverName == null || receiverName == "" ? "无" : receiverName) + "(" + (receiverLevel == null ? "无" : receiverLevel) + ")"
	  +  "</td>" 
	  +  "<td class='center'>" + changeLevelIdToName(levels)
	  +  "</td>" 
	  +  "<td class='center'>" + changeDate(sendTime)
	  +  "</td>" 
	  +  "<td class='center'><input type='button' value='下载' onclick='download(\""+path+"\", \""+fileName+"\", \""+levels+"\")' /></td>" 
	  +  "</tr>"
}

//文件下载
function download(path, fileName, levels) {
	if (leves == "1") {
		$.downloadByPath(path, fileName);
		JqdeBox.message('success', "下载成功！");
	} else {
		JqdeBox.message('error', "加密文件不能下载！");
	}
}

//批量删除文件
function del_more_file() {
	var inputTime = $("#inputTime").val();
	var inputTime_r = /^\d{1,4}(\/)\d{1,2}\1\d{1,2}$/;
	if (inputTime && inputTime_r.test(inputTime)) {
		AjaxMethod.ajax('groupController/del_more_file', {
			'inputTime' : inputTime,
			'type' : "group"
		}).then(function (result){	
			JqdeBox.message('success', "删除成功！");
		});
	} else {
		JqdeBox.message('error', "未添加时间或时间格式不正确，删除失败！");
	}
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