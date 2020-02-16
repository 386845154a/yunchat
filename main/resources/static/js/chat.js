var socket = null;
var not_read = {};//未读消息{'发消息的人'，‘消息数量’}
//var permission = '';//权限字段
var cishu = 2;

$(function (){
    // Cookie设置关闭浏览器失效、判断用户是否登录
    // if (getCookie('nodeLoginStatus')) {
    //     return false;
    // }
    AjaxMethod.ajax('indexController/soceketConfig').then(function (result){
        var socketService = result.socketService;
        token = result.token;
        startSocketLinter(socketService);
    });
});

// socket监听服务
function startSocketLinter(service){
    if (!service){
        JqdeBox.alert("系统出错，请重新登录!", function (){
            window.location.href = "logout";
        });
        return false;
    }
    socket = io.connect(service);//'http://192.168.1.103:8888'
    //var cookice = toJson(document.cookie);
    //token = cookice.token;
    //permission = cookice.permission;

    if (!token){
        JqdeBox.alert("登录超时！", function (){
            window.location.href = "logout";
        });
    }

    //socket连接事件
    socket.on('connect', function () {
        socket.emit('conn', socket.id, token);
        //document.cookie="nodeLoginStatus=success";
        //JqdeBox.message('success', '登录成功');
    });
    //接收消息(消息来源,消息内容)
    socket.on('receiver-msg',function(fromId, msg, chatType){
    	//发送提示消息
    	JSInteraction.showmessage("您有新消息,请注意查看！");
        //当前聊天页面是否为消息接收者
        var receiverUser = $('#chat-user-id').val();//当前聊天界面
        if (receiverUser == fromId){
            //追加内容
            join_msg(false, msg.send_time, msg.userName, msg.msg, msg.msg_type,msg.msg_id, msg.msg_sender, msg.levels);
            //消息标记为已读
            readMsg(msg.msg_id, msg.msg_sender, $('#chat-type').val());
        }else {
            // 右下角消息提醒或右上角提示
            receiveMsg(msg, chatType);
        }
    });
    //离线
    socket.on('log-overtime',function(data){
        JqdeBox.alert(data, function (){
            window.location.href = "indexController/logout";
        });
    });
    //系统消息
    socket.on('system-notification',function(msg){
        var receiverUser = $('#chat-user-id').val();//当前聊天界面
        if (receiverUser == '-1'){
            var noti_html = join_system_noti(msg.title, msg.type, msg.content, new Date());
            $("#system_noti_list").prepend(noti_html);
        }
    });
    //发送系统消息给指定人员
    socket.on('system-touser',function(msg){
        var receiverUser = $('#chat-user-id').val();//当前聊天界面
        if (receiverUser == '-1'){
            var noti_html = join_system_noti(msg.userId, msg.receiverUserId, msg.content, msg.chatType, new Date());
            $("#container-div").prepend(noti_html);
        }
    });
    //转码信息
    socket.on('conver-info',function(msg){
        console.log(msg);
    });

}


