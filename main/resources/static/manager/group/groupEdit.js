
//保存已选择的人
var change_user = {};
var nowGroupId = "";
var nowGroupName = "";
var groupCreater = "";

function get_create_group() {
	create_group();
}

//显示项目组菜单
function show_Pmenu() {
	$("#p_menu").show();
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		//通过接口获取任务信息
		get_projectName(now_ID);
	});
}

//获取项目信息
function get_projectName(now_ID) {
	//获取任务
//	$.ajax({
//		  url: 'http://10.12.97.30:8080/newnewcosim-master_war/iworktask.ht?id='+now_ID,
//		  type: 'GET',
//		  dataType: 'jsonp',
//		  jsonp:"callback",
//		  success: function (data) {
//				{"projectid":10000028500000,"projectname":"智慧总体部项目","ddTaskId":10000028500003,"ddTaskName":"测试任务2"}	
			  var data = [];
			  var new_allProject_Name = [];
			  for (var i=0; i<data.length; i++) {
				  new_allProject_Name += data[i].projectname + ",";
			  }
			  new_allProject_Name = getArray(new_allProject_Name);
		      var project_info = "";
		      project_info += '	<li>';
		      project_info += '		<a onclick="choose_project(\'' + "请选择项目" + '\')"';
		      project_info += '			style="float: left; font-size:15px;">'+"请选择项目"+'</a>';
		      project_info += '	</li>';
		      $.each(new_allProject_Name,function(i){
		    	  project_info += '	<li>';
		    	  project_info += '		<a onclick="choose_project(\'' + new_allProject_Name[i] + '\')"';
		    	  project_info += '			style="float: left; font-size:15px;">'+ new_allProject_Name[i] +'</a>';
		    	  project_info += '	</li>';
		      });
		      project_info += '	<li>';
		      project_info += '		<a onclick="choose_project(\'' + "其他" + '\')"';
		      project_info += '			style="float: left; font-size:15px;">'+"其他"+'</a>';
		      project_info += '	</li>';
		      $("#p_menu").html(project_info);
//		  },
//	      error: function(err){
//			  var new_allProject_Name = [];
//			  create_group(new_allProject_Name);
//	          console.log(JSON.stringify(err));
//	      }
//	});
}

//获取保密等级
function getLeves(levels) {
	$.ajax({
        type : 'post',
        url : '/levelController/queryLevel',
        async:true,
        cache: false,
        success:function(data){
        	if (data){
                //填充到select左右风格中的左侧框
                var html_ = "";
                $('#levels').empty();
                $('#levels').append('<option  value="0" selected>请选择密级</option>');
                // $('#levels').empty();
                // $('#levels').append('<option  value="" selected>-选择密级-</option>');
                $(data.levelList).each(function(i) {
                    if (this.levelId <= levels) {
                        $('#levels').append('<option value="'+this.levelId+'">'+this.levelName+'</option>');
                    }
                });
            }
        }
    });
}


//根据讨论组密级刷新可选人员
function getUserByLevel() {
    getAllUser(function () {
//        update_checked_user();
    });
}

//创建讨论组
function create_group(){
    JqdeBox.dialog({
        title: '创建讨论组',
        url: '/js/groupEdit/groupEdit.html',
        init: function () {
        	$('#gname-input').removeAttr("disabled");
        	$('#gdecribe-textarea').removeAttr("disabled");
        	$('#scop_join').removeAttr("disabled");
        	 $('#levels').removeAttr("disabled");
//        	 $('#proBtn').removeAttr("disabled");
            //获取个人保密等级
            AjaxMethod.ajax('upDownLoadController/queryUserLevel', {}).then(function (result){
                getLeves(result.levels);
            });
            change_user = {};
        },
        confirm: function () {
            var group_name = $('#gname-input').val();
            var choose_name = $('#proBtn').val();
            var levels = $('#levels').val();
            if (!group_name || group_name.trim() == '' ){
                alert('请输入讨论组名称！');return false;
            }
            var user_id_array = '';
            for (var i in change_user){
                user_id_array += i + ',';
            }
            if (!user_id_array || user_id_array.length == 0){
                alert('请选择讨论组成员！');return false;
            }
            if (choose_name == "请选择项目") {
            	alert('未选择项目，请选择！');return false;
            }
            if (levels == 0) {
                alert('未选择项目，请选择！');return false;
            }else {
            	$.ajax({
                    type : 'post',
                    url : '/groupController/createGroup',
                    data: {
                    	'groupName': group_name, 
                    	'groupDescribe': $('#gdecribe-textarea').val(), 
                    	'userIdList' : user_id_array,
                    	'choose_name' : choose_name,
                    	'scop' : $('#scop_join').val(),
                    	'levels' : levels
                    },
                    async:true,
                    cache: false,
                    success:function(data){
                    	if (data && data.ok){
                        	JqdeBox.message('success', '创建成功！');
                            saveLog("createGroup", "创建讨论组"+group_name);
//                            sendIntegral("3", "qiushi", "talk_2", "");
                        	show_group();
                        	// location.reload();
                    	}else {
                    		JqdeBox.message('error', '创建失败，请稍后再试！');
                    	}
                    },
                    error:function(data){
                    	JqdeBox.message('error', '创建失败，请稍后再试！');
                    }
                });
            }
            return true;
        }
    });
}

