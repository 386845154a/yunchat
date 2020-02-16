var sendUser_c, tools_id_c, explain_c, downc_c;

$(function () {
	// 激活文字提示
    $("[data-toggle='tooltip']").tooltip();
	//获取当前登录人
	query_now_person_info();
	// 本地控制工具
	show_tools_c();
	$("#inputInfo").show();
	$("#fb_up").hide();
});

//获取当前用户信息
function query_now_person_info() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		//获取未读系统信息
		query_sys_total(now_ID);
	});
}

//获取未读系统信息
function query_sys_total(now_ID) {
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
	            	if (now_ID == contents[1]) {
	            		count++;
	            	}
	            }
	        }
	        $("#totalCount").html(count);
		}
	});
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

//网络工具
function show_tools(tools_class){
	AjaxMethod.ajax('toolsController/queryTools',{"tools_class":tools_class}).then(function (result){
		if (result) {
			var toolsList = result.toolsList;
			var tools_info = "";
	  		$.each(toolsList,function(i){
				var toolsList_child = toolsList[i];
				if (toolsList_child.isApprove == "1") {
					var toolTitle = "/userHeadController/showHead?path="+toolsList_child.readPath
					tools_info += '	<div style="height: 90px; width: 70px; float: left; margin-left:5px; margin-top:5px;">';
					tools_info += '	<img class="i_tools_" src="/img/toolDown.png" onclick="tools_down(\''+toolsList_child.fileId+'\', \''+toolsList_child.path+'\', \''+toolsList_child.fileName+'\', \''+toolsList_child.downc+'\', \''+toolsList_child.leves+'\')">';
					tools_info += '	<li id="showW" onclick="tools_details(\''+toolsList_child.sender+'\', \''+toolsList_child.fileId+'\', \''+toolsList_child.use+'\', \''+toolsList_child.downc+'\', \''+toolsList_child.note+'\', \''+toolsList_child.fileName+'\', \''+toolsList_child.leves+'\')">';
					tools_info += '	<img src="'+toolTitle+'" style="cursor: pointer; width: 70px; height: 70px; margin-top: -29px;">';
					if (toolsList_child.fileName.length > 3) {
						tools_info += '<span class="popbox_">'+toolsList_child.fileName.substring(0, 3)+'..'+'</span>';
					} else {
						tools_info += '<span class="popbox_">'+toolsList_child.fileName+'</span>';
					}
					tools_info += '	</li>';
					tools_info += '	</div>';
				}
			});
	  		tools_info += '	<img class="add_tools_" alt="add" onclick="tools_up()" src="/img/plus_add.png"/>';
	  		if (tools_info) {
	  			$("#tools_ids").html(tools_info);
			} else {
				$("#tools_ids").html("");
			}
        }
	});
}

//热门推荐
function hotNew(newFlag, hotFlag) {
	AjaxMethod.ajax('toolsController/newAndHot',{
		"newFlag":newFlag,
		"hotFlag":hotFlag
	}).then(function (result){
		if (result) {
			var toolsList = result.toolsList;
			var tools_info = "";
	  		$.each(toolsList,function(i){
				var toolsList_child = toolsList[i];
				if (toolsList_child.isApprove == "1") {
					var toolTitle = "/userHeadController/showHead?path="+toolsList_child.readPath
					tools_info += '	<div style="height: 90px; width: 70px; float: left; margin-left:5px; margin-top:5px;">';
					tools_info += '	<img class="i_tools_" src="/img/toolDown.png" onclick="tools_down(\''+toolsList_child.fileId+'\', \''+toolsList_child.path+'\', \''+toolsList_child.fileName+'\', \''+toolsList_child.downc+'\', \''+toolsList_child.leves+'\')">';
					tools_info += '	<li id="showW"  onclick="tools_details(\''+toolsList_child.sender+'\', \''+toolsList_child.fileId+'\', \''+toolsList_child.use+'\', \''+toolsList_child.downc+'\', \''+toolsList_child.note+'\', \''+toolsList_child.fileName+'\', \''+toolsList_child.leves+'\')">';
					tools_info += '	<img src="'+toolTitle+'" style="cursor: pointer; width: 70px; height: 70px; margin-top: -29px;">';
					if (toolsList_child.fileName.length > 3) {
						tools_info += '<span class="popbox_">'+toolsList_child.fileName.substring(0, 3)+'..'+'</span>';
					} else {
						tools_info += '<span class="popbox_">'+toolsList_child.fileName+'</span>';
					}
					tools_info += '	</li>';
					tools_info += '	</div>';
				}
			});
	  		if (tools_info) {
	  			$("#tools_ids").html(tools_info);
			} else {
				$("#tools_ids").html("");
			}
        }
	});
}

