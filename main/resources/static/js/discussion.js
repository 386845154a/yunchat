var updater = "";
var updater_id = "";
var uList = new Array();
var clean = "";
var teamUser = new Array();
var editor = "";
var at_config = "";
$(function () {
	initDiscussion();
	show_lately();
});

// 初始化
function initDiscussion() {
	//当前用户组信息
	now_Person();
	//从地址栏获得参数
	var disFlag = "";
	var url=decodeURI(location.href);
	var tmp1=url.split("?")[1]; 
	var tmp2 = [];
	if (tmp1) {
		tmp2=tmp1.split("&"); 
	}
	for ( var i in tmp2) {
		if (tmp2[i].split("=")[0] == "disFlag") {
			disFlag = tmp2[i].split("=")[1]; 
		}
	}
	
	if (disFlag) {
		system_noti();
	}

    // // 选择emoji表情
    // $('.emoji-div').click(function () {
    //     var emoji_src = $(this).attr('src');
    //     var startOffset = kindEditor.cmd.range.startOffset;// 编辑器光标处
    //     kindEditor.insertHtml('<img src="' + emoji_src + '" style="width: 30px;height: 30px;" class="emoji-div">');
    // });

    // // 隐藏emoji表情
    // $(document).bind('click', function (e) {
    //     // 隐藏emoji表情弹出框
    //     var target_ = $(e.target);
    //     if (target_.parents("#emoji-panel-div").length == 0 && !target_.hasClass("emoji-li")) {
    //         if ($("#emoji-panel-div").is(':visible')) {
    //             $("#emoji-panel-div").hide();
    //         }
    //     }
    // });

    // 回车发送消息
    $('#msgPre').keydown(function (event) {
		if (event.keyCode == 13) {
	    	if (event.ctrlKey == false){
                sendMsg(2);
                return false;
            }else {
            	$('#msgPre').append('<br/>\n');
            	var obj = document.getElementById('msgPre');
                var range = window.getSelection();// 创建range
                range.selectAllChildren(obj);// range 选择obj下所有子内容
                range.collapseToEnd();// 光标移至最后
            }
    	}
    });

    // 右键
    var menu = new BootstrapMenu('.chat-content', {
        fetchElementData: function (target_) {
            return target_.html();
        },
        actions: [
//          {
//            name: '转发',
//            onClick: function (html) {
//            	var sendType = $('#talking_type').val();
//            	var sendLevel = $('#talking_id').val();
//            	var loginLevel = getLoginLevels();
//        		var fileLevel = "";
//            	var send_level = "";
//            	if (html && html.indexOf("img-msg-div") == -1) {
//                	if (html.indexOf("msg-office-div") != -1 ) {
//                		$.ajax({
//                			type : 'post',
//                			url : '/messageController/queryGandUFile',
//                			data : {
//                				'fileId' : (sendType == "user" ? html.substring(32,45) : html.substring(32,64)),
//                				'uploadType' : sendType
//                			},
//                			dataType : 'JSON',
//                			async: false,
//                			success : function(result) {
//                                 if (loginLevel < result.path.levels) {
//                                 	JqdeBox.message('error', '密级不足，无法转发!');
//                                 	return false;
//                                 }
//                                 if (result.path) {
//                                	 transpond_dialog(html, result.path.levels, sendType, result.path.fileId);
//                                 }
//                			},	
//                			error : function() {
//                			}
//                		});
//					}  else {
//						if (sendType == "group") {
//		            		send_level = getGroupLevels(sendLevel);
//		            	} else if (sendType == "user") {
//		            		send_level = getLevels(sendLevel);
//		            	}
//						transpond_dialog(html, send_level, sendType);
//					}
//                } else {
//                	JqdeBox.message("error", "系统不支持非文件类型转发!");
//                }
//            }
//        },
        {
	        name: '标记',
	        onClick: function (html) {
	        	if (html && html.indexOf("img-msg-div") == -1 && html.indexOf("msg-office-div") == -1) {
	        		addImportantFlag(html);
	        	} else {
	        		JqdeBox.message("error", "系统不支持非文本类型标记!");
	        	}
	        }
        },{
	        name: '下载',
	        onClick: function (html) {
	        	var fileId = "";
	        	var sendType = $('#talking_type').val();
	        	if (html.indexOf("img-msg-div") != -1) {
	        		fileId = (sendType == "user" ? html.substring(34,47) : html.substring(34,66));
	        	} else {
	        		fileId = (sendType == "user" ? html.substring(32,45) : html.substring(32,64));
	        	}
	        	$.ajax({
	        		type : 'post',
	        		url : '/messageController/queryGandUFile',
	        		data : {
	        			'fileId' : fileId,
	        			// 'fileId' : html.substring(32,64),
	        			'uploadType' : sendType
	        		},
	        		dataType : 'JSON',
	        		async: false,
	        		success : function(result) {
	        			if (result.path) {
							$.downloadByPath(result.path.path, result.path.fileName);
							saveLog("downFiles", result.loginName + "在群组中下载了文件！");
	        			}
	        		},	
	        		error : function() {
	        		}
	        	});
	        }
        }
    ]
    });
    $('.chat-list').css("overflow-y", "hidden");
    hFlag();
}

