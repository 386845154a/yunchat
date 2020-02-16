var departmentJson = [
    {"orgId":"B000001140","orgName":"部领导","pid":"1000"},{"orgId":"B000001141","orgName":"科技委","pid":"1000"},
    {"orgId":"B000001142","orgName":"部办公室","pid":"1000"},{"orgId":"B000001143","orgName":"党委办公室","pid":"1000"},
    {"orgId":"B000001144","orgName":"发展计划处","pid":"1000"},{"orgId":"B000001145","orgName":"科研处","pid":"1000"},
    {"orgId":"B000001146","orgName":"生产处","pid":"1000"},{"orgId":"B000001193","orgName":"产业发展处","pid":"1000"},
    {"orgId":"B000001149","orgName":"质量技术处","pid":"1000"},{"orgId":"B000001150","orgName":"财务处","pid":"1000"},
    {"orgId":"B000001151","orgName":"人力资源处","pid":"1000"},{"orgId":"B000001152","orgName":"行政处","pid":"1000"},
    {"orgId":"B000001153","orgName":"保密处","pid":"1000"},{"orgId":"B000001154","orgName":"保卫处","pid":"1000"},
    {"orgId":"B000001155","orgName":"技安处","pid":"1000"},{"orgId":"B000001195","orgName":"纪检审计风险处","pid":"1000"},
    {"orgId":"B000001157","orgName":"工会办公室","pid":"1000"},{"orgId":"B000001158","orgName":"离退休办公室","pid":"1000"},
    {"orgId":"B000001185","orgName":"军贸代表室","pid":"1000"},{"orgId":"B000001196","orgName":"空天防御创新中心办公室","pid":"1000"},
    {"orgId":"B000001178","orgName":"技术保障中心","pid":"1000"},{"orgId":"B000001177","orgName":"档案情报资料室","pid":"1000"},
    {"orgId":"1002","orgName":"909专家组办公室","pid":"1000"},{"orgId":"B000001162","orgName":"精导秘书办公室","pid":"1000"},
    {"orgId":"B000001163","orgName":"一室","pid":"1000"},{"orgId":"B000001164","orgName":"二室","pid":"1000"},
    {"orgId":"B000001165","orgName":"三室","pid":"1000"},{"orgId":"B000001166","orgName":"四室","pid":"1000"},
    {"orgId":"B000001167","orgName":"五室","pid":"1000"},{"orgId":"B000001168","orgName":"六室","pid":"1000"},
    {"orgId":"B000001169","orgName":"七室","pid":"1000"},{"orgId":"B000001170","orgName":"八室","pid":"1000"},
    {"orgId":"B000001171","orgName":"九室","pid":"1000"},{"orgId":"B000001172","orgName":"十室","pid":"1000"},
    {"orgId":"B000001173","orgName":"十一室","pid":"1000"},{"orgId":"B000001174","orgName":"十三室","pid":"1000"},
    {"orgId":"B000001175","orgName":"十五室","pid":"1000"},{"orgId":"B000001176","orgName":"十六室","pid":"1000"},
    {"orgId":"B000001192","orgName":"售后事业部","pid":"1000"},{"orgId":"B000001198","orgName":"仿真公司","pid":"1000"},
    {"orgId":"1003","orgName":"测试组001","pid":"1000"},{"orgId":"1004","orgName":"离职退休人员","pid":"1000"}
];

