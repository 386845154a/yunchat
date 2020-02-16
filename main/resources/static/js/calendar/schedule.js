var isToday = false;// 是否点击今日事件
//加载点击的日期事件
function queryClickDate() {
    htmlPage("pageInfo", 1, 0, 'queryList', 10);
    queryList(1);
}

//列表显示
function queryList(page) {
	var pageSize = $("#pageSelect").val();
	var startTime = changeTime($("#start").val());
	if (isToday) {
		startTime = '';
	}
	//日程列表
//	rc(page, pageSize, startTime);
	//日程、会议列表
	hy(page, pageSize, startTime);
}

//日程列表
//function rc(page, pageSize, startTime) {
//	$.ajax({
//		type: "GET",
//		url: '/calendarController/queryScheduleInfo',
//		data: {
//			'page' : page,
//			'pageRow':pageSize,
//			'startTime' : startTime
//		},
//		dataType: 'JSON',
//		cache: false,
//		async: false,
//		success: function(result) {
//			var schedule = result.objectList;
//			var schedule_html = "";
//			for (var i in schedule){
//				schedule_html += "<tr>"
//					  +  "<td>" + schedule[i].eventName
//					  +  "</td>"
//					  +  "<td>" + schedule[i].eventDescribe
//					  +  "</td>"
//					  +  "<td class='center'>" + getHourAndMinute(schedule[i].startTime)
//					  +  "</td>"
//					  +  "</td>"
//					  +  "<td class='center'>" +
//							"<a onclick='eventShowModel(\""+schedule[i].eventId+"\", \""+schedule[i].eventName+"\", \""+getHourAndMinute(schedule[i].startTime)+"\")'>详情</a>"+"/"+
//							"<a onclick='deleteSch(\""+schedule[i].eventId+"\")'>删除</a>"
//					  +  "</td>"
//					  +  "</tr>"
//			}
//			$("#schedule_List").html(schedule_html);
//            htmlPage("pageInfo", result.page, result.total, 'queryList', result.pageRow);
//		}
//	});
//}

//会议列表
function hy(page, pageSize, startTime) {
	$.ajax({
		type: "GET",
		url: '/meetingController/queryMeetingInfo',
		data: {
			'page' : page,
			'pageRow':pageSize,
			'startTime' : startTime
		},
		dataType: 'JSON',
		cache: false,
		async: false,
		success: function(result) {
			var list = result.objectList;
			var list_html = "";
			for (var i in list){
				var id = (list[i].eventid == null ? list[i].meetid : list[i].eventid);
				list_html += "<tr>"
					  +  "<td>" + list[i].name
					  +  "</td>"
					  +  "<td>" + (list[i].type == "1" ? "日程" : "会议")
					  +  "</td>"
					  +  "<td class='center'>" + getHourAndMinute(list[i].savetime)
					  +  "</td>"
					  +  "</td>"
					  +  "<td class='center'>" +
						"<a onclick='eventShowModel(\""+ id +"\", \""+ list[i].type +"\")'>详情</a>"+"/"+
						"<a onclick='update(\""+ id +"\", \""+ list[i].type +"\", \""+ list[i].name +"\")'>修改</a>"+"/"+
						"<a onclick='deleteSch(\""+ id +"\", \""+ list[i].type +"\", \""+ list[i].userId +"\")'>删除</a>"
					  +  "</td>"
					  +  "</tr>"
			}
		    $("#schedule_List").html(list_html);
            htmlPage("pageInfo", result.page, result.total, 'queryList', result.pageRow);
		}
	});
}

/**
 * 今日日程
 */