function hFlag() {
    setTimeout(function () {
    	var zdH = $("#left-list").height();
    	if (zdH > 900) {
    		$("#heightInfo").css("height", "825px");
    	} else {
    		$("#heightInfo").css("height", "460px");
    	}
        hFlag();
    }, 100);
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

//获取sendGroupLevel
function getGroupLevels(Id) {
	var levels = "";
	$.ajax({
		type : 'post',
		url : '/groupController/queryGroupInfoById',
		data : {
			'receiver' : Id,
			'type': 'group'
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

//获取登录人员密级
function getLoginLevels() {
	var levels = "";
     $.ajax({
        type: 'POST',
        url: '/homeController/getNewPersonName',
        async:false,
        success: function (data) {
        	levels = data.userLevel;
        }
    });
    return levels;
}

//去除单引号
function delLlittleFlag(flag) {
	flag = "@@" + flag + "@@";
	flag = flag.replace("@@'","").replace("'@@","").replace("@@","");
	return flag;
}

//下载文档
function downfiles(fileName, fileId, uploadType) {
    AjaxMethod.ajax('homeController/queryFile', {'fileId' : fileId, 'uploadType' : uploadType}).then(function (result){
        if (result){
            $.downloadByPath(result.path, fileName);
            saveLog("downFiles", result.loginName + "在群组中下载了文件！");
        }
    });
}

/*加载联系人信息start*/

//获取当前登录人
function now_Person() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		updater_id = result.Id;
		updater = result.userId;
        //通过接口获取任务信息、加载群组
//        interface_getTask_info(now_ID);
		all_project();
        //加载联系人信息
        //loadOfficeRoomInfo();
        loadOfficeRoomInfo('0000');
        //加载最近联系信息
        // show_lately();
	});
}

/*//加载科室信息
function loadOfficeRoomInfo() {
	var org_html = '<ul style="padding:0px;">';
	$.ajax({
		type : 'post',
		url : '/orgController/queryOrg',
		async : false,
		success : function(data) {
			var dJson = data.orgList;
			for (var i in dJson){
				org_html += '<div style="background-color: rgb(225, 246, 255); border: 1px solid #dddddd;" onclick="openOrClose(\'' + dJson[i].orgId + '\')"><img class="user-users goRight" src="/img/org.png"/><span class="orgName">'+dJson[i].orgName+'</span></div>';
				org_html += '<div id='+dJson[i].orgId+' class="org_users"></div>';
			}
			org_html += '</ul>'
			$('#ul_pid_nav_01').html(org_html);
		},
		error : function(err) {
			console.log(err);
		}
	});
}*/
//加载科室信息-new
function loadOfficeRoomInfo(suporgid) {
    var org_html = '<ul style="padding:0px;">';
    $.ajax({
        type : 'post',
        url : '/orgController/queryOrgNew',
		data : {'orgsupid':suporgid},
        async : false,
        success : function(data) {
            var dJson = data.orgList;
            for (var i in dJson){
            	//是否叶子节点1是0否
            	var isLeaf = dJson[i].isLeaf;
                if(isLeaf == 1 || isLeaf == '1'){
                    org_html += '<div style="background-color: rgb(225, 246, 255); border: 1px solid #dddddd;" ><span style="display:inline-block;width: 80%" onclick="openOrClose(\'' + dJson[i].orgId + '\')"><img class="user-users goRight" src="/img/org.png"/><span class="orgName">'+dJson[i].orgName+'</span></span><span style="display: inline-block;cursor: pointer;" onclick = "loadOfficeRoomInfo(\'0000\')">返回</span></div>';
                    org_html += '<div id='+dJson[i].orgId+' class="org_users"></div>';
				}else{
                    org_html += '<div style="background-color: rgb(225, 246, 255); border: 1px solid #dddddd;"><span style="display:inline-block;width: 80%" onclick="loadOfficeRoomInfo(\'' + dJson[i].orgId + '\')"><img class="user-users goRight" src="/img/org.png"/><span class="orgName">'+dJson[i].orgName+'</span></span><span style="display: inline-block;cursor: pointer;" onclick = "loadOfficeRoomInfo(\'0000\')">返回</span></div>';
                    org_html += '<div id='+dJson[i].orgId+' class="org_users"></div>';
				}

            }
            org_html += '</ul>'
            $('#ul_pid_nav_01').html(org_html);
        },
        error : function(err) {
            console.log(err);
        }
    });
}

//展开收缩
function openOrClose(orgId) {
	if (orgId == clean) {
		$('#'+clean).html("");
		clean = "";
	} else {
		classRoomUser(orgId);
	}
}

//加载科室人员
function classRoomUser(orgId) {
	clanUList();
	$('#'+clean).html("");
	clean = orgId;
	AjaxMethod.ajax('homeController/queryClassUser', {'orgId': orgId}).then(function (result){
		var user_html = '';
		var classUserList = result.classUser;
        for (var i in classUserList) {
        	if (classUserList[i].userId != result.loginUserId) {
        		var personLeft = "personLeft" + classUserList[i].userId;
        		user_html += '<li style="background: none; height: 22px; border-radius: 0px; border: 1px solid #dddddd; background-color: rgb(225, 246, 255) !important;" class="list-group-item"  id="li_' + classUserList[i].userId + '" \
        		onclick="change_chat(\'' + classUserList[i].userId + '\',\'' + classUserList[i].fullname + '\', \'user\', this)"> \
        		<div id="'+personLeft+'" class="img-div user-img-div"></div> \
        		<span style="position: relative; left: 35%; bottom: 23px;">' + classUserList[i].fullname + '</span>';
        		if (classUserList[i].isonline == "1") {
        			user_html += '<span style="float:right; color:green; position: relative; left: 10px; bottom: 23px;">[在线]</span>';
        		} else {
        			user_html += '<span style="float:right; color:red; position: relative; left: 10px; bottom: 23px;">[离线]</span>';
        		}
        		personLeftHead(classUserList[i].userId, personLeft, classUserList[i].fullname);
        	}
        }
        user_html += '</li></ul></div>';
        $('#'+orgId).append(user_html);
	});
}

//清空uList
function clanUList() {
	for (var i = 0; i < uList.length; i++) {
		$('#'+uList[i]).html("");
	}
}

/*加载联系人信息end*/

/*加载最近联系信息start*/
//刷新最近联系人
function show_lately() {
	AjaxMethod.ajax('homeController/queryLatelyUser', {}).then(function (result){
		if (result){
			var total = result.count.total;
			var msg_arr = result.count.objectList;
			var contents = [];
			var count = 0;
	        if (msg_arr && msg_arr.length > 0) {
	        	var noti_html = '';
	            for (var i in msg_arr) {
	            	var msg = msg_arr[i];
	            	contents = msg_arr[i].msgContent.split(",");
	            	if (result.loginId == contents[1]) {
	            		count++;
	            	} else if (contents[3] == "all") {
	            		count++;
	            	}
	            }
	            $("#totalCount").html(count);
	        }
			var late_html = '';
//	    	late_html += '<dt style="height: 33px; background-color: rgb(225, 246, 255);" class="list-group-item user-list" id="li_-1" '
//				  	  +  'onclick="system_noti()">'
//				  +  '<div class="img-div sys-img-div"></div>'
//				  +  '<div class="name-span">系统通知</div><div id="badgeCount" class="badge" style="margin-top: -20px; background-color: #E87070;">'+count+'</div></dt>';
	    	if (result.latelyUser && result.latelyUser.length > 0){
	        	for (var i in result.latelyUser){
	        		var num = 0;
        			$("#gstate").show();
            		$("#del").show();
					var linkid =result.latelyUser[i].LINK_ID;
					var type =result.latelyUser[i].TYPE;
					// alert(linkid);
                    // $.ajax({
                     //    type: 'POST',
                     //    url: '/homeController/queryPrivateUserNum',
                     //    data: {"linkid": linkid},
                     //    /**
                     //     *必须false才会自动加上正确的Content-Type
                     //     */
                     //    async:false,
                    //
                     //    success: function (data) {
                     //    	// alert(data);
                     //       num = data;
                     //    }
                    // });

                    $.ajax({
                        type: 'POST',
                        url: '/homeController/notReadCountZ',
                        data: {"senderid": linkid},
                        /**
                         *必须false才会自动加上正确的Content-Type
                         */
                        async:false,

                        success: function (data) {
                            // alert(data);
                            num = data;
                        }
                    });
                     late_html += join_lately_html(result.latelyUser[i].ID, result.latelyUser[i].NAME, result.latelyUser[i].TYPE,num);
                    // alert(result.latelyUser[i].ID);

	        	}
	        }
	    	late_html += '</ul>';
	    	$("#nearest_contact").html(late_html);
//	    	updateNotRead('lately');
		}
	});
}

// 拼接最近联系人聊天列表html，chat的receiveMsg方法需要调用，所以从show_lately方法中剥离
function join_lately_html(id, name, type,num) {
	debugger
	// var num_str = ''
	// if (num > 0) {
	// 	num_str = '<span class="badge" style="margin-top: 10px;width: 16px;height: 40%;background-color: #E87070;">' + num + '</span>'
	// }
	var leftId = "left" + id;
	// var resultVal = '<dt style="height: 33px; background-color: rgb(225, 246, 255);" class="list-group-item item-list" id="li_' + id + '" ' +
    //     '   onclick="change_chat(\'' + id + '\',\'' + name + '\', \'' + type + '\', this)">' +
    //     (type == 'group' ? '<div class="img-div"><img class="user-img" style="width:40px; height:40px;" src="/img/group.png"></div>' : ('<div id="'+leftId+'" class="img-div user-img-div"></div>')) +
    //     '<span style="position: relative; left: 35%; '+(type == "user" ? "bottom: 20px;" : "bottom: 33px;")+'">' + name + '</span>'+num_str+'<img style="width: 21px; position: absolute; top: 15px; right: 5px;" onclick="del_zj(\'' + id + '\', \'' + type + '\')" src="/img/delete_zj.png"></dt>';
    // if (type == "user") {
    // 	leftHead(id, leftId, name);
    // }
	// debugger
	var resultVal = '<blockquote class="layui-elem-quote" onclick="change_chat(\'' + id + '\',\'' + name + '\', \'' + type + '\', this)">'+name +'</blockquote>'
    return resultVal;
}
/*加载最近联系信息end*/

/*加载群组start*/

//获取项目组
function all_project() {
	var project_info = "";
	var num_id = 0;
	var num_pic = 0;
	project_info += '	<li class="list-group-item item-user" style="background: none; height: 30px; border-radius: 0px; border: 1px solid #dddddd; background-color: rgb(225, 246, 255) !important;">';
	project_info += '		<a onclick="change_pic(\'' + '其他' + '\', \'' + 'p_other' + '\' , \'' + 'caocao_pic_other' + '\')"';
	project_info += '			style="float: left; color: #000000; font-size:15px; text-decoration: none;">';
	project_info += '		<img src="/img/jia.png" id='+ 'caocao_pic_other' +'>';
	project_info += '		<span style="position: relative; top: 3px; font-weight: bold;">'+'研讨组'+'</span>';
	project_info += '		</a>';
	project_info += '		<button onclick="get_create_group()" style="position: relative; top: 5px; height: 20px; line-height: 20px; border-radius: 5px; float: right;">'+'添加'+'</button>';
	project_info += '	</li>';
	project_info += '	<ul id='+ 'p_other' +'></ul>';
	// project_info += '	<li class="list-group-item item-user" style="background: none; height: 30px; border-radius: 0px; border: 1px solid #dddddd; background-color: rgb(225, 246, 255) !important;">';
	// project_info += '		<a onclick="change_pic(\'' + 'MPM' + '\', \'' + 'mpm' + '\' , \'' + 'caocao_mpm' + '\')"';
	// project_info += '			style="float: left; color: #000000; font-size:15px; text-decoration: none;">';
	// project_info += '		<img src="/img/jia.png" id='+ 'caocao_mpm' +'>';
	// project_info += '		<span style="position: relative; top: 3px; font-weight: bold;">'+'MPM'+'</span>';
	// project_info += '		</a>';
	// project_info += '		<button onclick="create_mpm()" style="position: relative; top: 5px; height: 20px; line-height: 20px; border-radius: 5px; float: right;">'+'添加'+'</button>';
	// project_info += '	</li>';
	// project_info += '	<ul id='+ 'mpm' +'></ul>';
	$("#ul_pid_nav_03").html(project_info);
}

//项目组展开收缩
function change_pic(name, ul_id, caocao_pic){
	var imgObj = document.getElementById(caocao_pic);
	if(imgObj.getAttribute("src",2)=="/img/jian.png"){
		imgObj.src="/img/jia.png";
		$("#"+ul_id).hide();
	}else{
		imgObj.src="/img/jian.png";
		$("#"+ul_id).show();
	}
	show_group(name, ul_id, caocao_pic);
}

//刷新组
function show_group() {
	AjaxMethod.ajax('homeController/queryGroup').then(function (result){
		var group_html = '';
		if (result && result.length > 0) {
				for (var i in result) {
					var group_name = "";
					if (result[i].GROUP_NAME.length > 7) {
						group_name = result[i].GROUP_NAME.substring(0,7) + "...";
					} else {
						group_name = result[i].GROUP_NAME;
					}
					group_html += '<blockquote  class="layui-elem-quote" onclick="change_chat(\'' + result[i].GROUP_ID + '\',\'' + result[i].GROUP_NAME + '\', \'group\', this, \'' + result[i].CREATOR + '\')">' +group_name+'</blockquote>'
					// 	'<li  onmouseover="showGname(\'' + result[i].GROUP_ID + '\')" onmouseout="outGname(\'' + result[i].GROUP_ID + '\')" style="background: none; height: 30px; border-radius: 0px; border: 1px solid #dddddd; background-color: rgb(225, 246, 255) !important;" class="list-group-item item-user" id="li_' + result[i].GROUP_ID + '" \
					// onclick="change_chat(\'' + result[i].GROUP_ID + '\',\'' + result[i].GROUP_NAME + '\', \'group\', this, \'' + result[i].CREATOR + '\')"> \
					// <div class="img-div"><img class="user-img" style="width:35px; height:35px;" src="/img/group.png"></div> \
					// <div style="float: right; position: absolute; bottom: 15px; left: 110px;">' + group_name + '</div>'
				}
    	}
    	$("#group_list").html(group_html);
	});
}

function showGname(id) {
	$("#"+id).show();
}

function outGname(id) {
	$("#"+id).hide();
}


/*加载群组end*/

//添加重要标记
function addImportantFlag(html) {
	var meg = html;
	AjaxMethod.ajax('groupController/addImportantFlag', {'meg': meg}).then(function (result){});
	JqdeBox.message('success', '添加成功');
    show_importantInfo_user($('#chat-user-id').val());
}

//搜索用户列表
function query_userlist() {
	clanUList();
	$('#'+clean).html("");
	var name = $('#contacts_kw_').val().trim();
	if (name) {
		$('#ul_pid_nav_01_1').empty();
		$('#ul_pid_nav_01_1').show();
		AjaxMethod.ajax('homeController/getUserByName', {'name': name}).then(function (result){
			if (result.userList.length > 0 || result.groupList.length > 0){
				$('#nav_00').show();
				for (var i in result.userList) {
					var user_html = '';
					var personLeft = "personLeft" + result.userList[i].userId;
					user_html += '<li style="background: none; height: 22px; border-radius: 0px; border: 1px solid #dddddd; background-color: rgb(225, 246, 255) !important;" class="list-group-item"  id="li_' + result.userList[i].userId + '" \
					onclick="change_chat(\'' + result.userList[i].userId + '\',\'' + result.userList[i].fullname + '\', \'user\', this)"> \
					<div id="'+personLeft+'" class="img-div user-img-div"></div> \
					<span style="position: relative; left: 35%; bottom: 23px;">' + result.userList[i].fullname + '</span>';
					if (result.userList[i].isonline == "1") {
						user_html += '<span style="float:right; color:green; position: relative; left: 13px; bottom: 23px;">[在线]</span>';
					} else {
						user_html += '<span style="float:right; color:red; position: relative; left: 13px; bottom: 23px;">[离线]</span>';
					}
					personLeftHead(result.userList[i].userId, personLeft, result.userList[i].fullname);
					user_html += '</li></ul></div>';
					$('#ul_pid_nav_01_1').append(user_html);
					uList[i] = result.userList[i].orgId;
				}
				for (var i in result.groupList) {
					var group_html = '';
					var group_name = "";
					if (result.groupList[i].groupName.length > 7) {
						group_name = result.groupList[i].groupName.substring(0,7) + "...";
					} else {
						group_name = result.groupList[i].groupName;
					}
					group_html += '<li  onmouseover="showGname(\'' + result.groupList[i].groupId + '\')" onmouseout="outGname(\'' + result.groupList[i].groupId + '\')" style="background: none; height: 30px; border-radius: 0px; border: 1px solid #dddddd; background-color: rgb(225, 246, 255) !important;" class="list-group-item item-user" id="li_' + result.groupList[i].groupId + '" \
					onclick="change_chat(\'' + result.groupList[i].groupId + '\',\'' + result.groupList[i].groupName + '\', \'group\', this, \'' + result.groupList[i].creator + '\')"> \
					<div class="img-div"><img class="user-img" src="/img/group.png"></div> \
					<div style="float: right; position: absolute; top: 0px; left: 42px; width: 100%;">' + group_name + '</div>'
					$('#ul_pid_nav_01_1').append(group_html);
				}
			} else {
				clanUList();
			}
		});
		$('#ul_pid_nav_01').hide();
		$('#ul_pid_nav_02').hide();
		$('#ul_pid_nav_03').hide();
		$('#nav_00').show();
		$('#ul_pid_nav_01_1').show();
	} else {
		$('#nav_00').hide();
		$('#ul_pid_nav_01_1').hide();
		$('#ul_pid_nav_01_1').empty();
		//loadOfficeRoomInfo();
        loadOfficeRoomInfo('0000');
	} 
}


//删除最近联系人
function del_zj(id, type) {
	AjaxMethod.ajax('homeController/delLink', {
		'link_id' : id,
		'type' : type
	}).then(function (result){
		JqdeBox.message('success', '删除成功！');
        show_lately();
	});
}

//获取头像路径
function leftHead(userID, leftId, name) {
	AjaxMethod.ajax('userHeadController/queryHead', {'userID' : userID}).then(function (result){
		if (result) {
		   var head_img = '';
		   var img_style = "border-radius: 40px; width: 24px; height: 24px; position: relative;top: 5px; left: 5px;";
           var head = result.head;
           if (head) {
        	   head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+head.head+'" class="img-msg">'
           } else {
        	   head_img = name.substring(0, 1);
           }
           $('#'+leftId).html(head_img);
        }
	});
}

// 获得系统通知
function system_noti() {
	$('#system_noti_list').show();
	$('#noti_page_div').hide();
	$('#user_info_div').hide();
	$('.right-main-div').hide();
	$('.group-info-div').hide();
	$('#system_noti_div').show();
    $('#chat-type').val('system');
//    $('#chat-user-name').html('系统通知');
    $('#chat-user-id').val('-1');
    $('#user-list').find('.active').removeClass('active');
    $('#li_-1').addClass('active');
    system_noti_page();
}

// 分页查询系统消息
function system_noti_page() {
	AjaxMethod.ajax('sysController/qSysMsg').then(function (result){
		$("#system_noti_list").empty();
		$("#badgeCount").html(result.count);
		var sysInfo = result.sysInfo;
		var page_html = "";
		for (var i = 0 ; i < sysInfo.length; i++){
			var contents = sysInfo[i].msgContent;
			if (sysInfo[i].msgType == "all") {
				page_html += '<div class="list-group-item" onclick="data_xq(\'' + sysInfo[i].msgTitle + '\', \'' + contents + '\')">' 
				page_html += '	<span style="cursor: pointer;"><a>'+ sysInfo[i].msgTitle + '</a></span>'
				page_html += '	<span style="float:right;">'+ changeDate(sysInfo[i].sendTime) +'</span>'
				page_html += '</div>';
			} 
		}
		$("#system_noti_list").html(page_html);
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

// 拼接系统消息html
function join_system_noti(notificationId, title, type, content, date) {
	var contents = content.split(",");
	var senderId = contents[0];
	var receiver = contents[1];
	var message = contents[2];
	var type_ = contents[3];
	var time = changeDate(date);
	var showInfo = message;
	var loginUserId = query_userId();
	if (type_ == "all") {
		return '<div class="list-group-item">'+ showInfo +'<span class="noti_time">'+time+'</span></div>';
	} else {
		if (loginUserId == receiver) {
			if(type == 'href') {
				return '<div class="list-group-item">'+ showInfo +'<span class="noti_time">'+time+'</span></div>';
//				return '<div class="list-group-item">'+ showInfo +'<a href="'+content+'" target="noti_iframe" onclick="show_iframe_info(\'' + notificationId + '\', \'' + message + '\', \'' + type_ + '\')">' 
//				+ "确认" + '</a><span class="noti_time">'+time+'</span></div>';
			}
		} else {
			return "";
		}
	}
	
}

//userId
function query_userId() {
	var userId = "";
	$.ajax({
		type : 'post',
		url : '/homeController/getNewPersonName',
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			userId = msg.Id;
		},	
		error : function() {
		}
	});
	return userId;
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

// 选择聊天对象
var user_array = [];// 当前组成员列表
function change_chat(chatId, name, type, this_, creator) {
	if (type == "user") {
		$("#send_type").val("chat");
	} else {
		$("#send_type").val("group");
	}
	$('#talking_id').val(chatId);
	$('#talking_type').val(type);
	close_type = type;
	show_chat();
    $('#chat-type').val(type);
    $('#chat-user-name').html(name);
    $('#chat-user-id').val(chatId);
    $('#right-info').show();
    $('#chat-content').html('');
    $('#msgPre').html('');
    $('#user-list').find('.active').removeClass('active');

    // 增加@功能，获取组内成员
    AjaxMethod.ajax('groupController/queryGroupUser', {'groupId' : chatId}).then(function (result){
        teamUser = result;
        // console.log(teamUser)
        //设置@功能
        at_config = {
            at: "@",
            // data:[{"userId":"12345678912345678X","fullname":"李乾坤","orgName":"一室","ttt":"222"},{"id":"123456789123456789","name":"王锴"},{"id":"3","name":"孔德博"},{"id":"4","name":"刘攀"},{"id":"5","name":"赵又鸣"}],
            data: teamUser.userList,
            insertTpl: '<span userid="${userId}">@${fullname}</span>',       //你的dom结构里显示的内容  你可以给span加样式  绑定id
            displayTpl: "<li > ${fullname}-${orgName} </li>",                       // 这个是显示的弹出菜单里面的内容 
            startWithSpace: false,//是否已空格开始
            callbacks: {
                beforeInsert: function (value, $li, e) {
                    var at_user_list = value.match('(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X|x)');
                   if (at_user_list != null) {
                       var at_user = at_user_list[0];
                       console.info("userid" + at_user);
                       $('#at_user').val(at_user);
				   }
                    return value;
                }
            },
            limit: 20
        };
        editor = CKEDITOR.replace( 'msgcontent',{
            // enterMode: false,
            // // Pressing Shift+Enter will create a new <p> element.
            // shiftEnterMode: CKEDITOR.ENTER_P

				enterMode : CKEDITOR.ENTER_BR,
				shiftEnterMode : CKEDITOR.ENTER_P,
		});

        CKEDITOR.on('instanceReady', function(event) {
            CKEDITOR.instances.msgcontent.document.$.body.onkeydown = function(e) {
                // console.log(e.keyCode); //可以用来监测你的按键
                if (e.keyCode == 13){
                        sendMsg(2);
                }
            };
            var editor = event.editor;
            // Switching from and to source mode
            editor.on('mode', function(e) {
                load_atwho(this, at_config);
            });
            // First load
            load_atwho(editor, at_config);
        });

    });



    show_group_matter(false);
    $(this_).addClass('active');
    // 重新计数未读
    not_read[chatId] = 0;
    $(this_).find('.badge').remove();
    

    // 获得最近聊天信息
	AjaxMethod.ajax('homeController/queryLatelyMsg', {'type' : type, 'id' : chatId}).then(function (result){
		var msg_arr = result.msgList;
        var userId = result.userId;
        var re_num = 0;
        if (msg_arr && msg_arr.length > 0) {
            for (var i = (msg_arr.length - 1); i >= 0; i--) {
                var msg = msg_arr[i];
                join_msg(msg.msgSender == userId, msg.sendTime, msg.senderName, msg, msg.msgType, msg.msgId, msg.msgSender, msg.levels);
            }
//-            getReInfo();
            // 更新消息为已读
            var last_msg = msg_arr[0];// 最后一条消息
            if (last_msg){
            	readMsg(last_msg.msgId, chatId, type);
            	getTotalmsg('lately');
            }  
        }
//-        if (msg_arr.length >= 10){
//-        	$('#load-div').html('<span class="load-span" onclick="loadMove()">加载更多消息</span>');
//-        }else {
        	$('#load-div').html('<span class="load-span" onclick="show_himsg(1)"><i class="fa fa-list"></i>历史消息</span>');
//-        }
	});
	
	// 如果是讨论组，显示讨论组菜单
	$('.group-info-div').show();
    if (type == "group"){
    	show_group_info();
    	$('#group_info_div').show();
    	$('#isTabShow').show();
    	$("#closeGroup").show();
    	$('#user_info_div').hide();
    	document.getElementById("container-div").style['width']="100%";
    	document.getElementById("container_div").style['width']="100%";
    }else {
    	show_user_info(chatId);
    	getHeadPath_(chatId);
    	$('#group_info_div').hide();
    	$('#isTabShow').hide();
    	$("#closeGroup").hide();
    	$('#user_info_div').show();
    	document.getElementById("container-div").style['width']="100%";
    	document.getElementById("container_div").style['width']="100%";
    }
    bottom_level(chatId, type);
}

// 显示讨论组成员
function show_group_user() {
	$('.group-info-div').find('.active').removeClass('active');
	$('#guser').addClass('active');
	$(".right-main-div").hide();
	$("#important_info_div").hide();
	$("#group_file_div").hide();
	$("#group_user_div").show();
	$('#main-div').show();
	var groupId = $('#chat-user-id').val();
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');
	}
	AjaxMethod.ajax('groupController/queryGroupUser', {'groupId' : groupId}).then(function (result){
		if (result){
    		var user_html = '<ul class="list-group">';
    		var user_list = result.userList;
    		for (var i in user_list){
    			var isOnLine = "";
    			if (user_list[i].isonline == "0") {
    				isOnLine = "离线";
    				user_html += '<li class="list-group-item" onclick="user_info(\''+user_list[i].userId+'\')"> \
					<label> ' + user_list[i].fullname + '</label><label>[' + user_list[i].orgName + ']</label></li>';
    			} else if (user_list[i].isonline == "1") {
    				isOnLine = "在线";
    				user_html += '<li class="list-group-item" onclick="user_info(\''+user_list[i].userId+'\')"> \
					<label style="color: #0BE213;"> ' + user_list[i].fullname + '</label><label>[' + user_list[i].orgName + ']</label></li>';
    			}
    		}
    		user_html += '</ul>'
    		$('#group_user_list').html(user_html);
    	}
	});
}

function toogle(th){ 
	var ele = $(th).children(".move"); 
	if(ele.attr("data-state") == "on"){ 
		ele.animate({left: "0"}, 300, function(){ 
			ele.attr("data-state", "off"); 
			show_group_matter(false);
			//alert("关！"); 
		}); 
		$(th).removeClass("on").addClass("off"); 
	} else if (ele.attr("data-state") == "off"){ 
		ele.animate({left: '28px'}, 300, function(){ 
			$(this).attr("data-state", "on"); 
			show_group_matter(true);
			//alert("开！"); 
		}); 
		$(th).removeClass("off").addClass("on"); 
	} 
} 

//显示重要信息
function show_importantInfo_user(groupId) {
	$('.group-info-div').find('.active').removeClass('active');
	$('#import').addClass('active');
	$(".right-main-div").hide();
	$("#group_file_div").hide();
	$("#important_info_div").show();
	$("#main-div").show();
	AjaxMethod.ajax('groupController/queryImportantInfo', {'groupId': groupId}).then(function (result){
		if (result){
    		var user_html = '<ul class="list-group">';
    		var user_list = result.importantList;
    		for (var i in user_list){
    			var importMsg = removeStyle(user_list[i].msg);
    			if (user_list[i].msgType == "text" && user_list[i].isImportant == "1" && user_list[i].msgReceiver == groupId) {
					user_html += '<li class="list-group-item" onclick=""> \
                        <a onclick=\"removeimpurtant_(\''+user_list[i].msg+'\')\"> \
  	                      <i class="ace-icon fa fa-trash-o  bigger-130" style="float:left; margin-top: 2px;"></i> \
  	                    </a> \
                        <label style="margin-left:5px;"> ' + importMsg + '<i class="glyphicon glyphicon-link" onclick=\"his_details(\''+importMsg+'\', \''+groupId+'\')\" style="color: #428BD3; cursor:pointer; margin-left:40px;"></i></label> \
					</li>';
    			}
    		}
    		user_html += '</ul>'
    		$('#important_info_list').html(user_html);
    	}
	});
}

//去除样式
function removeStyle(msg) {
     var kindVal = msg;
	 kindVal=kindVal.replace(/<\/?.+?>/g,"");
	 kindVal=kindVal.replace(/ /g,"");//去掉html标签的内容
	 kindVal=kindVal.replace(/\t+/g,"");//\t
	 kindVal=kindVal.replace(/\ +/g,"");//去掉空格
	 kindVal=kindVal.replace(/[ ]/g,"");//去掉空格
	 kindVal=kindVal.replace(/[\r\n]/g,"");//去掉回车换行
	 if (!kindVal) {
		 msg.html("");
	 }
	return kindVal;
}

//取消重要信息标记
function removeimpurtant_(msg) {
	AjaxMethod.ajax('groupController/removeImportantInfo', {
		'msg': msg
	}).then(function (result){
		if (result){
            JqdeBox.message('success', '删除成功');
            show_importantInfo_user($('#chat-user-id').val());
    	}
	});
}

//查看重要任务详情
function his_details(msg, groupId) {
	//获取全部组信息
	AjaxMethod.ajax('homeController/queryAllHisGroupMsg', {'msg' : msg, 'groupId' : groupId}).then(function (result){
		window.open("/indexController/historicaldetails?msg="+msg+",groupId="+encodeURIComponent(JSON.stringify(result.msgList))+",userId="+updater_id,"","width=550px,height=560px,screenX=550px,screenY=250px");
//		window.open('historicaldetails.html', 'newwindow', 'height=100,width=100,status=yes,msg='+msg+'groupId='+encodeURIComponent(JSON.stringify(result.msgList))+'userId='+updater_id);
	});
	
}

//显示人员信息
function user_info(userId) {
	$('#group-user-modal').modal('show');
	if (userId) {
		$('.sah').hide();
		AjaxMethod.ajax('homeController/queryUserInfo', {'userId' : userId}).then(function (result){
			if (result){
				var img_style = "border-radius: 40px; width: 60px; height: 60px; margin-top: -4px;";
				var head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+result.head+'" class="img-msg"">'
				$('#guser_lastname').html(head_img);
				$('#guser-name').html(result.fullname);
				$('#guser-org').html(result.orgName);
				$('#guser-mobile').html(result.mobile || '无');
				$('#guser-phone').html(result.phone || '无');
				$('#guser-email').html(result.email || '无');
			}
		});
	} else {
		$('.sah').show();
		AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
			var now_Id = result.Id;
			AjaxMethod.ajax('homeController/queryUserInfo', {'userId' : now_Id}).then(function (result){
				if (result){
					var img_style = "border-radius: 40px; width: 60px; height: 60px; margin-top: -4px;";
					var head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+result.head+'" class="img-msg"">'
					$('#guser_lastname').html(head_img);
					$('#guser-name').html(result.fullname);
					$('#guser-org').html(result.orgName);
					$('#guser-mobile').html(result.mobile || '无');
					$('#guser-phone').html(result.phone || '无');
					$('#guser-email').html(result.email || '无');
				}
			});
		});
	}
}

// 显示讨论组信息
function show_group_info() {
	$('.group-info-div').find('.active').removeClass('active');
	$('#ginfo').addClass('active');
	$(".right-main-div").hide();
	$("#important_info_div").hide();
	$("#group_file_div").hide();
	$("#group_user_div").hide();
	$("#group_info_div").show();
	$('#main-div').show();
	var groupId = $('#chat-user-id').val();
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');
	}
	AjaxMethod.ajax('groupController/queryGroupInfo', {'groupId' : groupId}).then(function (result){
		if (result){
    		$('#group_name').html(result.groupName);
    		switch (result.levels) {
				case '1':
                    $('#group_le').html("非密");
					break;
                // case '2':
                //     $('#group_le').html("内部");
                //     break;
                // case '3':
                //     $('#group_le').html("秘密");
                //     break;
                // case '4':
                //     $('#group_le').html("机密");
                //     break;
			}
    		$('#group_describe').html(result.groupDescribe);
    		$('#group_create_time').html(format_date(result.createTime));
    		if (result.creatorName){
    			$('#group_creator').html(result.creatorName);
    		}else if(result.creator == -1){
    			$('#group_creator').html("系统创建");
    		}
    		
    	}
	});
}

// 显示组文件
function show_group_file() {
	$('.group-info-div').find('.active').removeClass('active');
	$('#gfile').addClass('active');
	$(".right-main-div").hide();
	$("#important_info_div").hide();
	$("#group_file_div").show();
	$('#main-div').show();
	fc_group_file(1);
}

//关闭讨论组
function closed_group(groupId, this_) {
	JqdeBox.confirm('是否关闭讨论组？', function (is_) {
    	if (is_){
    		AjaxMethod.ajax('groupController/closedGroup', {
    			'groupId': groupId
    		}).then(function (result){
    			if (result.success) {
    				JqdeBox.message('success', '讨论组已关闭！');
    				location.reload();
    			} else {
    				JqdeBox.message('success', '非创建者不可关闭群组!');
    			}
    		});
    	}
    });
}

//讨论组状态加载讨论组信息2018-03-22
function show_group_matter(flag){
	var dv = document.getElementById( "msgPre" );
	return;
    if(flag) {
       dv.style.display = "none"; 
    } else {
        dv.style.display = "block";
    }
}

// 拼接讨论组文件列表，翻页查询调用
function fc_group_file(page) {
	var groupId = $('#chat-user-id').val();
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');
	}
	AjaxMethod.ajax('groupController/queryGroupFile', {'groupId' : groupId, 'page' : page, 'fileName' : $('#group_file_input').val()}).then(function (result){
		if (result){
			var file_html = '';
			var page_data = result.data.objectList;
			for (var i in page_data){
				var file_name = page_data[i].fileName
				file_html += '<tr><td class="group_file_name" title="' + page_data[i].fileName + '"'
				+'onclick="fc_group_file_down(\''+page_data[i].fileName+'\', \''+page_data[i].path+'\')">'
				+ file_name + '</td> \
				<td class="center">' + page_data[i].creatorName + '</td> \
				<td class="del_gro_fil center" onclick="removeGroupFile(\''+page_data[i].fileId+'\', \''+page_data[i].path+'\', \''+page_data[i].readPath+'\')"> \
				<i class="fa fa-trash"></i></td></tr>';
			}
    		$('#file-table').html(file_html);
    	}
	});
}