var initObj = {
    loadDepartment : function () {
        $('#ul_pid_nav_01').empty();
        // 遍历组织机构
        $(departmentJson).each(function(i){
            var orgHtml = '<dt id="ul_dt_'+this.orgId+'" onclick="changeContactsNav(this)"> \
		    <img class="f_left" src="images/2018/c04.png" height="37px" width="37px"/> \
		    	<span class="f_left"><a title="'+this.orgName+'">'+this.orgName+'</a></span> \
		    </dt> \
		    <ul id="ul_ul_pid_ul_dt_'+this.orgId+'" class="user-dt-ul'+(i==0?' active':'')+'">';
            //
            orgHtml += '<dt'+(i==0?' class="active"':'')+' style="margin-left: 25px;"> \
			    <img class="f_left" src="images/2018/userphoto.png" height="37px" width="37px"/> \
					<span class="f_left" style="padding-left: 15px;"><a>张三'+i+'</a></span> \
				</dt>';
            orgHtml += '</ul>';
            $('#ul_pid_nav_01').append(orgHtml);
        });
        // for (var i in departmentJson) {
        //     var html = '<dt><img class="f_left" src="../images/keshi.png" height="37px" width="37px"/>' +
        //         '<span class="f_left"><a onclick="initObj.loadContacts(\''+departmentJson[i].orgId+'\')">' +
        //             departmentJson[i].orgName + '</a></span></dt>';
        //     $('ul[name=contacts]').append(html);
        // }
    },
    loadRecentlyAndGroup: function () {// 最近联系人和群组
        AjaxMethod.ajax('contacts/queryLastlyMessageByUserId', {'page': 1, 'rows': 9999})
            .then(function (result) {
            if (result) {
            	
//                result = result.recentlyMessage;
//                console.log(result);
//                $('ul[name=recently]').find('dt').remove();
//                for (var i = 0; i < result.length; i++) {
//                    var imgPath = result[i].TYPE == "group" ? "/img/group.png" :　result[i].HEAD;
//                    var html = '<dt><img class="f_left" src="' + imgPath + '" height="37px" width="37px"/>' +
//                        '<span class="f_left"><a onclick="initObj.chat(\''+result[i].LINK_ID+'\', \''+result[i].TYPE+'\')">' + result[i].NAME +
//                        '</a></span></dt>';
//                    $('ul[name=recently]').append(html);
//                }
            }
        });
    },
    loadGroup: function () {// 群组
        AjaxMethod.ajax('contacts/queryGroup')
            .then(function (result) {
                if (result) {
                    for (var i = 0; i < result.length; i++) {
                        var html = '<dt><img class="f_left" src="/img/group.png" height="37px" width="37px"/>' +
                            '<span class="f_left"><a>' + result[i].GROUP_NAME +
                            '</a></span></dt>';
                        $('ul[name=group]').append(html);
                    }
                }
            });
    },
    loadContacts: function (orgId) {// 部门下的联系人
        AjaxMethod.ajax('contacts/queryDepartmentUser', {'orgId': orgId == null ? "" : orgId})
            .then(function (result) {
                if (result) {
                    for (var i in result) {
                        var imgPath = "/userHeadController/showHead?path=" + result[i].head;
                        var html = '<dt><img class="f_left" src="'+imgPath+'" height="37px" width="37px"/>' +
                            '<span class="f_left"><a onclick="initObj.chat(\''+result[i].LINK_ID+'\', \''+result[i].TYPE+'\')">' +
                            result[i].fullname + '</a></span></dt>';
                        $('ul[name=contacts]').append(html);
                    }
                }
        });
    },
    chat : function (LINK_ID, type) {// 对某用户聊天
        if (LINK_ID) {
            $("#messageDiv").show();
        }
    },
    keywordFilter : function (flag) {// 关键字过滤
        if (flag) {
            $.post("contacts/keywordFilter", {"msg" : "msg"}, function (result) {
                alert(result);
            });
        }
    },
    loadFunction : function (flag) {// 重新渲染function
        if (flag) {
            setTimeout(function () {
                for (var i in initObj) {
                    initObj[i].call(this);
                }
            }, 2000);// 延时接收消息
        }
    },
    loadGroupFile : function (flag , page, size) {// 加载群文件

    }
}

/**
 * 点击事件
 * @type {{searchUser: onclickObj.searchUser}}
 */
var onclickObj = {
    searchUser : function () {
        var keyword = $('input[name=contacts_kw_]').val();
        AjaxMethod.ajax('contacts/queryUserByKeyword', {'keyword': keyword})
            .then(function (result) {
                if (result) {

                }
        });
    }

}

//联系人左侧导航切换
function changeContactsNav(nav_) {
    var p_id = $(nav_).attr("id");
    if (p_id == "nav_01" || p_id == "nav_02" || p_id == "nav_03") {
        // 第一级折叠
        $(".contacts > .content > ul > ul.org-dt-ul").hide();
        $(".contacts > .content > ul > ul.dt-ul").hide();
        $("#ul_pid_" + p_id).show();
    } else {
        // 第二级折叠
        $(".contacts > .content > ul > ul.org-dt-ul > ul.user-dt-ul").hide();
        $("#ul_ul_pid_" + p_id).show();
    }
}

// 左侧导航切换
function changeNav(nav_, method) {
    var ulArr = ["dt-ul-1", "dt-ul-2", "dt-ul-3"];
    for (var i in ulArr) {
        $("." + ulArr[i]).find("dt").remove();
    }
    initObj[method].call(this);
}

$('document').ready(function () {
    for (var i in initObj) {
        initObj[i].call(this);
    }
    show_user_info("10000025190000");
});

//显示人员信息
function show_user_info(userId) {
	$('#userinfo').show();
	$('#groupinfo').hide();
	$('#groupUserInfo').hide();
	$('#groupFileInfo').hide();
	$('#importInfo').hide();
	if (!userId) {
		JqdeBox.message('error', '系统出错，请稍后再试！');
	} else {
		AjaxMethod.ajax('homeController/queryUserInfo', {'userId' : userId}).then(function (result){
			if (result){
				$('#userName').html(result.fullname);
				$('#classRoom').html(result.orgName);
				$('#address').html(result.roomid);
				getHeadPath(result.head);
			}
		});
	}
}

//显示讨论组信息
function show_group_info(groupId) {
	groupId = "25711534128684082";
	$('#userinfo').hide();
	$('#groupinfo').show();
	$('#groupUserInfo').hide();
	$('#groupFileInfo').hide();
	$('#importInfo').hide();
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');
	} else {
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
				$('#scop').html(result.scop);
			}
		});
	}
}

