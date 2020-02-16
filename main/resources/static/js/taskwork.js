var open_pName = "";
var open_tName = "";
$(function(){
	$('#nav_ul').find('.active').removeClass('active');
	$('#nav_ul li').eq(3).addClass('active');
	//获取当前登录人
	newPersonName();
	//获取未读信息总条数
	getSysTotalmsg();
	//获取地址栏信息
	working();
});

function working(){
	var P_name = "";
	var T_name = "";
	var T_path = "";
	var T_state = "";
	//从地址栏获得参数
	var url=decodeURI(location.href);
	var tmp1=url.split("?")[1]; 
	var tmp2 = [];
	if (tmp1) {
		tmp2=tmp1.split("&"); 
	}
	for ( var i in tmp2) {
		if (tmp2[i].split("=")[0] == "projectName") {
			P_name = tmp2[i].split("=")[1]; 
		} else if (tmp2[i].split("=")[0] == "path") {
			T_path = decodeURIComponent(tmp2[i].split("=")[1]);
		} else if (tmp2[i].split("=")[0] == "taskName") {
			T_name = tmp2[i].split("=")[1];
		} else if (tmp2[i].split("=")[0] == "state") {
			T_state = tmp2[i].split("=")[1];
		} else if (tmp2[i].split("=")[0] == "goPage") {
			$("#pageNo").val(tmp2[i].split("=")[1]);
		}
	}
	if (P_name && T_path) {
		lookTask(P_name, T_name, T_path, T_state);
	}
}

//查看任务
function lookTask(projectName, taskName, path, state) {
	open_pName = projectName;
	open_tName = taskName;
	var page_html = "";
	var task_show = JSInteraction.getTaskFile(path, taskName);
	var task_json = $.parseJSON(task_show);
//	var task_json = [{"name":"ceshi.rar","path":"D:\\workhub\\项目一\\任务一\\ceshi.rar","type":".rar"},{"name":"ceshi.rar","path":"D:\\workhub\\项目二\\任务二\\ceshi.rar","type":".rar"},{"name":"ceshi.rar","path":"D:\\workhub\\项目三\\任务三\\ceshi.rar","type":".rar"}];
	for (var i in task_json) {
		var newPath = task_json[i].path.replace(/\\/g,'\\\\');
		$("#myTaskName").html(taskName);
		if (state == "1") {
			$("#check_box").val(newPath);
			page_html += "<tr>"
			  +  "<td class='center'><input type='checkbox' id='check_box' name='check_box' value=\""+newPath+"\"/>"
			  +  "</td>"
			  +  "<td id='name' class='center'>" + task_json[i].name
			  +  "</td>"
			  +  "<td id='type' class='center'>" + task_json[i].type
			  +  "</td>" 
//			  +  "<td class='center'>"
//			  +  "<input type='button' value=\"上传\" onclick='upTaskFile(\"" + projectName + "\", \"" + taskName + "\")'/></td>" 
			  +  "</tr>";
		} else if (state == "4") {
			page_html += "<tr>"
			  +  "<td class='center'>" + task_json[i].name
			  +  "</td>"
			  +  "<td class='center'>" + task_json[i].type
			  +  "</td>" 
			  +  "<td class='center'>"
			  +  "<input type='button' value=\"打开\" onclick='open_File(\"" + newPath + "\")'/></td>" 
			  +  "</tr>";
		}
		
	}
	if (state == "1") {
		$("#table_info_one").html(page_html);
		$("#inputInfo_one_head").show();
		$("#inputInfo_one").show();
//		$("#container-fluid").show();
		$("#inputInfo_two").hide();
		$("#myBut").show();
	} else if (state == "4") {
		$("#table_info_two").html(page_html);
//		$("#inputInfo_one_head").hide();
		$("#inputInfo_two").show();
		$("#inputInfo_one").hide();
		$("#myBut").hide();
	}
}

//上传文件
function upTaskFile(projectName, taskName) {
	JSInteraction.upTaskFile(projectName, taskName);
}

//打开工作空间
function open_work() {
	JSInteraction.openworkFile(open_pName, open_tName);
}

//commit
function commitTask() {
	$("#myModal").modal();
}

//确认提交
function commit() {
	var msg = $("#msg").val();
	//复选框选中
	checkChanged(msg);
}

//列表复选框选中改变
function checkChanged(msg) {
    var ids = [];
    $('#table_info_one').find('td input[type=checkbox]').each(function () {
        if (this.checked) {
            ids.push(this.value);
        }
    });
    this.ids = ids;
	JSInteraction.commitTask(open_pName, open_tName, msg, ids);
}

//PUSH
function pushTask() {
	JSInteraction.pushTask(open_pName, open_tName);
}

//打开文件
function open_File(newPath) {
	JSInteraction.openFile(newPath.replace(/\\/g,'\\\\'));
}

function go_back() {
	if ($("#pageNo").val() == "project_page") {
		window.location.href = "taskinfo";
	} else if ($("#pageNo").val() == "task_page") {
		window.location.href = "mytask";
	}
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

//主页
function chang_menu() {
	window.location.href = "home";
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

//控制工具
function go_controls() {
	window.location.href = "controls";
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