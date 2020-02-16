$(function(){
	// 激活文字提示
    $("[data-toggle='tooltip']").tooltip();
	$("#my_tool").css("display", "block");
	$("#my_tab_name").html("我的工具");
	load_localTool();//加载本地工具
});

//加载本地工具
function load_localTool(tab_name){
	var tools_infos = "";
	$("#tool_lb").hide();
	$("#my_tool_list").show();
	$("#details_info").hide();
	$("#other_tool").hide();
	$("#my_tool").css("display", "block");
	$("#my_tab_name").html(tab_name);
	var tools_jsons = JSInteraction.loadtool();
	tools_jsons = $.parseJSON(tools_jsons);
	if (tools_jsons) {
		$.each(tools_jsons,function(i){
			var tools_json_tids = tools_jsons[i];
			$.each(tools_json_tids,function(j){
				var imgPath = "/imgPath/" + tools_json_tids[j].PicName+ ".png";//工具图片
				var tools_id = 	tools_json_tids[j].ID;//工具ID
				var tools_name = tools_json_tids[j].Name.toUpperCase();//工具名称
				var tools_path = tools_json_tids[j].Path;//工具地址
				var tools_ver = tools_json_tids[j].Date;//工具版本
				var tools_ex = tools_json_tids[j].Explain;//工具说明
				var tools_time = tools_json_tids[j].CreateTime;//工具上传时间
				tools_infos += '<div class="row clearfix" style="border-bottom:2px solid #DDDDDD;margin-top: 10px;">'
				tools_infos += '   <div class="col-xs-8 column">'
			    tools_infos += '       <div class="media">'
		        tools_infos += '           <div href="#" class="pull-left"><img src="/userHeadController/showHead?path='+imgPath+'" style="margin-bottom: 5px;" width="100px" height="100px" class="media-object"  /></div>'
	            tools_infos += '           <div class="media-body">'
            	if (tools_name.length > 100) {
            		tools_infos += '<h4 class="media-heading">'+tools_name.substring(0,99)+'</h4>';
				} else {
					tools_infos += '<h4 class="media-heading">'+tools_name+'</h4>';
				}	
	            tools_infos += 					tools_ex
	            tools_infos += '                <footer>'+tools_time.split(",")[0]+'</footer>'
	            tools_infos += '            </div>'
	            tools_infos += '        </div>'
		        tools_infos += '    </div>'
			    tools_infos += '    <div class="col-xs-2 column">'
			    tools_infos += '        <button type="button" style="margin-top:5px;" class="btn btn-success" onclick="opentool(\'' + tools_id + '\', \'' + tools_name + '\' ,\'' + tools_path + '\')">打开</button>'
			    tools_infos += '        <button type="button" style="margin-top:5px;" class="btn btn-success" onclick="delete_tools(\'' + tools_id + '\')">删除</button>'
				tools_infos += '    </div>'
				tools_infos += '</div>'
			});	
		});
	}
	$("#my_tool_list").html(tools_infos);
}

//打开本地工具
function opentool(id, name ,path){
    //更新最近工具
	JSInteraction.modifylastesttool(id);
	try {
		//打开工具
		JSInteraction.openFile(path);
	} catch (e) {}
	saveLog("userMyTool", "使用了个人工具"+tools_name);
	// sendIntegral("1", "qiushi", "tool_2", "");
}

//添加本地的工具
function add_local_tools(){
	$("tools_address").val("");
	toolHeadImg();
	$("#myTools").modal();
}