function eventToday() {
    isToday = true;
    $("#eventTip").hide();
    $("#notification_div").show();
    htmlPage("pageInfo", 1, 0, 'queryList', 10);
    queryList(1);
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

//时间格式转换
function changeDate (date_str){
    var date = new Date(date_str);
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    return month + '-' + day + '&nbsp;&nbsp;' + hour + ':' + minute;
}

function getHourAndMinute (time){
	var date = new Date(time);
    //时间转字符串
    var year = date.getFullYear();
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    return year + '/' + month + '/' + day + ' ' + hour + ':' + minute  + ':' + '00';
}

//姓名转换
function getNameById(creator) {
	var fullName = "";
	$.ajax({
		type : 'post',
		url : '/homeController/queryUserInfo',
		data : {
			'userId' : creator
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

//打开弹窗
function open_window(obj) {
	var tiltle = obj ? '日程事件编辑' : '日程事件添加';
	var btn_tiltle = obj ? '修改' : '确定';
    $.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href':'modules/calendar/date_event_edit'},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            DevBox.dialogNoCancel({
                title: tiltle,
                width:'90%',
                message: result,
                init: function () {
                    for (var i = 8; i < 19; i++) {
						$('#hour').append('<option value=\''+i+'\'>'+i+'</option>');
					}
					for (var i = 0; i < 60; i++) {
						$('#minute').append('<option value=\''+i+'\'>'+i+'</option>');
					}
                	if (obj) {
                		obj = JSON.parse(decodeURIComponent(obj));
                        $('input[name=eventId]').val(obj.eventId);
                        $('input[name=eventName]').val(obj.eventName);
                        $('textarea[name=eventDescribe]').val(obj.eventDescribe);
                        // 时间回显
                        var time = getHourAndMinute(obj['startTime']).split(":");
                        var hour = time[0], minute = time[1];
                        $('#hour').val(hour);
                        $('#minute').val(minute);
					}
                	//科室加载
 					meet_event_org();
 					//获取会议人员
// 					meeting_user();
                },
                confirm : function() {
                	if ($('#eventName').val() == '') {
                        JqdeBox.message(false, '事件标题不能为空');
                		return false;
					}
					if ($('#eventDescribe').val() == '') {
                		JqdeBox.message(false, '事件内容不能为空');
                        return false;
					}
					if ($('#eventAddress').val() == '') {
						JqdeBox.message(false, '事件地点不能为空');
                        return false;
					} 
					if ($('#eventagenda').val() == '') {
						JqdeBox.message(false, '事件议程不能为空');
                        return false;
					}
                	if (obj) {
                        schedule_update();
					} else {
                        schedule_add();
					}
                    return true;
                },
                cancel_btn: "取消",
                confirm_btn: btn_tiltle
            });
        }
    });

}


function load_org() {
	var isradio = $("input[name='u_c']:checked").val();//是否默认
	if (!isradio) {
		$("#user_choose").show();
		$.ajax({
			type : 'post',
			url : '/orgController/queryOrg',
			async : false,
			success : function(data) {
				var dJson = data.orgList;
				//填充到select左右风格中的左侧框
                var org_html = "";
                $('#orgs').empty();
                $('#orgs').append('<option  value="" selected>请选择科室</option>');
                $(dJson).each(function(i) {
                    $('#orgs').append('<option value="'+this.orgId+'">'+this.orgName+'</option>');
                });
			},
			error : function(err) {
				console.log(err);
			}
		});
	} else {
		$("#user_choose").hide();
	}
}

