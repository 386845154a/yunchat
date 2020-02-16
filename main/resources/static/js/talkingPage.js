//文本编辑器加载
function editM(chatId) {
	// 增加@功能，获取组内成员
    AjaxMethod.ajax('groupController/queryGroupUser', {'groupId' : chatId}).then(function (result){
        teamUser = result;
        //设置@功能
        at_config = {
            at: "@",
            data: teamUser.userList,
            insertTpl: '<span userid="${userId}">@${fullname}</span>',       //你的dom结构里显示的内容  你可以给span加样式  绑定id
            displayTpl: "<li > ${fullname}-${orgName} </li>",                       // 这个是显示的弹出菜单里面的内容 
            startWithSpace: false,//是否已空格开始
            callbacks: {
                beforeInsert: function (value, $li, e) {
                    var at_user_list = value.match('(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X|x)');
                   if (at_user_list != null) {
                       var at_user = at_user_list[0];
//                       console.info("userid" + at_user);
                       $('#at_user').val(at_user);
				   }
                    return value;
                }
            },
            limit: 20
        };

        editor = CKEDITOR.replace( 'msgcontent');

        CKEDITOR.on('instanceReady', function(event) {
            var editor = event.editor;
            editor.on('mode', function(e) {
                load_atwho(this, at_config);
            });
            load_atwho(editor, at_config);
        });

    });
}

//信息加载
function loadHisMsg(id, type) {
	$.ajax({
		type : 'post',
		url : '/messageController/queryHisMsgs',
		data : {
			'type' : type, 
			'id' : id,
			'page' : 1
		},
		dataType : 'JSON',
		async: false,
		success : function(result) {
			var msgList = result.msgList.objectList;
			var loginId = result.userId;
			nextPage = result.msgList.nextPage; 
			totalPage = result.msgList.totalPage;
			var isMe;
			for (var i = msgList.length - 1; i >= 0; i--) {
				isMe = (msgList[i].msgSender == loginId ? true : false);
				if (msgList[i].msg.indexOf("img-msg-div") != -1 || msgList[i].msg.indexOf("msg-office-div") != -1 || msgList[i].msg.indexOf("img alt") != -1) {
					user_html += hisHtmlMsg(msgList[i].msgId, msgList[i].msgSender, msgList[i].senderName, msgList[i].sendTime, msgList[i].msg, msgList[i].head, isMe, msgList[i].levels);
				} else {
					var importMsg = removeStyle(msgList[i].msg);
					user_html += hisHtmlMsg(msgList[i].msgId, msgList[i].msgSender, msgList[i].senderName, msgList[i].sendTime, importMsg, msgList[i].head, isMe, msgList[i].levels);
				}
			}
		},	
		error : function() {
		}
	});
}

//信息拼接
function hisHtmlMsg(msgId, msgSender, senderName, sendTime, msg, head, isMe, levels) {
    var img_style = "", msg_style = "", my_style = "", name_style = "", filestitleMore = "";
    if (isMe) {
        img_style = "border-radius: 40px; width: 20px; height: 20px; float: right;";
        msg_style = "float: right; margin-right: 5px;";
        my_style = "margin-top: 30px; margin-right:5px;";
        name_style = "margin-top:5px;margin-bottom:5px;margin-left:20px;float:right;";
    } else {
        img_style = "border-radius: 40px; width: 20px; height: 20px; float: left;";
        msg_style = "float: left; position: relative; right: 14%;";
        my_style = "margin-top: 30px; ";
        name_style = "margin-top:5px;margin-bottom:5px;margin-left:20px;float:left;";
        filestitleMore = "position: relative; right: 76%;";
    }
    var time = changeDate(sendTime);
    if (msg.indexOf("img-msg-div") != -1) {
        return '<div class="val" style="border:1px solid #FFFFFF;min-height: 120px;">' +
		            '<div style="'+name_style+'">'+
		            	'<span class="textsize">' + senderName + '</span>' + '  ' + '<span style="font-size: 12px;">' + time + '</span>' + '<span style="color:red;">【' +getLevelVal(levels)+ '】</span>' +
		            '</div>' +
	         	    '<div style="'+my_style+'">' +
	         	    	'<img style="'+img_style+'" src="/userHeadController/showHead?path='+head+'" />' +
     	    			'<span class="chat-cont" style="'+msg_style+'">' + msg + '</span>' +
     	    		'</div>' +
 			   '</div>'; 
    } else if (msg.indexOf("msg-office-div") != -1) {
        return '<div class="val" style="border:1px solid #FFFFFF;min-height: 120px;">' +
		            '<div style="'+name_style+'">'+
		            	'<span class="textsize">' + senderName + '</span>' + '  ' + '<span style="font-size: 12px;">' + time + '</span>' + '<span style="color:red;">【' +getLevelVal(levels)+ '】</span>' +
		            '</div>' +
	         	    '<div style="'+my_style+'">' +
	         	    	'<img style="'+img_style+'" src="/userHeadController/showHead?path='+head+'" />' +
     	    			'<img class="filestitle" style="'+filestitleMore+'" src="/img/filestitle.png" />' +
     	    			'<span class="chat-cont" style="'+msg_style+'">' + msg + '</span>' +
     	    		'</div>' +
 			   '</div>'; 
    } else {
        return '<div class="val" style="border:1px solid #FFFFFF;min-height: 60px;">' +
		            '<div style="'+name_style+'">'+
		            	'<span class="textsize">' + senderName + '</span>' + '  ' + '<span style="font-size: 12px;">' + time + '</span>' + '<span style="color:red;">【' +getLevelVal(levels)+ '】</span>' +
		            '</div>' +
	         	    '<div style="'+my_style+'">' +
	         	    	'<img style="'+img_style+'" src="/userHeadController/showHead?path='+head+'" />' +
     	    			'<span class="chat-cont" style="'+msg_style+'">' + msg + '</span>' +
     	    		'</div>' +
 			   '</div>'; 
    }

}

