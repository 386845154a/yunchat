//封装ajax方法
var AjaxMethod = {
	ajax : function(requestMapping, ajaxData) {
		return this.asyncAjax(requestMapping, ajaxData, true, 'json');
	},
	asyncAjax: function (requestMapping, ajaxData, isAsync, type){
		var url = '/' + requestMapping;

		return new Promise(function(resolve, reject) {
			$.ajax({
				type : 'post',
				url : url,
				data : ajaxData,
				cache : false,
				async : isAsync,
				dataType : type,
				success : function(data, textStatus, jqXHR) {
					if (data.errorCode && data.errorCode == '1001') {
						window.location.href = '/indexController/login';
						return;
					}
					resolve(data);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
//					console.error(XMLHttpRequest);
//					if (XMLHttpRequest.responseText){
//						var result = eval('(' + XMLHttpRequest.responseText + ')');
//						if (result && result.errorCode && result.errorCode  == '1001'){
//							window.location.href = '/indexController/login';
//							return;
//						}
//					}
//					reject(XMLHttpRequest);
				}
			});
		})
	},
	ajaxTextType : function (requestMapping, ajaxData){
		return this.asyncAjax(requestMapping, ajaxData, true, 'text');
	}
};