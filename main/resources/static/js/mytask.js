$(function () {
	$('#nav_ul').find('.active').removeClass('active');
	//获取当前登录人
	query_task();
});

//获取当前用户信息
function query_task(taskid) {
        AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
            var now_ID = result.Id;
            var ifa = "http://10.12.97.30:8080/newnewcosim-master_war/loginiwork.ht?id="+now_ID+"&type="+1;
            JSInteraction.topage(1);
            $("#myframe").attr("src",ifa);
        });
}