//选择项目
function choose_project(pName) {
	$("#proBtn").val(pName);
	$("#p_menu").hide();
}

//编辑讨论组
function edit_group (groupId){
    var levels = '';
	var have_person = "";
	nowGroupId = groupId;
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');return false;
	}
    JqdeBox.dialog({
        title: '编辑讨论组',
        url: '/js/groupEdit/groupEdit.html',
        init: function () {
        	$.ajax({
                type : 'post',
                url : '/groupController/queryGroupInfoById',
                data: {
                	'receiver':groupId,
                    'type': 'group'
                },
                async:true,
                cache: false,
                success:function(data){
                	if (data){
                		$("#proBtn").attr("disabled", "true");
                		$('#levels').removeAttr("disabled");
                        getLeves(data.levels);
                    }
                }
            });
        	$("#gId").val(groupId);
        	change_user = {};
            getAllUser(function () {
                $.ajax({
                    type : 'post',
                    url : '/groupController/queryGroupAllInfo',
                    data: {'groupId': groupId},
                    async:true,
                    cache: false,
                    success:function(data){
                    	if (data && data.ok) {
                            user_array = data.userList;
                            if (user_array && user_array.length > 0) {
                                for (var i in user_array) {
                                    change_user[user_array[i].userId] = user_array[i].fullname;
                                    have_person += user_array[i].userId + ",";
                                    $('#' + user_array[i].userId).removeClass('unchecked');
                                    $('#' + user_array[i].userId).addClass('checked');
                                }
                                update_checked_user();
                            }
                            var group_info = data.groupInfo;
                            if (group_info) {
                            	groupCreater = group_info.creator;
                            	nowGroupName = group_info.groupName;
                                $('#gname-input').val(group_info.groupName);
                                $('#gdecribe-textarea').val(group_info.groupDescribe);
                                $('#scop_join').val(group_info.scop);
                            }
                        }
                    }
                });
            });
        },
        confirm: function () {
            var group_name = $('#gname-input').val();
            if (!group_name || group_name.trim() == '' ){
                alert('请输入讨论组名称！');return false;
            }
            if (!change_user || change_user.length == 0){
                alert('请选择讨论组成员！');return false;
            }
            var user_id_array = "";
            for (var i in change_user){
                user_id_array += i + ",";
            }
            AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
        		var now_ID = result.Id;
        		if (now_ID == $("#create_user").val()) {
                    saveLog("updateGroup", "更新了组"+group_name);
        			admin_edit(groupId, group_name, user_id_array);
        		} else {
                    saveLog("updateGroup", "更新了组"+group_name);
        			group_user_edit(groupId, group_name, user_id_array, have_person);
        		}
        	});
            return true;
        }
    });
}

//讨论组管理员编辑
function admin_edit(groupId, group_name, user_id_array) {
	$.ajax({
        type : 'post',
        url : '/groupController/updateGroup',
        data: {
            'groupId' : groupId,
            'groupName': group_name,
            'groupDescribe': $('#gdecribe-textarea').val(),
            'userIdList' : user_id_array
        },
        async:true,
        cache: false,
        success:function(data){
        	if (data && data.ok){
            	JqdeBox.message('success', '更新成功！');
        	}else {
        		JqdeBox.message('error', '更新失败，请稍后再试！');
        	}
        },
        error:function(data){
        	JqdeBox.message('error', '创建失败，请稍后再试！');
        }
    })
}

//成员编辑
function group_user_edit(groupId, group_name, user_id_array, have_person) {
	var old_person = have_person.split(",");
	var new_person = user_id_array.split(",");
	if(isContained(new_person,old_person)){
    	$.ajax({
            type : 'post',
            url : '/groupController/updateGroup',
            data: {
                'groupId' : groupId,
                'groupName': group_name,
                'groupDescribe': $('#gdecribe-textarea').val(),
                'userIdList' : user_id_array
            },
            async:true,
            cache: false,
            success:function(data){
            	if (data && data.ok){
                	JqdeBox.message('success', '更新成功！');
            	}else {
            		JqdeBox.message('error', '更新失败，请稍后再试！');
            	}
            },
            error:function(data){
            	JqdeBox.message('error', '创建失败，请稍后再试！');
            }
        })
    } else {
    	JqdeBox.message('error', '您为组成员不可删除人员！');
    }
}