//加载人员
function load_user() {
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

//添加日程事件
function schedule_add(){
	var chk_value = "";
	$('#select2 option').each(function(index,element){
		chk_value += $(element).val() + ",";
	});
	var eventName = $('#eventName').val();
	var eventDescribe = $('#eventDescribe').val();
	var start = changeTime($("#start").val());
    start += + $("#hour").val() + ":" + $("#minute").val();
    $('div.modal-backdrop.fade.in').hide();
    
    var eventAddress = $('#eventAddress').val();
    var eventagenda = $('#eventagenda').val().replace(/[\r\n]/g,"").replace(/\t+/g,"");
	AjaxMethod.ajax('calendarController/saveEvent', {
		'eventName' : eventName,
		'eventDescribe' : eventDescribe,
		'start' : start,
		'chk_value' : chk_value,
		'eventAddress' : eventAddress,
		'eventagenda' : eventagenda
	}).then(function (result){
		if(result){
	        JqdeBox.message('success', '添加成功');
	        saveLog("addSchedule", "日程事件添加");
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
//修改
function edit(obj){
	open_window(obj);
}

function schedule_update() {
	var start = changeTime($("#start").val());
    var eventName = $('#eventName').val();
    var eventDescribe = $('#eventDescribe').val();
    start += + $("#hour").val() + ":" + $("#minute").val();
	AjaxMethod.ajax('calendarController/updateEvent', {'start' : start ,'eventId':$('#eventId').val(),'eventName':eventName,'eventDescribe' : eventDescribe}).then(function (result){
		if(result){
	        JqdeBox.message('success', '修改成功');
	        queryList($('#currentPage').val());
		}
	});
}

//本地时间日期转换
function dayTime(date){
	var time = "";
	var year = date.substring(4,8);
	time = time + year +"/";
	var month = date.substring(0,1);
	time = time + month +"/";
	var day = date.substring(2,3);
	time = time + day;
	return time;
}

//删除选择
function deleteSch(id, state, userId){
	if (state == "2") {
		delMeeting(id, userId);
	} else {
		delEvent(id, userId);
	}
}

//删除日程
function delEvent(id, userId) {
	AjaxMethod.ajax('calendarController/delEvent', {'scheduleId':id}).then(function (result){
		if(result){
			if (result.success) {
		        JqdeBox.message('success', '删除成功');
	            queryList(1);
	            // 清空日历
	            $("#calendar").find('div').remove();
	            $("#calendar").find('table').remove();
	            //  日历刷新事件
	            eventDays = _event();
	            initDateEvent();
			} else {
				JqdeBox.message('error', '你不是事件发起人！');
			}
		}
	});
}

//删除会议
function delMeeting(id, userId) {
	AjaxMethod.ajax('meetingController/delMeeting', {'id':id}).then(function (result){
		if(result){
			if (result.success) {
				JqdeBox.message('success', '删除成功！');
				queryList(1);
				// 清空日历
				$("#calendar").find('div').remove();
				$("#calendar").find('table').remove();
				//  日历刷新事件
				eventDays = _event();
				initDateEvent();
			} else {
				JqdeBox.message('error', '你不是会议发起人！');
			}
		}
	});
}

//详情窗口选择
function eventShowModel(id, state) {
	if (state == "2") {
		meetingShow(id);
	} else {
		eventShow(id);
	}
}

//会议详情
function meetingShow(id) {
	var tiltle = '会议详情展示';
    $.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href':'modules/calendar/meeting_show'},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            DevBox.dialogNoCancel({
                title: tiltle,
                width:'90%',
                message: result,
                init: function () {
                	$("#eventUser").empty();
            		AjaxMethod.ajax('meetingController/getMeetingById', {
                        'id' : id
                    }).then(function (result){
                    	$("#meetname").html(result.info[0].meetname);
                    	$("#meettype").html(result.info[0].meettype);
                    	$("#stime").html(getHourAndMinute(result.info[0].stime));
                    	$("#meettime").html(result.info[0].meettime);
                    	$("#meetaddress").html(result.info[0].meetaddress);
                    	$("#meetu").html(result.info[0].meetu);
                    	$("#meetclub").html(result.info[0].meetclub);
                    	var state = "";
                    	if (result.info[0].state == "1") {
                    		$("#state").html("待开");
                    	} else if (result.info[0].state == "2") {
                    		$("#state").html("取消");
                    	} else if (result.info[0].state == "3") {
                    		$("#state").html("结束");
                    	}
                    	$("#creater").html(getNameById(result.info[0].suser));
                    	var userInfo = result.user;
                    	for (var i in userInfo) {
                    		var page_html = "";
                    		page_html += "<tr>"
                  			  +  "<td class='center'>" + userInfo[i].fullname + "</td>"
                  			  +  "<td class='center'>" + getGroupNameById(userInfo[i].orgId) + "</td>"
                  			  +  "<td class='center'>" + "--" + "</td>"
                  			  +  "<td class='center'><input type='button' disabled='true' value='签到' /></td>"
                  			  +  "</tr>";
                    		$("#eventUser").append(page_html);
                    	}
                    });
                },
                confirm : function() {
                },
                confirm_btn: "关闭"
            });
        }
    });
}

//日程详情
function eventShow(id) {
	var tiltle = '日程详情展示';
    $.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href':'modules/calendar/event_show'},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            DevBox.dialogNoCancel({
                title: tiltle,
                width:'90%',
                message: result,
                init: function () {
                	$("#eventUser").empty();
            		AjaxMethod.ajax('calendarController/getEventById', {
                        'eventId' : id
                    }).then(function (result){
                    	$("#eventName").html(result.info[0].eventName);
                    	$("#eventDescribe").html(result.info[0].eventDescribe);
                    	$("#eventTime").html(getHourAndMinute(result.info[0].startTime));
                    	$("#eventAddress").html(result.info[0].address);
                    	$("#eventAgenda").html(result.info[0].agenda);
                    	var userInfo = result.user;
                    	for (var i in userInfo) {
                    		var page_html = "";
                    		page_html += "<tr>"
                  			  +  "<td class='center'>" + userInfo[i].fullname + "</td>"
                  			  +  "<td class='center'>" + getGroupNameById(userInfo[i].orgId) + "</td>"
                  			  +  "<td class='center'>" + "--" + "</td>"
                  			  +  "<td class='center'><input type='button' disabled='true' value='签到' /></td>"
                  			  +  "</tr>";
                    		$("#eventUser").append(page_html);
                    	}
                    });
                },
                confirm : function() {
                },
                confirm_btn: "关闭"
            });
        }
    });
}

//groupId转汉字
function getGroupNameById(orgId) {
	var orgName = "";
	$.ajax({
		type : 'post',
		url : '/orgController/queryOrgNameById',
		data : {
			'orgId' : orgId
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			orgName = msg[0].orgName;
		},	
		error : function() {
		}
	});
	return orgName;
}

