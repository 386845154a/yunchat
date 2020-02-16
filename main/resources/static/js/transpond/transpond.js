var choose_user_list = [];
var inputValue = "";

//显示接收转发消息的用户列表
function transpond_dialog (content_html, send_level, sendType, fileId){
//	var level = "";
//	if (content_html.indexOf("view_by_id") != -1 ) {
//		var x = content_html.indexOf("(") + 1;
//		var y = content_html.indexOf(")");
//        var first = content_html.substring(x,y).split(",");
//        level = delLlittleFlag(first[2]);
//	} else {
//		level = "1";
//	}
	
    JqdeBox.dialog({
        title: '转发消息 ',
        url: '/js/transpond/chooseUser.html',
        init: function () {
        	//清空已选择的人
            choose_user_list = [];
            //拼接可以转发的人
            join_tran_user(send_level);
            //拼接可以转发的组
            join_tran_group(send_level);
        },
        confirm: function () {
            if (choose_user_list.length == 0){
                JqdeBox.message('error', '请选择接收消息的用户！');
                return false;
            }
            for (var i in choose_user_list){
                if (choose_user_list[i]){
                	var chatType = "";
                	var choose_user_level = "";
                	var choose_name = "";
                	var create_info = creater_Id();
                	if (choose_user_list[i].chatType == undefined) {
                		chatType = "user";
                		choose_user_level = getLevels(choose_user_list[i].id);
                		choose_name = getNameById_(choose_user_list[i].id);
                	} else {
                		chatType = choose_user_list[i].chatType;
                		choose_user_level = getGroupLevels(choose_user_list[i].id);
                		choose_name = getGroupNameById_(choose_user_list[i].id);
                	}
                	
            		if (send_level <= choose_user_level) {
            			send_msg(content_html, choose_user_list[i].id, chatType);
            			if (content_html.indexOf("msg-office-div") != -1 ) {
            				$.ajax({
                    			type : 'post',
                    			url : '/messageController/queryGandUFile',
                    			data : {
                    				'fileId' : fileId,
                    				'uploadType' : sendType
                    			},
                    			dataType : 'JSON',
                    			async: false,
                    			success : function(result) {
                    				saveLog("transpond", create_info.fullName + "转发" + result.path.fileName + "给" + choose_name);
                    			},	
                    			error : function() {
                    			}
                    		});
            			} else {
            				saveLog("transpond", create_info.fullName + "转发" + content_html + "给" + choose_name);
            			}
            		} else {
            			JqdeBox.message('error', choose_name+"密级不足不能转发！");
            			continue;
            		}
                }
            }
            JqdeBox.message('success', '转发成功！');
            return true;
        }
    });
}

//去除单引号
function delLlittleFlag(flag) {
	flag = "@@" + flag + "@@";
	flag = flag.replace("@@'","").replace("'@@","").replace("@@","");
	return flag;
}

//拼接可以转发的组
function join_tran_group (level){
	$.ajax({
        type : 'post',
        url : '/homeController/queryGroup',
        data: {'level' : level},
        async: false,
        success:function(data){
        	if (data && data.length > 0) {
            	var group_html = '';
            	for (var i in data) {
                	group_html += '<li class="list-group-item item-user" id="li_' + data[i].GROUP_ID + '" \
                	 			onclick="choose_user($(this).find(\'.checked-div\'))" > \
                		 <div class="checked-div unchecked" id="' +data[i].GROUP_ID + '" name="' + data[i].GROUP_NAME + '" type="group"></div> \
                         <div class="img-div"><img class="user-img" src="/img/group.png"></div> \
                         <span class="name-span tran-name">' + data[i].GROUP_NAME + '</span></li>';
            	}
            	$('#choose-group-ul').html(group_html);
        	}
        },
        error:function(error){
            console.error(error);
        }
    });
}

//拼接可以转发的人
function join_tran_user (level){
	$.ajax({
        type : 'post',
        url : '/homeController/queryOrgUser',
        data : {'noLogUser' : true, 'level' : level, 'inputValue' : ''},
        async: true,
        success:function(data){
        	var org_map = data.orgMap;
        	var org_map_id = data.orgMapId;
            var org_user = data.orgUser;
            var userListHtml = '';
            $('#choose-user-list').html('');
            var org_map_s = org_map.split(",");
            var org_map_id_s = org_map_id.split(",");
            for (var i = 0; i < org_map_s.length; i++) {
            	var f_id = "f_" + org_map_id_s[i];
                userListHtml = '<div id="'+org_map_id_s[i]+'" class="user-org" style="width: 250px; cursor: pointer;" onclick="CorO(this, \'' + f_id + '\')"><span class="org-name">' + org_map_s[i] + '</span></div>';
                var user_list = org_user[org_map_id_s[i]];
                if (user_list){
                    userListHtml += '<div id="'+f_id+'" class="org-user" style="display:none;"><ul>';
                    for (var j in  user_list){
                        userListHtml += '<li class="list-group-item item-user" style="position: relative; width: 208px;" onclick="choose_user($(this).find(\'.checked-div\'))"> ' +
                            '   <div class="checked-div unchecked" id="' + user_list[j].userId + '" name="' + user_list[j].userName + '"></div> ' +
                            '   <div class="user-name">' + user_list[j].userName + '</div> ' +
                            '</li>';
                    }
                    userListHtml += '</ul></div>';
                }
                $('#choose-user-list').append(userListHtml);
            }
        }
    });
}

//选择人员
function choose_user (this_){
    var checked_div = $(this_);
    if (checked_div.hasClass('unchecked')){
        checked_div.removeClass('unchecked');
        checked_div.addClass('checked');
        choose_user_list.push({'id':checked_div[0].id, 'chatType':checked_div.attr('type')});
    }else {
        checked_div.removeClass('checked');
        checked_div.addClass('unchecked');
        choose_user_list.forEach(function (v, i) {
            if (v == checked_div[0].id){
                choose_user_list.splice(i, 1);
            }
        })
    }
}

//搜索
function query_tran_user() {
	inputValue = $('#tran-list-input').val().trim();
	var level = getLoginLevels();
	if (inputValue) {
		$.ajax({
	        type : 'post',
	        url : '/homeController/queryOrgUser',
	        data : {'noLogUser' : true, 'level' : level, 'inputValue' : inputValue},
	        async: true,
	        success:function(data){
	            var org_user = data.orgUser;
	            var userListHtml = '';
	            $('#choose-user-list').html('');
	            for (var key in org_user) {
	                var user_list = org_user[key];
	                if (user_list){
	                    for (var j = 0; j < user_list.length; j++){
	                        userListHtml = '<li class="list-group-item item-user" style="position: relative; width: 208px;" onclick="choose_user($(this).find(\'.checked-div\'))"> ' +
	                            '   <div class="checked-div unchecked" id="' + user_list[j].userId + '" name="' + user_list[j].userName + '"></div> ' +
	                            '   <div class="user-name">' + user_list[j].userName + '</div> ' +
	                            '</li>';
	                    }
	                }
	                $('#choose-user-list').append(userListHtml);
	            }
	        }
	    });
	} else {
		join_tran_user();
	}
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

//userId转汉字	
function getNameById_(Id) {
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

//groupId转汉字
function getGroupNameById_(groupid) {
	var groupName = "";
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
		},	
		error : function() {
		}
	});
	return groupName;
}

//添加全选创建者
function creater_Id() {
	var info  = "";
	$.ajax({
		type : 'post',
		url : '/homeController/getNewPersonName',
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			info = msg;
		},	
		error : function() {
		}
	});
	return info;
}