function fc_group_file_down(fileName, path) {
	$.downloadByPath(fileName, path);
}

// 计算文件大小
function change_size_type (file_size){
	if (file_size){
		if (file_size < 1024){
			return file_size + 'B';
		}else if (file_size < 1024*1024){
			return (file_size/1024).toFixed(2) + 'KB';
		}else if (file_size < 1024*1024*1024){
			return (file_size/(1024*1024)).toFixed(2) + 'MB';
		}else  if (file_size < 1024*1024*1024*1024){
			return (file_size/(1024*1024*1024)).toFixed(2) + 'GB';
		}else {
			return '未知';
		}
	}else {
		return '未知';
	}
}
// 格式化时间
function format_date(date) {
	var newDate = new Date(date);
	return newDate.toJSON().substring(0, 10);
}

// 显示聊天页面
function show_chat() {
	$('.group-info-div').find('.active').removeClass('active');
	$('.right-main-div').hide();
	$('#main-div').show();
	if (close_type == "group") {
		$('#group_info_div').show();
	} else if (close_type == "user") {
		$('#user_info_div').show();
	}
}

//commit
function updateFiles() {
	var gid = $('#chat-user-id').val();
	var type = $('#talking_type').val();
	AjaxMethod.ajax('groupController/queryGroupInfoById', {'receiver' : gid, 'type': type}).then(function (result){
		if (result) {
			get_level(type, result.levels);
			if (type == "chat" || type == "user") {
				$("#my_Modal").modal();
			} else if (type == "group") {
				$("#myModal").modal();
			}
		}
	});
}

