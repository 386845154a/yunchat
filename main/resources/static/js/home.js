

$(function () {
    // 激活文字提示
    $("[data-toggle='tooltip']").tooltip();
	// 
	$(".user_msg").hover(function(){
		$(".user_msg_content").show();
	},function(){
		$(".user_msg_content").hide();
	});
    // 加载主页
    chang_menu($('#home'));

    // 加载活动
    getActivity();
    //禁止复制
//    no_ctrlC();

     // ReportDlg();
	//判断是否提示年报
    // ReportDlg();
	isReport();
	// 判断是否有赏金
	// isMoney();
    WelcomeDlg();
});

//禁止复制
function no_ctrlC() {
	document.addEventListener('keydown', function(e){
		 e = window.event || e;
         var keycode = e.keyCode || e.which;     
         if(e.ctrlKey && keycode == 87){   //屏蔽Ctrl+w  
            e.preventDefault();
            window.event.returnValue = false;  
         }
	 
         if(e.ctrlKey && keycode == 82){   //Ctrl + R 
	        e.preventDefault(); 
	        window.event.returnValue= false; 
	     }                   
	     if(e.ctrlKey && keycode== 83){ //Ctrl + S  
	            e.preventDefault();
	            window.event.returnValue= false;     
	         }
	 
	         if(e.ctrlKey && keycode == 72){   //Ctrl + H 
	        e.preventDefault();
	        window.event.returnValue= false; 
	     }
	     if(e.ctrlKey && keycode == 74){   //Ctrl + J
	        e.preventDefault(); 
	        window.event.returnValue= false; 
	     }
	     if(e.ctrlKey && keycode == 75){   //Ctrl + K 
	        e.preventDefault();
	        window.event.returnValue= false; 
	     }
	     if(e.ctrlKey && keycode == 78){   //Ctrl + N
	        e.preventDefault();
	        window.event.returnValue= false; 
	     }        
	     if(e.ctrlKey && keycode == 67){   //Ctrl + c
	    	 e.preventDefault();
	    	 window.event.returnValue= false; 
	     }        
	});
}

//用户信息修改弹窗
function updata_userInfo() {
//	$("#call_phone").val("");
//	 $("#work_room").val("");
	$('#updata_userInfo').show();
	$("#updata_userInfo").modal();
	$('div.modal-backdrop.fade.in').show();
}

//提交用户修改信息
function upUserInfo() {
	if (!$("#call_phone").val()) {
		JqdeBox.message('error', '电话不能为空！');
		return false;
	} else if (!$("#work_room").val()) {
		JqdeBox.message('error', '办公室不能为空！');
		return false;
	} else {
		AjaxMethod.ajax('homeController/updataUserInfo', {
			'phone' : $("#call_phone").val(),
			'roomid' : $("#work_room").val()
		}).then(function (result){
			if (result){
				JqdeBox.message('success', '修改成功！！');
				$('#updata_userInfo').hide();
				$('div.modal-backdrop.fade.in').hide();
				loadUserInfo();
			}
		});
	}
}

//头像上传
function up_head_img(this_) {
	var files = $(this_)[0].files;
	if (files.length < 1){
		return false;
	} else if (files.length > 1) {
		JqdeBox.message('error', '不能选中多张图片！');
		return false;
	}
	for (var i = 0 ; i < files.length; i++){
		var file = files[i];
		var maxSize = 500*1024;
		var img_type = file.name.split(".")[1];
		if (file.size > maxSize){
			alert('您上传的文件：' + file.name + '大小超过500KB，不能上传！');
			continue;
		} else if (img_type == "jpg" || img_type == "JPG" || img_type == "Jpg" || img_type == "jPg" || img_type == "jpG") {
			// 生成一个fileId
			var timestamp = new Date().getTime();// 精确到毫秒的时间戳
			var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id
			// 开始上传
			var formData = new FormData();
			formData.append("fileId", file_id);
			formData.append("file", file);
			formData.append("up_path", "D:/toolsupload");
		    $.ajax({
		        type : 'post',
		        url : '/userHeadController/uploadHead',
		        data: formData,
		        processData: false,
		        contentType: false,
		        async : false,
		        success : function(data) {
	                $('#userImg_l').attr("src", "/userHeadController/showHead?path="+data +　"&t_="+Math.random());
	                $('#userImg_r').attr("src", "/userHeadController/showHead?path="+data +　"&t_="+Math.random());
		        },
		        error : function(err) {
		            console.log(err);
		        }
		    });
		} else {
			alert('请选择JPG格式图片上传！');
			continue;
		}
	}
	// 清空上传文件框，使其可以重复上传相同文件
	$(this_).val("");
}