//事件、会议修改
function update(rcId, state, name) {
	var title = ""
	if (state == "2") {
		title = "会议修改";
	} else {
		title = "事件修改";
	}
	$.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href':'modules/calendar/update_edit'},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            DevBox.dialogNoCancel({
                title: title,
                width:'90%',
                message: result,
                init: function () {
                	for (var i = 8; i < 19; i++) {
 						$('#hours_').append('<option value=\''+i+'\'>'+i+'</option>');
 					}
                	if (state == "2") {
                		$("#isShow").show();
                		var minute_list = ['00','15','30','45'];
                		for (var i = 0; i < minute_list.length; i++) {
                			$('#minutes_').append('<option value=\''+minute_list[i]+'\'>'+minute_list[i]+'</option>');
                		}
                	} else {
                		$("#isShow").hide();
                		for (var i = 0; i < 60; i++) {
                			$('#minutes_').append('<option value=\''+i+'\'>'+i+'</option>');
                		}
                	}
                	meet_event_org();//科室加载
                	right_option(rcId, state);//加载已选中人员
                },
                confirm : function() {
                	if ($('#select2 option').length <= 0) {
						JqdeBox.message(false, '成员不能为空');
                		return false;
					}
                	if (state == "2") {
                		edit_meet(rcId, name);
                	} else {
                		edit_event(rcId, name);
                	}
                },
                confirm_btn: "确认"
            });
        }
    });
}

//加载已选中人员
function right_option(rcId, state) {
	var url_ = "";
	if (state == "2") {
		url_ = '/meetingController/rightUser';
	} else {
		url_ = '/calendarController/rightUser';
	}
	$.ajax({
		type : 'post',
		url : url_,
		data : {
			'rcId' : rcId
		},
		async : false,
		success : function(data) {
			$("#muser_org").val(data[0].orgId);
			var html_ = "";
			$(data).each(function(i) {
				$('#select2').append('<option value="'+this.userId+'">'+this.fullname+'</option>');
			});
		},
		error : function(err) {
			console.log(err);
		}
	});
}

//提交事件修改
function edit_event(rcId, name) {
	var meet_U = "";
	$('#select2 option').each(function(index,element){
		meet_U += $(element).val() + ",";
	});
	var start = changeTime($("#start").val());
    start += + $("#hours_").val() + ":" + $("#minutes_").val();
    AjaxMethod.ajax('calendarController/updateEvent', {
		'rcId' : rcId,
		'name' : name,
    	'start' : start,
		'meet_U' : meet_U
	}).then(function (result){
		if(result){
			if (result.success) {
				JqdeBox.message('success', '修改成功');
				$('#scheduleTitle').val("");
				$('#scheduleContent').val("");
				queryList(1);
				// 清空日历
				$("#calendar").find('div').remove();
				$("#calendar").find('table').remove();
				//  日历刷新事件
				eventDays = _event();
				initDateEvent();
			} else {
				JqdeBox.message('error', '你不是事件发起人！');
			}
		}
	});
}

//提交会议修改
function edit_meet(rcId, name) {
	var meet_U = "";
	$('#select2 option').each(function(index,element){
		meet_U += $(element).val() + ",";
	});
	var start = changeTime($("#start").val());
    start += + $("#hours_").val() + ":" + $("#minutes_").val();
    var state = $("input[name='ra']:checked").val();
    AjaxMethod.ajax('meetingController/updateMeeting', {
		'rcId' : rcId,
		'name' : name,
    	'start' : start,
		'state' : state,
		'meet_U' : meet_U
	}).then(function (result){
		if(result){
			if (result.success) {
				JqdeBox.message('success', '修改成功');
				$('#scheduleTitle').val("");
				$('#scheduleContent').val("");
				queryList(1);
				// 清空日历
				$("#calendar").find('div').remove();
				$("#calendar").find('table').remove();
				//  日历刷新事件
				eventDays = _event();
				initDateEvent();
			} else {
				JqdeBox.message('error', '你不是会议发起人！！');
			}
		}
	});

}

//上传发钱文件
function uploadfile(file){
    var formData = new FormData();
    formData.append("file", file.files[0]); //file是blob数据

    $.ajax({
        type : 'post',
        url : '/ParssOfficeController/parssWord',
        data: formData,
        contentType: false,
        processData: false,
        success : function(data) {
            if(data.state){
             // alert(111);
            }
        },
        error : function(err) {
            console.log(err);
        }
    });
    DevBox.hideAll();
}