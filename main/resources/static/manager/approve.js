$(function(){
	htmlPage('page-info', 1, 0, 'queryData', 10);
	system_noti_page(1);
})

// 分页查询工具消息
function system_noti_page(page) {
	AjaxMethod.ajax('toolsController/query_Tools', {
		'page' : page,
		'fileName' : $("#fileName").val(),
		'sendUser' : getUserByName($("#sendUser").val()),
		'fileLevels' : $("#fileLevels").val()
	}).then(function (result){	
//		console.log(JSON.stringify(result.objectList));
		$("#org-user-list").empty();
		var msg_arr = result.objectList;
        if (msg_arr && msg_arr.length > 0) {
        	var noti_html = '';
            for (var i in msg_arr) {
            	var msg = msg_arr[i];
            	var turn_name = getNameById(msg.sender);
        		noti_html += join_system_noti(msg.fileId, msg.fileName, msg.use, turn_name, msg.path,msg.sendTime, msg.readPath, msg.sender ,msg.grade, msg.isregister, msg.leves);
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

//拼接工具消息html
function join_system_noti(fileId, fileName, use, turn_name, path, sendTime, readPath, sender, grade, isregister, leves) {
	return '<tr> \
	<td>' + fileName + '</td> \
	<td>' + use + '</td> \
	<td>' + turn_name + '</td> \
	<td>' + changeDate(sendTime) + '</td> \
	<td>' + readPath + '</td> \
	<td style="text-align: center;">' + isregisterRe(fileId, isregister) + '</td> \
	<td style="text-align: center;">' + greadRe(fileId, grade) + '</td> \
	<td style="text-align: center;"><input type="button" value="下载" onclick="glDown(\'' + fileName + '\', \'' + path + '\', \'' + leves + '\')" /><input type="button" value="同意" onclick="approve_tool(\'' + fileId + '\', \'' + sender + '\')" /><input style="margin-left: 10px;" type="button" value="不同意" onclick="del_tool(\'' + fileId + '\', \'' + path + '\')" /><img src="/img/toolTitleImg.png" style="height: 20px; margin-left:10px;" onclick="tool_title_model('+ fileId +')"></td> \
	</tr>';
}

function greadRe(fileId, grade) {
	if (grade == "1") {
		return '<input id="grade" name="'+fileId+'_'+'" type="radio" value="1" checked="checked" />二部<input id="grade" name="'+fileId+'_'+'" type="radio" value="2" />二院<input id="grade" name="'+fileId+'_'+'" type="radio" value="3" />研究室'
	} else if (grade == "3") {
		return '<input id="grade" name="'+fileId+'_'+'" type="radio" value="1" />二部<input id="grade" name="'+fileId+'_'+'" type="radio" value="2" />二院<input id="grade" name="'+fileId+'_'+'" type="radio" value="3" checked="checked" />研究室'

	}
}

function isregisterRe(fileId, isregister) {
	if (isregister == "1") {
		return '<input id="have" name="'+fileId+'" type="radio" value="1" checked="checked" />有<input id="nohave" name="'+fileId+'" type="radio" value="0" />无'
	} else {
		return '<input id="have" name="'+fileId+'" type="radio" value="1" />有<input id="nohave" name="'+fileId+'" type="radio" value="0" checked="checked" />无'
	}
}

//ID转NAME
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

//审批工具(同意)
function approve_tool(fileId, sender) {
	var gId = fileId + "_";
	var isregister = $("input[name='"+fileId+"']:checked").val();//是否有软件注册权
	var ischeckbox = $("input[name='"+gId+"']:checked").val();//是否是二部等级
	AjaxMethod.ajax('toolsController/approve_tool', {
		'fileId' : fileId,
		'isregister' : isregister,
		'grade' : ischeckbox
	}).then(function (result){	
		if (isregister == "1") {
			// sendIntegral(sender, "150", "chuangxin", "store_1", "");
		} else {
			if (ischeckbox == "1") {
				// sendIntegral(sender, "100", "chuangxin", "store_1", "");
				JqdeBox.message('success', "二部级工具审批成功！");
				system_noti_page(1);
			} else if (ischeckbox == "2") {
				JqdeBox.message('error', "暂无二院级!");
//				sendIntegral(sender, "150", "chuangxin", "store_1", "");
			} else if (ischeckbox == "3") {
				// sendIntegral(sender, "40", "chuangxin", "store_1", "");
				JqdeBox.message('success', "研究室级工具审批成功！");
				system_noti_page(1);
			}
		} 
	});
}

//工具下载
function glDown(name, path, leves) {
	if (leves == "1") {
		$.toolsDownByPath(path, name);
		JqdeBox.message('success', "下载成功！");
	} else {
		JqdeBox.message('error', "加密文件不能下载！");
	}
}

//积分传递
function sendIntegral(uid, sourceScore, sourceType, sourceDetail) {
// 	$.ajax({
// 		url: 'http://10.12.97.30:8080/newnewcosim-master_war/coin/add.ht?uid='+uid+'&sourceScore='+sourceScore+'&sourceType='+sourceType+'&sourceDetail='+sourceDetail+'&updTime=0',
// 		type: 'post',
// 		dataType: 'jsonp',
// 		jsonp:"callback",
// 		success: function (data) {
// //			JqdeBox.message('success', "");
// 		},
// 		error: function(err){
// 		}
// 	});
}


//删除工具(不同意)
function del_tool(fileId, path) {
	AjaxMethod.ajax('toolsController/del_tool', {
		'fileId' : fileId,
		'headPath' : 'D:/toolsupload',
		'filePath' : path
	}).then(function (result){	
		JqdeBox.message('success', "删除成功！");
		location.reload();
	});
}

//工具标识弹窗
function tool_title_model(fileId) {
	$("#toolid").val(fileId);
	$("#tool_title_model").modal('show');
}

//工具图片
function tools_title_img(this_) {
	var files = $(this_)[0].files;
	if (files.length < 1){
		return false;
	}
	for (var i = 0 ; i < files.length; i++){
		var file = files[i];
		var maxSize = 200*1024;
		var img_type = file.type.split("/")[1];
		if (file.size > maxSize){
			alert('您上传的文件：' + file.name + '大小超过200KB，不能上传！');
			return false;
		}
		// 生成一个fileId
		var timestamp = new Date().getTime();// 精确到毫秒的时间戳
		var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id
		// 开始上传
		var xhr = new XMLHttpRequest();
	    xhr.open("POST", "/toolsController/titleImg", true);
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'multipart/form-data;');
		var formData = new FormData();
		formData.append("fileId", file_id);
		formData.append("file", file);
		formData.append("up_path", "D:/toolsupload");
		formData.append("toolid", $("#toolid").val());
        // 发生错误事件
        xhr.onerror = function (event) {  
            JqdeBox.alert("文件发送失败，请稍后再试！");
        }
	    xhr.send(formData);
	}
	// 清空上传文件框，使其可以重复上传相同文件
	$(this_).val("");
	$('#tool_title_model').modal('hide');
	location.reload();
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