//加载工具头像
function toolHeadImg() {
    var imgJson = [
        {"name": "1"}, {"name": "2"}, {"name": "3"},{"name": "4"},{"name": "5"},
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

//返填工具地址
function get_add(adr){
	$("#tools_address").val(adr);
	$("#work_space").val(adr);
}

//获取工具地址
function get_address(){
	JSInteraction.choosetool();	
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
		load_localTool();
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

//删除本地工具
function delete_tools(tools_id){
	$('#showC').attr('disabled', true);
	JSInteraction.deletetool(tools_id);
	load_localTool();
    $('#showC').removeAttr('disabled');
}

//加载非本地工具
function load_othertools(tab_name, tab_id, type, page) {
	$("#my_tool").hide();
	$("#datable").hide();
	$("#details_info").hide();
	$("#other_tool").css("display", "block");
	$("#other_tab_name").html(tab_name);
	AjaxMethod.ajax('toolsController/queryTools',{
		"page":page, 
		"tab_name":tab_name, 
		"tab_id":tab_id, 
		"type":type
	}).then(function (result){
		if (result) {
			var tools_info = "";
			var toolsList = result.objectList;
			if (toolsList && toolsList.length > 0) {
				$("#other_tool_list").empty();
				$.each(toolsList,function(i){
					var downState = downState_(toolsList[i].fileId);
					var creater_User = createrUser_(toolsList[i].fileId);
					var onebutton = 'onclick="tools_down(\''+toolsList[i].fileId+'\', \''+toolsList[i].path+'\', \''+toolsList[i].fileName+'\', \''+toolsList[i].downc+'\', \''+toolsList[i].leves+'\', \''+tab_name+'\', \''+tab_id+'\', \''+type+'\')"';
					var twobutton = 'onclick="submitapply(\''+tab_name+'\', \''+tab_id+'\', \''+type+'\', \''+page+'\', \''+toolsList[i].fileId+'\', \''+toolsList[i].fileName+'\', \''+toolsList[i].leves+'\')"';
					tools_info += '<div class="row clearfix" style="border-bottom:2px solid #DDDDDD;margin-top: 10px;padding-bottom: 10px;">'
					tools_info += '   <div class="col-xs-8 column">'
					tools_info += '       <div class="media">'
					tools_info += '           <div class="pull-left"><img style="cursor: pointer;" onclick="tools_details(\''+toolsList[i].fileId+'\', \''+tab_name+'\')" src="/userHeadController/showHead?path='+toolsList[i].readPath+'" style="margin-bottom: 5px;" width="80px" height="80px" class="media-object"  /></div>'
					tools_info += '           <div class="media-body">'
					tools_info += '					<h4 class="media-heading" style="cursor: pointer;" onclick="tools_details(\''+toolsList[i].fileId+'\', \''+tab_name+'\')">'+(toolsList[i].fileName.length > 15 ? toolsList[i].fileName.substring(0,15)+'...' : toolsList[i].fileName)+'</h4>';
					tools_info += 					toolsList[i].use.substring(0,100)
					tools_info += '                <footer>'+changeDate(toolsList[i].sendTime)+'</footer>'
					tools_info += '            </div>'
					tools_info += '        </div>'
					tools_info += '    </div>'
					tools_info += '    <div class="col-xs-2 column">'	
					if (tab_name == "全部工具" || tab_name == "最新工具" || tab_name == "热门工具") {
						tools_info += '        <button type="button" style="margin-top:5px;" class="btn btn-success" '+onebutton+'> '+"下载"+'</button>'
					} else {
						if (creater_User == "") {
							tools_info += '        <button type="button" style="margin-top:5px;" class="btn btn-success" '+(downState == "2" ? onebutton : twobutton)+'> '+"申请"+'</button>'
						} else {
							tools_info += '        <button type="button" style="margin-top:5px;" '+(downState == "1" ? "disabled=true" : "")+' class="btn btn-success" '+(downState == "2" ? onebutton : twobutton)+'>'+(downState == "2" ? "下载" : (downState == "1" ? "已申请" : "申请"))+'</button>' + '<lable style="color: red;margin-top:5px; position: relative; left: 5px; top: 3px;">'+(downState == "3" ? "已驳回" : "")+'</lable>'
						}
					}
					tools_info += '    </div>'
					tools_info += '</div>'
				});
				$("#other_tool_list").html(tools_info);
				// 拼接页码
		        if (result.total >= 1){
		        	var page_html = '<li><a onclick="load_othertools(\''+tab_name+'\',\''+tab_id+'\',\''+type+'\','+ result.priorPage +')">&laquo;</a></li>';
		    		for (var i = 1; i <= result.totalPage; i++){
		    			if (i == page){
		    				page_html += '<li class="active"><a>' + page + '</a></li>';
		    			}
		    		}
		    		page_html += '<li><a onclick="load_othertools(\''+tab_name+'\',\''+tab_id+'\',\''+type+'\','+ result.nextPage +')">&raquo;</a></li>';
		        	$('#system_noti_page').html(page_html);
		        }
			} else {
				$("#other_tool_list").empty();
				// 拼接页码
	        	var page_html = '<li><a onclick="load_othertools(\''+tab_name+'\',\''+tab_id+'\',\''+type+'\','+ result.priorPage +')">&laquo;</a></li>';
	    		for (var i = 1; i <= result.totalPage; i++){
	    			if (i == page){
	    				page_html += '<li class="active"><a>' + page + '</a></li>';
	    			}
	    		}
	    		page_html += '<li><a onclick="load_othertools(\''+tab_name+'\',\''+tab_id+'\',\''+type+'\','+ result.nextPage +')">&raquo;</a></li>';
	        	$('#system_noti_page').html(page_html);
			}
        }
	});
}

//下载审批状态
function downState_(fileId) {
	var downState = "";
	$.ajax({
		type : 'post',
		url : '/toolsController/getDownState',
		data : {
			'tid' : fileId
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			if (msg.list != null) {
				downState = msg.list.dastate;
			}
		},	
		error : function() {
		}
	});	
	return downState;
}

//当前用户是否提交下载申请
function createrUser_(fileId) {
	var createrUser = "";
	$.ajax({
		type : 'post',
		url : '/toolsController/isSubmit',
		data : {
			'tid' : fileId
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			if (msg.list != null) {
				createrUser = msg.list.dacreater;
			}
		},	
		error : function() {
		}
	});	
	return createrUser;
}

//打开工具下载申请弹窗
function submitapply(tab_name, tab_id, type, page, fileId, fileName, leves) {
	$("#dafileid").val(fileId);
	$("#dafilename").val(fileName);
	$("#dafilelevel").val(leves);
	$("#tabName_").val(tab_name);
	$("#tab_id_").val(tab_id);
	$("#typ_e").val(type);
	$("#pag_e").val(page);
	$("#dauser").val("");
	$("#datext").val("");
	$("#downAppor_model").modal();
	selectDownChose(tab_id);
}

//工具下载审批执行人显示
function selectDownChose(tab_id) {
	var selectVal = "";
	$.ajax({
		type : 'post',
		url : '/userController/selectDownChose',
		data : {
			'orgId' : tab_id
		},
		dataType : 'JSON',
		async: false,
		success : function(data) {
			var list = data.classUser;
			for (var i in list) {
				if (list[i].userId != data.loginUserId) {
					selectVal += "<option value="+list[i].userId+">"+list[i].fullname+"</option>";
				}
			}
			$("#dauser").html(selectVal);
		},	
		error : function() {
		}
	});
}

//submitapply 提交工具下载申请
function downAppor_submit() {
	AjaxMethod.ajax('toolsController/downApporSubmit', {
		'dafileid' : $("#dafileid").val(),
		'dafilename' : $("#dafilename").val(),
		'dafilelevel' : $("#dafilelevel").val(),
		'dauser' : $("#dauser").val(),
		'datext' : $("#datext").val()
	}).then(function (result){
		if (result.success) {
			JqdeBox.message('success', result.text);
			load_othertools($("#tabName_").val(),$("#tab_id_").val(),$("#typ_e").val(),$("#pag_e").val());
		} else {
			JqdeBox.message('error', result.text);
		}
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

//非本地工具添加
function add_other_tools() {
	$("#tools_model").show();
	$(".modal-backdrop").show();
	$("#tools_model").modal();
	get_level();
}

//获取保密等级
function get_level() {
	AjaxMethod.ajax('upDownLoadController/queryUserLevel', {}).then(function (result){
		if (result) {
			getLeves_one(result.levels);
		}
	});
}

//获取保密等级
function getLeves_one(levels) {
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

$("#update_btn").click(function(){
	var levels = $("#levelId").val();
	var options=$("#tools_class_").val();
	var version = $("#tools_version_info").val();
	var use = $("#tools_use_info").val();
	var note = $("#tools_note_info").val();
	var ischeckbox = $("input[name='tul']:checked").val();//是否是二部等级
	if (levels && options && version && use && note && ischeckbox != "2") {
		$('#one').removeAttr("disabled");
		$("#update_btn").find('input')[0].click()
	} else {
		$('#one').attr("disabled","disabled");
		if (!levels) {
			JqdeBox.message('error', '请填选择密级别！');return false;
		} else if (ischeckbox == "2") {
			JqdeBox.message('error', "暂无二院级!");return false;
		} else if (!options) {
			JqdeBox.message('error', "请选择研究室！");return false;
		} else if (!note) {
			JqdeBox.message('error', "请填写团队信息！");return false;
		} else if (!version) {
			JqdeBox.message('error', "请填写版本信息！");return false;
		} else if (!use) {
			JqdeBox.message('error', "请填写工具详细说明！");return false;
		}
	}
});

//上传工具和主文件
function upload_chat_file(this_, classification) {
	var levels = $("#levelId").val();
	var options=$("#tools_class_").val();
	var version = $("#tools_version_info").val();
	var use = $("#tools_use_info").val();
	var note = $("#tools_note_info").val();
	var isregister = $("input[name='zcq']:checked").val();//是否有软件注册权
	var ischeckbox = $("input[name='tul']:checked").val();//是否是二部等级
	if (use.length > 3000) {
		JqdeBox.message('error', "使用说明长度过大，请重新填写！");
		return false;
	}
	if (!classification) {
		classification = options;
	}
	var files = $(this_)[0].files;
	if (files.length < 1){
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
		formData.append("isregister", isregister);
		formData.append("ischeckbox", ischeckbox);
		
		if (classification != "file_up") {
			formData.append("FileFalg", "0");
		} else {
			formData.append("FileFalg", "1");
		}
    	// 上传结束
        xhr.onerror = function (event) {  
            JqdeBox.alert("文件发送失败，请稍后再试！");
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

//网络工具下载
function tools_down(fileId, path, name, downc, leves, tab_name, tab_id, type) {
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
						load_othertools(tab_name, tab_id, type, 1);
					}
				});
				downToolLog("toolsFileDown", "下载了文件"+name, fileId);
			} else {
				JqdeBox.message('error', "您的密级不足，无法下载次文件！");
			}
		}
	});
}

//工具详情 
function tools_details(toolId, tab_name) {
	$("#my_tool").hide();
	$("#other_tool").hide();
	$("#details_info").css("display", "block");
	$("#details_tab_name").html(tab_name);
	//获取工具详情
	AjaxMethod.ajax('toolsController/queryDetailsInfo', {"toolId": toolId}).then(function (result){
		var toolImg = '<img style="cursor: pointer;" src="/userHeadController/showHead?path='+result[0].readPath+'" style="margin-bottom: 5px;" width="80px" height="80px" class="media-object"  />';
		$("#toolImg").html(toolImg);
		$("#xq_name").html(result[0].fileName);
		$("#down_cs").html(result[0].downc);
		$("#kf_user").html(getNameById(result[0].sender));
		$("#kf_date").html(changeDate(result[0].sendTime));
		$("#kf_version").html(result[0].version);
		$("#software_sm").html(result[0].use);
		$("#team_info").html(result[0].note);
		var user_pl = talkerInfo(result[0].sender, result[0].fileId);
		if (user_pl) {
			$("#user_pl").html(user_pl);
		} else {
			$("#user_pl").html("暂无评论！");
		}
		var fb_botton = '<input type="button" value="发表" style="float: right; position: relative; bottom: 100px; right: 10%;" onclick="issue(\''+toolId+'\', \''+tab_name+'\')" />';
		$("#fb_botton").html(fb_botton);
		//等级填写
		level_write(toolId);
	});
}

//等级填写
function level_write(toolId) {
	$("#commentAll").find(".label").html(0);
	$("#myComment").find(".label").html(0);
	AjaxMethod.ajax('toolsController/levelWrite', {"toolId": toolId}).then(function (result){
		var allLevel = result.commentAll/result.commentAllCount;
		var allLevels = "";
		if (allLevel.toString().indexOf(".") == -1) {
			//不包含小数
			allLevels = allLevel;
		} else {
			var falgs = allLevel.toString().split(".")[1];
			if (falgs == "5") {
				//包含小数位,小数位有且仅有一位,且值为5
				allLevels = allLevel;
			} else {
				//包含小数位
				allLevels = allLevel.toFixed(0, 2);
			}
		}
		var f = $("#commentAll");
		f.find("#input-22").val(allLevels);
		var leveClass = allLevel * 2 * 10 + "%";
		f.find(".rating-stars").attr("style", "width:" + leveClass);
		f.find(".star-rating").attr("style", "pointer-events:none;");
		f.find(".label").html(allLevels);
		var MycommentInfo = result.Mycomment;
		if (MycommentInfo.length > 0) {
			if (MycommentInfo[0].talkLeve) {
				f = $("#myComment");
				f.find("#input-23").val(MycommentInfo[0].talkLeve);
				f.find(".rating-stars").attr("style", "width:" + (MycommentInfo[0].talkLeve * 2 * 10 + "%"));
				f.find(".label").html(MycommentInfo[0].talkLeve);
				f.find(".star-rating").attr("style", "pointer-events:none;");
			}
		} else {
			f = $("#myComment");
			f.find("#input-23").val(0);
			f.find(".rating-stars").attr("style", "width:" + (0 * 2 * 10 + "%"));
			f.find(".label").html(0);
			f.find(".star-rating").attr("style", "pointer-events:auto;");
		}
	});
	

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
			if (fullName == "安全管理员") {
				fullName = "管理员(27446)";
			}
		},	
		error : function() {
		}
	});
	return fullName;
}