//工具详情 
function tools_details(sendUser, tools_id, explain, downc, note, fileName, leves) {
    sendUser_c = sendUser;
    tools_id_c = tools_id;
    explain_c = explain;
    downc_c = downc;
	$("#PLInfo").html("");
	$("#talker_commit").show();
	//姓名转换
	var CH_Info = queryUserInfo(sendUser);
	$("#downCount").html(downc);
	$("#father_id").html(tools_id);
	$("#explain").html(explain);
	$("#teamInfo").html(note);
	$("#tool_Name").html(fileName);
	$("#tool_level").html(changeLevelIdToName(leves));
	talkerInfo(sendUser, tools_id);
	$("#ToolsDetailsModel").modal();
	$(".in").hide();
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

//评论信息
function talkerInfo(sendUser, tools_id) {
	$.ajax({
		type : 'post',
		url : '/toolsController/queryDetails',
		data: {
			'pid' : tools_id
        },
		async : false,
		success : function(data) {
			var toolsList = data.toolsList;
			var myComment = data.myComment;// 我的评论信息
			var Zleve = [];
			$.each(toolsList,function(i){
				if (toolsList[i].talkContent) {
					var fullname = queryUserInfo(toolsList[i].writer);
					$("#PLInfo").append(fullname+"："+toolsList[i].talkContent+"<br/>");
				} else {
					$("#PLInfo").html("");
				}
				if (toolsList[i].talkLeve.split(".")[1] == 5) {
					var pLeft = toolsList[i].talkLeve.split(".")[0];
					Zleve.push(++pLeft);
				} else {
					Zleve.push(parseInt(toolsList[i].talkLeve));
				}
			});
			var lastTalkLeve = 0;
			var newTalkLeve = leve_count(Zleve);
			newTalkLeve = newTalkLeve/Zleve.length;
			if (newTalkLeve.toString().indexOf(".") == -1) {
				//不包含小数
				lastTalkLeve = newTalkLeve;
			} else {
				//包含小数位
				lastTalkLeve = newTalkLeve.toFixed(0, 2);
			}
			var f = $("#commentAll");
			f.find("#input-22").val(lastTalkLeve);
			var leveClass = lastTalkLeve * 2 * 10 + "%";
			f.find(".rating-stars").attr("style", "width:" + leveClass);
            f.find(".star-rating").attr("style", "pointer-events:none;");
			f.find(".label").html(lastTalkLeve);
			// 我的评论信息
			if (myComment && myComment.length > 0) {
				f = $("#myComment");
                f.find("#input-23").val(myComment[0].talkLeve);
                f.find(".rating-stars").attr("style", "width:" + (myComment[0].talkLeve * 2 * 10 + "%"));
                f.find(".label").html(myComment[0].talkLeve);
                f.find(".star-rating").attr("style", "pointer-events:none;");
                //$("#detcom").attr('disabled', 'disabled');
			} else {
				f = $("#myComment");
                f.find("#input-23").val(0);
                f.find(".rating-stars").attr("style", "width:" + (0 * 2 * 10 + "%"));
                f.find(".label").html(0);
                f.find(".star-rating").attr("style", "pointer-events:auto;");
			}
		},
		error : function(err) {
			console.log(err);
		}
	});
}

//计算等级
function leve_count(Zleve) {
	//还是要判断数组的长度
	var num=0;
	for(var i=0;i<Zleve.length;i++){
		num = Zleve[i]+num;
	}
	return num;
}

//名称转换
function queryUserInfo(sendUser) {
	var fullname = null;
	$.ajax({
		type : 'post',
		url : '/homeController/queryUserInfo',
		data: {
			'userId' : sendUser
        },
		async : false,
		success : function(data) {
			fullname = data.fullname;
		},
		error : function(err) {
			console.log(err);
		}
	});
	return fullname;
}

//详情提交
function details_commit() {
	var fatherId = $("#father_id").html();
	var talkleve = $("#myComment").find(".label").html();
	var comment = $("#comment").val();
	if (!fatherId) {
		JqdeBox.message('error', "未选中任何工具！");
		return false;
	} else if (!comment) {
		JqdeBox.message('error', "您尚未发表任何评论！");
		return false;
	}
	
	if (talkleve) {
		AjaxMethod.ajax('toolsController/saveDetails', {
			'pid' : fatherId,
			'talkLeve' : talkleve,
			'talkContent' : comment
		}).then(function (result){
			if (result.success){
				$("#talker_commit").hide();
				$("#comment").val("");
                saveLog("comment", "评论");
                tools_details(sendUser_c, tools_id_c, explain_c, downc_c);
                // sendIntegral("2", "qiushi", "tool_4", "");
                // sendIntegral("1", "qiushi", "tool_5", tools_id_c);
                // sendIntegral("1", "qiushi", "tool_6", tools_id_c);
			} else {
                JqdeBox.message('error', result.message);
			}
		});
	} else {
		JqdeBox.message('error', "评论等级不能为空！");
		return false;
	}
}

function F_Open_dialog(){
	document.getElementById("btn_file").click();
}

//网络工具下载
function tools_down(fileId, path, name, downc, leves) {
	//获取保密等级
	AjaxMethod.ajax('upDownLoadController/queryUserLevel', {}).then(function (result){
		if (result) {
			if (result.levels >= leves) {
				$.toolsDownByPath(path, name);
				AjaxMethod.ajax('toolsController/updateDownc', {
					'fileId' : fileId,
					'downc' : ++downc
				}).then(function (result){
					if (result){
//						location.reload();
					}
				});
                saveLog("toolsFileDown", "下载了文件"+name);
			} else {
				JqdeBox.message('error', "您的密级不足，无法下载次文件！");
			}
		}
	});
}

function show_tools_c(){
	var tools_jsons = JSInteraction.loadtool();
	tools_jsons = $.parseJSON(tools_jsons);
	var tools_infos = "";
	if (tools_jsons) {
		$.each(tools_jsons,function(i){
			var tools_json_tids = tools_jsons[i];
			$.each(tools_json_tids,function(j){
				var imgPath = "/imgPath/" + tools_json_tids[j].PicName+ ".png";
				var tools_id = 	tools_json_tids[j].ID;
				var tools_name = tools_json_tids[j].Name.toUpperCase();
				var tools_path = tools_json_tids[j].Path;
				var tools_ver = tools_json_tids[j].Date;
				var tools_ex = tools_json_tids[j].Explain;
//				data-toggle="tooltip" title="'+tools_name+'"  
				tools_infos += '	<li  id="showC" >';
				tools_infos += '	<img class="bd_div" onclick="opentool(\'' + tools_id + '\', \'' + tools_name + '\' ,\'' + tools_path + '\')" src="/userHeadController/showHead?path='+imgPath+'">';
				tools_infos += '	<img class="delete_tools" src="/img/minus.png" onclick="delete_tools(\'' + tools_id + '\')"/>';
				if (tools_name.length > 3) {
					tools_infos += '<span class="popbox" style="color:#000000;">'+tools_name.substring(0, 3)+'..'+'</span>';
				} else {
					tools_infos += '<span class="popbox" style="color:#000000;">'+tools_name+'</span>';
				}
				tools_infos += '	</li>';
			});	
		});
		tools_infos += '<li><a class="tip" onclick="add_tools()"><img class="add_tools" alt="add" src="/img/plus_add.png"/><span class="popbox">创建工具</span></a></li>';
	} else {
		tools_infos += '<li><a class="tip" onclick="add_tools()"><img class="add_tools" alt="add" src="/img/plus_add.png"/><span class="popbox">创建工具</span></a></li>';
	}
	
	$(".tools_cls").html(tools_infos);
}

//添加本地的工具
function add_tools(){
	$("tools_address").val("");
	toolHeadImg();
	$("#myTools").modal();
}

//加载工具头像
function toolHeadImg() {
    var imgJson = [
        {"name": "1"}, {"name": "3"},{"name": "4"},{"name": "5"},
        {"name": "6"},{"name": "7"},{"name": "8"},{"name": "9"},{"name": "10"},
        {"name": "11"},{"name": "12"},{"name": "13"},{"name": "14"},{"name": "15"},
        {"name": "16"},{"name": "17"},{"name": "18"},{"name": "19"},{"name": "20"},
        {"name": "21"},{"name": "22"}
    ];
	var imgInfo = "";
	$.each(imgJson,function(i){
		var imgPath = "/imgPath/" + imgJson[i].name+ ".png";
		imgInfo += '	<li id="'+imgJson[i].name+'" style="list-style: none; float: left;" onclick="chooseImg(\'' + imgJson[i].name + '\')">';
		imgInfo += '		<img src="/userHeadController/showHead?path='+imgPath+'" width="60" height="62"/>';
		imgInfo += '	</li>';
	});
	$("#tools_img").html(imgInfo);
}

//标记选中图片
function chooseImg(this_) {
	$('#tools_img').find('.tHeadImg').removeClass('tHeadImg');
	$('#'+this_).addClass('tHeadImg');
	$("#tool_head_img").val(this_);
}

function get_add(adr){
	$("#tools_address").val(adr);
	$("#work_space").val(adr);
}

//打开本地工具
function opentool(id, name ,path){
    //更新最近工具
	JSInteraction.modifylastesttool(id);
	//打开工具
	JSInteraction.openFile(path);
	saveLog("userMyTool", "使用了个人工具"+tools_name);
	sendIntegral("1", "qiushi", "tool_2", "");
}

//提交工具
function commit_tools(){
	var tools_name = $("#tools_name").val();
	var tools_path = $("#tools_address").val();
	var tools_ver = $("#tools_ver").val();
	if (tools_name && tools_path && tools_ver) {
		var toolHeadImg = $("#tool_head_img").val();
		saveLog("upMyTools", "上传个人工具"+tools_name);
		var tools_ex = $("#tools_ex").val();
		var tools_jsons = JSInteraction.loadtool();
		tools_jsons = $.parseJSON(tools_jsons);
		if(tools_jsons){
			JSInteraction.savetool(tools_name,tools_path,tools_ver,tools_ex,toolHeadImg);
		}else{
			JSInteraction.createXmltool(tools_name,tools_path,tools_ver,tools_ex,toolHeadImg);
		}
		show_tools_c();
		//清空数据
	    $("#tools_name").val("");
	    $("#tools_address").val("");
	    $("#tools_ver").val("");
	    $("#tools_ex").val("");
	} else {
		if (!tools_name){
	        JqdeBox.message('error', '请输入新增工具名称！不能为空！');
	    } else if (!tools_path){
			JqdeBox.message('error', '请输入新增工具地址！不能为空！');
		} else if (!tools_ver){
			JqdeBox.message('error', '请输入新增工具版本信息！不能为空！');
		}
	}
}

function delete_tools(tools_id){
	$('#showC').attr('disabled', true);
	JSInteraction.deletetool(tools_id);
    show_tools_c();
    $('#showC').removeAttr('disabled');
}

//tab页-本地工具
function inputInfo() {
	$("#inputInfo").show();
	$("#taskInfo").hide();
	$("#fb_up").hide();
	$('#input_ul').find('.active').removeClass('active');
	$('#input_ul li').eq(0).addClass('active');
}

//tab页-网络工具
function taskInfo() {
	$("#taskInfo").show();
	$("#fb_up").show();
	$("#inputInfo").hide();
	$('#input_ul').find('.active').removeClass('active');
	$('#input_ul li').eq(1).addClass('active');
}

function tools_up() {
	$("#tools_model").show();
	$("#tools_model").modal();
	get_level();
}

function files_up() {
	$("#files_model").show();
	$("#files_model").modal();
}

//上传工具和主文件
function upload_chat_file(this_, classification) {
	var levels = $("#levelId").val();
	if (!levels) {
		JqdeBox.message('error', '请填选择密级别！');
		return false;
	}
	var version = "";
	var use = "";
	var note = "";
	if (!classification) {
		var options=$("#tools_class_ option:selected");
		if (options.val()) {
			classification = options.val();
			version = $("#tools_version_info").val();
			use = $("#tools_use_info").val();
			note = $("#tools_note_info").val();
		} else {
			JqdeBox.message('error', "请选择类型！");
			return false;
		}
	} else {
		version = $("#files_version_info").val();
		use = $("#files_use_info").val();
		note = $("#files_note_info").val();
	}
	var files = $(this_)[0].files;
	if (files.length < 1){
		return false;
	}
	if (!note) {
		JqdeBox.message('error', "团队信息不能为空！");
		return false;
	}
//	sendIntegral("40", "chuangxin", "store_1", "");
	for (var i = 0 ; i < files.length; i++){
		var file = files[i];
		// 生成一个fileId
		var timestamp = new Date().getTime();// 精确到毫秒的时间戳
		var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id
		// 开始上传
		var xhr = new XMLHttpRequest();
	    xhr.open("POST", "/upDownLoadToolsController/uploadFlie", true);
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'multipart/form-data;');
		var formData = new FormData();
		formData.append("fileId", file_id);
		formData.append("file", file);
		formData.append("classification", classification);
		formData.append("version", version);
		formData.append("use", use);
		formData.append("note", note);
		formData.append("configPath", "D:/toolsupload");
		formData.append("levels", levels);
		
		if (classification != "file_up") {
			formData.append("FileFalg", "0");
		} else {
			formData.append("FileFalg", "1");
		}
    	// 上传结束
//		location.reload();        // 发生错误事件
        xhr.onerror = function (event) {  
            JqdeBox.alert("文件发送失败，请稍后再试！");
            // var log_content = name + "使用账号登录！";
            // saveLog("upload", log_content);
        }
	    xhr.send(formData);
	}
	// 清空上传文件框，使其可以重复上传相同文件
	$(this_).val("");
	if (classification != "file_up") {
		$("#tools_model").hide();
	} else {
		$("#files_model").hide();
	}
	$("#tools_class_ option:first").prop("selected", 'selected');
	$("#tools_version_info").val("");
	$("#tools_use_info").val("");
	$("#tools_note_info").val("");
	$(".modal-backdrop").hide();
    JqdeBox.alert("上传成功，文件审核中");
}