//发送消息按钮调用方法
function sendMsg(){
    // debugger;
    var receiverUser = $('#chat-user-id').val();//消息接收人id
    if (!receiverUser) {
        alert('请选择接收消息的用户或者组');
        return false;
    }
    var bottomLevel = $("input[name='bottomLevel']:checked").val();//信息密级
    var msg = CKEDITOR.instances.msgcontent.getData();
    // alert(msg);
    //
    // var kindVal = kindEditor.html();
    // if (kindEditor.html() && kindEditor.html().indexOf('img') == -1) {
		// kindVal=kindVal.replace(/<\/?.+?>/g,"");
		// kindVal=kindVal.replace(/ /g,"");//去掉html标签的内容
		// kindVal=kindVal.replace(/\t+/g,"");//\t
		// kindVal=kindVal.replace(/\ +/g,"");//去掉空格
		// kindVal=kindVal.replace(/[ ]/g,"");//去掉空格
		// kindVal=kindVal.replace(/[\r\n]/g,"");//去掉回车换行
		// if (!kindVal) {
		// 	kindEditor.html("");
		// }
    // }
    // var msg = kindEditor.html();
//    if (msg.substr(0, 3) == "回复-") {
//        var split_msg = msg.split("-")[1];
//        split_msg = split_msg.split(":")[0];
//        split_msg = "-" + split_msg;
//        msg = msg.replace(split_msg, "");
//        var reid = $("#reId").val();
//        var sender_id = $("#sender_id").val();
//        AjaxMethod.ajax('homeController/addReMsg', {
//            'remsg': msg,
//            'pid': reid,
//            'msgReceiver': sender_id
//        }).then(function (result){ });
//        head_Person(reid, msg);
//        $('#msgPre').html("");
//        return false;
//    }
    if (!msg || msg.trim() == ''){
        return;
    }
    if (msg.length > 1000){
        msg.substring(0, 1000);
        alert('消息内容不能超过1000字节!');
        return;
    }
    //清空输入
    //追加内容(ajax敏感词过滤)
    AjaxMethod.ajaxTextType('homeController/filterSensitiveWord', {'msg' : msg}).then(function (result){
        join_msg(true, new Date(), '', result, 'text', '', '', bottomLevel);
    });
    $("#chat-content").scrollTop($("#chat-content")[0].scrollHeight);
    //发送消息
    send_msg(msg, receiverUser, $('#chat-type').val(), bottomLevel);
    //如果显示的是最近联系人列表，将聊天对象移动到顶部
    update_lately(receiverUser, $('#chat-user-name').html(), $('#chat-type').val());

// <span class="atwho-inserted" contenteditable="false" data-atwho-at-query="@"><span data-id="2">@王锴</span></span>
    var receiverId = $('#at_user').val();
    if(receiverId !=null){
        AjaxMethod.ajaxTextType('homeController/addAtUser', {'groupId' : receiverUser,'receiverId':receiverId}).then(function (result){

        });
    }


    CKEDITOR.instances.msgcontent.setData('',function() {
        CKEDITOR.instances.msgcontent.document.$.body.onkeydown = function(e) {
            // console.log(e.keyCode); //可以用来监测你的按键
            if (e.keyCode == 13){
                sendMsg(2);
            }
        };
        load_atwho(editor, at_config);
    });
}

// function getCaption(obj){
//     var index=obj.lastIndexOf("userid=\"");
//     obj=obj.substring(index+1,obj.length);
// //  console.log(obj);
//     return obj;
// }
// var str=" 执法办案流程-立案审批";
// getCaption(str);

function load_atwho(editor, at_config) {

    // WYSIWYG mode when switching from source mode
    if (editor.mode != 'source') {

        editor.document.getBody().$.contentEditable = true;

        $(editor.document.getBody().$)
            .atwho('setIframe', editor.window.getFrame().$)
            .atwho(at_config);

    }
    // Source mode when switching from WYSIWYG
    else {
        $(editor.container.$).find(".cke_source").atwho(at_config);
    }

}

//头像指定人员
function head_Person(reid, msg) {
    AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
        if (result) {
            getHead_Path(result.Id, reid, msg); //获取头像路径
        }
    });
}

//获取头像路径
function getHead_Path(userID, reid, msg) {
    AjaxMethod.ajax('userHeadController/queryHead', {'userID' : userID}).then(function (result){
        if (result) {
            var head = result.head;
            var img_style = "border-radius: 40px; width: 25px; height: 25px;";
            var head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+head.head+'" class="img-msg">'
            $("#"+reid).append("<div style='margin-top: 5px;'>"+head_img+"<span style='float:none;' class='msg-text other-msg-text'>"+msg+"</span><br/></div>");
        }
    });
}

//如果显示的是最近联系人列表，将聊天对象移动到顶部
function update_lately(chatId, chatUserName, chatType){
    var nav = $('#nav_ul').find('.active').attr('id');
    var li_ = $('#li_' + chatId);
    if (nav == 'lately' && li_.length == 0){//如果当前显示的是最近聊天列表，判断最近聊天列表中是否包含此聊天对象，如果不包含新增用户到列表
        if (chatType == 'user'){
            var html = join_lately_html(chatId, chatUserName, chatType);
            $('#lately-user-ul li').eq(0).after(html);
        }else if (chatType == 'group'){
            var html = join_lately_html(chatId, chatUserName, chatType);
            $('#lately-user-ul li').eq(0).after(html);
        }
    }else {
        $('#lately-user-ul li').eq(0).after(li_);
    }
}

//向服务器发送消息
function send_msg (msg, receiverUser, chatType, bottomLevel){
	if (!chatType){
        chatType = $('#chat-type').val();
    }
    //发送消息
    socket.emit('send-text', token, receiverUser, msg, chatType, 'text', bottomLevel);
}