//加载更多
function loadMove() {
  var nowMsgNum = $('#loadDiv').find('.val').length;// 当前已显示的数量
  AjaxMethod.ajax('messageController/loadMsg', {'page': (nextPage < totalPage ? nextPage++ : nextPage), 'type' : type, 'id' : id, 'nowMsgNum' : nowMsgNum}).then(function (result){
	  var html = "";
	  var msg_arr = result.msgList;
	  var loginId = result.userId;
      for (var i = 0; i < msg_arr.length; i++){
          var msg = msg_arr[i];
          var isMe = (msg.msgSender == loginId ? true : false);
          html = hisHtmlMsg(msg.msgId, msg.msgSender, msg.senderName, msg.sendTime, msg.msg, msg.head, isMe, msg.levels);
          $('#loadDiv').prepend(html);
      }
  });
}

//显示讨论组信息
function show_group_info() {
	$("#group_info_div").show();
	$("#functionButton").show();
	$("#user_info_div").hide();
	$("#group_user_div").hide();
	$("#group_file_div").hide();
	$("#important_info_div").hide();
	AjaxMethod.ajax('groupController/queryGroupInfo', {'groupId' : id}).then(function (result){
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
    		$('#group_create_time').html(changeDate(result.createTime));
    		$('#group_scope').html(result.scop);
    		$('#group_vote').html("暂无此功能！");
    		if (result.creatorName){
    			$('#group_creator').html(result.creatorName);
    		}else if(result.creator == -1){
    			$('#group_creator').html("系统创建");
    		}
    		
    	}
	});
}

//显示人员信息
function show_user_info() {
	$("#user_info_div").show();
	$("#group_info_div").hide();
	$("#group_user_div").hide();
	$("#group_file_div").hide();
	$("#important_info_div").hide();
	$("#functionButton").hide();
	AjaxMethod.ajax('homeController/queryUserInfo', {'userId' : id}).then(function (result){
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
			var head_img = '<img style="width:85px; height: 84px; border-radius: 50%;" src="/userHeadController/showHead?path='+result.head+'">';
 		   	$('#talkUserHead').html(head_img);
		}
	});
}