//切换在线状态
function changeOnLine(isOnline) {
//	var isOnline = $("#selectOnline").val();
	if (isOnline == "online") {
		$("#selectOnline").html("在线");
	} else if (isOnline == "unline") {
		$("#selectOnline").html("离线");
	}
}

//未读系统通知条数
function getSysTotalmsg() {
	AjaxMethod.ajax('sysController/qSysMsg').then(function (result){
		$("#sysCount").html(result.count);
	});
}

//个人信息、版本信息弹框
function setModeDialog(flag) {
	var title_ = "";
	var url_ = "";
	if (flag == 1) {
		title_ = "版本信息";
		url_ = '/js/set/version.html';
	} else if(flag == 2){
		title_ = "个人信息";
		url_ = "/js/set/userinfo.html";
	}
    // else if(flag == 3){
    //     title_ = "使用说明";
    //     url_ = "/js/office/web/viewer.html";
    // }
	//版本信息、个人信息弹窗
	DevBox.dialogNoCancel({
    	title: title_,
        url: url_,
        init: function () {
        	loadUserInfo();
        },
        confirm : function() { // 确认事件
			return true;
		},
        confirm_btn: "关闭"
    });
}

//加载个人信息
function loadUserInfo() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_Id = result.Id;
	    $.ajax({
	        type : 'post',
	        url : '/homeController/queryUserInfo',
	        data: {
	        	'userId' : now_Id
	        },
	        async : false,
	        success : function(data) {
	        	$('#phone').html(data.phone || '无');
				$('#roomid').html(data.roomid || '无');
				$('#name').html(data.fullname || '无');
				$('#orgName').html(data.orgName || '无');
				$("#call_phone").val(data.phone);
				$("#work_room").val(data.roomid);
				getHeadPath("second");
	        },
	        error : function(err) {
	            console.log(err);
	        }
	    });
	});
}

//顶部跨库搜索
function indexSearch() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var cardId = result.Id;
		var query_input_val = $("#kw_").val();
		JSInteraction.opense(encodeURIComponent(query_input_val), cardId);
	});
}

//获取本人头像
function getHeadPath(flag) {
	AjaxMethod.ajax('userHeadController/queryHead', {'userID' : 'my'}).then(function (result){
		if (result) {
			if (result.loginUserLevel == "秘密" || result.loginUserLevel == "机密") {
				$("#loginUserLevel").html(result.loginUserLevel == "秘密" ? "一般" : "重要");
			} else {
				$("#loginUserLevel").html(result.loginUserLevel);
			}
           var head = result.head;
           if (head != null) {
        	   if (flag == "first") {
        		   $('#userphoto').html('<img id="userImg_l" style="width:85px; height: 84px;" src="/userHeadController/showHead?path='+head.head+'&t_=1">');
        	   } else {
                   $('#setHead').html('<img id="userImg_r" style="width:85px; height: 84px;" src="/userHeadController/showHead?path='+head.head+'&t_=1">');
               }
           }
        }
	});
}

//获取更新版本号
function getUpdataVersion () {
	try {
		$.ajax({
			type : 'post',
			url : '/configController/getVersionVal',
			dataType : 'JSON',
			data : {
				'configName' : 'version'
			},
			async: false,
			success : function(result) {
				var oleVersion = JSInteraction.getVersion();	//客户端版本
				var myVsersion = result.model.configValue+"";	//服务器版本
				if (oleVersion < "10109") {
				  JqdeBox.confirm('云雀系统更新，请点击确认，下载安装新版本，下载完成后请关闭客户端，安装完成后请重启软件', function (result){
				      if (result){
				    	  $.toolsDownByPath("/updataIwork/云雀.exe", "云雀.exe");
				      }
				  });
				}
				if (oleVersion < myVsersion && oleVersion > "10109") {
		            JqdeBox.confirm('<h1 style="text-align: center">版本更新</h1>1.增加下载文件路径记录功能<br>2.增加研究室工具下载审批功能<br>3.修复显示BUG<br><span style="float: right">2019年2月20日</span>', function (result){
		                if (result){
		                    JSInteraction.setVersion(myVsersion);
		                    //读取版本更新地址并更新
		                    getUpdataAddress();
		                }
		            });
					// alert("\t版本更新\t\n1.增加下载文件路径记录功能\n2.增加研究室工具下载审批功能\n3.修复显示BUG\n\t2019年2月20日\t\n");

				}
			},	
			error : function() {
			}
		});
	} catch (e) {
//	  JqdeBox.confirm('云雀系统更新，请点击确认，下载安装新版本，下载完成后请关闭客户端，安装完成后请重启软件', function (result){
//	      if (result){
//	    	  $.toolsDownByPath("/updataIwork/云雀.exe", "云雀.exe");
//	      }
//	  });
	}
	
}

