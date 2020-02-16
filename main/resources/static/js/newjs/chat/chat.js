var socket = null;
var not_read = {};// 未读消息{'发消息的人'，‘消息数量’}
//var permission = '';// 权限字段
var cishu = 2;

$(function (){
    AjaxMethod.ajax('indexController/soceketConfig').then(function (result){
        var socketService = result.socketService;
        token = result.token;
        startSocketLinter(socketService);
    });
});

//  socket监听服务
function startSocketLinter(service){
    if (!service){
        JqdeBox.alert("系统出错，请重新登录!", function (){
            window.location.href = "logout";
        });
        return false;
    }
    socket = io.connect(service);

    if (!token){
        JqdeBox.alert("登录超时！", function (){
            window.location.href = "logout";
        });
    }

    // socket连接事件
    socket.on('connect', function () {
        socket.emit('conn', socket.id, token);
    });
    // 接收消息(消息来源,消息内容)
    socket.on('receiver-msg',function(fromId, msg, chatType){
        alert(fromId+":" + msg);
        // 当前聊天页面是否为消息接收者
        var receiverUser = $('#chat-user-id').val();//当前聊天界面
        if (receiverUser == fromId){
            // 追加内容
            joinMsg(false, msg.send_time, msg.userName, msg.msg, msg.msg_type);
            // 消息标记为已读
            readMsg(msg.msg_id, msg.msg_sender, $('#chat-type').val());
        } else {
            // 重新加载最近联系人消息
            initObj.loadFunction(true);
            receiveMsg(msg, chatType);
        }
    });
    // 离线
    socket.on('log-overtime',function(data){
        JqdeBox.alert(data, function (){
            window.location.href = "indexController/logout";
        });
    });
    // 系统消息
    socket.on('system-notification',function(msg){
        var receiverUser = $('#chat-user-id').val();//当前聊天界面
        if (receiverUser == '-1'){
            var noti_html = join_system_noti(msg.title, msg.type, msg.content, new Date());
            $("#system_noti_list").prepend(noti_html);
        }
    });
    // 发送系统消息给指定人员
    socket.on('system-touser',function(msg){
        var receiverUser = $('#chat-user-id').val();//当前聊天界面
        if (receiverUser == '-1'){
            var noti_html = join_system_noti(msg.userId, msg.receiverUserId, msg.content, msg.chatType, new Date());
            $("#container-div").prepend(noti_html);
        }
    });
    // 转码信息
    socket.on('conver-info',function(msg){
        console.log(msg);
    });
}

var user_array = [];// 当前组成员列表
/**
 * @param userId 聊天对象用户userid或者groupid
 * @param userName 聊天对象用户名
 * @param chatType 聊天类型 user、group
 * @param this_
 */
function chatToUsersOrGroup(userId, userName, chatType, this_) {
    $('#msgContent').find('li').remove();

    $('#chat-user-id').val(userId);
    $('#userFullName').val(userName);
    $('#chatType').val(chatType);

    // 重新计数未读
    not_read[userId] = 0;
    // 获得最近聊天信息
    AjaxMethod.ajax('homeController/queryLatelyMsg', {'type' : chatType, 'id' : userId}).then(function (result){
        var msgArr = result.msgList;
        var userId = result.userId;
        var re_num = 0;
        if (msgArr && msgArr.length > 0) {
            for (var i = (msgArr.length - 1); i >= 0; i--) {
                var msg = msgArr[i];
                joinMsg(msg.msgSender == userId, msg.sendTime, msg.senderName, msg.msg, msg.msgType, msg.msgId, msg.msgSender);
            }
           // getReInfo();
            // 更新消息为已读
            var last_msg = msgArr[0];// 最后一条消息
            if (last_msg){
               // readMsg(last_msg.msgId, chatId, type);
               // getTotalmsg('lately');
            }
        }
//        if (msgArr.length >= 10){
//            $('#load-div').html('<span class="load-span" onclick="loadMove()">加载更多消息</span>');
//        }else {
            $('#load-div').html('<span class="load-span" onclick="show_himsg(1)"><i class="fa fa-list"></i>历史消息</span>');
//        }
    });

    // 展示聊天基本信息
    if (chatType == "group"){
        showGroupinfo();
    } else {
        $('#chatInfo').find('a').remove();
        $('#chatInfo').html(userName);
    }
}

/**
 *
 * @param creator 当前用户
 * @param groupId 组id
 * @param groupName 组名
 * @param type group
 * @param this_
 */
