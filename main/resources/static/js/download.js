//下载（文件相对路径，下载文件名）
function downloap(filePath, fileName) {
	var form = $("<form></form>");
	form.attr('action','commMods/download');
	form.attr('method','post');
    input1 = $("<input type='hidden' name='filePath'/>");
    input1.attr('value',filePath);
    form.append(input1)
    input2 = $("<input type='hidden' name='fileName'/>");
    input2.attr('value',fileName);
    form.append(input2)
	form.submit();
}

//下载
$.download = function(url, data, fileName, downPath) {
	if (url) {
		var inputs = "<input type='hidden' name='fileName' value='"+fileName+"'>";
		if (data) {
			for (var i in data) {
				inputs += "<input type='hidden' name='"+i+"' value='"+data[i]+"'>";
			}
		}
		inputs += "<input type='hidden' name='downPath' value='"+downPath+"'>";
		$("<form action='"+url+"' method='post' target='_blank'>"+inputs+"</form>").appendTo('body').submit().remove();
	}
}

$.downloadByPath = function(path, fileName) {
	$.ajax({
		type : 'post',
		url : '/indexController/fileHave',
		data : {
			'path' : path,
			'fileName' : fileName,
			'downPath' : "D:/toolsupload"
		},
		dataType : 'JSON',
		async: false,
		success : function(data) {
			if (data) {
				$.download("downloadByPath", {"path":path}, fileName, "D:/toolsupload");
			} else {
				JqdeBox.message('success', "文件已过期！");
			}
		},	
		error : function() {
		}
	});
}

$.toolsDownByPath = function(path, fileName) {
	$.download("toolsDownByPath", {"path":path}, fileName, "D:/toolsupload");
}

$.downloadForOpen = function(path, fileName) {
	$.download("downloadForOpen", {"path":path}, fileName, "D:/toolsupload");
}

//导出库存信息
function exprotExcel_(url,list_sort) {
	var inputs = "<input type='hidden' name='ajaxParams' value='"+list_sort+"'>";
	$("<form action='"+url+"' method='post' target='_blank'>"+inputs+"</form>").appendTo('body').submit().remove();
}

//导出反馈信息
function feedBackExcel_(url,list_sort) {
	var inputs = "<input type='hidden' name='ajaxParams' value='"+list_sort+"'>";
	$("<form action='"+url+"' method='post' target='_blank'>"+inputs+"</form>").appendTo('body').submit().remove();
}

//看板导出
function kbExcel_(url,row,page,query) {
	var inputs = "<input type='hidden' name='row' value='"+row+"'>";
	 inputs += "<input type='hidden' name='page' value='"+page+"'>";
	 inputs += "<input type='hidden' name='query' value='"+query+"'>";
	$("<form action='"+url+"' method='post' target='_blank'>"+inputs+"</form>").appendTo('body').submit().remove();
	
}

