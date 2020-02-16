//@ sourceURL=dynamicScript.js
$(function(){
	//获取地址栏参数
	get_task_info();
	//获取系统消息列表
	system_noti_page(1);
	//获取公告信息
	query_affiche();
	//日历
	$("#affiche_info").load("/calendar/fullcalendar.html");
});

//获取公告信息
function query_affiche() {
	AjaxMethod.ajax('upDownLoadToolsController/queryAffiche',{
	}).then(function (result){
		var page_html = "";
		for (var i = 0 ; i < result.length; i++){
			var affiche_file = result[i];
			page_html +=  "<li class='affiche_li'><a style='float: left;' onclick='look_info(\"" + affiche_file.title + "\", \"" + affiche_file.context + "\", \"" + affiche_file.fileName + "\", \"" + affiche_file.path + "\")'>" + affiche_file.title 
					  + "</a><span class='affiche_span'>" + changeDate(affiche_file.sendTime) + "</span></li>";
			$("#affiche_list").html(page_html);
		}
	});
}

//查看公告详情
function look_info(title, context, name, path) {
	window.open("/indexController/afficheInfo?name="+encodeURIComponent(name)+",path="+path+",title="+encodeURIComponent(title)+",context="+encodeURIComponent(context));
}

//读取本地接收字符串
function show_projects(){
	var now_ID = ""
	function newPersonName() {
		AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
			now_ID = result.Id;
			//获取项目
			$.ajax({
			  url: 'http://localhost:8080/iworkproject.ht?id='+now_ID,
			  type: 'GET',
			  dataType: 'jsonp',
			  jsonp:"callback",
			  success: function (data) {
				var project_json = data;
//				var project_json = [
//		            {"projectId": "1","projectName": "导弹制导"},
//		            {"projectId": "2","projectName": "精确制导"},
//		            {"projectId": "3","projectName": "弹道导弹"},
//		            {"projectId": "4","projectName": "导弹推进器"},
//		            {"projectId": "5","projectName": "导弹推进能源"},
//		            {"projectId": "6","projectName": "隐形飞机"},
//		            {"projectId": "7","projectName": "超低空飞行"},
//		            {"projectId": "8","projectName": "导弹杀伤半径"},
//		            {"projectId": "9","projectName": "导弹原理"}
//				];
				var project_info = "";
				$.each(project_json,function(i){
					project_info += '	<li>';
					project_info += '		<a onclick="to_home(\'' + project_json[i].projectName + '\')"';
					project_info += '			style="float: left; font-size:15px;">'+project_json[i].projectName+'</a>';
					project_info += '	</li>';
				});
				$("#totalTaskCount").html(project_json.length);
				$("#total_TaskCount").html(project_json.length);
				$("#menu").html(project_info);
				$("#menu_").html(project_info);
			  },
			  error: function(err){
			      console.log(JSON.stringify(err));
			  }
			});
			
		});
	}
}
function showTaskInfo(name, path){
	var newPath = path.replace(/\\/g,'\\\\');
	window.location.href = "taskinfo?name="+name+"&path="+encodeURIComponent(newPath);
}

//去工作
function go_work() {
	alert("即将上线");
//	window.location.href = "mytask";
}

//分页查询系统消息
function system_noti_page(page) {
	AjaxMethod.ajax('homeController/querySystemNotification', {'title' : null, 'startTime' : null, 'startEnd' : null, 'page' : page}).then(function (result){
		var msg_arr = result.objectList;
		var contents = [];
		var count = 0;
        if (msg_arr && msg_arr.length > 0) {
        	var noti_html = '';
            for (var i in msg_arr) {
            	var msg = msg_arr[i];
            	contents = msg_arr[i].msgContent.split(",");
            	if (now_Id == contents[1]) {
            		count++;
            	}
            	noti_html += join_system_noti(msg_arr[i].notificationId, msg_arr[i].msgTitle, msg.msgType, msg_arr[i].msgContent, msg_arr[i].sendTime);
            }
            $("#totalCount").html(count);
            $("#system_noti_list").html(noti_html);
        }
        // 拼接页码
        if (result.total > 1){
        	var page_html = '<li><a onclick="system_noti_page('+ result.priorPage +')">&laquo;</a></li>';
    		for (var i = 1; i <= result.totalPage; i++){
    			if (i == page){
    				page_html += '<li class="active"><a>' + i + '</a></li>';
    			}else {
    				page_html += '<li onclick="system_noti_page('+ i +')"><a>' + i + '</a></li>';
    			}
    		}
    		page_html += '<li><a onclick="system_noti_page('+ result.nextPage +')">&raquo;</a></li>';
        	$('#system_noti_page').html(page_html);
        }
	})
}

// 拼接系统消息html
function join_system_noti(notificationId, title, type, content, date) {
	var contents = content.split(",");
	var senderId = contents[0];
	var receiver = contents[1];
	var message = contents[2];
	var type_ = contents[3];
	var time = changeDate(date);
	var showInfo = message;
	if (now_Id == receiver) {
		if(type == 'href') {
			return '<div class="list-group-item">'+ showInfo +'<a href="'+content+'" target="noti_iframe" onclick="show_iframe_info(\'' + notificationId + '\', \'' + message + '\', \'' + type_ + '\')">' 
						+ "确认" + '</a><span class="noti_time" style="float: right;">'+time+'</span></div>';
		}
	} else {
		return "";
	}
}

// 展示系统消息的外部页面
function show_iframe_info(notificationId, message, type_) {
	var projectName = message.substring(message.indexOf('>>'),message.lastIndexOf('<<')+2);
	query_group(projectName);
	//是否已经确认任务
	AjaxMethod.ajax('groupController/updateMsgFlag', {'notificationId': notificationId}).then(function (result){
		if (result){
        JqdeBox.message('success', '添加成功');
		}
	});
	location.reload();
}

//组查询
function query_group(projectName) {
	AjaxMethod.ajax('groupController/queryGroup', {}).then(function (result){
		var data = JSON.stringify(result.groupList);
		var info = result.groupList;
		if (data && data.indexOf(projectName) != -1) {
			for (var i = 0; i < info.length; i++) {
				if (info[i].groupName == projectName) {
					add_person(info[i].groupId)
				}
			}
		} else {
			default_group(projectName);
		}
	});
}

//新增讨论组成员
function add_person(groupId) {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		AjaxMethod.ajax('groupController/addGroupPerson', {'userIdList': now_ID, 'groupId': groupId}).then(function (result){
			var now_ID = result.Id;
		});
	});
}

//添加默认项目组
function default_group(de_groupName) {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var my_Id = result.Id;
		AjaxMethod.ajax('groupController/createGroup', {
			'groupName': de_groupName, 
	    	'groupDescribe': de_groupName, 
	    	'userIdList' : my_Id+",",
	    	'choose_name' : de_groupName
		}).then(function (result){
			if (result.ok) {
				JqdeBox.message('success', '创建成功！');
				location.reload();
			}
		});
	});
}


