$(function (){
	//禁止右键
	$("body").bind("contextmenu", function () {
        return false;
    });
	//是否记住密码
	var save_password = get_token('save_password');
	if (save_password){
		$('#save-password').attr('checked', true);
		$('#account').val(get_token('login_account'));
		$('#password').val(get_token('login_password'));
	}
	$('#auto-login').on('click', function (){
		$('#save-password').attr('checked', true);
	});
	//是否自动登录
	var is_auto_login = get_token('login_auto');
	if (is_auto_login){
		$('#save-password').attr('checked', true);
		$('#auto-login').attr('checked', true);
		if($('#account').val() && $('#password').val()){
			if (!$('#error_msg').html() && window.location.pathname == '/login'){
				//自动登录
				setTimeout(function (){
					$('#login-form').submit();
				}, 100);
			}
		}
	}
	get_login_info();
});

//获取任务栏参数
function get_login_info() {
	var P_account = "";
	var P_password = "";
	//从地址栏获得参数
	var url=decodeURI(location.href);
	var tmp1=url.split("?")[1]; 
	var tmp2 = [];
	if (tmp1) {
		tmp2=tmp1.split("&"); 
	}
	for ( var i in tmp2) {
		if (tmp2[i].split("=")[0] == "account") {
			P_account = tmp2[i].split("=")[1]; 
		} else if (tmp2[i].split("=")[0] == "password") {
			P_password = decodeURIComponent(tmp2[i].split("=")[1]);
		}
	}
	if (P_account && P_password) {
		if (P_account == "admin" || P_account == "logmanager" || P_account == "secadm") {
			$.ajax({
				type : 'post',
				url : '/homeController/loginAction',
				data : {
					'account' : P_account,
					'password' : P_password
				},
				cache : false,
				async : false,
				dataType : 'json',
				success : function(data, textStatus, jqXHR) {
					if (data && data.success){
						//聊天页面
//						window.location.href = "/indexController/discussion";
					}else {
						if (data.errMsg) 
							$('#error_msg').html(data.errMsg);
						else 
							$('#error_msg').html("登录失败");
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log(XMLHttpRequest);
					console.log(textStatus);
					console.log(errorThrown);
					$('#error_msg').html("系统出错，登录失败!");
				}
			});
			var log_content = name + "使用账号登录！";
			saveLog("login", log_content);
		} else {
			alert("请从网关登录！！");
			return false;
		}
	}
}

//登录
function login(){
	var name = $('#account').val();
	var password = $('#password').val();
	if ($('#save-password').is(':checked')){
		save_token('save_password', true);
		save_token('login_account', name);
		save_token('login_password', password);
	}else {
		delete_token('save_password');
		delete_token('login_account');
		delete_token('login_password');
	}
	if ($('#auto-login').is(':checked')){
		save_token('login_auto', true);
	}else{
		delete_token('login_auto');
	}
    // window.location.href = "/indexController/loginCA?userId="+$('#account').val();
	$.ajax({
		type : 'post',
		url : '/homeController/loginAction',
		data : {
			'account' : $('#account').val(),
			'password' : $('#password').val()
		},
		cache : false,
		async : false,
		dataType : 'json',
		success : function(data) {
             // window.location.href = "/indexController/loginCA"
			// debugger
			if (data && data.success && !data.errMsg){
				if (data.isAdmin){
					window.location.href = "/indexController/managerHome";
				} else if (data.isLog) {
					window.location.href = "/indexController/logHome";
				} else if (data.isSecadm) {
					window.location.href = "/indexController/secadmHome";
				} else {
					//聊天页面
					window.location.href = "/indexController/home";
				}
			}else {
				if (data.errMsg)
					$('#error_msg').html(data.errMsg);
				else
					$('#error_msg').html("登录失败");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
			$('#error_msg').html("系统出错，登录失败!");
		}
	});
	var log_content = name + "使用账号登录！";
	saveLog("login", log_content);
}

//提交方法调用，用来保存账号和密码
function submit_form() {
	if ($('#save-password').is(':checked')){
		var name = $('#account').val();
		var password = $('#password').val();
		save_token('save_password', true);
		save_token('login_account', name);
		save_token('login_password', password);
	}else {
		delete_token('save_password');
		delete_token('login_account');
		delete_token('login_password');
	}
	if ($('#auto-login').is(':checked')){
		save_token('login_auto', true);
	}else{
		delete_token('login_auto');
	}
	return true;
}

//删除token
function delete_token(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	document.cookie = name + "=null"+ ";expires=" + exp.toGMTString();
}


//获得token值
function get_token(name) {
	var arr,reg=new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg)){
		return unescape(arr[2]);
	}else {
		return null;
	}
}

//保存token
function save_token(name, value) {
	var exp = new Date();
	exp.setTime(exp.getTime() + 30*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};

//回车事件
document.onkeydown = function(e){
	if(!e){
		e=window.event;
	}
	if((e.keyCode || e.which)==13){
		login();
	}
}