function isClick(flag) {
	if (flag == "true") {
		if ($("#level_Id").val()) {
			$('#one').removeAttr("disabled");
		} else {
			$('#one').attr("disabled","disabled");
		}
	} else {
		if ($("#levelId").val()) {
			$('#two').removeAttr("disabled");
		} else {
			$('#two').attr("disabled","disabled");
		}
	}
}

//获取保密等级
function get_level(type, levels) {
	AjaxMethod.ajax('levelController/queryLevel', {}).then(function (result){
		if (result){
    		//填充到select左右风格中的左侧框
			var html_ = "";
			$('#levelId').empty();
			$('#levelId').append('<option  value="" selected>-选择密级-</option>');
			$('#level_Id').empty();
			$('#level_Id').append('<option  value="" selected>-选择密级-</option>');
			$(result.levelList).each(function(i) {
				var loginLevel = getLevels();
				if (loginLevel < levels) {
					if (this.levelId <= loginLevel) {
						if (type == "chat" || type == "user") {
							$('#level_Id').append('<option value="'+this.levelId+'">'+this.levelName+'</option>');
						} else if (type == "group") {
							$('#levelId').append('<option value="'+this.levelId+'">'+this.levelName+'</option>');
						}
					}
				} else {
					if (this.levelId <= levels) {
						if (type == "chat" || type == "user") {
							$('#level_Id').append('<option value="'+this.levelId+'">'+this.levelName+'</option>');
						} else if (type == "group") {
							$('#levelId').append('<option value="'+this.levelId+'">'+this.levelName+'</option>');
						}
					}
				}
				
			});
		}
	});
}

