var child_address = [
 	{"text":"B-01会议室","pid":"研发楼"}, {"text":"B-02会议室","pid":"研发楼"}, {"text":"B-04某团队专用会议室","pid":"研发楼"},
 	{"text":"B-05会议室","pid":"研发楼"}, {"text":"B-06会议室","pid":"研发楼"}, {"text":"B-07会议室","pid":"研发楼"},
 	{"text":"B-08会议室","pid":"研发楼"}, {"text":"C801(一室、十六室)","pid":"研发楼"}, {"text":"C803(九室、十三室)","pid":"研发楼"},
 	{"text":"C701(三室、二室)","pid":"研发楼"}, {"text":"C501(五室、十五室)","pid":"研发楼"}, {"text":"C403(六室、档案室)","pid":"研发楼"},
 	{"text":"C503(七室、四室)","pid":"研发楼"}, {"text":"A-0411(空间室)","pid":"研发楼"}, {"text":"A-01会议室","pid":"研发楼"},
 	{"text":"A-02会议室","pid":"研发楼"}, {"text":"A-03会议室","pid":"研发楼"}, {"text":"A-04会议室","pid":"研发楼"},
 	{"text":"A-05会议室","pid":"研发楼"}, {"text":"A-06会议室","pid":"研发楼"}, {"text":"A-07会议室","pid":"研发楼"},
 	{"text":"A-08会议室","pid":"研发楼"}, {"text":"A-0615","pid":"研发楼"}, {"text":"A-0815","pid":"研发楼"},
 	{"text":"A-1015","pid":"研发楼"}, {"text":"75-II_203会议室","pid":"研发楼"}, {"text":"天空Space","pid":"研发楼"},
 	{"text":"信展楼4602网络会议室","pid":"信展楼"}, {"text":"信展楼4605网络会议室","pid":"信展楼"}, {"text":"信展楼4606网络会议室","pid":"信展楼"},
 	{"text":"信展楼4607网络会议室","pid":"信展楼"}, {"text":"信展楼4631网络会议室","pid":"信展楼"}, {"text":"信展楼4633网络会议室","pid":"信展楼"},
 	{"text":"信展楼4635网络会议室","pid":"信展楼"}, {"text":"北楼1007网络会议室","pid":"信展楼"}, {"text":"北楼6012单点会议室","pid":"信展楼"},
 	{"text":"北楼6015网络会议室","pid":"信展楼"}, {"text":"北楼7052网络会议室","pid":"信展楼"}, {"text":"北楼9029单点会议室","pid":"信展楼"},
 	{"text":"信展楼4627网络会议室","pid":"信展楼"}, {"text":"北楼7036网络会议室","pid":"信展楼"}, {"text":"北楼5081单点会议室","pid":"信展楼"},
 	{"text":"北楼6050单点会议室","pid":"信展楼"}, {"text":"北楼6085单点会议室","pid":"信展楼"}, {"text":"北楼8018单点会议室","pid":"信展楼"},
 	{"text":"北楼9062单点会议室","pid":"信展楼"}, {"text":"信展楼1610多功能厅","pid":"信展楼"}, {"text":"信展楼4609报告厅","pid":"信展楼"},
 	{"text":"北楼4012会议室(无终端)","pid":"信展楼"}, {"text":"北楼7079会议室(无终端)","pid":"信展楼"},
 	{"text":"仿真4层会议室","pid":"仿真楼"}, {"text":"仿真十室会议室","pid":"仿真楼"}
];	
//添加会议
function add_meeting() {
	var tiltle = '会议添加';
	var btn_tiltle = '确定';
    $.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href':'modules/calendar/add_meeting'},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            DevBox.dialogNoCancel({
                title: tiltle,
                width:'90%',
                message: result,
                init: function () {
                	var minute_list = ['00','15','30','45'];
                	var meeting_time = ['30','60','90','120','150','180','210','全天'];
                	var meeting_address = ['研发楼','信展楼','仿真楼'];
                	for (var i = 8; i < 19; i++) {
 						$('#hours').append('<option value=\''+i+'\'>'+i+'</option>');
 					}
 					for (var i = 0; i < minute_list.length; i++) {
 						$('#minutes').append('<option value=\''+minute_list[i]+'\'>'+minute_list[i]+'</option>');
 					}
 					for (var i = 0; i < meeting_time.length; i++) {
 						$('#meeting_time').append('<option value=\''+meeting_time[i]+'\'>'+meeting_time[i]+'</option>');
 					}
 					for (var i = 0; i < meeting_address.length; i++) {
 						$('#meeting_address').append('<option value=\''+meeting_address[i]+'\'>'+meeting_address[i]+'</option>');
 					}
 					childAddress();//补充地址
 					login_info();//获取当前用户信息
 					meet_event_org();//科室加载
 					//meeting_user();//获取会议人员
 					
                },
                confirm : function() {
                	if ($('#meeting_name').val() == '') {
                        JqdeBox.message(false, '会议名称不能为空');
                		return false;
					} else if ($('#meeting_type').val() == '') {
						JqdeBox.message(false, '会议类型不能为空');
                		return false;
					} else if ($('#meeting_u').val() == '') {
						JqdeBox.message(false, '主持人不能为空');
                		return false;
					} else if ($('#meeting_club').val() == '') {
						JqdeBox.message(false, '会务不能为空');
                		return false;
					} else if ($('#select2 option').length <= 0) {
						JqdeBox.message(false, '会议成员不能为空');
                		return false;
					}
                    meeting_add();
                    return true;
                },
                cancel_btn: "取消",
                confirm_btn: btn_tiltle
            });
        }
    });

}
//补充地址
function childAddress() {
	var meeting_address = $("#meeting_address").val();
	if (child_address) {
		$('#child_address').empty();
		for (var i = 0; i < child_address.length; i++) {
			if (meeting_address == child_address[i].pid) {
				$('#child_address').append('<option value=\''+child_address[i].text+'\'>'+child_address[i].text+'</option>');
			}
		}
	}
}