//读取版本更新地址并更新
function getUpdataAddress() {
//    $.ajax({
//        type : 'post',
//        url : '/fileBaseController/uploadFile',
//        async : false,
//        success : function(data) {
            JSInteraction.systemUpdate("http://10.12.97.30:8083/云雀.exe");
//        },
//        error : function(err) {
//            console.log(err);
//        }
//    });
}

//input元素回车事件绑定，参数：$("#" + id_)对象，function名称
function curElementFunc(o_, fun_) {
    o_.bind('keyup', function(e) {
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            eval(fun_ + "()");
        }
    });
}

//获取常用链接并显示
function commonly_links(){
    var links_list = "";
//    var commonly_links_json = JSInteraction.getshowlinks();
//    commonly_links_json = $.parseJSON(commonly_links_json);
    var commonly_links_json = [
          {"Name":"PDM", "Href":"https://jit-external.yfb.ii.com/ErbuPDM"},
          {"Name":"TDM", "Href":"https://jit-external.yfb.ii.com/TDM"},
          {"Name":"OA", "Href":"https://jit.yfb.ii.com/erbuoa"},                     
          {"Name":"NAS", "Href":"https://jit-external.yfb.ii.com/nas"},
          {"Name":"邮件", "Href":"http://10.11.16.2/secmail/key/i_to_login.jsp"},                     
          {"Name":"会议", "Href":"https://jit-external.yfb.ii.com/meeting"}                     
    ];
    for (var i = 0 ; i < commonly_links_json.length; i++){
		links_list += '	<a onclick="openlinks(\'' + commonly_links_json[i].Href + '\')" target="_blank"><li class="f_left" style="margin-left:10px;" >';
		if (commonly_links_json[i].Name == "OA") {
			links_list += '	<img src="/img/OA.png" width="55" height="47"/>';
		} else if (commonly_links_json[i].Name == "TDM") {
			links_list += '	<img src="/img/TDM.png" width="55" height="47"/>';
		} else if (commonly_links_json[i].Name == "PDM") {
			links_list += '	<img src="/img/PDM.png" width="55" height="47"/>';
		}  else if (commonly_links_json[i].Name == "NAS") {
			links_list += '	<img src="/img/NA.png" width="55" height="47"/>';
		}  else if (commonly_links_json[i].Name == "邮件") {
			links_list += '	<img src="/img/邮件.png" width="55" height="47"/>';
		}  else if (commonly_links_json[i].Name == "会议") {
			links_list += '	<img src="/img/meeting.png" width="55" height="47"/>';
		} else {
			links_list += '	<img src="/img/IE.png" width="55" height="47"/>';
		}
		links_list += '	<span class="subject">' + commonly_links_json[i].Name+'</span>';
		links_list += '	</li></a>';
    }
   // links_list += '	<img src="/img/加号.png" width="55" height="47" style="margin-left:16px; margin-top:8px;" onclick="linksWindows()"/>';
   links_list += '	<img src="/img/加号.png" width="55" height="47" style="margin-left:16px; margin-top:8px;" onclick="openLinks_Chrome()"/>';
    links_list += '	<span class="subject">MPM</span>';
    $("#commonly_used_links_list").html(links_list);
}

