$('document').ready(function() {
	// 获取用户信息
	
	// 
	$(".user_msg").hover(function(){
		$(".user_msg_content").show();
	},function(){
		$(".user_msg_content").hide();
	});
	
	// 设置编辑器
	if ((location.href + "").indexOf("contacts") != -1) {
		setKindEditor($('textarea[name="msg-content"]'));
		if ($('textarea[name="msg-content"]').val()) {
			if (!kindEditor.html()) {
				kindEditor.html($('textarea[name="msg-content"]').val());
			}
		}
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
		
		// 根据组织机构获取用户
		
		// 
		$(".chat > .content").scrollTop($(".chat > .content")[0].scrollHeight);
	}
	// 提交时添加
	/*if (!this.item["content"]) {
		this.item["content"] = kindEditor.html();
	}*/
});

// 左侧导航切换
function changeNav(nav_) {
	$(".menu > ul > li").removeClass();
	$(nav_).addClass("active");
	// 临时
	location.href = $(nav_).attr("code") + ".html";
}

//联系人左侧导航切换
function changeContactsNav(nav_) {
	var p_id = $(nav_).attr("id");
	if (p_id == "nav_01" || p_id == "nav_02" || p_id == "nav_03") {
		// 第一级折叠
		$(".contacts > .content > ul > ul.org-dt-ul").hide();
		$(".contacts > .content > ul > ul.dt-ul").hide();
		$("#ul_pid_" + p_id).show();
		if (p_id == "nav_03") {
			$(".creategroup").show();
		} else {
			$(".creategroup").hide();
		}
	} else {
		// 第二级折叠
		$(".contacts > .content > ul > ul.org-dt-ul > ul.user-dt-ul").hide();
		$("#ul_ul_pid_" + p_id).show();
	}
}

// 个人信息、版本信息弹框
function setModeDialog(v_) {
	var title_ = "";
	var url_ = "";
	if (v_ == 1) {
		title_ = "版本信息";
		url_ = "./version.html";
	} else if (v_ == 2) {
		title_ = "个人信息";
		url_ = "./userinfo.html";
	}
	//
	DevBox.dialogNoCancel({
    	title: title_,
        url: url_,
        init: function () {
        },
        confirm : function() { // 确认事件
			return true;
		},
        confirm_btn: "关闭"
    });
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