//拼接一条聊天信息追加到聊天框末尾(是否是我发送的消息，消息发送时间，发送者， 发送的消息， 消息类型)
function join_msg(isMy, msgDate, sendUser, result, msgType, msgId, reUser, bottomlevels) {
    var str = get_msg_html(isMy, msgDate, sendUser, result, msgType, msgId, reUser, bottomlevels);
    $('#chat-content').append(str);
    $('#container-div').scrollTop($('#chat-content').height());
}

//拼接一条聊天信息追加到聊天框上方(是否是我发送的消息，消息发送时间，发送者， 发送消息)
function get_msg_html(isMy, msgDate, sendUser, result, msgType, msgId, reUser, bottomlevels) {
    var head = '', dataHtml = '',sty = 'user';
    if (typeof result == 'string') {
        try {
            head = JSON.parse(result)['user']['head'];
            dataHtml = JSON.parse(result)['msg'];
        }catch (e) {

            $.ajax({
                type: "post",
                url: '/userHeadController/queryHead',
                data: {'userID' : reUser},
                dataType: 'text',
                async: false,
                success: function(m) {
                    head =JSON.parse(m)['head']['head'];;
                    dataHtml = result;
                }
            });
        }
        // 点击发送的返回值
    } else {
        // 点击某人或组的聊天
        head = result['head'];
        dataHtml = result['msg'];
    }
    var str = '';
    var date = changeDate(msgDate);
    if (dataHtml.indexOf("msg-office-div") != -1) {
    	var msglv = msg_lv(dataHtml, $("#send_type").val());
    }
    if (isMy){
        var isMy = "isMy" + msgId;
        if (dataHtml.indexOf("msg-office-div") != -1) {
        	str +='<div class="list-group-item" style="min-height: 80px; border:none;">' ;
        	str +='<div style="float: right; margin-right: 25px;">';
	    		str +='<span style="color:red;">【'+changeLevelIdToName(bottomlevels)+'】</span>';
	    		str +='<span>' + date + '</span>';
    		str +='</div><br/>' ;
        	str +='<div style="margin-top: 5px;">';
        		str +='<img style="border-radius: 40px; width: 20px; height: 20px; float: right;" src="/userHeadController/showHead?path=' + head +'" class="img-msg">';
        	str +='</div>' ;
        	str +='<div class="msg-text my-msg-text">';
	        	str +='<span class="msg-border my-msg-border" style="top: 30px;"></span>';
	        	str +='<div class="my_office_css">';
	        		str +='<img class="my_officeImg_css" src="/img/office.png"/>';
	        		str +='<div class="my_officeChild_css">'+ dataHtml+'</div>';
        		str +='</div>';
        	str +='</div>';
        	str +='</div>';
        	str +='<div class="re_msg" id ="'+msgId+'"></div>';
        } else {
        	if (dataHtml.indexOf("img-msg-div") != -1) {
        		str +='<div class="list-group-item" style="min-height: 80px; border:none;">' ;
	        	str +='<div style="float: right; margin-right: 25px;">';
		    		str +='<span style="color:red;">【公开】</span>';
		    		str +='<span>' + date + '</span>';
	    		str +='</div><br/>' ;
	        	str +='<div style="margin-top: 5px;">';
	        		str +='<img style="border-radius: 40px; width: 20px; height: 20px; float: right;" src="/userHeadController/showHead?path=' + head +'" class="img-msg">';
	        	str +='</div>' ;
	        	str +='<div class="msg-text my-msg-text">';
		        	str +='<span class="msg-border my-msg-border" style="top: 30px;"></span>';
		        	str += dataHtml;
	        	str +='</div>';
	        	str +='</div>';
	        	str +='<div class="re_msg" id ="'+msgId+'"></div>';
        	} else {
        		str +='<div class="list-group-item" style="min-height: 80px; border:none;">' ;
	        	str +='<div style="float: right; margin-right: 25px;">';
		    		str +='<span style="color:red;">【'+changeLevelIdToName(bottomlevels)+'】</span>';
		    		str +='<span>' + date + '</span>';
	    		str +='</div><br/>' ;
	        	str +='<div style="margin-top: 5px;">';
	        		str +='<img style="border-radius: 40px; width: 20px; height: 20px; float: right;" src="/userHeadController/showHead?path=' + head +'" class="img-msg">';
	        	str +='</div>' ;
	        	str +='<div class="msg-text my-msg-text">';
		        	str +='<span class="msg-border my-msg-border" style="top: 30px;"></span>';
		        	str +='<div class="bg-right-css" ><span class="msg-right-css">' + dataHtml + '</span></div>';
	        	str +='</div>';
	        	str +='</div>';
	        	str +='<div class="re_msg" id ="'+msgId+'"></div>';
        	}
        	
        }
        myHeadPath(result.msgSender, isMy, "isMy");
    }else {
        var noMy = "noMy" + msgId;
        if (dataHtml.indexOf("msg-office-div") != -1) {//非纯文本
        	str +='<div class="list-group-item" style="min-height: 80px; border:none;">' ;
        	str +='<div style="float: left; margin-right: 25px;">';
	        	str +='<span style="color:#A26CF5; cursor: pointer;" onclick="chatGo_(\'' +result.msgSender  + '\', \'' + sendUser + '\', \'' + sty + '\')">' + sendUser + '</span>&nbsp;';
	    		str +='<span>' + date + '</span>';
	    		str +='<span style="color:red;">【'+changeLevelIdToName(bottomlevels)+'】</span>';
    		str +='</div><br/>' ;
        	str +='<div style="margin-top: 5px;">';
        		str +='<img style="border-radius: 40px; width: 20px; height: 20px; float: left;" src="/userHeadController/showHead?path=' + head +'" class="img-msg">';
        	str +='</div>' ;
        	str +='<div class="msg-text my-msg-text">';
	        	str +='<span class="msg-border my-msg-border" style="top: 30px;"></span>';
	        	str +='<div class="other_office_css">';
	        		str +='<img class="my_officeImg_css" src="/img/office.png"/>';
	        		str +='<div class="my_officeChild_css">'+ dataHtml+'</div>';
        		str +='</div>';
        	str +='</div>';
        	str +='</div>';
        	str +='<div class="re_msg" id ="'+msgId+'"></div>';
        } else {//纯文本
        	if (dataHtml.indexOf("img-msg-div") != -1) {
        		str +='<div class="list-group-item" style="min-height: 80px; border:none;">' ;
	        	str +='<div style="float: left; margin-right: 25px;">';
		        	str +='<span style="color:#A26CF5; cursor: pointer;" onclick="chatGo_(\'' +result.msgSender  + '\', \'' + sendUser + '\', \'' + sty + '\')">' + sendUser + '</span>&nbsp;';
		    		str +='<span>' + date + '</span>';
		    		str +='<span style="color:red;">【'+changeLevelIdToName(bottomlevels)+'】</span>';
	    		str +='</div><br/>' ;
	        	str +='<div style="margin-top: 5px;">';
	        		str +='<img style="border-radius: 40px; width: 20px; height: 20px; float: left;" src="/userHeadController/showHead?path=' + head +'" class="img-msg">';
	        	str +='</div>' ;
	        	str +='<div class="msg-text my-msg-text">';
		        	str +='<span class="msg-border my-msg-border" style="top: 30px;"></span>';
		        	str +='<div style="float: left; position: relative; left: 40px;">'+dataHtml+'</div>';
	        	str +='</div>';
	        	str +='</div>';
	        	str +='<div class="re_msg" id ="'+msgId+'"></div>';
        	} else {
        		str +='<div class="list-group-item" style="min-height: 80px; border:none;">' ;
	        	str +='<div style="float: left; margin-right: 25px;">';
	        		str +='<span style="color:#A26CF5; cursor: pointer;" onclick="chatGo_(\'' +result.msgSender  + '\', \'' + sendUser + '\', \'' + sty + '\')">' + sendUser + '</span>&nbsp;';
		    		str +='<span>' + date + '</span>';
		    		str +='<span style="color:red;">【'+changeLevelIdToName(bottomlevels)+'】</span>';
	    		str +='</div><br/>' ;
	        	str +='<div style="margin-top: 5px;">';
	        		str +='<img style="border-radius: 40px; width: 20px; height: 20px; float: left;" src="/userHeadController/showHead?path=' + head +'" class="img-msg">';
	        	str +='</div>' ;
	        	str +='<div class="msg-text my-msg-text">';
		        	str +='<span class="msg-border my-msg-border" style="top: 30px;"></span>';
		        	str +='<div class="bg-left-css" ><div class="msg-left-css">' + dataHtml + '</div></div>';
	        	str +='</div>';
	        	str +='</div>';
	        	str +='<div class="re_msg" id ="'+msgId+'"></div>';
        	}
        }
        myHeadPath(result.msgSender, noMy, "noMy");
    }
    return str;
}