//常用链接弹窗
function linksWindows() {
    var links_list = "";
    var commonly_links_json = JSInteraction.getalllinks();
    commonly_links_json = $.parseJSON(commonly_links_json);
    links_list += '	<ul class="links">';
    for (var i = 0 ; i < commonly_links_json.length; i++){
        links_list += '	<li>';
        links_list += '	<a onclick="openlinks(\'' + commonly_links_json[i].Href + '\')"><img src="/img/IE.png" width="55" height="47"/></a>';
        links_list += '	<a onclick="addlinks(\'' + commonly_links_json[i].Name + '\')"><span>' + commonly_links_json[i].Name +'</span></a>';
        links_list += '	</li>';
    }
    links_list += '	</ul>';
    //打开链接弹窗
    DevBox.dialogNoCancel({
        title: '常用链接',
        message: links_list,
        init: function () {
        },
        confirm : function() { // 确认事件
            return true;
        },
        noconfirm: true,
        confirm_btn: "关闭"
    });
}

//更新最新链接
function addlinks(name) {
    //选择链接
    common_tools_json = JSInteraction.setlastest(name);
    //刷新链接参数
    commonly_links();
}

//打开链接
function openlinks(path) {
    //打开链接
    JSInteraction.openIe(path);
    saveLog("openLink", "打开常用链接！");
}
//使用Chrome打开链接
function openLinks_Chrome(path)
{
	window.open(path);
}

//获取常用工具并显示
function common_tools() {
    var tool_list = "";
    var common_tools_json = JSInteraction.loadlastesttools();
    common_tools_json = $.parseJSON(common_tools_json);
    var count = common_tools_json.length - 8;
    for (var i = 0 ; i < common_tools_json.length; i++){
        if (i >= count) {
            var imgPath = "/imgPath/" + common_tools_json[i].PicName+ ".png";
            var path = common_tools_json[i].Path.replace(/\\/g,'\\\\');
            tool_list += '	<li class="f_left" style="margin-left:10px; cursor: pointer;" onclick="openTools(\'' + path + '\', \'' + common_tools_json[i].Name + '\')" style="cursor: pointer;">';
            tool_list += '	<img src="/userHeadController/showHead?path='+imgPath+'" width="55" height="47"/>';
            tool_list += '	<span class="subject"><a>' + common_tools_json[i].Name+'</a></span>';
            tool_list += '	</li>';
            $("#common_tools_list").html(tool_list);
        }
    }
}

//打开工具
function openTools(path, tools_name){
    saveLog("userMyTool", "使用了工具"+tools_name);
    JSInteraction.openFile(path);
    // sendIntegral("1", "qiushi", "tool_2", "");
}

//选择菜单
function chang_menu(this_, callBackFun) {
    // $(".menu > ul > li").removeClass();
    // $(this_).addClass("active");
    // $.ajax({
    //     type: "GET",
    //     url: 'loadPath',
    //     data: {'href': $(this_).attr("code")},
    //     dataType: 'html',
    //     cache: false,
    //     async: false,
    //     success: function(result) {
    //         $('#main-content').html("").html(result);
    //         //获取更新版本号
    //         getUpdataVersion();
    //         //获取本人头像
    //         getHeadPath("first");
    //         //未读系统通知条数
    //         getSysTotalmsg();
    //     },
    //     error: function(err) {
    //         alert("加载出错！");
    //     }
    // });
    //
}

//获取搜索的值
function query(){
    var query = $("#query").val();
    JSInteraction.opense(query,'1');
}

//查看当天日程
function schedule_today(){
    AjaxMethod.ajax('calendarController/querytoday', {}).then(function (result){
        if(result.objectList.length > 0) {
            // Cookie设置关闭浏览器失效
            if (getCookie('event')) {
                return false;
            }
            document.cookie="event=日程";
            $.ajax({
                type: "GET",
                url: 'loadPath',
                data: {'href':'modules/calendar/schedule'},
                dataType: 'html',
                cache: false,
                async: false,
                success: function(result) {
                    DevBox.dialogNoCancel({
                        title: '日程事件',
                        width:'90%',
                        message: result,
                        init: function () {
                            $("#notification_div").hide();
                            $("#eventTip").show();
                        }
                    });
                }
            });
        }
    });
}

//系统版本信息
function sys_info() {
    window.open('/indexController/sysInfo', 'newwindow', 'height=500,width=300,top=200,left=700');
}

//显示提示
function xianshi(info) {
    if (info == "联系人") {
        $("#bcd").html(info);
        document.getElementById("bcd").style.display="block";
    } else {
        $("#abc").html(info);
        document.getElementById("abc").style.display="block";
    }
}