//信息密级初始化
function bottom_level(chatId, type) {
	AjaxMethod.ajax('levelController/queryLevel', {}).then(function (result){
		if (result){
    		//填充到select左右风格中的左侧框
			var bottom_html = "", reLevel = "";
			$('#bottom_level').empty();
			var loginLevel = result.loginLevel;
			if (type == "group") {
				reLevel = getGroupNameById(chatId);
			} else {
				reLevel = getNameById(chatId);
			}
			$(result.levelList).each(function(i) {
				if (loginLevel <= reLevel) {
					if (this.levelId <= loginLevel) {
						if (this.levelId == "1") {
							$('#bottom_level').append('<input type="radio" name="bottomLevel" value="'+this.levelId+'"  checked="checked" />'+'<span style="color:red;">'+this.levelName+'</span>');
						} else {
							$('#bottom_level').append('<input type="radio" name="bottomLevel" value="'+this.levelId+'" />'+'<span style="color:red;">'+this.levelName+'</span>');
						}
					}
				} else {
					if (this.levelId <= reLevel) {
						if (this.levelId == "1") {
							$('#bottom_level').append('<input type="radio" name="bottomLevel" value="'+this.levelId+'"  checked="checked" />'+'<span style="color:red;">'+this.levelName+'</span>');
						} else {
							$('#bottom_level').append('<input type="radio" name="bottomLevel" value="'+this.levelId+'" />'+'<span style="color:red;">'+this.levelName+'</span>');
						}					
					}
				}
			});
		}
	});
}