//获取当前用户信息
function login_info() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		$("#meeting_u").val(result.fullName);
		$("#meeting_club").val(result.fullName);
	});
}

//科室加载
function meet_event_org() {
	$.ajax({
		type : 'post',
		url : '/orgController/queryOrg',
		async : false,
		success : function(data) {
			var html_ = "";
			$('#muser_org').append('<option value="" checked="checked">'+"请选择部门"+'</option>');
            $(data.orgList).each(function(i) {
                $('#muser_org').append('<option value="'+this.orgId+'">'+this.orgName+'</option>');
            });
		},
		error : function(err) {
			console.log(err);
		}
	});
}

//成员添加
function meeting_user() {
	$('#select1').empty();
	if ($("#muser_org").val()) {
		$.ajax({
			type : 'post',
			url : '/userController/GetMeUser',
			data : {
				'orgId' : $("#muser_org").val()
			},
			async : false,
			success : function(data) {
				var html_ = "";
				$(data.list).each(function(i) {
					$('#select1').append('<option value="'+this.userId+'">'+this.fullname+'</option>');
				});
			},
			error : function(err) {
				console.log(err);
			}
		});
	} else {
		JqdeBox.message('error', '请选择部门！');
	}
}

//显示会议类型下拉
function type_down() {
	$("#meeting_type_down").show();
}

//隐藏会议下拉
function type_down_hide() {
	$("#meeting_type_down").hide();
}

//获取会议类类型、隐藏会议下拉
function type_val(this_) {
	var type = $(this_).html();
	$("#meeting_type").val(type);
	$("#meeting_type_down").hide();
}

//人员选择
function user_choose() {
	var isradio = $("input[name='u_c']:checked").val();//是否默认
	if (isradio) {
		$.ajax({
			type : 'post',
			url : '/homeController/queryClassUser',
			data : {
				'orgId': $('#orgs').val()
			},
			async : false,
			success : function(data) {
				$('#org_user').empty();
				var classUserList = data.classUser;
				$(classUserList).each(function(i) {
					$('#org_user').append('<div style="width: 100px;float:left;padding-left:5px;"><input type="checkbox" name="test" value="'+classUserList[i].userId+'" />'+classUserList[i].fullname+'</div>');
				});
			},
			error : function(err) {
				console.log(err);
			}
		});
	}
}

//添加会议
function meeting_add() {
	var meet_U = "";
	$('#select2 option').each(function(index,element){
		meet_U += $(element).val() + ",";
	});
	var meeting_name = $("#meeting_name").val();
	var meeting_type = $("#meeting_type").val();
	var start = changeTime($("#start").val());
    start += + $("#hours").val() + ":" + $("#minutes").val();
	var meeting_time = $("#meeting_time").val();
	var meeting_address = $("#meeting_address").val() + "-" + $("#child_address").val();
	var meeting_u = $("#meeting_u").val();
	var meeting_club = $("#meeting_club").val();
	var state = $("input[name='ra']:checked").val();
	AjaxMethod.ajax('meetingController/addMeeting', {
		'meeting_name' : meeting_name,
		'meeting_type' : meeting_type,
		'start' : start,
		'meeting_time' : meeting_time,
		'meeting_address' : meeting_address,
		'meeting_u' : meeting_u,
		'meeting_club' : meeting_club,
		'state' : state,
		'meet_U' : meet_U
	}).then(function (result){
		if(result){
	        JqdeBox.message('success', '添加成功');
	        saveLog("addMeeting", "添加会议");
	        $('#scheduleTitle').val("");
	        $('#scheduleContent').val("");
            queryList(1);
            // 清空日历
            $("#calendar").find('div').remove();
            $("#calendar").find('table').remove();
            //  日历刷新事件
            eventDays = _event();
            initDateEvent();
		}
	});
}

//日历时间转换为日期格式
function changeTime(date){
	var time = "";
	var year = date.substring(11,15);
	time = time + year +"/";
	var month = date.substring(4,7);
	switch(month){
		case 'Jan': month = '01'; break;
		case 'Feb': month = '02'; break;
		case 'Mar': month = '03'; break;
		case 'Apr': month = '04'; break;
		case 'May': month = '05'; break;
		case 'Jun': month = '06'; break;
		case 'Jul': month = '07'; break;
		case 'Aug': month = '08'; break;
		case 'Sep': month = '09'; break;
		case 'Oct': month = '10'; break;
		case 'Nov': month = '11'; break;
		case 'Dec': month = '12'; break;
	}
	time = time + month +"/";
	var day = date.substring(8,11);
	time = time + day;
	return time;
}

//发钱
function add_money(){

    // $.ajax({
    //     type : 'post',
    //     url : '/ParssOfficeController/parssWord',
    //     data : {
    //
    //     },
    //     async : false,
    //     success : function(data) {
    //
    //     },
    //     error : function(err) {
    //         console.log(err);
    //     }
    // });
}