//隐藏提示
function yincang(info) {
    if (info == "联系人") {
        document.getElementById("bcd").style.display="none";
    } else {
        document.getElementById("abc").style.display="none";
    }
}

// 查看公告详情
function look_info(title, context, fileName, path) {
	saveLog("lookAffiche", "查看公告");
    var url = "/indexController/afficheInfo?fileName="+encodeURIComponent(fileName)+"&path="+path+"&title="+encodeURIComponent(title)+"&context="+context;
    $.ajax({
        type: "GET",
        url: url,
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            DevBox.dialogNoCancel({
                title: '公告详情',
                width:'90%',
                message: result,
                init: function () {},
                confirm : function() {
                	location.reload();
                	return true;
                },
                confirm_btn: "关闭"
            });
        }
    });
}

// 删除最近联系人
function delLastContacts(link_id, type) {
    AjaxMethod.ajax('homeController/delLink', {
        'link_id' : link_id,
        'type' : type
    }).then(function (result){
        JqdeBox.message('success', '删除成功');
        fetchData(1);
    });
}

/**
 * 查询cookie
 * @param name
 */
function getCookie(name) {
    // debugger;
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}
/**
 * web服务器状态
 */
var status = true;
function checkServerStatus() {
    $.ajax({
        type: 'post',
        url: '/homeController/loginUserInfo',
        async:false,
        success: function (result) {
        		changeOnLine("online");
//            JSInteraction.isonline(1);
        },
        error: function(e) {
            status = false;
            	changeOnLine("unline");
//            JSInteraction.isonline(0);
        }
    });
    setTimeout(function () {
        if (status) {
            checkServerStatus();
        }
    }, 1000);
}

checkServerStatus();

//8分钟调用
var eightFlag = true;
function eightTime() {
    $.ajax({
        type: 'post',
        url: '/homeController/eightTime',
        async:false,
        success: function (result) {
        	
        },
        error: function(e) {
        	eightFlag = false;
        }
    });
    setTimeout(function () {
        if (eightFlag) {
        	eightTime();
        }
    }, 480000);
}

eightTime();

//积分传递
function sendIntegral(sourceScore, sourceType, sourceDetail, other) {
	// if (other) {
	// 	IS_tool(sourceScore, sourceType, sourceDetail, other);
	// } else {
	// 	IS_NOT_tool(sourceScore, sourceType, sourceDetail);
	// }
} 

//非工具
function IS_NOT_tool(sourceScore, sourceType, sourceDetail) {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		$.ajax({
		  url: 'http://10.12.97.30:8080/newnewcosim-master_war/coin/add.ht?uid='+result.Id+'&sourceScore='+sourceScore+'&sourceType='+sourceType+'&sourceDetail='+sourceDetail+'&updTime=0',
		  type: 'GET',
		  dataType: 'jsonp',
		  jsonp:"callback",
		  success: function (data) {
			  JqdeBox.message('success', data.result);
		  },
		  error: function(err){
		  }
		});
	});
}

//工具
function IS_tool(sourceScore, sourceType, sourceDetail, tools_id) {
	var toolSender = getSend_Info(tools_id);
	var length = pl_length(tools_id);
	if (sourceScore == "3" && length <= 1) {
		// sendIntegral("1", "qiushi", "tool_3", "");
		$.ajax({
			url: 'http://10.12.97.30:8080/newnewcosim-master_war/coin/add.ht?uid='+toolSender+'&sourceScore='+sourceScore+'&sourceType='+sourceType+'&sourceDetail='+sourceDetail+'&updTime=0',
			type: 'GET',
			dataType: 'jsonp',
			jsonp:"callback",
			success: function (data) {
				JqdeBox.message('success', data.result);
			},
			error: function(err){
			}
		});
	} else {
		$.ajax({
			url: 'http://10.12.97.30:8080/newnewcosim-master_war/coin/add.ht?uid='+toolSender+'&sourceScore='+sourceScore+'&sourceType='+sourceType+'&sourceDetail='+sourceDetail+'&updTime=0',
			type: 'GET',
			dataType: 'jsonp',
			jsonp:"callback",
			success: function (data) {
				JqdeBox.message('success', data.result);
			},
			error: function(err){
			}
		});
	}
}