//userId密级
function getNameById(Id) {
	var uLevel = "";
	$.ajax({
		type : 'post',
		url : '/homeController/queryUserInfo',
		data : {
			'userId' : Id
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			uLevel = msg.levels;
		},	
		error : function() {
		}
	});
	return uLevel;
}

//groupId密级
function getGroupNameById(groupid) {
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
			groupLevels = msg.groupLevels;
		},	
		error : function() {
		}
	});
	return groupLevels;
}

//发送人和接收人密级
function getLevels() {
	var levels = "";
	$.ajax({
		type : 'post',
		url : '/homeController/getNewPersonName',
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			levels = msg.userLevel;
		},	
		error : function() {
		}
	});
	return levels;
}

// 上传聊天文件
function upload_chat_file(this_) {
	var files = $(this_)[0].files;
	var levels = $("#level_Id").val();
	JqdeBox.confirm('是否将<span style="font-size: 135%; font-weight: bold;">'+files[0].name+'</span>文件，按照<span style="color:red; font-size: 135%; font-weight: bold;">'+changeLevelIdToName(levels)+'</span>级别上传？', function (result){
       if (result){
    	   if (!levels) {
    		   JqdeBox.message('error', '请填选择密级别！');
    		   return false;
    	   }
    	   if (files.length < 1){
    		   return false;
    	   } else if (files.length > 1) {
    		   JqdeBox.message('error', '不支持多文件上传！');
    		   return false;
    	   } else {
    		   var chatId = $('#chat-user-id').val();
    		   var chatType = $('#chat-type').val();
    		   if (!chatId || !chatType){
    			   JqdeBox.message('error', '系统出错，请稍后再试！');
    		   }
    		   for (var i = 0 ; i < files.length; i++){
    			   var file = files[i];
    			   if (file.size > 500*1024*1024){
    				   alert('您上传的文件：' + file.name + '大小超过500MB，不能上传！');continue;
    			   }
    			   // 生成一个fileId
    			   var timestamp = new Date().getTime();// 精确到毫秒的时间戳
    			   var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id
    			   
    			   // 开始上传
    			   var xhr = new XMLHttpRequest();
    			   xhr.open("POST", "/upDownLoadController/uploadChatFlie", true);
    			   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'multipart/form-data;');
    			   var formData = new FormData();
    			   formData.append("fileId", file_id);
    			   formData.append("file", file);
    			   formData.append("chatId", chatId);
    			   formData.append("chatType", chatType);
    			   formData.append("levels", levels);
    			   formData.append("up_path", "D:/toolsupload");
    			   saveLog("upUserFile", "上传个人文件"+file.name);
    			   // 上传结束
    			   xhr.onload = function (event) {
    				   var data = eval("("+xhr.responseText+")");// 返回对象
    				   // 拼接显示结果
    				   var msg = join_uploaded(data, "chat", levels);
    				   // 发送文件消息
    				   var msgType = file.type.length > 11 ? file.type.substring(0, 11) : file.type;
    				   socket.emit('send-text', token, data.receiverStr, msg, chatType, msgType, levels);
    			   };
    			   // 发生错误事件
    			   xhr.onerror = function (event) {  
    				   JqdeBox.alert("文件发送失败，请稍后再试！");
    			   }
    			   // xhr.upload.addEventListener("progress", function (evt){},
    			   // false);//进度条
    			   xhr.send(formData);
    		   }
    		   // 清空上传文件框，使其可以重复上传相同文件
    		   $(this_).val("");
    	   }
       } else {
    	   $(this_).val("");
       }
       $('#my_Modal').modal('hide');
	});
	
}

