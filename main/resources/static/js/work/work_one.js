$(function () {
	$('#nav_ul').find('.active').removeClass('active');
	//获取访问路径
	queryPath();
});

//获取访问路径 数据中心-->知识管理
function queryPath() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		// var ifa = "http://10.12.97.30:8080/giksp/clientk.action?j_username="+"daifeng@zju.edu.cn";
	    var ifa = "http://10.12.97.30:8006/giksp/clientk.action?j_username="+now_ID;
	    JSInteraction.topage(3);
	    $("#workOne").attr("src",ifa);
	});
}