//获取工具发布者
function getSend_Info(tools_id) {
	var send_info = "";
	$.ajax({
		type : 'post',
		url : '/toolsController/getToolById',
		data: {
			'toolId' : tools_id
        },
		async : false,
		success : function(data) {
			send_info = data.sender;
		},
		error : function(err) {
			console.log(err);
		}
	});
	return send_info;
}

//获取工具发布者
function pl_length(tools_id) {
	var length = "";
	$.ajax({
		type : 'post',
		url : '/toolsController/myPLCount',
		data: {
			'toolId' : tools_id
        },
		async : false,
		success : function(data) {
			length = data;
		},
		error : function(err) {
			console.log(err);
		}
	});
	return length;
}

//导航跳转系统消息
function go_sysInfo(this_) {
	chang_menu(this_);
	system_noti_page();
}

//加载活动
function getActivity() {

}

function isReport() {
    // 判断用户是否生成过年报
    $.ajax({
        type : 'post',
        url : '/flagController/getFlagByUserId',
        dataType: "JSON",
        // async : false,
        success : function(data) {
            if (data.report == "0" || data.report == "4")
            {
                //未生成 1生成
                //默认值 0退出
            } else if (data.report == "1"){
                showyanhua();
                ReportDlg();
			} else if(data.report == "2")
			{
				$("#myreport").show();
			}
        },
        error : function(err) {
            console.log(err);
        }
    });
}

function isMoney() {
    // 判断用户是否有赏金
    $.ajax({
        type : 'post',
        url : '/moneyRewardController/getMyNoRead',
        dataType: "JSON",
        async : true,
        success : function(data) {
            if(data.length>0)
            {
                var amount = 0;
                for(var i=0;i<data.length;i++)
                {
                    //   显示赏金页面
                    amount = parseFloat(data[i].money)+amount;
                    // alert("123");
                }
                MoneyDlg(amount);
            }
            // if (data.report == "0" || data.report == "4")
            // {
            //     //未生成 1生成
            //     //默认值 0退出
            // } else if (data.report == "1"){
            //     ReportDlg();
            // } else if(data.report == "2")
            // {
            //     $("#myreport").show();
            // }
        },
        error : function(err) {
            console.log(err);
        }
    });
}

//获取我的年报
function getReport() {
//弹出显示pdf文件
    Reportdh();
    $.ajax({
        type : 'post',
        url : '/ReportController/getReport',
        dataType: "json",
        // async : false,
        success : function(data) {
            if (data.success == "success")
            {
                $(this).parent().fadeOut();$(".opacity").fadeOut();
                $(".windows").css("display","none");
                DevBox.hideAll();
                window.open("/upDownLoadController/readFile?path=/Report/"+data.userid+".pdf","我的年报");
                //更新FLAG状态为已生成
                changeReportFlag("2");
            }else if (data.success == "error"){
                alert("报告生成失败，程序员小哥正在赶来，稍后请重试！！！");
                $(this).parent().fadeOut();$(".opacity").fadeOut();
                $(".windows").css("display","none");
                DevBox.hideAll();
            }
        },
        error : function(err) {
            console.log(err);
        }
    });
}

function changeReportFlag(reportF) {
    var title = "我的年报"
    $.ajax({
        type: "post",
        url: '/flagController/updateFlagByUserId',
        data: {'report':reportF},
        async: false,
        success: function(result) {
        	if (result.success) {
        		JqdeBox.message('success', "年报已生成！");
        	} else {
        		JqdeBox.message('success', "年报生成失败！");
        	}
        }
    });
}


function Reportdh() {
    var title = "我的年报"
    $.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href':'modules/report/report'},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            DevBox.dialogNoCancel({
                // title: title,
                width:'90%',
                message: result,
                init: function () {
                     // getReport();
                     $(".modal-footer").hide();
                     $(".modal-header").hide();
                },
                confirm : function() {

                },
                confirm_btn: "确认"
            });
        }
    });
}

//年报页面
function ReportDlg() {
  $(".windows").fadeIn();
  $(".opacity").fadeIn();
  $(".close-zz").click(function(){
     $(this).parent().fadeOut();$(".opacity").fadeOut();
     $(".windows").css("display","none");
  })
}

//赏金页面
function MoneyDlg(amount) {
    $(".shangjin").fadeIn();
    $(".opacity").fadeIn();//遮罩
    // alert(amount);
    $("#amount").html(amount);
    $(".shangjin-zz").click(function(){
        $(this).parent().fadeOut();$(".opacity").fadeOut();
        $(".windows").css("display","none");
        //更新赏金显示状态
        AjaxMethod.ajax('moneyRewardController//updateMyRead', {}).then(function (result){

        });
    })
}

