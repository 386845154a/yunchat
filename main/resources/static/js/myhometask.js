$(function () {
    query_now_person_info();
});


//获取当前用户信息
function query_now_person_info() {
    AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
        var now_ID = result.Id;
        // alert(now_ID);
//        interface_getTask_info(now_ID);
//        moreTask(now_ID);
        more_OTask(now_ID);
    });
}

//获取首页我的代办信息 忠
function interface_getTask_info(now_ID) {
    //获取任务
    var pagedata = '';
    $.ajax({
        url: 'http://10.12.97.30:8080/newnewcosim-master_war/iworktask.ht?id='+now_ID,
        type: 'GET',
        dataType: 'jsonp',
        jsonp:"callback",
        success: function (data) {
//             var data = [{"projectid":10000028500000,"projectname":"智慧总体部项目","ddTaskId":10000028500003,"ddTaskName":"测试任务2"}];
            var new_allProject_Name = [];
            for (var i=0; i<data.length; i++) {
                pagedata += ("<li><span style='width:50%' class=\"creator\"><a onclick='getTaskInfo("+ data[i].ddTaskId+" )'>" + data[i].ddTaskName)+"</a></span>";
                pagedata += ("<span style='width:45%' class=\"subject\">" + data[i].projectname + "</span>");
                pagedata += ("</li>");
            }
            $("#mytask").prepend(pagedata);
//            moreTask(now_ID);
        },
        error: function(err){
            console.log(JSON.stringify(err));
        }
    });
}

//more_task
function moreTask(now_ID) {
	//获取任务
    var pagedata = '';
    $.ajax({
    	url: 'http://10.12.97.30:8006/giksp/knowledge/approval/approval-statistics!getNeededApprovalKnowledgesfortask.action?userid='+now_ID,
        type: 'GET',
        dataType: 'jsonp',
        jsonp:"callback",
        success: function (data) {
    	    if (data =="null"){

            } else{
            	if (data.length > 0) {
                    for (var i=0; i<data.length; i++) {
                        pagedata += ("<li><span style='width:50%' class=\"creator\"><a onclick='openIe(\"" + data[i].kid + "\", \"" + now_ID + "\")'>" + (data[i].knowledgename.length > 10 ? data[i].knowledgename.substring(0, 10) + "..." : data[i].knowledgename))+"</a></span>";
                        pagedata += ("<span style='width:45%' class=\"subject\">" + data[i].taskname + "</span>");
                        pagedata += ("</li>");
                    }
                    $("#mytask").prepend(pagedata);
                }
            }
        },
        error: function(err){
            console.log(JSON.stringify(err));
        }
    });
    interface_getTask_info(now_ID);
}

function more_OTask(now_ID) {
	var pagedata = '';
	$.ajax({
		type : 'post',
		url : '/toolsController/upAndApprove',
		data: {
			'approve' : "上传审批"
        },
		success : function(data) {
			$.each(data.list,function(i){
				pagedata += ("<li><span style='width:50%' class='creator'><a code='modules/tool/tool' onclick='chang_menu(this)'>" + data.list[i].fileName +"</a></span>");
                pagedata += ("<span style='width:45%' class=\"subject\">" + "工具上传审批" + "</span>");
                pagedata += ("</li>");
			});
			$("#mytask").prepend(pagedata);
		},
		error : function(err) {
			console.log(err);
		}
	});
	more_TTask(now_ID);
}

function more_TTask(now_ID) {
	var pagedata = '';
	$.ajax({
		type : 'post',
		url : '/toolsController/datablelist',
		data: {
			'daname' : "下载审批"
        },
		success : function(data) {
			var loginUId = data.loginUId;
			$.each(data.list,function(i){
				pagedata += ("<li><span style='width:50%' class='creator'><a code='modules/tool/tool' onclick='chang_menu(this)'>" + data.list[i].daname +"</a></span>");
				pagedata += ("<span style='width:45%' class=\"subject\">" + "工具下载审批" + "</span>");
				pagedata += ("</li>");
			});
			$("#mytask").prepend(pagedata);
		},
		error : function(err) {
			console.log(err);
		}
	});
    moreTask(now_ID);
}

function openIe(kid, userId) {
	JSInteraction.openIe("http://10.12.97.30:8006/giksp/ui!clientsearch.action?kid="+kid+"&kname=&j_username="+userId+"&flag=client");

}

function getTaskInfo(ddTaskId) {
    var this_ = $('.menu > ul > li[click=contacts]');
    $(".menu > ul > li").removeClass();
    $.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href': 'modules/task/mytaskinfo'},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            $('#main-content').html("").html(result);
            // alert(ddTaskId);
            query_task_info(ddTaskId)
        },
        error: function(err) {
            alert("加载出错！");
        }
    });
}