function chatToGroup(creator, groupId, groupName, type, this_) {
    $("#create_user").val(creator);
    show_chat();
    $('#chat-type').val(type);
    $('#chat-user-name').html(name);
    $('#chat-user-id').val(chatId);
    $('#right-info').show();
    $('#chat-content').html('');
    $('#msgPre').html('');
    $('#user-list').find('.active').removeClass('active');
    $('#group_info_div').show();
    show_group_info();
    show_group_matter(false);
    $(this_).addClass('active');
    // 重新计数未读
    not_read[chatId] = 0;
    $(this_).find('.badge').remove();
    // 获得最近聊天信息
    AjaxMethod.ajax('homeController/queryLatelyMsg', {'type' : type, 'id' : chatId}).then(function (result){
        var msg_arr = result.msgList;
        var userId = result.userId;
        if (msg_arr && msg_arr.length > 0) {
            for (var i = (msg_arr.length - 1); i >= 0; i--) {
                var msg = msg_arr[i];
               // join_msg(msg.msgSender == userId, msg.sendTime, msg.senderName, msg.msg, msg.msgType, msg.msgId, msg.msgSender);
            }
           // getReInfo();
            // 更新消息为已读
            var last_msg = msg_arr[0];// 最后一条消息
            if (last_msg){
                readMsg(last_msg.msgId, chatId, type);
            }
        }
        if (msg_arr.length >= 10){
            $('#load-div').html('<span class="load-span" onclick="loadMove()">加载更多消息</span>');
        }else {
            $('#load-div').html('<span class="load-span" onclick="show_himsg(1)"><i class="fa fa-list"></i>历史消息</span>');
        }
    });

    // 如果是讨论组，显示讨论组菜单
    if (type == "group"){
        $('.group-info-div').show();
        if (creator == updater_id) {
            $("#gstate").show();
            $("#del").show();
            $("#closeGroup").show();
        } else {
            $("#gstate").hide();
            $("#del").hide();
            $("#closeGroup").hide();
        }
    }else {
        $('.group-info-div').hide();
    }
}

/**
 * 根据组id查询组消息
 */
function showGroupinfo() {
    var groupId = $('#chat-user-id').val();
    AjaxMethod.ajax('groupController/queryGroupInfo', {'groupId' : groupId}).then(function (result){
        if (result){
            $('#chatInfo').find('a').remove();
            $('#chatInfo').html(result.groupName);
        }
    });
}

// 拼接一条聊天信息追加到聊天框末尾(是否是我发送的消息，消息发送时间，发送者， 发送的消息， 消息类型)
function joinMsg(isMy, msgDate, sendUser, dataHtml, msgType, msgId, reUser) {
    var str = get_msg_html(isMy, msgDate, sendUser, dataHtml, msgType, msgId, reUser);
    $('#msgContent').append(str);
}

//拼接一条聊天信息追加到聊天框上方(是否是我发送的消息，消息发送时间，发送者， 发送消息)
function get_msg_html(isMy, msgDate, sendUser, dataHtml, msgType, msgId, reUser) {
    var str = '';
    if (isMy){
        var isMy = "isMy" + msgId;
        str ='<li>' +
            '   <span id="'+isMy+'" class="chat_right f_right"></span>' +
            '   <span class="subject subject_r f_right p-l-3 p-r-3">'+dataHtml+'</span>' +
            '   <span class="time">'+msgDate+'</span>' +
            '</li>';
        myHead(isMy, "isMy");
    } else {
        var noMy = "noMy" + msgId;
        var date = changeDate(msgDate);
        str = '<li>' +
            '    <span id="'+noMy+'" class="chat_left f_left"></span>' +
            '        <span class="subject f_left p-l-3 p-r-3">'+dataHtml+'</span>' +
            '        <span class="time">'+date+'</span>' +
            '    </li>';
        if (reUser) {
           myHeadPath(reUser, noMy, "noMy");
        }
    }
    return str;
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
        img_style = "f_right";
    } else if (lar == "noMy") {
        img_style = "f_left";
    }
    var head_img = '<img height="47px" width="47px" src="/userHeadController/showHead?path='+path+'" class="'+img_style+'")">'
    $('#'+isMy).append(head_img);
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

//发送消息按钮调用方法
function sendMsg(){
    var receiverUser = $('#chat-user-id').val();//消息接收人id
    if (!receiverUser) {
        alert('请选择接收消息的用户或者组');
        return false;
    }
    var msg = kindEditor.html();

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
        alert('消息内容不能为空!');
        return;
    }
    if (msg.length > 1000){
        msg.substring(0, 1000);
        alert('消息内容不能超过1000字节!');
        return;
    }
    $('#msgPre').html('');//清空输入
    //追加内容(ajax敏感词过滤)
    // AjaxMethod.ajaxTextType('homeController/filterSensitiveWord', {'msg' : msg}).then(function (msg){
    //     join_msg(true, new Date(), '', msg, 'text');
    // });

    //发送消息
    send_msg(msg, receiverUser, $('#chat-type').val());
    //如果显示的是最近联系人列表，将聊天对象移动到顶部
   // update_lately(receiverUser, $('#chat-user-name').html(), $('#chat-type').val());
}

//向服务器发送消息
function send_msg(msg, receiverUser, chatType){
    if (!chatType){
        chatType = $('#chatType').val();
    }
//    if (chatType == "group") {
//        saveLog("sendMsg", "给"+$("#group_name").html()+"发送了一条消息");
//    } else {
//        // 日志
//        AjaxMethod.ajax('homeController/querySender', {
//            'sender' : receiverUser
//        }).then(function (result){
//            if (result){
//                saveLog("sendMsg", "给"+result.userInfo.fullname+"发送了一条消息");
//            }
//        });
//    }
    //发送消息
    socket.emit('send-text', token, receiverUser, msg, chatType, 'text');
}


//保存日志
function saveLog(msgType, msgContent) {
    $.ajax({
        type : 'post',
        url : '/logController/saveLog',
        data: {'msgType' : msgType, 'msgContent' : msgContent},
        success:function(data){}
    });
}