//欢迎页面
function WelcomeDlg() {
	$.ajax({
		type : 'post',
		url : '/configController/getVersionVal',
		dataType : 'JSON',
		data : {
			'configName' : 'wh'
		},
		async: false,
		success : function(result) {
			if(result.isIn){
		        if (getCookie('welcome')) {
		            return false;
		        }else{
		            document.cookie="welcome=欢迎";
		            $(".welcome").fadeIn();
		            $(".opacity").fadeIn();//遮罩
		            // alert(amount);
		            $(".welcome-zz").click(function(){
		                $(this).parent().fadeOut();$(".opacity").fadeOut();
		                $(".welcome").css("display","none");
		                //更新赏金显示状态
		                // AjaxMethod.ajax('moneyRewardController//updateMyRead', {}).then(function (result){
		                //
		                // });
		            })
		        }
		    }
		},	
		error : function() {
		}
	});
}

//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function openMyReport() {
    AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
        var now_Id = result.Id;
        window.open("/upDownLoadController/readFile?path=/Report/"+now_Id+".pdf","我的年报");
    });

}

//我的赏金
function openMygold(page) {

	$.ajax({
        type: "post",
        url: '/moneyRewardController/gotMygold',
    	async: false,
    	data:{
    		'page' : page
    	},
        success: function(result) {
            $(this).parent().fadeOut();$(".opacity").fadeOut();
            $(".windows").css("display","none");
            $(".shangjin").css("display","none");
            DevBox.hideAll();
            // //更新赏金显示状态
            AjaxMethod.ajax('moneyRewardController//updateMyRead', {}).then(function (result){

            });
        	console.log(JSON.stringify(result.totalPage))
        	if (page <= result.totalPage) {
        		var htmlList = '<div style="overflow-x: hidden; height: 480px;"><table id="dynamic-table" class="table table-striped table-bordered table-hover" style="width: 100%;">';
        		htmlList +='<tr>';
        		// htmlList +='<th class="center bg">姓名</th>';
        		htmlList +='<th class="center bg">项目</th>';
        		htmlList +='<th class="center bg">金额</th>';
        		htmlList +='<th class="center bg">时间</th>';
        		// htmlList +='<th class="center bg">是否已读</th>';
        		htmlList +='</tr>';
        		for (var i in result.objectList) {
        			htmlList +='<tr>';
        			// htmlList +='<th class="goldVal">'+result.objectList[i].collectname+'</th>';
        			htmlList +='<th class="goldVal">'+result.objectList[i].projectc+'</th>';
        			htmlList +='<th class="center goldVal">'+result.objectList[i].money+'</th>';
        			htmlList +='<th class="center goldVal">'+changeDate(result.objectList[i].collecttime)+'</th>';
        			// htmlList +='<th class="center goldVal">'+(result.objectList[i].isread == "1" ? "已读" : "未读")+'</th>';
        			htmlList +='</tr>';
        		}
        		htmlList +='</table><div style="float:right;">'
        			htmlList +='<input type="text" id="pageVal" value="1" style="width: 30px; text-align: center; height: 30px; position: relative; top: 2px; right: 10px;" />'
        				htmlList +='<input type="button" class="btn btn-success" value="GO" onclick="changePage()" />'
        					htmlList +='</div></div>';
        		
        		//打开链接弹窗
        		DevBox.dialogNoCancel({
        			title: '预先承诺',
        			message: htmlList,
        			init: function () {
        			},
        			confirm : function() { // 确认事件
        				return true;
        			},
        			noconfirm: true,
        			confirm_btn: "关闭"
        		});
        	} else {
        		openMygold(1);
        	}
        }
    });
	
}

function changePage() {
	DevBox.hideAll();
	openMygold($("#pageVal").val());
}

//时间格式转换
function changeDate (date_str){
	if(isNaN(date_str))
	{
		return date_str;
	}
    var date = new Date(date_str);
    var year = date.getFullYear();
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + '/' + month + '/' + day + '&nbsp;' + hour + ':' + (minute < 10 ? "0" + minute : minute) + ':' + second;
}

function shuoMing(name, path) {
	$.downloadForOpen(path, name);
}