//显示讨论组成员
function show_group_user(groupId) {
	groupId = "25711534128684082";
	$('#userinfo').hide();
	$('#groupinfo').hide();
	$('#groupUserInfo').show();
	$('#groupFileInfo').hide();
	$('#importInfo').hide();
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');
	} else {
		AjaxMethod.ajax('groupController/queryGroupUser', {'groupId' : groupId}).then(function (result){
			if (result){
				var user_html = '<ul class="list-group">';
	    		var user_list = result.userList;
	    		for (var i in user_list){
	    			var isOnLine = "";
	    			if (user_list[i].isonline == "0") {
	    				isOnLine = "离线";
	    				user_html += '<li class="list-group-item" style="width: 90%; border: none;" onclick="user_info(\''+user_list[i].userId+'\')"> \
						<label> ' + user_list[i].fullname + '</label><label>[' + user_list[i].orgName + ']</label></li>';
	    			} else if (user_list[i].isonline == "1") {
	    				isOnLine = "在线";
	    				user_html += '<li class="list-group-item" style="width: 90%; border: none;" onclick="user_info(\''+user_list[i].userId+'\')"> \
						<label style="color: #0BE213;"> ' + user_list[i].fullname + '</label><label>[' + user_list[i].orgName + ']</label></li>';
	    			}
	    		}
	    		user_html += '</ul>'
	    		$('#groupUserInfoList').html(user_html);
			}
		});
	}
}

//显示组文件
function show_group_file(groupId) {
	groupId = "25711534128684082";
	$('#userinfo').hide();
	$('#groupinfo').hide();
	$('#groupUserInfo').hide();
	$('#groupFileInfo').show();
	$('#importInfo').hide();
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');
	} else {
		AjaxMethod.ajax('groupController/queryGroupFile', {'groupId' : groupId, 'page' : 1}).then(function (result){
			if (result){
				var file_html = '';
				var page_data = result.data.objectList;
				for (var i in page_data){
					var file_name = page_data[i].fileName
					file_html += '<tr><td class="group_file_name" title="' + page_data[i].fileName + '"'
					+'onclick="view_by_id(\''+page_data[i].fileName+'\', \''+page_data[i].fileId+'\',\'' + page_data[i].levels + '\', \'group\',\'' + result.loginId + '\')">'
					+ file_name + '</td> \
					<td class="center">' + page_data[i].creatorName + '</td> \
					<td class="del_gro_fil center" onclick="removeGroupFile(\''+page_data[i].fileId+'\', \''+page_data[i].path+'\', \''+page_data[i].readPath+'\')"> \
					<i class="fa fa-trash"></i></td></tr>';
				}
				$('#groupFileInfoList').html(file_html);
			}
		});
	}
}

//显示重要信息
function show_importantInfo_user(groupId) {
	groupId = "25711534128684082";
	$('#userinfo').hide();
	$('#groupinfo').hide();
	$('#groupUserInfo').hide();
	$('#groupFileInfo').hide();
	$('#importInfo').show();
	AjaxMethod.ajax('groupController/queryImportantInfo', {'groupId' : groupId}).then(function (result){
		if (result){
			AjaxMethod.ajax('groupController/queryImportantInfo', {'groupId' : groupId}).then(function (result){
				if (result){
		    		var user_html = '<ul class="list-group">';
		    		var user_list = result.importantList;
		    		for (var i in user_list){
		    			if (user_list[i].msgType == "text" && user_list[i].msgReceiver == groupId) {
		    				if (user_list[i].msg.indexOf('name-span\">') != -1) {
		    					var splitStr = user_list[i].msg.split('name-span\">');
		    					user_list[i].msg = splitStr[1].split('</span>')[0];
		    				}
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
	});
}

//导出聊天记录
function out_files(groupId) {
	alert("导出讨论组信息");
	var groupId = "25711534128684082";
	exprotExcel_("/groupController/groupExcelData",JSON.stringify(({'groupId' : groupId})));
    saveLog("exportChatMsg", "导出了"+$("#group_name").html()+"的聊天消息");
}

//个人讨论组删除
function del_group(groupId) {
	alert("删除讨论组");
	var type = "true";
	delete_group(groupId, type);
}

//编辑讨论组
function edit_group_btn(groupId) {
	alert("编辑讨论组");
    edit_group(groupId);
}

//关闭讨论组
function closed_group(groupId) {
	alert("关闭讨论组");
	var groupId = "25711534128684082";
	AjaxMethod.ajax('groupController/closedGroup', {
		'groupId': groupId
	}).then(function (result){
		if (result) {
			JqdeBox.message('success', '讨论组已关闭！');
		}
	});
}

//获取头像
function getHeadPath(userID) {
	AjaxMethod.ajax('userHeadController/queryHead', {'userID' : 'my'}).then(function (result){
		if (result) {
           var head = result.head;
           if (head != null) {
        	   var head_img = '<img style="width:85px; height: 84px; border-radius: 50%;" src="/userHeadController/showHead?path='+head.head+'">';
    		   $('#talkUserHead').html(head_img);
           }
        }
	});
}

//格式化时间
function format_date(date) {
	var newDate = new Date(date);
	return newDate.toJSON().substring(0, 10);
}