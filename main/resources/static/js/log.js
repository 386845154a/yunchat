//保存日志
function saveLog(msgType, msgContent) {
	$.ajax({
	    type : 'post',
	    url : '/logController/saveLog',
	    data: {'msgType' : msgType, 'msgContent' : msgContent},
	    success:function(data){
	    	
	    }
	});
}

//工具下载日志
function downToolLog(msgType, msgContent, fileId) {
	$.ajax({
	    type : 'post',
	    url : '/logController/saveLog',
	    data: {'msgType' : msgType, 'msgContent' : msgContent, 'fileId' : fileId},
	    success:function(data){
	    	
	    }
	});
}