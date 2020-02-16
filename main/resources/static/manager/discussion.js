var updater = "";
var updater_id = "";
$(function () {
	$('#nav_ul').find('.active').removeClass('active');
	$('#nav_ul li').eq(1).addClass('active');
	//当前用户组信息
	now_Person();
	//加载最近联系页面
	show_lately();
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

    // 选择emoji表情
    $('.emoji-div').click(function () {
        var emoji_src = $(this).attr('src');
        $('#msgPre').append('<img src="' + emoji_src + '" class="emoji-div">');
    });

    // 隐藏emoji表情
    $(document).bind('click', function (e) {
        // 隐藏emoji表情弹出框
        var target_ = $(e.target);
        if (target_.parents("#emoji-panel-div").length == 0 && !target_.hasClass("emoji-li")) {
            if ($("#emoji-panel-div").is(':visible')) {
                $("#emoji-panel-div").hide();
            }
        }
    });

    // 回车发送消息
    $('#msgPre').keydown(function (event) {
		if (event.keyCode == 13) {
	    	if (event.ctrlKey == false){
                sendMsg();
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
        actions: [{
            name: '转发',
            onClick: function (html) {
                if (html) {
                    transpond_dialog(html);
                }
            }
        },{
	        name: '标记',
	        onClick: function (html) {
	        	if (html) {
	        		addImportantFlag(html);
	        	}
	        }
        },{
	        name: '下载',
	        onClick: function (html) {
	        	if (html) {
	        		var first = html.split("view_by_id(");
	        		var second = first[1].split(")");
	        		var third = second[0].split(",");
	        		for (var i = 0; i < third.length; i++) {
	        			third[i] = delLlittleFlag(third[i]);
	        		}
	        		downfiles(third[0], third[1]);
	        	}
	        }
        }]
    });
});

//获取当前登录人
function now_Person() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		updater_id = result.Id;
		updater = result.userId;
	});
}

//添加重要标记
function addImportantFlag(html) {
	var meg = html;
	AjaxMethod.ajax('groupController/addImportantFlag', {'meg': meg}).then(function (result){
		if (result){
		location.reload();
        JqdeBox.message('success', '添加成功');
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

// 搜索用户列表
function query_userlist() {
	var name = $('#user-list-input').val().trim();
	if (!name){
		$('#user-list').find('.list-group-item').show();
		return;
	}
	var type = $('#nav_ul').find('.active').attr('id');
	$('#user-list').find('.list-group-item').each(function (i, v){
		var span_name = $(v).find('.name-span').html();
		if (span_name.indexOf(name) >= 0){
			$(v).show();
		}else {
			$(v).hide();
		}
	});
}

// 刷新最近联系人
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
	            	if (now_Id == contents[1]) {
	            		count++;
	            	}
	            }
	            $("#totalCount").html(count);
	        }
			var late_html = '<ul class="nav list-group" id="lately-user-ul">';
	    	late_html += '<li class="list-group-item user-list" id="li_-1" '
				  	  +  'onclick="system_noti()">'
				  +  '<div class="img-div sys-img-div"></div>'
				  +  '<div class="name-span">系统通知</div><div class="badge" style="margin-top: -20px;">'+count+'</div></li>';
	    	//JqdeBox.message('success', '你有'+total+'未读系统消息');
	        if (result.latelyUser && result.latelyUser.length > 0){
	        	for (var i in result.latelyUser){
//	        		if (result.latelyUser[i].user_id == now_Id) {
	        			$("#gstate").show();
	            		$("#del").show();
//	    	    	} else {
//	            		$("#gstate").hide();
//	            		$("#del").hide();
//	            	}
	        		late_html += join_lately_html(result.latelyUser[i].ID, result.latelyUser[i].NAME, result.latelyUser[i].TYPE);
	        	}
	        }
	    	late_html += '</ul>';
	    	$("#user-list").html(late_html);
	    	updateNotRead('lately');
		}
	});
}

// 拼接最近联系人聊天列表html，chat的receiveMsg方法需要调用，所以从show_lately方法中剥离
function join_lately_html(id, name, type) {
	var leftId = "left" + id;
	var resultVal = '<li class="list-group-item item-list" id="li_' + id + '" ' +
        '   onclick="change_chat(\'' + id + '\',\'' + name + '\', \'' + type + '\', this)">' +
        (type == 'group' ? '<div class="img-div"><img class="user-img" src="/img/group.png"></div>' : ('<div id="'+leftId+'" class="img-div user-img-div"></div>')) +
        '<span class="name-span">' + name + '</span></li>';
    if (type == "user") {
    	leftHead(id, leftId, name);
    }
    return resultVal;
}