//上传子文件
function upload_child_file(this_, pid) {
	var files = $(this_)[0].files;
	if (files.length < 1){
		return false;
	}
	for (var i = 0 ; i < files.length; i++){
		var file = files[i];
		// 生成一个fileId
		var timestamp = new Date().getTime();// 精确到毫秒的时间戳
		var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id
		// 开始上传
		var xhr = new XMLHttpRequest();
	    xhr.open("POST", "/upDownLoadToolsController/uploadChildFlie", true);
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'multipart/form-data;');
		var formData = new FormData();
		formData.append("fileId", file_id);
		formData.append("file", file);
		formData.append("pid", pid);
		formData.append("configPath", "D:/toolsupload");
    	// 上传结束
//		location.reload();        // 发生错误事件
        xhr.onerror = function (event) {  
            JqdeBox.alert("文件发送失败，请稍后再试！");
        }
	    xhr.send(formData);
	}
	// 清空上传文件框，使其可以重复上传相同文件
	$(this_).val("");
}


//获取保密等级
function get_level() {
	AjaxMethod.ajax('upDownLoadController/queryUserLevel', {}).then(function (result){
		if (result) {
			getLeves(result.levels);
		}
	});
}
//获取保密等级
function getLeves(levels) {
	AjaxMethod.ajax('levelController/queryLevel', {}).then(function (result){
		if (result){
    		//填充到select左右风格中的左侧框
			var html_ = "";
			$('#levelId').empty();
			$('#levelId').append('<option  value="" selected>-选择密级-</option>');
			$('#level_Id').empty();
			$('#level_Id').append('<option  value="" selected>-选择密级-</option>');
			$(result.levelList).each(function(i) {
				if (this.levelId <= levels) {
					$('#levelId').append('<option value="'+this.levelId+'">'+this.levelName+'</option>');
				}
			});
		}
	});
}

function isClick(flag) {
	if ($("#levelId").val()) {
		$('#one').removeAttr("disabled");
	} else {
		$('#one').attr("disabled","disabled");
	}
}

//获取工具地址
function get_address(){
	JSInteraction.choosetool();	
}