//数组比较
isContained =(a, b)=>{
    if(!(a instanceof Array) || !(b instanceof Array)) return false;
    if(a.length < b.length) return false;
    var aStr = a.toString();
    for(var i = 0, len = b.length; i < len; i++){
      if(aStr.indexOf(b[i]) == -1) return false;
    }
    return true;
}

//获取参数
function out_group(groupId) {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		getCreater(now_ID, groupId);
        saveLog("outGroup", "退出了群组");
	});
}

//获取讨论组创建人
function getCreater(now_ID, groupId) {
	AjaxMethod.ajax('groupController/queryGroupInfo', {
		'groupId':groupId
	}).then(function (result){
		if (now_ID != result.creator) {
			out(now_ID, groupId);
		} else {
			JqdeBox.message('error', '创建者不能退出讨论组！');
		}
	});
}

//退出群组
function outgroup(now_ID, groupId) {
	AjaxMethod.ajax('groupController/outGroup', {
		'nowId':now_ID,
		'groupId':groupId
	}).then(function (result){
		location.reload();
	});
}

//弹窗询问是否退出群组
function out(now_ID, groupId){
	JqdeBox.confirm('确定退出群组？', function (result){
	    if (result){
	    	outgroup(now_ID,groupId);  	    	  
	    }
	});
}

//是否删除联系人
function delUser(userId, grouoId) {
	JqdeBox.confirm('确定删除联系人？', function (result){
	    if (result){
	    	outgroup(userId,groupId);  	    	  
	    }
	});
}


//拼接所有人员信息
function getAllUser(callback) {
    var levels = $('#levels').val();
    // alert($('#levels').val());
	$.ajax({
        type : 'post',
        url : '/homeController/queryOrgUserBylevels',
        data: {'noLogUser' : true,'levels' : levels},
        async:true,
        cache: false,
        success:function(data){
            if (data){
            	var org_map = data.orgMap;
            	var org_map_id = data.orgMapId;
                var org_user = data.orgUser;
                var user = data.user;
                $('#change-user-list').html('');
                change_user[user.userId] = user.fullname;
                var org_map_s = org_map.split(",");
                var org_map_id_s = org_map_id.split(",");
                for (var i = 0; i < org_map_s.length; i++) {
                	var f_id = "f_" + org_map_id_s[i];
                    userListHtml = '<div id="'+org_map_id_s[i]+'" class="user-org" style="width: 250px;margin-left: 40px; cursor: pointer;" onclick="CorO(this, \'' + f_id + '\')"><input id="org_Box" name="orgBox" type="radio" onclick="check_all(\'' + org_map_id_s[i] + '\');" /><span class="org-name">' + org_map_s[i] + '</span></div>';
                    var user_list = org_user[org_map_id_s[i]];
                    if (user_list){
                        userListHtml += '<div id="'+f_id+'" class="org-user" style="display:none;"><ul>';
                        for (var j in  user_list){
                            userListHtml += '<li class="list-group-item item-user"  onclick="checked_change($(this).find(\'.checked-div\'))"> ' +
                                '   <div class="checked-div unchecked" id="' + user_list[j].userId + '" name="' + user_list[j].userName + '"></div> ' +
                                // '   <div class="user-img">' + user_list[j].userName.substring(0, 1) + '</div> ' +
                                '   <div class="user-name">' + user_list[j].userName + '</div> ' +
                                '</li>';
                        }
                        userListHtml += '</ul></div>';
                    }
                    $('#change-user-list').append(userListHtml);
                }
//                for (var i in org_map){
//                	
//                }
                callback();
            }
        }
	});
}

var cuid = "";
function check_all(orgId) {
	var clan_cuid = cuid.split(",");
	for (var j = 0; j < clan_cuid.length; j++) {
		$('#' + clan_cuid[j]).removeClass('checked');
		$('#' + clan_cuid[j]).addClass('unchecked');
	}
	AjaxMethod.ajax('homeController/queryClassUser', {'orgId': orgId}).then(function (result){
		 var classUserList = result.classUser;
		 userListHtml = '';
		 change_user = {};
         if (classUserList){
        	 for (var i in classUserList) {
        		 change_user[classUserList[i].userId] = classUserList[i].fullname
        		 cuid += classUserList[i].userId + ",";
        		 $('#' + classUserList[i].userId).removeClass('unchecked');
        		 $('#' + classUserList[i].userId).addClass('checked');
        	 }
        	 update_checked_user();
         }
	});
}