//加载讨论组成员
function show_group_user() {
	$("#group_user_div").show();
	$("#user_info_div").hide();
	$("#group_info_div").hide();
	$("#group_file_div").hide();
	$("#important_info_div").hide();
	AjaxMethod.ajax('groupController/queryGroupUser', {'groupId' : id}).then(function (result){
		if (result){
    		var user_html = '<ul class="list-group" >';
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

//加载群组文件
function show_group_file(page) {
	$("#group_file_div").show();
	$("#user_info_div").hide();
	$("#group_user_div").hide();
	$("#group_info_div").hide();
	$("#important_info_div").hide();
	AjaxMethod.ajax('groupController/queryGroupFile', {'groupId' : id, 'page' : page, 'fileName' : $('#group_file_input').val()}).then(function (result){
		if (result){
			var file_html = '';
			var page_data = result.data.objectList;
			for (var i in page_data){
				var file_name = page_data[i].fileName
				file_html += '<tr><td class="group_file_name" style="cursor: pointer;"'
				+'onclick="view_by_id(\''+page_data[i].fileName+'\', \''+page_data[i].fileId+'\',\'' + page_data[i].levels + '\', \'group\',\'' + result.loginId + '\')">'
				+ (file_name.length > 5 ? file_name.substring(0,7)+"..." : file_name) + '</td> \
				<td class="center">' + page_data[i].creatorName + '</td> \
				<td class="del_gro_fil center" style="padding-left: 18px; cursor: pointer;" onclick="removeGroupFile(\''+page_data[i].fileId+'\', \''+page_data[i].path+'\', \''+page_data[i].readPath+'\')"> \
				<i class="fa fa-trash"></i></td></tr>';
			}
    		$('#file-table').html(file_html);
    	}
	});
}

//加载重要信息
function show_importantInfo_user() {
	$("#important_info_div").show();
	$("#user_info_div").hide();
	$("#group_user_div").hide();
	$("#group_info_div").hide();
	$("#group_file_div").hide();
	AjaxMethod.ajax('groupController/queryImportantInfo', {'groupId': id}).then(function (result){
		if (result){
    		var user_html = '<ul class="list-group">';
    		var user_list = result.importantList;
    		var loginId = result.loginId;
    		for (var i in user_list){
    			var importMsg = removeStyle(user_list[i].msg);
    			if (user_list[i].msgType == "text" && user_list[i].isImportant == "1" && user_list[i].msgReceiver == id) {
					user_html += '<li class="list-group-item" onclick="">'; 
					user_html += '<a onclick="removeImpurtant(\''+user_list[i].msgId+'\', \''+removeStyle(user_list[i].msg)+'\')">';
					user_html += '<i class="ace-icon fa fa-trash-o  bigger-130" style="float:left; margin-top: 2px;"></i>';
					user_html += '</a>';
					user_html += '<label style="margin-left:5px;"> ' + importMsg + '<i class="glyphicon glyphicon-link" onclick=\"his_details(\''+importMsg+'\', \''+id+'\', \''+loginId+'\')\" style="color: #428BD3; cursor:pointer; margin-left:40px;"></i></label>';
					user_html += '</li>';
    			}
    		}
    		user_html += '</ul>'
    		$('#important_info_list').html(user_html);
    	}
	});
}

//发送信息密级初始化
function bottom_level(id, type) {
	AjaxMethod.ajax('levelController/queryLevel', {}).then(function (result){
		if (result){
    		//填充到select左右风格中的左侧框
			var bottom_html = "", reLevel = "";
			$('#bottom_level').empty();
			var loginLevel = result.loginLevel;
			if (type == "group") {
				reLevel = getGroupNameById(id);
			} else {
				reLevel = getNameById(id);
			}
			$(result.levelList).each(function(i) {
				if (loginLevel <= reLevel) {
					if (this.levelId <= loginLevel) {
						if (this.levelId == "1") {
							$('#bottom_level').append('<input type="radio" name="bottom_Level_" value="'+this.levelId+'"  checked="checked" />'+'<span style="color:red;">'+this.levelName+'</span>');
						} else {
							$('#bottom_level').append('<input type="radio" name="bottom_Level_" value="'+this.levelId+'" />'+'<span style="color:red;">'+this.levelName+'</span>');
						}
					}
				} else {
					if (this.levelId <= reLevel) {
						if (this.levelId == "1") {
							$('#bottom_level').append('<input type="radio" name="bottomLevel_" value="'+this.levelId+'"  checked="checked" />'+'<span style="color:red;">'+this.levelName+'</span>');
						} else {
							$('#bottom_level').append('<input type="radio" name="bottomLevel_" value="'+this.levelId+'" />'+'<span style="color:red;">'+this.levelName+'</span>');
						}					
					}
				}
			});
		}
	});
}

//删除组文件
function removeGroupFile(fileId, path, readPath) {
    JqdeBox.confirm('是否确定此文件？', function (is_) {
    	if (is_){
    		AjaxMethod.ajax('groupController/deleteGroupFile', {
				'groupId': id, 
				'fileId': fileId, 
				'filePath' : path, 
				'readPath' : readPath
    		}).then(function (result){
                JqdeBox.message('success', '删除成功');
                show_group_file();
    		});
    	}
    });
}

//查看重要任务详情
function his_details(msg, groupId, loginId) {
	//获取全部组信息
	AjaxMethod.ajax('homeController/queryAllHisGroupMsg', {'msg' : msg, 'groupId' : groupId}).then(function (result){
		window.open("/indexController/historicaldetails?msg="+msg+",groupId="+encodeURIComponent(JSON.stringify(result.msgList))+",userId="+loginId,"","width=550px,height=560px,screenX=550px,screenY=250px");
	});
}

//取消重要信息标记
function removeImpurtant(msgId, msg) {
	AjaxMethod.ajax('groupController/removeImportantInfo', {
		'msgId': msgId,
		'msg': msg
	}).then(function (result){
		if (result){
            JqdeBox.message('success', '删除成功');
            show_importantInfo_user();
    	}
	});
}

//导出聊天记录
function out_files() {
	exprotExcel_("/groupController/groupExcelData",JSON.stringify(({
		'groupId' : id
	})));
}

//编辑讨论组
function edit_group_btn() {
    edit_group(id);
}

//关闭讨论组
function closed_group(this_) {
	JqdeBox.confirm('是否关闭讨论组？', function (is_) {
    	if (is_){
    		AjaxMethod.ajax('groupController/closedGroup', {
    			'groupId': id
    		}).then(function (result){
    			if (result.success) {
    				JqdeBox.message('success', '讨论组已关闭！');
    				window.close();
    			} else {
    				JqdeBox.message('success', '非创建者不可关闭群组!');
    			}
    		});
    	}
    });
}

//commit
function updateFiles() {
	AjaxMethod.ajax('upDownLoadController/queryUserLevel', {}).then(function (result){
		if (result) {
			get_level(result.levels);
			if (type == "user") {
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
function get_level(levels) {
	AjaxMethod.ajax('levelController/queryLevel', {}).then(function (result){
		if (result){
    		//填充到select左右风格中的左侧框
			var html_ = "";
			$('#levelId').empty();
			$('#levelId').append('<option  value="" selected>-选择密级-</option>');
			$('#level_Id').empty();
			$('#level_Id').append('<option  value="" selected>-选择密级-</option>');
			var loginLevel = result.loginLevel;
			$(result.levelList).each(function(i) {
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

//上传讨论组文件
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
	} else if (files.length > 1) {
		JqdeBox.message('error', '不支持多文件上传！');
		return false;
	} else {
		if (!id){
			JqdeBox.message('error', '系统出错，请稍后再试！');
		}
		IS_NOT_tool("2", "qiushi", "talk_3");
		for (var i = 0 ; i < files.length; i++){
			var file = files[i];
			if (file.size > 500*1024*1024){
				alert('您上传的文件：' + file.name + '大小超过500MB，不能上传！');continue;
			}
			var timestamp = new Date().getTime();// 精确到毫秒的时间戳
			var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id
			
			// 拼装文件信息，显示在聊天页面
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "/upDownLoadController/uploadGroupFile", true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'multipart/form-data;');
			var formData = new FormData();
			formData.append("file", files[i]);
			formData.append("groupId", id);
			formData.append("levels", levels);
			formData.append("up_path", "D:/toolsupload");
			saveLog("upGroupFile", "上传讨论组文件"+file.name);
			// 上传结束
			xhr.onload = function (event) {
				var data = eval("("+xhr.responseText+")");// 返回对象
				// 拼接显示结果
				var imgFilePJ_msg = imgFilePJ(data, "group");
				$('#loadDiv').append(imgFilePJ_msg);
				var msg = join_uploaded(data, "group");
				// 发送文件消息
				var msgType = file.type.length > 11 ? file.type.substring(0, 11) : file.type;
				socket.emit('send-text', token, data.groupId, msg, type, msgType, levels);

				show_group_file(1);
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
}

function imgFilePJ(file, send_type) {
	var msg = '';
    var file_type = '';
    var file_ext = file.fileExt;
    var fullName = "", headPath = "";
    $.ajax({
        type : 'post',
        url : '/homeController/getNewPersonName',
        async : false,
        success : function(data) {
        	fullName = data.fullName;
    		headPath = data.headPath;
        },
        error : function(err) {
            console.log(err);
        }
    });
    if (file.fileType === 'image'){
    	msg = '<div class="val" style="border:1px solid #FFFFFF;min-height: 120px;">' +
				    '<div style="margin-top:5px;margin-bottom:5px;margin-left:20px;float:right;">'+
				    	'<span class="textsize">' + fullName + '</span>' + '  ' + '<span style="font-size: 12px;">' + changeDate(new Date()) + '</span>' + '<span style="color:red;">【' +getLevelVal(file.levels)+ '】</span>' +
				    '</div>' +
					    '<div style="margin-top: 30px; margin-right:5px;">' +
					    	'<img style="border-radius: 40px; width: 20px; height: 20px; float: right;" src="/userHeadController/showHead?path='+headPath+'" />' +
							'<span class="chat-cont" style="float: right; margin-right: 5px;"><img img-msg id="' + file.fileId + '" src="/upDownLoadController/readFile?path=' + file.readPath
				        	+ '" class="img-msg" style="width: 90px; height: 85px;" onclick="show_img(\'' + file.readPath + '\', \'' + file.chatType + '\')"></span>' +
						'</div>' +
				'</div>'; 
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
        var threeMsg = "float: right; margin-right: 5px; background-color: #BECEEB; width: 290px; min-height: 80px; border-radius: 3px; position: relative; left: 16%;";
        var foreMsg = "position: absolute; left: 30%; top: 15px; width: 200px; word-wrap: break-word;";
        msg = '<div class="val" style="border:1px solid #FFFFFF; min-height:120px;">' +
			        '<div style="margin-top:5px;margin-bottom:5px;margin-left:20px;float:right;">'+
			    		'<span class="textsize">' + fullName + '</span>' + '  ' + '<span style="font-size: 12px;">' + changeDate(new Date()) + '</span>' + '<span style="color:red;">【' +getLevelVal(file.levels)+ '】</span>' +
			        '</div>' +
			        '<div style="margin-top: 30px; margin-right:5px;">' +
	         	    	'<img style="border-radius: 40px; width: 20px; height: 20px; float: right;" src="/userHeadController/showHead?path='+headPath+'" />' +
	 	    			'<img class="filestitle" style="z-index: 1;" src="/img/filestitle.png" />' +
	 	    			'<span class="chat-cont" style="'+threeMsg+'" onclick="view_by_id(\'' + file.fileName + '\',\'' + file.fileId + '\',\'' + file.levels + '\',\'' + send_type + '\')"><span style="'+foreMsg+'">' + file.fileName + '</span></span>' +
	 	    		'</div>' +
			   '</div>'; 
    }
    return msg;
}

//拼装上传结束后的文件信息(数据库)
function join_uploaded(file, send_type) {
	var msg = '';
    var file_type = '';
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
    return msg;
}

//上传聊天文件
function upload_chat_file(this_) {
	var levels = $("#level_Id").val();
	if (!levels) {
		JqdeBox.message('error', '请填选择密级别！');
		return false;
	}
	var files = $(this_)[0].files;
	if (files.length < 1){
		return false;
	} else if (files.length > 1) {
		JqdeBox.message('error', '不支持多文件上传！');
		return false;
	} else {
		if (!id || !type){
			JqdeBox.message('error', '系统出错，请稍后再试！');
		}
		for (var i = 0 ; i < files.length; i++){
			var file = files[i];
			if (file.size > 500*1024*1024){
				alert('您上传的文件：' + file.name + '大小超过500MB，不能上传！');continue;
			}
			IS_NOT_tool("2", "qiushi", "talk_3");
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
			formData.append("chatId", id);
			formData.append("chatType", type);
			formData.append("levels", levels);
			formData.append("up_path", "D:/toolsupload");
			saveLog("upUserFile", "上传个人文件"+file.name);
	    	// 上传结束
		    xhr.onload = function (event) {
	            var data = eval("("+xhr.responseText+")");// 返回对象
	            var imgFilePJ_msg = imgFilePJ(data, "group");
				$('#loadDiv').append(imgFilePJ_msg);
	            // 拼接显示结果
	            var msg = join_uploaded(data, "chat");
	            // 发送文件消息
	            var msgType = file.type.length > 11 ? file.type.substring(0, 11) : file.type;
	            socket.emit('send-text', token, id, msg, type, msgType, levels);
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
	
}

//拼装上传中的文件信息
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
    	'user' : {
    		'head' : head
		},
		'msg' : msg
	};
    join_msg(true, new Date(), null, JSON.stringify(result), type);
}

//添加积分
function IS_NOT_tool(sourceScore, sourceType, sourceDetail) {
//	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
//		var now_ID = result.Id;
//		$.ajax({
//		  url: 'http://10.12.97.30:8080/newnewcosim-master_war/coin/add.ht?uid='+result.Id+'&sourceScore='+sourceScore+'&sourceType='+sourceType+'&sourceDetail='+sourceDetail+'&updTime=0',
//		  type: 'GET',
//		  dataType: 'jsonp',
//		  jsonp:"callback",
//		  success: function (data) {
//			  JqdeBox.message('success', data.result);
//		  },
//		  error: function(err){
//		  }
//		});
//	});
}

//发送消息按钮调用方法
function send_Msg(){
    var receiverUser = id;//消息接收人id
    if (!receiverUser) {
        alert('请选择接收消息的用户或者组');
        return false;
    }
    
    var bottomLevelVal = $("input[name='bottomLevel_']:checked").val();//信息密级
    var msg = CKEDITOR.instances.msgcontent.getData();
    if (!msg || msg.trim() == ''){
        return;
    }
    if (msg.length > 1000){
        msg.substring(0, 1000);
        alert('消息内容不能超过1000字节!');
        return;
    }
    //清空输入
//    $("#chat-cont").scrollTop($("#chat-cont")[0].scrollHeight);
    
    //发送消息
    send_msg(msg, receiverUser, type, bottomLevelVal);
    //如果显示的是最近联系人列表，将聊天对象移动到顶部
    update_lately_(receiverUser, msg, new Date(), bottomLevelVal);
    var receiverId = $('#at_user').val();
    if(receiverId !=null){
        AjaxMethod.ajaxTextType('homeController/addAtUser',{ 
    		'groupId' : receiverUser,
    		'receiverId':receiverId
        }).then(function (result){

        });
    }
    
    CKEDITOR.instances.msgcontent.setData('',function() {
        load_atwho(editor, at_config);
    });
    
}

//如果显示的是最近联系人列表，将聊天对象移动到顶部
function update_lately_(receiverUser, msg, sysTime, bottomLevelVal){
    var html = join_lately_html(receiverUser, msg, sysTime, bottomLevelVal);
    $('#loadDiv').append(html);
}

//拼接发送消息字符串
function join_lately_html(receiverUser, msg, sysTime, bottomLevelVal) {
	var fullName = "", headPath = "";
    $.ajax({
        type : 'post',
        url : '/homeController/getNewPersonName',
        async : false,
        success : function(data) {
        	fullName = data.fullName;
    		headPath = data.headPath;
        },
        error : function(err) {
            console.log(err);
        }
    });
	return '<div class="val" style="border:1px solid #FFFFFF;min-height: 60px;">' +
			    '<div style="margin-top:5px;margin-bottom:5px;margin-left:20px;float:right;">'+
			    	'<span class="textsize">' + fullName + '</span>' + '  ' + '<span style="font-size: 12px;">' + changeDate(sysTime) + '</span>' + '<span style="color:red;">【' +getLevelVal(bottomLevelVal)+ '】</span>' +
			    '</div>' +
				    '<div style="margin-top: 30px; margin-right:5px;">' +
				    	'<img style="border-radius: 40px; width: 20px; height: 20px; float: right;" src="/userHeadController/showHead?path='+headPath+'" />' +
						'<span class="chat-cont" style="float: right; margin-right: 5px;">' + msg + '</span>' +
					'</div>' +
			'</div>'; 
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

//去除样式
function removeStyle(msg) {
     var kindVal = msg;
	 kindVal=kindVal.replace(/<\/?.+?>/g,"");
	 kindVal=kindVal.replace(/ /g,"");//去掉html标签的内容
	 kindVal=kindVal.replace(/\t+/g,"");//\t
	 kindVal=kindVal.replace(/\ +/g,"");//去掉空格
	 kindVal=kindVal.replace(/[ ]/g,"");//去掉空格
	 kindVal=kindVal.replace(/[\r\n]/g,"");//去掉回车换行
	return kindVal;
}

//密级id转名称
function getLevelVal(levelId) {
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

//转汉字
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