//评论信息
function talkerInfo(sendUser, tools_id) {
	var pl_info = "";
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
				pl_info += leftHead(toolsList[i].writer)+getNameById(toolsList[i].writer)+':'+toolsList[i].talkContent+'<br/><span style="float:right;">'+changeDate(toolsList[i].createtime)+'</span><br/>';
			});
		},
		error : function(err) {
			console.log(err);
		}
	});
	return pl_info;
}

//获取头像路径
function leftHead(userID) {
	var head_img = "";
	$.ajax({
		type : 'post',
		url : '/userHeadController/queryHead',
		data: {
			'userID' : userID
        },
		async : false,
		success : function(data) {
			var img_style = "border-radius: 40px; width: 23px; height: 23px;";
	           var head = data.head;
	           if (head) {
	        	   head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+head.head+'" class="img-msg">'
	           }
		},
		error : function(err) {
			console.log(err);
		}
	});
	return head_img;
}

//发布评论
function issue(toolId, tab_name) {
	var comment = $("#my_pl").val().trim().replace(/[\r\n]/g, "");
	if (comment.length < 15) {
		return false;
	} 
	var talkleve = $("#myComment").find(".label").html();
	if (!comment) {
		JqdeBox.message('error', "您尚未发表任何评论！");
		return false;
	} else if (talkleve == 0) {
		JqdeBox.message('error', "首次发布评论,请评定级别!");
		return false;
	}
	AjaxMethod.ajax('toolsController/saveDetails', {
		'pid' : toolId,
		'talkLeve' : talkleve,
		'talkContent' : comment
	}).then(function (result){
		if (result.success){
			$("#my_pl").val("");
			tools_details(toolId, tab_name);
            saveLog("comment", "评论");
            // sendIntegral("2", "qiushi", "tool_4", "");
            // sendIntegral("3", "qiushi", "tool_5", toolId);
            // sendIntegral("1", "qiushi", "tool_6", toolId);
		} else {
            JqdeBox.message('error', result.message);
		}
	});
}