function msg_lv(html, sendType) {
	html = html.replace(" loading-div","");
	var lv = "";
	$.ajax({
		type : 'post',
		url : '/messageController/queryGandUFile',
		data : {
			'fileId' : (sendType == "user" || sendType == "chat" ? html.substring(32,45) : html.substring(32,64)),
			'uploadType' : sendType
		},
		dataType : 'JSON',
		async: false,
		success : function(result) {
             lv = result.levels
		},	
		error : function() {
		}
	});
	return lv;
}

function chatGo_(chatId, chatName, type) {
if (type == "user") {
	$("#send_type").val("chat");
} else {
	$("#send_type").val("group");
}
var this_ = $('.menu > ul > li[click=contacts]');
$(".menu > ul > li").removeClass();
$(this_).addClass("active");
$.ajax({
    type: "GET",
    url: 'loadPath',
    data: {'href': $(this_).attr("code")},
    dataType: 'html',
    cache: false,
    async: false,
    success: function(result) {
        $('#main-content').html("").html(result);
        // 打开聊天窗口
        $(".contacts > .content > ul > ul.org-dt-ul").hide();
        $(".contacts > .content > ul > ul.dt-ul").hide();
//        $("#ul_pid_nav_02").show();
        $('#talking_id').val(chatId);
        $('#talking_type').val(type);
        change_chat(chatId, chatName, type, $("#ul_pid_nav_02").find("#li_"+chatId));
        $("#ul_pid_nav_02").find("#li_"+chatId).click();
    },
    error: function(err) {
        // alert("加载出错！");
    }
});
}

