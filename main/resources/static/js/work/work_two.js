$(function () {
	//获取访问路径
	queryPath();
});

//获取访问路径 项目管理
function queryPath() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		var now_ID = result.Id;
		var ifa = "http://10.12.97.30:8080/newnewcosim-master_war/loginiwork.ht?id="+now_ID+"&type="+4;
	    JSInteraction.topage(5);
	    $("#workTwo").attr("src",ifa);
	});
}