//下载审批
function downApporTable(tab_name) {
	$("#datable").show();
	$("#datable_lb").show();
	$("#my_tool_list").hide();
	$("#other_tool").hide();
	$("#details_info").hide();
	$("#my_tool").hide();
	$("#datable_name").html(tab_name);
	$.ajax({
		type : 'post',
		url : '/toolsController/datablelist',
		data : {
			'daname' : tab_name
		},
		success : function(data) {
			var datable_list = "";
			$.each(data.list,function(i){
				datable_list += html_da(tab_name,data.list[i].id,data.list[i].daid,data.list[i].daname,data.list[i].datext,data.list[i].dacreater,
				data.list[i].dacreatername,data.list[i].dalevel,data.list[i].dastate,data.list[i].daappor,data.list[i].dacreatertime);
			});
			$("#datable_text").html(datable_list);
		},
		error : function(err) {
			console.log(err);
		}
	});
}

function html_da(tab_name, id, daid, daname, datext, dacreater, dacreatername, dalevel, dastate, daappor, dacreatertime) {
	var fileName = "", path = "";
	$.ajax({
		type : 'post',
		url : '/toolsController/getToolById',
		data: {
			'toolId' : daid
        },
		success : function(data) {
			fileName = fileName;
			path = path;
		},
		error : function(err) {
			console.log(err);
		}
	});
	var page_html = ''
		page_html +=  '<tr>'
		page_html +=  '<td>' + daname
		page_html +=  '</td>'
		page_html +=  '<td>' + datext
		page_html +=  '</td>'
		page_html +=  '<td>' + getNameById(dacreater)
		page_html +=  '</td>' 
		page_html +=  '<td>' + changeLevelIdToName(dalevel)
		page_html +=  '</td>'
		page_html +=  '<td>' + getNameById(daappor)
		page_html +=  '</td>'
		page_html +=  '<td>' + change_Date(dacreatertime)
		page_html +=  '</td>' 
		page_html +=  '<td>' + (dastate == "1" ? "已申请" : "已审核")
		page_html +=  '</td>' 
		page_html +=  '<td><input type="button" class="btn btn-primary" value="通过" onclick=agreeDown(\''+"2"+'\',\''+id+'\') /><input type="button" class="btn btn-primary" value="驳回" onclick=agreeDown(\''+"3"+'\',\''+id+'\') />'
		page_html +=  '</td>'
		page_html +=  '</tr>';
	return page_html;
}