//密级id转名称
function changeLevelIdToName(levelId) {
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

//头像指定人员
function myHead(isMy, lar) {
    AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
        myHeadPath(result.Id, isMy, lar); //获取头像路径
    });
}

//获取头像路径
function myHeadPath(userID, isMy, lar) {
    AjaxMethod.ajax('userHeadController/queryHead', {'userID' : userID}).then(function (result){
        if (result) {
            var head = result.head;
            if (head != null) {
                myHeadInfoByPath(head.head, isMy, lar); //获取头像信息byPath
            } else {
                myHeadInfoByPath("", isMy, lar); //获取头像信息byPath
            }
        }
    });
}

//获取头像信息byPath
function myHeadInfoByPath(path, isMy, lar) {
    var img_style = "";
    if (lar == "isMy") {
        img_style = "border-radius: 40px; width: 20px; height: 20px; float: right;";
    } else if (lar == "noMy") {
        img_style = "border-radius: 40px; width: 20px; height: 20px; float: left;";
    }
    var head_img = '<img style="'+img_style+'" src="/userHeadController/showHead?path='+path+'" class="img-msg">'
    $('#'+isMy).html(head_img);
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

//token字符串转json
function toJson (str){
    if (!str) return {};

    var json = {};
    var array = str.split(';');
    for (var i in array){
        var obj = array[i].trim();
        json[obj.substring(0, obj.indexOf('='))] = obj.substring(obj.indexOf('=') + 1);
    }
    return json;
}

//更新消息为已读(消息，类型)
function readMsg(msgId, chatId, chatType) {
    AjaxMethod.ajax('homeController/readMsg', {'type' : chatType, 'msgId' : msgId, 'chatId' : chatId}).then(function (result){
        //获取未读信息总条数
    });
}
var totalCount = 0;
//收到其他消息(非当前聊天窗口的消息)
function receiveMsg(msg, chatType) {
    // debugger;
    //判断消息类型（user, group）
    var id = '';
    var alertMsg = "";
    //查询是否有未读，没有为1，有加1
    var count = not_read[id];
    if (count){
        $("#red_dot").show();
        not_read[id] = ++count;
    }else {
        $("#red_dot").hide();
        not_read[id] = 1;
        count = 1;
    }
//    if (chatType && chatType === 'group'){
//        id = msg.msg_receiver;
//        //获取消息发送者姓名
//        AjaxMethod.ajax('groupController/queryGroupInfoById', {
//            'receiver' : id,
//            'type': 'group'
//        }).then(function (result){
//            alertMsg = "<"+result.groupName+">讨论组中有"+count+"未读消息,请注意查收！";
//            JqdeBox.message('success', alertMsg);
//        });
//    }else {
//        id = msg.msg_sender;
//        //获取消息发送者姓名
//        AjaxMethod.ajax('homeController/querySender', {
//            'sender' : id
//        }).then(function (result){
//            alertMsg = "<"+result.userInfo.fullname+">发送给你"+count+"未读消息,请注意查收！";
//            JqdeBox.message('success', alertMsg);
//            JqdeBox.dialog();
//        });
//    }

    var nav = $('#nav_ul').find('.active').attr('id');
    var li_ = $('#li_' + id);
    if (nav == 'lately' && li_.length == 0){//如果当前显示的是最近聊天列表，判断最近聊天列表中是否包含此聊天对象，如果不包含新增用户到列表
        if (chatType == 'user'){
            var html = join_lately_html(msg.msg_sender, msg.userName, chatType);
            $('#lately-user-ul li').eq(0).after(html);
        }else if (chatType == 'group'){
            var html = join_lately_html(msg.msg_receiver, msg.groupName, chatType);
            $('#lately-user-ul li').eq(0).after(html);
        }
        li_ = $('#li_' + id);
    }else {
        $('#lately-user-ul li').eq(0).after(li_);
    }
    if (li_.find('.badge').length > 0){
        li_.find('.badge').html(count > 9 ? '9+' : count);
    }else {
        li_.append('<span class="badge">' + (count > 9 ? '9+' : count) + '</span>');
    }
    console.log(msg);
}

//弹出显示图片
function show_img(path, type) {
    // $(".move").hide();
    // $(".user_info_div").hide();
    //
    // $('body').append('<div class="dialog-background"><div class="dialog-div"><img src="/upDownLoadController/readFile?path=' + path + '&configPath=D:/toolsupload"></div>'+
    //     '<div class="dialog-close" onclick="close_dialog(this, \'' + type + '\')"></div></div>');
    //var div_height = $('.dialog-div').height();
    //var img_height = $('.dialog-div').find('img').height();
    //if (div_height > img_height){
    //    $('.dialog-div').find('img').css('margin-top',(div_height - img_height)/2 - 20);
    //}

}

//关闭弹窗
function close_dialog(this_, type) {
    $(".move").show();
    if (type == "user") {
    	$(".user_info_div").show();
    } else if (type == "group ") {
    	$(".user_info_div").hide();
    }
    
    $(this_).parent().remove();
}

//在线预览文件
function view_online(name, filePath, type) {
    JqdeBox.loading();
    //判断文件是否支持预览
    if (filePath == null || filePath == 'null' || filePath.length < 1){
        JqdeBox.alert('该类型文件暂时不支持在线查看！', null);
    }else {
        if (type == 'image'){
            show_img(filePath);
        }else if (filePath){
            show_file(name, encodeURIComponent(filePath));
        }else {
            JqdeBox.alert('该类型文件暂时不支持在线查看！', null);
        }
    }
    JqdeBox.unloading();

}

//获取当前登录人
function view_by_id(name, fileId, levels, uploadType) {
    AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
        var updater = result.userId;
        //通过文件id，预览文件office
        view_by_id_(name, fileId, levels, uploadType, updater);
    });
}