function CorO(this_, f_id) {
	var p_id = $(this_).attr("id");
	var f_id_ = f_id.replace("f_", "");
	if (p_id == f_id_) {
		$("#"+p_id).attr("id", p_id.replace("_", "")+"_");
		$("#"+f_id).show();
	} else {
		$("#"+p_id).attr("id", p_id.replace("_", ""));
		$("#"+f_id).hide();
	}	
}

//更改checked样式
function checked_change (this_){
    var checked_div = $(this_);
    if (checked_div.hasClass('unchecked')){
        checked_div.removeClass('unchecked');
        checked_div.addClass('checked');
        change_user[checked_div[0].id] = checked_div.attr('name');
    }else {
        checked_div.removeClass('checked');
        checked_div.addClass('unchecked');
        delete change_user[checked_div[0].id];
    }
    update_checked_user();
}

//拼接已选中的人
function update_checked_user() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
	    var user_html = '';
	    if (change_user){
	        for (var i in change_user){
	        	if (now_ID == groupCreater) {
	        		user_html += '<div class="checked-user-info" id="checked_user_' + i + '">' +
                    '    <div class="user-img">' + change_user[i].substring(0, 1) + '</div>' +
                    '    <div class="user-name">' + change_user[i] + '</div>' +
                    '    <img class="delete_tools" src="/img/minus.png" onclick="delUser(\''+i+'\')" />' +
                    '</div>';
	        	} else {
	        		user_html += '<div class="checked-user-info" id="checked_user_' + i + '">' +
                    '    <div class="user-img">' + change_user[i].substring(0, 1) + '</div>' +
                    '    <div class="user-name">' + change_user[i] + '</div>' +
                    '</div>';
	        	}
	            $('#' + i).removeClass('unchecked');
	            $('#' + i).addClass('checked');
	        }
	    }
	    $('#checked-user').html(user_html);
	});
}


//是否删除联系人
function delUser(userId) {
	JqdeBox.confirm('确定删除联系人？', function (result){
	    if (result){
	    	truedel(userId);  	    	  
	    }
	});
}

//删除联系人
function truedel(userId) {
	AjaxMethod.ajax('groupController/outGroup', {
		'nowId':userId,
		'groupId':nowGroupId
	}).then(function (result){
		if (result.success) {
			reloadUser();
		} else {
			JqdeBox.message('error', '不可删除管理员！');
		}
	});
}

function reloadUser() {
	change_user = {};
    $.ajax({
        type : 'post',
        url : '/groupController/queryGroupAllInfo',
        data: {'groupId': nowGroupId},
        async:false,
        cache: false,
        success:function(data){
        	if (data && data.ok) {
                user_array = data.userList;
                if (user_array && user_array.length > 0) {
                    for (var i in user_array) {
                        change_user[user_array[i].userId] = user_array[i].fullname;
                        $('#' + user_array[i].userId).removeClass('unchecked');
                        $('#' + user_array[i].userId).addClass('checked');
                    }
                    update_checked_user();
                }
            }
        }
    });
}

//搜索全体成员
function query_gro_user() {
	var inputValue = $('#gro-list-input').val().trim();
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
	            $('#change-user-list').html('');
	            for (var key in org_user) {
	                var user_list = org_user[key];
	                if (user_list){
	                    for (var j = 0; j < user_list.length; j++){
	                        userListHtml = '<li class="list-group-item item-user" style="position: relative; width: 208px; float: right;" onclick="checked_change($(this).find(\'.checked-div\'))"> ' +
	                            '   <div class="checked-div unchecked" id="' + user_list[j].userId + '" name="' + user_list[j].userName + '"></div> ' +
	                            '   <div class="user-name">' + user_list[j].userName + '</div> ' +
	                            '</li>';
	                    }
	                }
	                $('#change-user-list').append(userListHtml);
	            }
	        }
	    });
	} else {
		getUserByLevel();
	}
}

//JSON数组去重
function getArray(workjson) {
	workjson = del_more(workjson);
	var hash = {},
	    len = workjson.length,
	    result = [];
	for (var i = 0; i < len; i++){
	    if (!hash[workjson[i]]){
	        hash[workjson[i]] = true;
	        result.push(workjson[i]);
	    } 
	}
	return result;
}

//去除多余","
function del_more(workjson) {
	workjson = workjson + "@@";
	workjson = workjson.replace(",@@","").replace("@@","").split(",");
	return workjson;
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

