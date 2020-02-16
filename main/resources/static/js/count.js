var now_user_Name = "";
var now_Id = "";
var now_fullName = "";
var close_type = "";
var allProject = [];
var new_allProject_Id = [];
var new_allProject_Name = [];
var new_allTask_Id = [];
var new_allTask_Name = [];

$(function(){
	headPerson("home"); //头像指定人员
	//报警信息
	setWarningTipsBgColor();
})

//头像指定人员
function headPerson(imgAdd) {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		getHeadPath(result.Id, imgAdd); //获取头像路径
	});
}

//获取工具地址
function get_address(){
	JSInteraction.choosetool();	
}

//获取头像路径
function getHeadPath(userID, imgAdd) {
	AjaxMethod.ajax('userHeadController/queryHead', {'userID' : userID}).then(function (result){
		if (result) {
           var head = result.head;
           if (head != null) {
        	   getHeadInfoByPath(head.head, imgAdd); //获取头像信息byPath
           }
        }
	});
}

//获取头像信息byPath
function getHeadInfoByPath(path, imgAdd) {
	var img_style = "";
	if (imgAdd == "home") {
		img_style = "border-radius: 40px; width: 40px; height: 40px;";
	} else if (imgAdd == "info") {
		img_style = "border-radius: 40px; width: 60px; height: 60px; margin-top: -4px;";
	}
	var head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+path+'" class="img-msg"">'
	if (imgAdd == "home") {
		$('.user-lastname').html(head_img);
	} else if (imgAdd == "info") {
		$('#guser-lastname').html(head_img);
	}
	
}

//获取任务栏参数
function get_task_info() {
	var P_name = "";
	var P_path = "";
	var T_name = "";
	var T_path = "";
	var workFlag = "";
	//从地址栏获得参数
	var url=decodeURI(location.href);
	var tmp1=url.split("?")[1]; 
	var tmp2 = [];
	if (tmp1) {
		tmp2=tmp1.split("&"); 
	}
	for ( var i in tmp2) {
		if (tmp2[i].split("=")[0] == "name") {
			P_name = tmp2[i].split("=")[1]; 
		} else if (tmp2[i].split("=")[0] == "path") {
			P_path = decodeURIComponent(tmp2[i].split("=")[1]);
		}
	}
	if (P_name && P_path) {
		searchFiles(P_name, P_path.replace(/\\/g, '\\\\'), T_name, T_path);
	}
	/*if (workFlag) {alert(workFlag);
		to_task();
	}*/
}

// 读取未读信息总条数
function getTotalmsg(type) {
	// 获得当前列表所有未读
	AjaxMethod.ajax('homeController/notReadCount', {'type' : type}).then(function (result){
		if (result) {
			debugger;
            var not_read = result;
            var count = Object.keys(not_read).length;
            if (count) {
            	$("#red_dot").show();
            } else {
            	$("#red_dot").hide();
            }
        }
	});
}

//未读系统通知
function getSysTotalmsg() {
	AjaxMethod.ajax('homeController/querySystemNotification', {}).then(function (result){
		if (result){
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
	            }
	        }
	        $("#totalCount").html(count);
		}
	});
}

function query() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var cardId = result.Id;
		var query_input_val = $("#query").val();
		JSInteraction.opense(encodeURIComponent(query_input_val), cardId);
	});
}

//获取当前登录人
function newPersonName() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		now_user_Name = result.userId;
		now_Id = result.Id;
		now_fullName = result.fullName;
	});
}

function to_home(name, path, taskname, taskState) {
	window.location.href = "taskinfo?name="+name+"&path="+encodeURIComponent(path)+"&taskname="+taskname+"&taskState="+taskState;
}

function set_user(){
	$("#work_space").val("");
	$("#set_model").modal('show');
}

function commit_workspace() {
	JSInteraction.setWorkspace($("#work_space").val(), $("#c_page").val(), $("#s_page").val());
}

//调至我的模型页面
function my_model() {
	alert("即将上线");
//	window.location.href = "myModel";
}

//去除''
function delLlittleFlag(flag) {
	flag = "@@" + flag + "@@";
	flag = flag.replace("@@'","").replace("'@@","").replace("@@","");
	return flag;
}

//下载文档
function downfiles(fileName, fileId) {
	AjaxMethod.ajax('homeController/queryFile', {'fileId' : fileId}).then(function (result){
		if (result){
			$.downloadByPath(result.path, fileName);
		}
	});
}