//通过文件id，预览文件office
function view_by_id_(name, fileId, levels, uploadType, now_name) {
    AjaxMethod.ajax('upDownLoadController/queryUserLevel', {'account' : now_name}).then(function (result){
        if (result) {
            if (result.levels >= levels) {
                JqdeBox.loading();
                //判断文件是否支持预览
                var file_type = name.substring(name.lastIndexOf('.') + 1);
                if (fileId == null || fileId == 'null' || fileId.length < 1){
                    JqdeBox.alert('读取出错，请重新上传！', null);
                } else {
                    openOtherFilesPartOne(name, fileId);
                }
                JqdeBox.unloading();
            } else {
                JqdeBox.message('error', '您的保密等级不够，请联系管理员！');
            }
        }
    });
}

//打开其他类型文件一
function openOtherFilesPartOne(fileName, fileId) {
	var uploadType = $("#send_type").val();
    AjaxMethod.ajax('homeController/queryFile', {'fileId' : fileId, 'uploadType': uploadType}).then(function (result){
        if (result){
        	$.ajax({
        		type : 'post',
        		url : '/indexController/fileHave',
        		data : {
        			'path' : result.path,
        			'fileName' : fileName,
        			'downPath' : "D:/toolsupload"
        		},
        		dataType : 'JSON',
        		async: false,
        		success : function(data) {
        			if (data) {
        				$.downloadByPath(result.path, fileName);
        			} else {
        				JqdeBox.message('success', "文件已过期！");
        			}
        		},	
        		error : function() {
        		}
        	});
//        	var newPaths = result.path.split(".")[0];
//        	var newPath = newPaths + ".pdf";
//            show_file(fileName, newPath);
        }
    });
}

//弹出显示pdf文件
function show_file(name, path) {
    window.open("/indexController/showPdf?path="+path);
}