//获取头像路径
function leftHead(userID, leftId, name) {
	AjaxMethod.ajax('userHeadController/queryHead', {'userID' : userID}).then(function (result){
		if (result) {
		   var head_img = '';
		   var img_style = "border-radius: 40px; width: 23px; height: 23px;";
           var head = result.head;
           if (head) {
        	   head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+head.head+'" class="img-msg" >'
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
	$('.right-main-div').hide();
	$('.group-info-div').hide();
	$('#system_noti_div').show();
    $('#chat-type').val('system');
    $('#chat-user-name').html('系统通知');
    $('#chat-user-id').val('-1');
    $('#user-list').find('.active').removeClass('active');
    $('#li_-1').addClass('active');
    system_noti_page(1);
}

// 分页查询系统消息
function system_noti_page(page) {
	AjaxMethod.ajax('homeController/querySystemNotification', {'title' : null, 'startTime' : null, 'startEnd' : null, 'page' : page}).then(function (result){
		var msg_arr = result.objectList;
        if (msg_arr && msg_arr.length > 0) {
        	var noti_html = '';
            for (var i in msg_arr) {
            	var msg = msg_arr[i];
            	noti_html += join_system_noti(msg_arr[i].notificationId, msg_arr[i].msgTitle, msg.msgType, msg_arr[i].msgContent, msg_arr[i].sendTime);
            }
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
	});
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
						+ "确认" + '</a><span class="noti_time">'+time+'</span></div>';
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

// 选择聊天对象
var user_array = [];// 当前组成员列表
function change_chat(chatId, name, type, this_) {
	close_type = type;
	show_chat();
    $('#chat-type').val(type);
    $('#chat-user-name').html(name);
    $('#chat-user-id').val(chatId);
    $('#right-info').show();
    $('#chat-content').html('');
    $('#msgPre').html('');
    $('#user-list').find('.active').removeClass('active');
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
                join_msg(msg.msgSender == userId, msg.sendTime, msg.senderName, msg.msg, msg.msgType, msg.msgId, msg.msgSender);
            }
            getReInfo();
            // 更新消息为已读
            var last_msg = msg_arr[0];// 最后一条消息
            if (last_msg){
            	readMsg(last_msg.msgId, chatId, type);
            	getTotalmsg('lately');
            }  
        }
        if (msg_arr.length >= 10){
        	$('#load-div').html('<span class="load-span" onclick="loadMove()">加载更多消息</span>');
        }else {
        	$('#load-div').html('<span class="load-span" onclick="show_himsg(1)"><i class="fa fa-list"></i>历史消息</span>');
        }
	});
	
    // 如果是讨论组，显示讨论组菜单
	$('.group-info-div').show();
    if (type == "group"){
    	show_group_info();
    	$('#group_info_div').show();
    	$('#isTabShow').show();
    	document.getElementById("container-div").style['width']="70%";
    	document.getElementById("container_div").style['width']="70%";
    }else {
    	$('#group_info_div').hide();
    	$('#isTabShow').hide();
    	document.getElementById("container-div").style['width']="100%";
    	document.getElementById("container_div").style['width']="100%";
    }
	 
	 
	 
	 // 如果是讨论组，显示讨论组菜单
		$('.group-info-div').show();
	    if (type == "group"){
	    	show_group_info();
	    	$('#group_info_div').show();
	    	$('#isTabShow').show();
	    	document.getElementById("container-div").style['width']="70%";
	    	document.getElementById("container_div").style['width']="70%";
	    	if (creator == updater_id) {
	    		$('#del').show();
	    	} else {
	    		$('#del').hide();
	    	}
	    }else {
	    	$('#group_info_div').hide();
	    	$('#isTabShow').hide();
	    	document.getElementById("container-div").style['width']="100%";
	    	document.getElementById("container_div").style['width']="100%";
	    }
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
	AjaxMethod.ajax('groupController/queryImportantInfo', {}).then(function (result){
		if (result){
    		var user_html = '<ul class="list-group">';
    		var user_list = result.importantList;
    		for (var i in user_list){
    			if (user_list[i].msgType == "text" && user_list[i].isImportant == "1" && user_list[i].msgReceiver == groupId) {
					user_html += '<li class="list-group-item" onclick=""> \
                        <a class="red" title="删除" onclick=\"removeimpurtant(\''+user_list[i].msg+'\')\"> \
  	                      <i class="ace-icon fa fa-trash-o  bigger-130" style="float:left; margin-top: 2px;"></i> \
  	                    </a> \
                        <label style="margin-left:5px;"> ' + user_list[i].msg + '<i class="glyphicon glyphicon-link" onclick=\"his_details(\''+user_list[i].msg+'\', \''+groupId+'\')\" style="color: #428BD3; cursor:pointer; margin-left:40px;"></i></label> \
					</li>';
    			}
    		}
    		user_html += '</ul>'
    		$('#important_info_list').html(user_html);
    	}
	});
}

//取消重要信息标记
function removeimpurtant(msg) {
	AjaxMethod.ajax('groupController/removeImportantInfo', {
		'msg': msg
	}).then(function (result){
		if (result){
			location.reload();
            JqdeBox.message('success', '删除成功');
    	}
	});
}

//查看重要任务详情
function his_details(msg, groupId) {
	//获取全部组信息
	AjaxMethod.ajax('homeController/queryAllHisGroupMsg', {'msg' : msg, 'groupId' : groupId}).then(function (result){
		window.open("/indexController/historicaldetails?msg="+msg+",groupId="+encodeURIComponent(JSON.stringify(result.msgList))+",userId="+updater_id);
//		window.open('historicaldetails.html', 'newwindow', 'height=100,width=100,status=yes,msg='+msg+'groupId='+encodeURIComponent(JSON.stringify(result.msgList))+'userId='+updater_id);
	});
	
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

//讨论组状态加载讨论组信息2018-03-22
function show_group_matter(flag){
	var dv = document.getElementById( "msgPre" );
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
//	<td>' + change_size_type(page_data[i].size) + '</td> \
//	<td class="center">' + format_date(page_data[i].createTime) + '</td> \
	AjaxMethod.ajax('groupController/queryGroupFile', {'groupId' : groupId, 'page' : page, 'fileName' : $('#group_file_input').val()}).then(function (result){
		if (result){
    		var file_html = '';
    		var page_data = result.objectList;
    		for (var i in page_data){
    			var file_name = page_data[i].fileName.substring(0,2)+"..."
    			file_html += '<tr><td class="group_file_name" title="' + page_data[i].fileName + '"'
    			+'onclick="view_by_id(\''+page_data[i].fileName+'\', \''+page_data[i].fileId+'\',\'' + page_data[i].levels + '\', \'group\')">'
									+ file_name + '</td> \
								<td class="center">' + page_data[i].creatorName + '</td> \
								<td class="del_gro_fil center" onclick="removeGroupFile(\''+page_data[i].fileId+'\', \''+page_data[i].path+'\', \''+page_data[i].readPath+'\')"> \
								<i class="fa fa-trash"></i></td></tr>';
    		}
    		$('#file-table').html(file_html);
    		// 拼接页码
			if (result.total > 0){
	    		var page_html = '<li><a onclick="fc_group_file('+ result.priorPage +')">&laquo;</a></li>';
	    		for (var i = 1; i <= result.totalPage; i++){
	    			if (i == page){
	    				page_html += '<li class="active"><a>' + i + '</a></li>';
	    			}else {
	    				page_html += '<li onclick="fc_group_file('+ i +')"><a>' + i + '</a></li>';
	    			}
	    		}
	    		page_html += '<li><a onclick="fc_group_file('+ result.nextPage +')">&raquo;</a></li>';
	    		$('#file-page').html(page_html);
			}
    	}
	});
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
	}
}

//commit
function updateFiles(type) {
	AjaxMethod.ajax('upDownLoadController/queryUserLevel', {}).then(function (result){
		if (result) {
			get_level(type, result.levels);
			if (type == "chat") {
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
				if (this.levelId <= levels) {
					if (type == "chat") {
						$('#level_Id').append('<option value="'+this.levelId+'">'+this.levelName+'</option>');
					} else if (type == "group") {
						$('#levelId').append('<option value="'+this.levelId+'">'+this.levelName+'</option>');
					}
				}
			});
		}
	});
}

// 上传聊天文件
function upload_chat_file(this_) {
	var levels = $("#level_Id").val();
	if (!levels) {
		JqdeBox.message('error', '请填选择密级别！');
		return false;
	}
	upload_group_file(this_, levels);
	var files = $(this_)[0].files;
	if (files.length < 1){
		return false;
	}
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
		
		// 拼装文件信息，显示在聊天页面
		join_uploading(file_id, file);
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
    	// 上传结束
	    xhr.onload = function (event) {
            var data = eval("("+xhr.responseText+")");// 返回对象
            // 拼接显示结果
            var msg = join_uploaded(data);
            // 发送文件消息
            var msgType = file.type.length > 11 ? file.type.substring(0, 11) : file.type;
            socket.emit('send-text', token, data.receiverStr, msg, chatType, msgType);
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
	$('#my_Modal').modal('hide');
}

// 拼装上传结束后的文件信息
function join_uploaded(file) {
	var msg = '';
    var file_type = '';
    var file_ext = file.fileExt;
    if (file.fileType === 'image'){
        msg = '<div class="img-msg-div"><img id="' + file.fileId + '" src="/upDownLoadController/readFile?path=' + file.readPath
        	+ '" class="img-msg" onclick="show_img(\'' + file.readPath + '\')"></div>';
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
        onclick="view_by_id(\'' + file.fileName + '\',\'' + file.fileId + '\',\'' + file.levels + '\',\'chat\')"> \
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
    return msg;
}

// 拼装上传中的文件信息
function join_uploading(file_id, file) {
    var file_type = file.type;
    var type = file_type.substring(0, file_type.indexOf('/'));
    var file_ext = file.ext;
    var msg = '';
    if (type === 'image'){var url = null;
		if (window.createObjectURL != undefined){
			url = window.createObjectURL(file);
		}else if (window.URL != undefined){
			url = window.URL.createObjectURL(file);
		}else if (window.webkitURL != undefined){
			url = window.webkitURL.createObjectURL(file);
		}
    	msg = '<div style="height: 110px;width: 110px;"><img id="' + file_id + '" class="msg-shade loading-div" src="' + url + '"> ' 
    		+'<img src="/img/loading.gif" class="img-shade-loading"></div>';;
    }else {
        var icon_class = '';
        if (file_ext === 'doc' || file_ext === 'docx'){
            icon_class = 'doc-img-div';
        }else if (file_ext === 'xls' || file_ext === 'xlsx'){
            icon_class = 'xls-img-div';
        }else if (file_ext === 'ppt' || file_ext === 'pptx'){
            icon_class = 'ppt-img-div';
        }else if (file_ext === 'pdf'){
            icon_class = 'pdf-img-div';
        }else if (file_ext === 'txt'){
            icon_class = 'txt-img-div';
        }else{
            icon_class = 'other-img-div';
        }
        msg = '<div class="msg-office-div loading-div" id="' + file_id + '">' +
                '<div class="icon-img-div ' + icon_class + '"></div>' +
                '<span class="name-span">' + file.name + '</span>' +
                '<div class="shade-div"><img src="/img/loading.gif" class="load-img"></div>' +
              '</div>';
    }
    join_msg(true, new Date(), null, msg, type);
}

// 上传讨论组文件
function upload_group_file(this_, left_levels) {
	var levels = "";
	if (left_levels) {
		levels = left_levels;
	} else {
		levels = $("#levelId").val();
	}
	if (!levels) {
		JqdeBox.message('error', '请填写保密级别！');
		return false;
	}
	var files = $(this_)[0].files;
	if (files.length < 1){
		return false;
	}
	var groupId = $('#chat-user-id').val();
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');
	}
	for (var i = 0 ; i < files.length; i++){
		var xhr = new XMLHttpRequest();
	    xhr.open("POST", "/upDownLoadController/uploadGroupFile", true);
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'multipart/form-data;');
		var formData = new FormData();
		formData.append("file", files[i]);
		formData.append("groupId", groupId);
		formData.append("levels", levels);
		formData.append("up_path", "D:/toolsupload");
	    xhr.onload = function (event) {
        	fc_group_file(1);
        };
        // 发生错误事件
        xhr.onerror = function (event) {  
            console.log(event);  
            console.log('传输错误');  
        }
	    // xhr.upload.addEventListener("progress", function (evt){},
		// false);//进度条
	    xhr.send(formData);
	}
	$('#myModal').modal('hide');
}

// 删除讨论组
function delete_group(groupId, type) {
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
    	        	location.reload();
	                JqdeBox.message('success', '删除成功');
    	        },
    	        error:function(data){
	                JqdeBox.message('error', '删除失败');
    	        }
    	    });
    	}
    });
}
//个人讨论组删除
function del_group(groupId) {
	var type = "true";
	delete_group(groupId, type);
}

// 更新未读消息提示
function updateNotRead(type) {
	alert(type);
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
                	//count += parseInt(not_read[id]);
                    $(value).append('<span class="badge">' + not_read[id] + '</span>');
                }
            });
        }
	});
}

// 显示表情弹出框
function showEmoji() {
    $('#emoji-panel-div').show();
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
                      var html = get_msg_html(msg.msgSender == userId, msg.sendTime, msg.senderName, msg.msg, msg.msgType, msg.msgId, msg.msgSender);
                      $('#chat-content').prepend(html);
                  // }
              }
              getReInfo();
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
	$(".right-main-div").hide();
	$("#group_file_div").hide();
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
						<span class="send-time">' + changeDate(list[i].sendTime) + '<span></div> \
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