//头像上传
function up_head_img(this_) {
	var files = $(this_)[0].files;
	var isBreak = false;
	if (files.length < 1){
		return false;
	}
	for (var i = 0 ; i < files.length; i++){
		var file = files[i];
		if (file.size > 250*1024){
			alert('您上传的文件：' + file.name + '大小超过250kb，不能上传！');
			isBreak = true;
			//break;
		}
		// 生成一个fileId
		var timestamp = new Date().getTime();// 精确到毫秒的时间戳
		var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id

		var formData = new FormData();
		formData.append("fileId", file_id);
		formData.append("file", file);
		formData.append("up_path", "D:/toolsupload");

        $.ajax({
            type: 'POST',
            url: '/userHeadController/uploadHead',
            data: formData,
            /**
             *必须false才会自动加上正确的Content-Type
             */
            contentType: false,
            /**
             * 必须false才会避开jQuery对 formdata 的默认处理
             * XMLHttpRequest会对 formdata 进行正确的处理
             */
            cache: false,
            processData: false,
            success: function (data) {
                $("#guser-lastname").find("img").attr("src", "/userHeadController/showHead?path="+data);
            }
        });
	}
	if (isBreak) {
		return false;
	}
	// 清空上传文件框，使其可以重复上传相同文件
	$(this_).val("");
	$('#group-user-modal').modal('hide');
	// location.reload();
}

//发送回复信息
//function get_msg_info(sendUser, msg, msgId, reMsgUser, msgType) {
//	if (msgType == "text") {
//		var replyPerson = "回复-"+msg+": ";
//		$("#reId").val(msgId);
//		$("#sender_id").val(reMsgUser);
//		$("#msgPre").html(replyPerson);
//	}
//}
//
////获取回复信息
//function getReInfo() {
//	AjaxMethod.ajax('homeController/queryReMsg', {}).then(function (result){
//		if (result){
//			var reMsgList = result.reMsgList;
//			for (var i = 0; i < reMsgList.length; i++) {
//                reMsgId(i,reMsgList[i].rePerson, reMsgList[i].pid, reMsgList[i].reMsg, reMsgList[i].msgReceiver); //信息接收人员ID
//			}
//		}
//	});
//}
//
////消息回复这ID
//function reMsgId(i,person, pid, msg, msgReceiver) {
//	$.ajax({
//		type : 'post',
//		url : '/homeController/getNewPersonName',
//		async : false,
//		success : function(data) {
//			reImg(person, pid, msg, msgReceiver, data.Id);
//		},
//		error : function(err) {
//			console.log(err);
//		}
//	});
//}
//
////回复头像
//function reImg(person, pid, msg, msgReceiver, me) {
//	$.ajax({
//		type : 'post',
//		url : '/userHeadController/queryHead',
//		data: {
//			'userID' : person
//        },
//		async : false,
//		success : function(result) {
//			if (result) {
//				var head = result.head;
//				var img_style = "";
//				var span_style = "";
//				if (msgReceiver == me) {
//					img_style = "border-radius: 40px; width: 25px; height: 25px; float: right; margin-right: 3%;";
//					span_style = "float: right;  margin-right: 10px;";//transform: rotateY(180deg);
//				} else {
//					img_style = "border-radius: 40px; width: 25px; height: 25px;";
//					span_style = "float:none;";
//				}
//				var head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+head.head+'" class="img-msg">'
//				$("#"+pid).append("<div style='margin-top: 5px; height: 30px;'>"+head_img+"<span style='"+span_style+"' class='msg-text other-msg-text'>"+msg+"</span><br/></div>");
//				$("#chat-content").load();
//			}
//		},
//		error : function(err) {
//			console.log(err);
//		}
//	});
//}


//保存日志
function saveLog(msgType, msgContent) {
	$.ajax({
	    type : 'post',
	    url : '/logController/saveLog',
	    data: {'msgType' : msgType, 'msgContent' : msgContent},
	    success:function(data){
	    	
	    }
	});
}

//报警信息的闪烁提醒
var bgcolor ="#1F68D4";
function setWarningTipsBgColor(){
//	setTimeout(function(){
//		if(bgcolor == "#1F68D4"){
//			bgcolor="#F5053B";
//		} else {
//			bgcolor="#1F68D4";
//		}
//		$("#warn").attr("style","background-color:"+bgcolor);
//		setWarningTipsBgColor();
//	},1000);
}
