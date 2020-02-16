$('document').ready(function() {
	// 获取用户信息
	
	// 设置编辑器
	if ((location.href + "").indexOf("contacts") != -1) {
		setKindEditor($('textarea[name="msg-content"]'));
		if ($('textarea[name="msg-content"]').val()) {
			if (!kindEditor.html()) {
				kindEditor.html($('textarea[name="msg-content"]').val());
			}
		}
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

//input元素回车事件绑定，参数：$("#" + id_)对象，function名称
function curElementFunc(o_, fun_) {
    o_.bind('keyup', function(e) {
    	var ev = document.all ? window.event : e;
	    if(ev.keyCode==13) {
	    	eval(fun_ + "()");
	    }
	});
}