// 拼装上传结束后的文件信息
function join_uploaded(file, send_type, lev) {
	var msg = '';
    var file_type = '';
    var type = file_type.substring(0, file_type.indexOf('/'));
    var file_ext = file.fileExt;
    if (file.fileType === 'image'){
        msg = '<div class="img-msg-div"><img id="' + file.fileId + '" src="/upDownLoadController/readFile?path=' + file.readPath
        	+ '" class="img-msg" onclick="show_img(\'' + file.readPath + '\', \'' + file.chatType + '\')"></div>';
        file_type = 'image';
    }else{
        if (file_ext === 'doc' || file_ext === 'docx'){
            file_type = 'doc';
        }else if (file_ext === 'xls' || file_ext === 'xlsx'){
            file_type = 'xls';
        }else if (file_ext === 'ppt' || file_ext === 'pptx'){
            file_type = 'ppt';
        }else if (file_ext === 'pdf'){
            file_type = 'pdf';
        }else if (file_ext === 'txt'){
            file_type = 'txt';
        }else if (file_ext === 'rar' || file_ext === 'zip'){
            file_type = 'zip';
        }else{
            file_type = 'other';
        }
        msg = '<div class="msg-office-div" id="' + file.fileId + '" \
        onclick="view_by_id(\'' + file.fileName + '\',\'' + file.fileId + '\',\'' + file.levels + '\',\'' + send_type + '\')"> \
            <div class="icon-img-div ' + file_type + '-img-div"></div> \
            <span class="name-span">' + file.fileName + '</span> \
            </div>';
    }
    // 替换消息
    $('.loading-div').each(function (i, v) {
        if (v.id == file.fileId){
        	var chat_content = $(v).closest('.chat-content');
        	chat_content.html(msg);
        }
    });
    
	 var head = '';
	 $.ajax({
	      type: 'post',
	      url: '/homeController/loginUserInfo',
	      async:false,
	      success: function (result) {
	          head = result.head;
	      },
	      error: function(e) {
	      }
	 });
	 var result = {
	  	'user' : {'head' : head},
		'msg' : msg
	 };
	 join_msg(true, new Date(), null, JSON.stringify(result), type, "", "", lev);
    return msg;
}

// 上传讨论组文件
function upload_group_file(this_, left_levels) {
	var files = $(this_)[0].files;
	var levels = "";
	if (left_levels) {
		levels = left_levels;
	} else {
		levels = $("#levelId").val();
	}
	JqdeBox.confirm('是否将<span style="font-size: 135%; font-weight: bold;">'+files[0].name+'</span>文件，按照<span style="color:red; font-size: 135%; font-weight: bold;">'+changeLevelIdToName(levels)+'</span>级别上传？', function (result){
	    if (result){
	    	if (!levels) {
	    		JqdeBox.message('error', '请填写保密级别！');
	    		return false;
	    	}
	    	if (files.length < 1){
	    		return false;
	    	} else if (files.length > 1) {
	    		JqdeBox.message('error', '不支持多文件上传！');
	    		return false;
	    	} else {
	    		var groupId = $('#chat-user-id').val();
	    		var chatType = $('#chat-type').val();
	    		if (!groupId){
	    			JqdeBox.message('error', '系统出错，请稍后再试！');
	    		}
	    		// sendIntegral("2", "qiushi", "talk_3", "");
	    		for (var i = 0 ; i < files.length; i++){
	    			var file = files[i];
	    			if (file.size > 500*1024*1024){
	    				alert('您上传的文件：' + file.name + '大小超过500MB，不能上传！');continue;
	    			}
	    			var timestamp = new Date().getTime();// 精确到毫秒的时间戳
	    			var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id
	    			
	    			var xhr = new XMLHttpRequest();
	    			xhr.open("POST", "/upDownLoadController/uploadGroupFile", true);
	    			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'multipart/form-data;');
	    			var formData = new FormData();
	    			formData.append("file", files[i]);
	    			formData.append("groupId", groupId);
	    			formData.append("levels", levels);
	    			formData.append("up_path", "D:/toolsupload");
	    			saveLog("upGroupFile", "上传讨论组文件"+file.name);
	    			// 上传结束
	    			xhr.onload = function (event) {
	    				var data = eval("("+xhr.responseText+")");// 返回对象
	    				// 拼接显示结果
	    				var msg = join_uploaded(data, "group", levels);
	    				// 发送文件消息
	    				var msgType = file.type.length > 11 ? file.type.substring(0, 11) : file.type;
	    				socket.emit('send-text', token, data.groupId, msg, chatType, msgType, levels);
	    				fc_group_file(1);
	    				chatGo(groupId, "text", "group"); 
	    				$("div.modal-backdrop.fade.in").hide();
	    			};
	    			// 发生错误事件
	    			xhr.onerror = function (event) {  
	    				// console.log(event);
	    				console.log('传输错误');  
	    			}
	    			$(this_).val("");
	    			xhr.send(formData);
	    		}
	    	}
	    } else {
	    	$(this_).val("");
	    }
	    $('#myModal').modal('hide');
	});
	
}

// 删除讨论组
function delete_group(groupId, type, this_) {
    var groupId = $('#chat-user-id').val();
    JqdeBox.confirm('讨论组删除后会删除所有组文件和聊天记录，是否确定删除？', function (is_) {
    	if (is_){
    		$.ajax({
    			type : 'post',
    		    url : '/groupController/deleteGroup',
    	        data: {
    	        	'groupId': groupId,
    	        	'type': type
     	        },
    	        success:function(data){
    	        	// console.log(data);
    	        	if (data) {
    	        		JqdeBox.message('success', '删除成功');
    	        		chang_menu(this_);
    	        	}
    	        },
    	        error:function(data){
	                JqdeBox.message('error', '删除失败');
    	        }
    	    });
    	}
    });
}
//个人讨论组删除
function del_group(groupId, this_) {
	var type = "true";
	delete_group(groupId, type, this_);
}

// 更新未读消息提示
function updateNotRead(type) {
    // 获得当前列表所有未读
	AjaxMethod.ajax('homeController/notReadCount', {'type' : type}).then(function (result){
		if (result) {
            not_read = result;
            var count = Object.keys(not_read).length;
            if (count) {
            	$("#red_dot").show();
            } else {
            	$("#red_dot").hide();
            }
            // 循环人员或者组列表
            $('#user-list').find('li').each(function (i, value) {
                var li_id = $(value).attr('id');
                var id = li_id.substring(li_id.lastIndexOf('_') + 1);
                // 查询是否有未读
                if (not_read[id]) {
                	//加法运算
                    $(value).append('<span class="badge">' + not_read[id] + '</span>');
                }
            });
        }
	});
}

// 显示表情弹出框
function showEmoji() {
    // $('#emoji-panel-div').show();
}

// 创建组
function create_group_btn() {
    create_group();
}

// 编辑讨论组
function edit_group_btn(groupId) {
    edit_group(groupId);
}

