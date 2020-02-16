//选择菜单
function chang_menu(this_, callBackFun) {
    $(".menu_li").attr("style", "background-color: none;");
    if(!callBackFun) {
    	$(this_).attr("style", "background-color: #10A2C5;");
    }
    $.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href': $(this_).attr("code")},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            $('#main-content').html("").html(result);
//            //获取更新版本号
//            getUpdataVersion();
//            //获取本人头像
//            getHeadPath("first");
//            //未读系统通知条数
//            getSysTotalmsg();
        },
        error: function(err) {
            alert("加载出错！");
        }
    });
}

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

//版本信息、个人信息、使用说明显示
function show_hide_msg() {
	$("#user_msg").show();
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

//获取本人头像
function getHeadPath(flag) {
	AjaxMethod.ajax('userHeadController/queryHead', {'userID' : 'my'}).then(function (result){
		if (result) {
		   $("#loginUserLevel").html(result.loginUserLevel);
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
