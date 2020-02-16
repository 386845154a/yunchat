var files;
$(function(){
	//获取公告信息
	query_affiche();
})

//获取公告信息
function query_affiche() {
	AjaxMethod.ajax('upDownLoadToolsController/queryAfficheList',{
	}).then(function (result){
		var page_html = "";
		for (var i = 0 ; i < result.length; i++){
			var affiche_file = result[i];
			page_html +=  "<li class='affiche_li'><a onclick='look_info(\"" + affiche_file.title + "\", \"" + encodeURIComponent(affiche_file.context) + "\", \"" + affiche_file.fileName + "\", \"" + affiche_file.path + "\")'>" + affiche_file.title
					  + "</a><span class='affiche_span'>" + changeDate(affiche_file.sendTime)
					  + "<input style='margin-left:5px;' type='button' value='删除' onclick='del_affiche(\"" + affiche_file.fileId + "\")' /></span></li>"
			$("#affiche_info").html(page_html);
		}
	});
}

//时间格式转换
function changeDate (date_str){
    var date = new Date(date_str);
    var year = date.getFullYear();
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + '/' + month + '/' + day + '&nbsp;' + hour + ':' + (minute < 10 ? "0" + minute : minute) + ':' + second;
}

//添加公告弹出框
function update_affiche() {
	$("#affiche_title").val("");
	$("#affiche_context").val("");
	$("#file_name").val("");
	$("#affiche_model").modal();
}

//隐藏原有属性
function F_Open_dialog() {
	document.getElementById("btn_file").click();
}

//获取附件信息
function get_attachment(this_) {
	files = $(this_)[0].files;
	var file = files[0];
	$("#file_name").val(file.name);
}

//上传公告
function upload_file() {
	var title = $("#affiche_title").val();
	var context = $("#msg-content").val();
	if (!title) {
		JqdeBox.message('error', "标题不能为空！");
		return false;
	}
	if (files) {
		//有附件
		if (files.length < 1){
			return false;
		} else {
			for (var i = 0 ; i < files.length; i++){
				var file = files[i];
				var maxSize = 100*1024*1024;
				var img_type = file.name.split(".")[1];
				if (file.size > maxSize){
					alert('您上传的文件：' + file.name + '大小超过100MB，不能上传！');
					return false;
				}
				// 生成一个fileId
				var timestamp = new Date().getTime();// 精确到毫秒的时间戳
				var file_id = timestamp + file.lastModified;// 由当前时间加上最后修改时间组成文件id
				var formData = new FormData();
				formData.append("fileId", file_id);
				formData.append("file", file);
				formData.append("title", title);
				formData.append("context", context);
				formData.append("up_path", "D:/toolsupload");
			    $.ajax({
			        type : 'post',
			        url : '/upDownLoadToolsController/uploadChildFlie',
			        data: formData,
			        processData: false,
			        contentType: false,
			        async : false,
			        success : function(data) {
			        	if (data) {
			        		JqdeBox.message('success', "添加成功！");
			        	} else {
			        		alert("超出存储长度,请以附件形式上传！");
			        	}
			        },
			        error : function(err) {
			        	JqdeBox.alert("文件发送失败，请稍后再试！");
			        }
			    });
			}
		}
	} else {
		//无附件
		AjaxMethod.ajax('upDownLoadToolsController/saveAffiche',{
			"title":title,
			"context":context
		}).then(function (result){
			if (result) {
				JqdeBox.message('success', "添加成功！");
			} else {
				alert("超出存储长度,请以附件形式上传！");
			}
		});
	}
	// 清空上传文件框，使其可以重复上传相同文件
	$(files).val("");
	$("#affiche_model").hide();
	location.reload();
}

//查看公告详情
function look_info(title, context, fileName, path) {
    var affiche_title = title;
    var affiche_context = decodeURIComponent(context);
    var affiche_name = fileName;
    var affiche_path = path;
    var page_info = '';
    page_info +=  '<div class="title" style="text-align: center;font-weight: bold;">'+ affiche_title +'</div>';
    page_info +=  '<div><p style="text-indent:2em;word-wrap: break-word; word-break: normal;">'+ affiche_context +'</p></div>';
    if (affiche_path != "null") {
        page_info +=  '<div style="margin-left: 30px;"><img src="/img/FJ.png" class="affiche_img" style="width:30px; height:20px;" />'
            +   '<a class="down" onclick="down_affiche(\'' + affiche_name + '\',\'' + affiche_path + '\')">'+affiche_name +'</a></div>';
    }
    document.getElementById('show').innerHTML = page_info;
    $("#afficheInfo").modal();
}

function down_affiche(name, path) {
	$.downloadForOpen(path, name);	//附件打开
//		$.toolsDownByPath(path, name);	//附件下载
}

//删除公告
function del_affiche(afficheId) {
	AjaxMethod.ajax('upDownLoadToolsController/delAfficheById',{
		"afficheId" : afficheId
	}).then(function (result){
		location.reload();
	});
}