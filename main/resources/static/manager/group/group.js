
//保存已选择的人
var change_user = {};

//创建讨论组
function create_group (){
    JqdeBox.dialog({
        title: '创建讨论组',
        url: '/js/groupEdit/groupEdit.html',
        init: function () {
            change_user = {};
            getAllUser(function () {
                update_checked_user();
            });
        },
        confirm: function () {
            var group_name = $('#gname-input').val();
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
            $.ajax({
                type : 'post',
                url : '/groupController/createGroup',
                data: {
                	'groupName': group_name, 
                	'groupDescribe': $('#gdecribe-textarea').val(), 
                	'userIdList' : user_id_array
                },
                async:true,
                cache: false,
                success:function(data){
                	if (data && data.ok){
                    	JqdeBox.message('success', '创建成功！');
                    	queryData($('#currentPage').val());
                	}else {
                		JqdeBox.message('error', '创建失败，请稍后再试！');
                	}
                },
                error:function(data){
                	JqdeBox.message('error', '创建失败，请稍后再试！');
                }
            });
            return true;
        }
    });
}

//编辑讨论组
function edit_group (groupId){
	if (!groupId){
		JqdeBox.message('error', '系统出错，请稍后再试！');return false;
	}
    JqdeBox.dialog({
        title: '编辑讨论组',
        url: '/js/groupEdit/groupEdit.html',
        init: function () {
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
                                    $('#eg_' + user_array[i].userId).removeClass('unchecked');
                                    $('#eg_' + user_array[i].userId).addClass('checked');
                                }
                                update_checked_user();
                            }
                            var group_info = data.groupInfo;
                            if (group_info) {
                                $('#gname-input').val(group_info.groupName);
                                $('#gdecribe-textarea').val(group_info.groupDescribe);
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
            var user_id_array = '';
            for (var i in change_user){
                user_id_array += i + ',';
            }
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
                    	queryData($('#currentPage').val());
                	}else {
                		JqdeBox.message('error', '更新失败，请稍后再试！');
                	}
                },
                error:function(data){
                	JqdeBox.message('error', '创建失败，请稍后再试！');
                }
            })
            return true;
        }
    });
}

//拼接所有人员信息
function getAllUser(callback) {
	$.ajax({
        type : 'post',
        url : '/homeController/queryOrgUser',
        data: {'noLogUser' : false},
        async:true,
        cache: false,
        success:function(data){
            if (data){
            	var org_map = data.orgMap;
                var org_user = data.orgUser;
                var user = data.user;
                $('#change-user-list').html('');

                for (var i in org_map){
                    userListHtml = '<div class="user-org"><span class="org-name">' + org_map[i] + '</span></div>';
                    var user_list = org_user[i];
                    if (user_list){
                        userListHtml += '<div class="org-user"><ul class="nav list-group" style="margin: 0px;">';
                        for (var j in  user_list){
                            userListHtml += '<li class="list-group-item item-user"  onclick="checked_change($(this).find(\'.checked-div\'))"> ' +
                                '   <div class="checked-div unchecked" id="eg_' + user_list[j].userId + '" name="' + user_list[j].userName + '"></div> ' +
                                '   <div class="user-img">' + user_list[j].userName.substring(0, 1) + '</div> ' +
                                '   <div class="user-name">' + user_list[j].userName + '</div> ' +
                                '</li>';
                        }
                        userListHtml += '</ul></div>';
                    }
                    $('#change-user-list').append(userListHtml);
                }
                callback();
            }
        }
	});
}

//更改checked样式
function checked_change (this_){
    var checked_div = $(this_);
    var id = checked_div[0].id.split('_')[1];
    if (checked_div.hasClass('unchecked')){
        checked_div.removeClass('unchecked');
        checked_div.addClass('checked');
        change_user[id] = checked_div.attr('name');
    }else {
        checked_div.removeClass('checked');
        checked_div.addClass('unchecked');
        delete change_user[id];
    }
    update_checked_user();
}

//拼接已选中的人
function update_checked_user (){
    var user_html = '';
    if (change_user){
        for (var i in change_user){
            user_html += '<div class="checked-user-info" id="checked_user_' + i + '">' +
                        '    <div class="user-img">' + change_user[i].substring(0, 1) + '</div>' +
                        '    <div class="user-name">' + change_user[i] + '</div>' +
                        '</div>';
        }
    }
    $('#checked-user').html(user_html);
}

//搜索全体成员
function query_gro_user() {
	var name = $('#gro-list-input').val().trim();
	if (!name || name.length == 0){
		$('#change-user-list').find('.list-group-item').show();
		return;
	}
	$('#change-user-list').find('.list-group-item').each(function (i, v){
		var user_name = $(v).find('.user-name').html();
		if (user_name.indexOf(name) > -1){
			$(v).show();
		}else {
			$(v).hide();
		}
	});
}