//下载审核通过/驳回
function agreeDown(flag, id) {
	$.ajax({
		type : 'post',
		url : '/toolsController/agreeDown',
		data : {
			'flag' : flag,
			'id' : id
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			downApporTable("下载审批");
		},	
		error : function() {
		}
	});
	
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


//我的上传、上传审批
function upAndApprove(tab_name) {
//	t_add
//	disabled="true"
	$("#my_tool").show();
	$("#tool_lb").show();
	$("#my_tool_list").hide();
	$("#other_tool").hide();
	$("#details_info").hide();
	$("#datable").hide();
	$("#my_tab_name").html(tab_name);
	$.ajax({
		type : 'post',
		url : '/toolsController/upAndApprove',
		data: {
			'approve' : tab_name
        },
		success : function(data) {
			var tools_infos = "";
			$.each(data.list,function(i){
				tools_infos += html_pj(data.list[i].fileId,data.list[i].fileName,data.list[i].sendTime,data.list[i].use,
				data.list[i].leves,data.list[i].version,data.list[i].state,data.list[i].approval,
				data.list[i].approver,tab_name,data.loginId,data.loginOrg,data.list[i].sender,data.list[i].path);
			});
			$("#tool_lb_up").html(tools_infos);
		},
		error : function(err) {
			console.log(err);
		}
	});
}

function html_pj(fileId,fileName,sendTime,use,leves,version,state,approval,approver,approve,loginId,loginOrg,sender,path) {
	var newState = "";
	switch (state) {
		case '0': newState = "新上传"; break;
		case '1': newState = "待审(一级)"; break;
		case '2': newState = "待审(二级)"; break;
		case '3': newState = "待审(三级)"; break;
		case '4': newState = "已驳回"; break;
		case '5': newState = "已审批"; break;
	}
	var flag = "disabled=true class='btn'";
	var page_html = ''
		page_html +=  '<tr>'
		page_html +=  '<td>' + fileName
		page_html +=  '</td>'
		page_html +=  '<td>' + change_Date(sendTime)
		page_html +=  '</td>'
		page_html +=  '<td>' + use
		page_html +=  '</td>' 
		page_html +=  '<td>' + changeLevelIdToName(leves)
		page_html +=  '</td>'
		page_html +=  '<td>' + version
		page_html +=  '</td>'
		page_html +=  '<td>' + newState
		page_html +=  '</td>' 
		page_html +=  '<td>' + (approval == null ? "无" : approval)
		page_html +=  '</td>'
		if (approve == "上传审批") {
			page_html +=  '<td>' + (state == "3" ? "管理员(27446)" : (approver == loginId ? select_down(fileId,"B000001141") : getNameById(approver)))
			page_html +=  '</td>'
			page_html +=  '<td><input type="button" value="意见" onclick="approvalWin(\''+fileId+'\',\''+approval+'\',\''+approve+'\')" />'
			page_html +=  '<input type="button" value="提交" onclick="apporChange(\''+fileId+'\',\''+"B000001141"+'\',\''+approve+'\',\''+state+'\')" )/>' 
			page_html +=  '<input type="button" value="驳回" onclick="apporBack(\''+fileId+'\',\''+sender+'\',\''+approve+'\')" )/>' 
			page_html +=  '<input type="button" value="下载" onclick="glDown(\''+fileName+'\',\''+path+'\')" )/></td>' 
		} else {
			page_html +=  '<td>' + (state == "3" ? "管理员(27446)" : (approver == loginId ? select_down(fileId,loginOrg) : getNameById(approver)))
			page_html +=  '</td>'
			page_html +=  '<td><input '+(state == 0 ? "class='btn btn-primary'" : flag)+' type="button" value="提交" onclick="apporChange(\''+fileId+'\',\''+loginOrg+'\',\''+approve+'\',\''+state+'\')" />'
			page_html +=  '<input class="btn btn-primary" type="button" value="更新" onclick="editAppor(\''+fileId+'\',\''+leves+'\')" />' 
			page_html +=  '<input class="btn btn-primary" type="button" value="详情" onclick="downUser(\''+fileId+'\')" /></td>' 
		}
		page_html +=  '</tr>';
	return page_html;
}

//工具下载
function glDown(name, path) {
	$.toolsDownByPath(path, name);
}


//审批执行人显示
function select_down(fileId,loginOrg) {
	var select_down = "<select id='"+fileId+"_"+loginOrg+"' style='width: 98%;'>";
	$.ajax({
		type : 'post',
		url : '/userController/selectDown',
		data : {
			'orgId': loginOrg
		},
		dataType : 'JSON',
		async: false,
		success : function(data) {
			var list = data.classUser;
			for (var i in list) {
				if (list[i].userId != data.loginUserId) {
					select_down += "<option value="+list[i].userId+">"+list[i].fullname+"</option>";
				}
			}
		},	
		error : function() {
		}
	});
	select_down += "</select>";
	return select_down;
}

//二级审批提交
function apporChange(fileId,loginOrg,approve,state) {
	var approver =  $("#"+fileId+"_"+loginOrg).val();
	$.ajax({
		type : 'post',
		url : '/toolsController/apporChange',
		data : {
			'fileId' : fileId,
			'approver' : approver,
			'state' : ++state
		},
		dataType : 'JSON',
		async: false,
		success : function(data) {
			upAndApprove(approve);
		},	
		error : function() {
		}
	});
}

//工具审批驳回
function apporBack(fileId,sender,approve) {
	$.ajax({
		type : 'post',
		url : '/toolsController/apporChange',
		data : {
			'fileId' : fileId,
			'approver' : sender,
			'state' : "4"
		},
		dataType : 'JSON',
		async: false,
		success : function(data) {
			upAndApprove(approve);
		},	
		error : function() {
		}
	});
}

//审批意见弹窗
function approvalWin(fileId, approval, approve) {
	var html_list = '<textarea id="app_val" type="text" maxlength="3000" style="width: 550px; height: 100px; resize: none;"></textarea>';
    //打开链接弹窗
    DevBox.dialogNoCancel({
        title: '审批意见',
        message: html_list,
        init: function () {
        },
        confirm : function() { // 确认事件
        	var approval_all = "";
        	var approval_O = $("#app_val").val();
        	var approval_T = (approval == "null" ? "" : approval);
        	if (!approval_T) {
        		approval_all = approval_O;
        	} else {
        		approval_all = approval_T + "," + approval_O;
        	}
        	$.ajax({
        		type : 'post',
        		url : '/toolsController/approvalChange',
        		data : {
        			'fileId' : fileId,
        			'approval' : approval_all
        		},
        		dataType : 'JSON',
        		async: false,
        		success : function(data) {
        			upAndApprove(approve);
        		},	
        		error : function() {
        		}
        	});
        },
        noconfirm: true,
        confirm_btn: "确认"
    });
}

//时间格式转换
function change_Date (date_str){
	var date = new Date(date_str);
    var year = date.getFullYear();
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + '/' + month + '/' + day + '&nbsp;' + hour + ':' + (minute < 10 ? "0" + minute : minute) + ':' + second;
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
var editId = "";
var editLevle = "";
//更新工具
function editAppor(fileId, level) {
	$("#edit_model").show();
	$(".modal-backdrop").show();
	$("#edit_model").modal();
	editId = fileId;
	editLevle = level;
}

function edit_tool_file(this_) {
	if ($("#toolsUse").val().length > 3000) {
		JqdeBox.message('error', "使用说明长度过大，请重新填写！");
		return false;
	}
	var files = $(this_)[0].files;
	if (files.length < 1){
		return false;
	}
	for (var i = 0 ; i < files.length; i++){
		var file = files[i];
		// 开始上传
		var xhr = new XMLHttpRequest();
	    xhr.open("POST", "/upDownLoadToolsController/editToolInfo", true);
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'multipart/form-data;');
		var formData = new FormData();
		formData.append("fileId", editId);
		formData.append("file", file);
		formData.append("classification", $("#room_choose").val());
		formData.append("teamInfo", $("#teamInfo").val());
		formData.append("toolsVer", $("#toolsVer").val());
		formData.append("toolsUse", $("#toolsUse").val());
		formData.append("configPath", "D:/toolsupload");
		formData.append("levels", editLevle);
    	// 上传结束
        xhr.onerror = function (event) {  
            JqdeBox.alert("文件发送失败，请稍后再试！");
        }
	    xhr.send(formData);
	}
	// 清空上传文件框，使其可以重复上传相同文件
	$(this_).val("");
	$("#edit_model").hide();
	$(".modal-backdrop").hide();
	$("#room_choose option:first").prop("selected", 'selected');
	$("#teamInfo").val("");
	$("#toolsVer").val("");
	$("#toolsUse").val("");
    JqdeBox.alert("上传成功，文件审核中");
}

$("#edit_up").click(function(){
	var room = $("#room_choose").val();
	var teamInfo = $("#teamInfo").val();
	var toolsVer = $("#toolsVer").val();
	var toolsUse = $("#toolsUse").val();
	if (room && teamInfo && toolsVer && toolsUse) {
		$('#editT').removeAttr("disabled");
		$("#edit_up").find('input')[0].click()
	} else {
		$('#editT').attr("disabled","disabled");
		if (!room) {
			JqdeBox.message('error', '请选择研究室！');return false;
		} else if (!teamInfo) {
			JqdeBox.message('error', "请填写团队信息！");return false;
		} else if (!toolsVer) {
			JqdeBox.message('error', "请填写版本信息！");return false;
		} else if (!toolsUse) {
			JqdeBox.message('error', "请填写使用说明！");return false;
		}
	}
});

//下载详情
function downUser(toolId) {
	DevBox.dialogNoCancel({
    	title: "下载详情",
        url: "/js/downUser/downUser.html",
        init: function () {
        	DQInfo(toolId);
        },
        confirm : function() { // 确认事件
			return true;
		},
        confirm_btn: "关闭"
    });
}

//D-详情查询
function DQInfo(toolId) {
	AjaxMethod.ajax('toolsController/DQInfo', {
		'toolId' : toolId
	}).then(function (result){
		$("#downUser").empty();
        if (result && result.length > 0) {
        	var noti_html = '';
            for (var i in result) {
            	noti_html += "<tr>"
	          	  +  "<td class='center'>" + result[i].fullName
	          	  +  "</td>"
	          	  +  "<td class='center'>" + changeDate(result[i].createTime)
	          	  +  "</td>" 
	          	  +  "</tr>"
            }	
            $("#downUser").html(noti_html);
        }
	});
}