// 删除组文件
function removeGroupFile(fileId, path, readPath) {
    var groupId = $('#chat-user-id').val();
    JqdeBox.confirm('是否确定此文件？', function (is_) {
    	if (is_){
    		AjaxMethod.ajax('groupController/deleteGroupFile', 
    				{'groupId': groupId, 'fileId': fileId, 'filePath' : path, 'readPath' : readPath}
    		).then(function (result){
    			var page = $('.pagination').find('.active').find('a').html();
	        	fc_group_file(page);
                JqdeBox.message('success', '删除成功');
    		});
    	}
    });
}

// 加载更多
function loadMove() {
  var nowMsgNum = $('#chat-content').find('.list-group-item').length;// 当前以显示的数量
  var chatType = $('#chat-type').val();// 聊天类型(system,user,group)
  var receiverId = $('#chat-user-id').val();// 聊天对象id
  AjaxMethod.ajax('homeController/loadMsg', {'nowMsgNum': nowMsgNum, 'chatType' : chatType, 'receiverId' : receiverId}).then(function (result){
  	var msg_arr = result.msgList;
      var userId = result.userId;
      if (parseInt(cishu)%2 == 0) {
    	  if (msg_arr && msg_arr.length > 0){
              for (var i = 0; i < msg_arr.length; i++){
                  var msg = msg_arr[i];
                  // if (msg.msg_type == 'text'){
                      var html = get_msg_html(msg.msgSender == userId, msg.sendTime, msg.senderName, msg, msg.msgType, msg.msgId, msg.msgSender);
                      $('#chat-content').prepend(html);
                  // }
              }
//              getReInfo();
          }else {
              $('#load-div').html('<span class="load-span" onclick="show_himsg(1)"><i class="fa fa-list"></i>历史消息</span>');
          }
    	  
      }
      cishu++;
      
  });
  cishu = 2;
}

// 打开历史消息记录
function show_himsg(page) {
	$("#group_info_div").hide();
	$("#hi_msg_div").show();
	var chatId = $('#chat-user-id').val();// 聊天对象id
	var chatType = $('#chat-type').val();// 聊天类型(system,user,group)
	AjaxMethod.ajax('homeController/queryHiMsg', {'chatType' : chatType, 'chatId' : chatId, 'page' : page}).then(function (result){
		if (result){
			var msg_html = '';
			var pageObject = result.pageObject;
			var list = pageObject.objectList;
			var userId = result.userId;
			var userName = result.userName;
			if (list && list.length > 0){
				for (var i = (list.length - 1); i >= 0; i--){
					msg_html += '<div class="hi-msg-list '+ (list[i].msgSender == userId ? 'my-hi-msg' : 'other-hi-msg') +'"> \
						<div><span class="send-name">' + (list[i].msgSender == userId ? userName : list[i].senderName) + '</span> \
						<span class="send-time">' + changeDate(list[i].sendTime) + '<span><span style="color:red;">【'+changeLevelIdToName(list[i].levels)+'】</span></div> \
						<div class="hi-msg-content chat-content">' + list[i].msg + '</div></div>';
				}
				$('#hi-msg-content').html(msg_html);
				// 拼接页码
				if (pageObject.total > 0){
					var page_html = '<li><a onclick="show_himsg('+ pageObject.priorPage +')">&laquo;</a></li>';
		    		for (var i = 1; i <= pageObject.totalPage; i++){
		    			if (i == page){
		    				page_html += '<li class="active"><a>' + i + '</a></li>';
		    			}else {
		    				page_html += '<li onclick="show_himsg('+ i +')"><a>' + i + '</a></li>';
		    			}
		    		}
		    		page_html += '<li><a onclick="show_himsg('+ pageObject.nextPage +')">&raquo;</a></li>';
		    		$('#msg-page').html(page_html);
				}
			}
		}
	});
}

//导出聊天记录
function out_files() {
	exprotExcel_("/groupController/groupExcelData",JSON.stringify(({})));
}

//联系人左侧导航切换
function changeContactsNav(nav_) {
    var p_id = $(nav_).attr("id");
    $("#ul_pid_nav_01_1").show();
    if (p_id == "nav_01" || p_id == "nav_02" || p_id == "nav_03" || p_id == "nav_00") {
        // 第一级折叠
        $(".contacts > .content > ul > ul.org-dt-ul").hide();
        $(".contacts > .content > ul > ul.dt-ul").hide();
        $("#ul_pid_" + p_id).show();
        if (p_id == "nav_00") {
        	$("#nav_00").show();
        	$("#ul_pid_nav_01_1").show();
        	$("#ul_pid_nav_01").hide();
        	$("#ul_pid_nav_03").hide();
        	$("#ul_pid_nav_02").hide();
        } else if (p_id == "nav_01") {
        	$("#nav_00").hide();
        	$("#ul_pid_nav_01_1").hide();
        	$("#ul_pid_nav_01").show();
        	$("#ul_pid_nav_02").hide();
        	$("#ul_pid_nav_03").hide();
        } else if (p_id == "nav_02") {
        	$("#nav_00").hide();
        	$("#ul_pid_nav_01_1").hide();
        	$("#ul_pid_nav_01").hide();
        	$("#ul_pid_nav_02").show();
        	$("#ul_pid_nav_03").hide();
        } else if (p_id == "nav_03") {
        	$("#nav_00").hide();
        	$("#ul_pid_nav_01_1").hide();
        	$("#ul_pid_nav_01").hide();
        	$("#ul_pid_nav_02").hide();
        	$("#ul_pid_nav_03").show();
        }
        $("#contacts_kw_").val("");
    } else {
        // 第二级折叠
        $(".contacts > .content > ul > ul.org-dt-ul > ul.user-dt-ul").hide();
        $("#ul_ul_pid_" + p_id).show();
    }
}

//获取头像路径
function personLeftHead(userID, leftId, name) {
	AjaxMethod.ajax('userHeadController/queryHead', {'userID' : userID}).then(function (result){
		if (result) {
		   var head_img = '';
		   var img_style = "border-radius: 40px; width: 24px; height: 24px; position: relative; bottom: 2px;";
           var head = result.head;
           if (head) {
        	   head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+head.head+'" class="img-msg">'
           } else {
        	   head_img = name.substring(0, 1);
           }
           $('#'+leftId).html(head_img);
        }
	});
}

////发送回复信息
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

//读取未读信息总条数
function getTotalmsg(type) {
	// 获得当前列表所有未读
	AjaxMethod.ajax('homeController/notReadCount', {'type' : type}).then(function (result){
		if (result) {
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

//显示人员信息
function show_user_info(userId) {
	if (!userId) {
		JqdeBox.message('error', '系统出错，请稍后再试！');
	} else {
		AjaxMethod.ajax('homeController/queryUserInfo', {'userId' : userId}).then(function (result){
			if (result){
				$('#userName').html(result.fullname);
				$('#classRoom').html(result.orgName);
				$('#address').html(result.roomid);
				switch (result.levels)
				{
					case '1':
                        $('#levelsinfo').html("非密");
						break;
                    case '2':
                        $('#levelsinfo').html("内部");
                        break;
                    case '3':
                        $('#levelsinfo').html("一般");
                        break;
                    case '4':
                        $('#levelsinfo').html("重要");
                        break;
				}
				$('#call_phone_').html(result.phone);
				if (result.isonline == "1") {
					$('#is_online_').html("在线");
				} else {
					$('#is_online_').html("离线");
				}
				getHeadPath_(result.head);
			}
		});
	}
}

//获取头像
function getHeadPath_(userID) {
	AjaxMethod.ajax('userHeadController/queryHead', {'userID' : userID}).then(function (result){
		if (result) {
           var head = result.head;
           if (head != null) {
        	   var head_img = '<img style="width:85px; height: 84px; border-radius: 50%; margin-left: 30%;" src="/userHeadController/showHead?path='+head.head+'">';
    		   $('#talkUserHead').html(head_img);
           }
        }
	});
}

function showHelpDoc() {
	window.open("http://127.0.0.1:8888/help/2.pdf");
}

function showSceneDoc() {
	window.open("http://127.0.0.1:8888/help/2.pdf");
}



