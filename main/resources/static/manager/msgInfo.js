//弹出显示图片
function show_img(path) {
    $('body').append('<div class="dialog-background"><div class="dialog-div"><img src="/upDownLoadController/readFile?path=' + path + '"></div>'+
    		'<div class="dialog-close" onclick="$(this).parent().remove()"></div></div>');
}

//通过文件id，预览文件office
function view_by_id(name, fileId, uploadType) {
	JqdeBox.loading();
    //判断文件是否支持预览
	var file_type = name.substring(name.lastIndexOf('.') + 1);
    if (fileId == null || fileId == 'null' || fileId.length < 1){
        JqdeBox.alert('读取出错，请重新上传！', null);
    }else if ('.doc.docx.xls.xlsx.ptt.pttx'.indexOf(file_type) > -1){
    	AjaxMethod.ajax('homeController/queryFileById', {'fileId' : fileId, 'uploadType' : uploadType}).then(function (result){
    		if (result){
    			if (result.readPath == "convering"){
    				JqdeBox.alert("文件正在转码，请稍后！");
    				return;
    			}else if (result.readPath == "conver error"){
    				JqdeBox.alert("文件转码失败，请重新上传！");
    				return;
    			}
    			show_file(name, result.readPath);
    		}else {
    			JqdeBox.alert("预览失败!");
    		}
    	}, function (error){
    		JqdeBox.alert("连接失败，预览失败!");
    	});
    }else {
    	JqdeBox.alert('该文件类型不支持预览！', null);
    }
    JqdeBox.unloading();
}

//弹出显示pdf文件
function show_file(name, path) {
	$('body').append('<div class="dialog-background"><div class="dialog-div" style="overflow: hidden;">' +
        '<iframe title="' + name + '" src="/indexController/showPdf?path='+path+'" style="width:100%;height:100%;overfloat:none;"></iframe>' + 
        '</div><div class="dialog-close" onclick="$(this).parent().remove()"></div></div>');
}



