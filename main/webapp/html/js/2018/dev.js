/**
 * DevMods ajax
 */
var DevMods = {
	ajax : function(action, verb, ajaxParams) {
		var apiPath = Config.apiPath.replace(/\/?$/, '');
		var url = apiPath + '/commMods/ajax?action=' + action + '&verb=' + verb;

		return new Promise(function(resolve, reject) {
			var data = null;
			if (ajaxParams) {
				if ($.type(ajaxParams) === "string") {
					data = {
						'ajaxParams' : ajaxParams
					};
				} else {
					data = {
						'ajaxParams' : JSON.stringify(ajaxParams)
					};
				}
			}

			$.ajax({
				type : 'post',
				url : url,
				data : data,
				cache : false,
				dataType : 'json',
				success : function(data, textStatus, jqXHR) {
					if (data.success == false
							&& data.message.indexOf('重新登录') > -1) {
						if (window.location.hash) {
							DevBox.alert(data.message, function() {
								window.location.href = apiPath + '/entry.html' + location.hash;
							});
						} else {
							window.location.href = apiPath + '/entry.html';
						}
						return;
					}
					resolve(data);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		})
	},
	asyncAjax : function(action, verb, ajaxParams, callback) {
		var apiPath = Config.apiPath.replace(/\/?$/, '');
		var url = apiPath + '/commMods/ajax?action=' + action + '&verb=' + verb;

		var data = null;
		if (ajaxParams) {
			if ($.type(ajaxParams) === "string") {
				data = {
					'ajaxParams' : ajaxParams
				};
			} else {
				data = {
					'ajaxParams' : JSON.stringify(ajaxParams)
				};
			}
		}

		$.ajax({
			type : 'post',
			url : url,
			data : data,
			cache : false,
			async : false,
			dataType : 'json',
			success : function(data, textStatus, jqXHR) {
				if (data.success == false
						&& data.message.indexOf('重新登录') > -1) {
					if (window.location.hash) {
						DevBox.alert(data.message, function() {
							window.location.href = './entry.html' + location.hash;
						});
					} else {
						window.location.href = './entry.html';
					}
					return;
				}
				if (callback)
					callback(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("请求出错！");
			}
		});
		
	},
	get : function(url, success, error) {
		$.ajax({
			type : 'get',
			url : url,
			cache : false,
			dataType : 'json',
			success : function(data, textStatus, jqXHR) {
				if (success)
					success(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (error)
					error(XMLHttpRequest);
			}
		});
	},
	post : function(url, data, success, error) {
		$.ajax({
			type : 'post',
			url : url,
			data : data,
			cache : false,
			dataType : 'json',
			success : function(data, textStatus, jqXHR) {
				if (success)
					success(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (error)
					error(XMLHttpRequest);
			}
		});
	}
};

/**
 * bootbox 弹出框
 * 
 * @type {{alert: DevBox.alert, confirm: DevBox.confirm, prompt:
 *       DevBox.prompt, dialog: DevBox.dialog, loading: DevBox.loading,
 *       unloading: DevBox.unloading}}
 */
var DevBox = {
	// alert/confirm/prompt/dialog
	alert : function(message, callback) {
		bootbox.alert({
			message : "<span class='bigger-130'>" + message + "</span>",
			buttons : {
				ok : {
					label : '<i class="fa fa-check"></i> 确定',
					className : 'btn-success'
				}
			},
			callback : callback
		});
	},
	confirm : function(message, callback) {
		//重置回车事件
    	keydownFunc("");
		bootbox.confirm({
			message : "<span class='bigger-130'>" + message + "</span>",
			buttons : {
				cancel : {
					label : '<i class="fa fa-times"></i> 取消',
					className : 'btn-sm',
				},
				confirm : {
					label : '<i class="fa fa-check"></i> 确定',
					className : 'btn-success btn-sm'
				}
			},
			callback : function(result) {
				//_.result($(this).data('bs.modal'), 'resetScrollbar');
				$.isFunction(callback) && callback(result);
			}
		});
	},
	prompt : function(title, inputType, callback) {

		if ($.isFunction(inputType)) {
			callback = inputType;
			inputType = 'text';
		}

		bootbox.prompt({
			title : title,
			inputType : inputType,
			buttons : {
				cancel : {
					label : '<i class="fa fa-times"></i> 取消',
					className : 'btn-sm',
				},
				confirm : {
					label : '<i class="fa fa-check"></i> 确定',
					className : 'btn-success btn-sm',
				}
			},
			callback : callback
		});
	},
	dialog : function(options) {
		var message = '<p><i class="fa fa-spin fa-spinner"></i> Loading...</p>';
		if (options.message) {
			message = options.message;
		}

		var dialog = bootbox.dialog({
			title : "<span class='bigger-130'>" + options.title + "</span>",
			message : message,
			// dialog的类名
			className: options.dialogClass ? options.dialogClass : "",
			buttons : {
				cancel : {
					label : '<i class="' + (options.cencel_i_class ? options.cencel_i_class : "fa fa-times") + '"></i> ' + (options.cancel_btn ? options.cancel_btn : "取消"),
					className : options.cencel_class ? options.cencel_class : "btn-sm",
					callback : function() {
						if (options.cancel)
							return options.cancel();
						return true;
					}
				},
				confirm : {
					label : '<i class="' + (options.confirm_i_class ? options.confirm_i_class : "fa fa-check") + '"></i> ' + (options.confirm_btn ? options.confirm_btn : "确定"),
					className : options.confirm_class ? options.confirm_class : "btn-success btn-sm",
					callback : function() {
						//_.result(dialog.data('bs.modal'), 'resetScrollbar');
						if (options.confirm)
							return options.confirm();
						return true;
					}
				}
			}
		});

		dialog.init(function() {
			if (options.url) {
				dialog.find('.bootbox-body').html("");
				$.get(options.url, function(html) {
					dialog.find('.bootbox-body').html(html);
					if (options.init)
						options.init();
				})
			} else {
				if (options.init)
					options.init();
			}
			dialog.find('.modal-header .close').on("click", function(){
				if (options.closeFunc) {
					return options.closeFunc();
				}
				return true;
			})
		});

		return dialog;
	},
	dialogNoCancel : function(options) {
		var message = '<p><i class="fa fa-spin fa-spinner"></i> Loading...</p>';
		if (options.message) {
			message = options.message;
		}

		var dialog = bootbox.dialog({
			title : "<span class='bigger-130'>" + options.title + "</span>",
			message : message,
			// dialog的类名
			className: options.dialogClass ? options.dialogClass : "",
			buttons : {
				confirm : {
					label : '<i class="' + (options.confirm_i_class ? options.confirm_i_class : "fa fa-check") + '"></i> ' + (options.confirm_btn ? options.confirm_btn : "确定"),
					className : options.confirm_class ? options.confirm_class : "btn-success btn-sm",
					callback : function() {
						if (options.confirm)
							return options.confirm();
						return true;
					}
				}
			}
		});

		dialog.init(function() {
			if (options.url) {
				dialog.find('.bootbox-body').html("");
				$.get(options.url, function(html) {
					dialog.find('.bootbox-body').html(html);
					if (options.init)
						options.init();
				})
			} else {
				if (options.init)
					options.init();
			}
			dialog.find('.modal-header .close').on("click", function(){
				if (options.closeFunc) {
					return options.closeFunc();
				}
				return true;
			})
		});

		return dialog;
	},
	hideAll : function() {
		bootbox.hideAll()
	},

	// loading
	loading : function() {
		this.dlgLoading = bootbox
				.dialog({
					message : '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
					backdrop : false,
					closeButton : false
				})
	},
	unloading : function() {
		var dlgLoading = this.dlgLoading;
		setTimeout(function() {
			if (dlgLoading) {
				//_.result(dlgLoading.data('bs.modal'), 'resetScrollbar');
				dlgLoading.modal('hide');
			}
		}, 200);
	},

	// message box
	message : function(type, message) {
		if (type === true)
			type = 'success';
		if (type === false)
			type = 'error';
		$.gritter.add({
			title : '提示',
			time : 1000,
			text : '<strong style="font-size: 14px;">'+message+'</strong>',
			class_name : 'gritter-' + type + ' gritter-light'
		});
	}
}

/**
* 自定义dialog
*/
var MyDev = {
	dialog_array: "",
	cur_flag: -1,
	title: "",
	message: '<i class="fa fa-spin fa-spinner"></i> Loading...',
	width: "600px", //70%
	opacity_no: "",
	btn_param : {},
	dialog : function(options) {
		$this = this;
		$this.title = options.title ? options.title : $this.title;
		$this.message = options.message ? options.message : $this.message;
		//
		btn_param = {
			buttons: {
				cancel : {
					isshow : options.nocancel ? false : true, 
					label : '<i class="' + (options.cancel_i_class ? options.cancel_i_class : "fa fa-times") + '"></i> ' + (options.cancel_btn ? options.cancel_btn : "取消"),
					className : options.cancel_class ? options.cancel_class : "btn-sm",
					callback : function() {
						if (options.cancel) {
							return options.cancel();
						}
						return true;
					}		
				},
				confirm : {
					isshow : options.noconfirm ? false : true,
					label : '<i class="' + (options.confirm_i_class ? options.confirm_i_class : "fa fa-check") + '"></i> ' + (options.confirm_btn ? options.confirm_btn : "确定"),
					className : options.confirm_class ? options.confirm_class : "btn-success btn-sm",
					callback : function() {
						if (options.confirm) {
							return options.confirm();
						}
						return true;
					}								
				}
			}
		}
		//
		$this.cur_flag++;
		var dialog_html_ = ' \
		<div class="dev_dialog" style="width:'+$this.width+'" id="dev_dialog_' + $this.cur_flag + '"> \
			<div class="dev_dialog_header" id="dev_dialog_header_' + $this.cur_flag + '"> \
				<span class="dev_dialog_title" id="dev_dialog_title">'+$this.title+'</span> \
				<span class="dev_dialog_close close" id="dev_dialog_close" \
					onclick="MyDev.undialog(' + $this.cur_flag + ')">×</span>\
			</div> \
	        <div class="dev_dialog_body" id="dev_dialog_body"> \
			    <div class="dev_dialog_context" id="dev_dialog_context">'+$this.message+'</div> \
			</div>';
		dialog_html_ += '<div class="dev_dialog_footer" id="dev_dialog_footer">';
		// buttons
		var btn_cancel = btn_param.buttons.cancel;
		var btn_confirm = btn_param.buttons.confirm;
		if (btn_cancel.isshow) {
			dialog_html_ += ' <button type="button" id="cancel_btn" class="btn btn-sm" \
				onclick="MyDev.undialog(' + $this.cur_flag + ');"> '+btn_cancel.label+'</button>';
		}
		if (btn_confirm.isshow) {
			dialog_html_ += ' <button type="button" id="confirm_btn" class="btn btn-success btn-sm"> '+btn_confirm.label+'</button>';
		}
		dialog_html_ += '</div> \
	    </div>';
		// 遮罩
		if (options.opacity_no == 1) {
			$this.opacity_no = " dev_dialog_backdrop_opacity_no";
		}
		dialog_html_ += '<div class="dev_dialog_backdrop' + $this.opacity_no + '" id="dev_dialog_backdrop' + $this.cur_flag + '"></div>';
	    $('body').append(dialog_html_);
		// 弹出框css设置
	    var width_ = options.width ? options.width : "600px";
	    var top_ = options.top ? options.top : $(document).scrollTop() + 30;
	    var left_ = 0;
	    if (width_.indexOf("%") != -1) {
	    	left_ = (100 - parseInt(width_.replace("%", ""))) / 2 + "%";
	    } else {
	    	left_ = (parseInt($(document).width()) - parseInt(width_.replace("px", ""))) / 2 + "px";
	    }
		$this.resetsize($this.cur_flag, {
			width: width_,
			top: top_,
			left: left_,
			display: "bock"
		});
		// 弹窗点击事件
		$("#cancel_btn").click(function() {
			return btn_cancel.callback() ? MyDev.undialog($this.cur_flag) : false;
	    });
		$("#confirm_btn").click(function() {
			return btn_confirm.callback() ? MyDev.undialog($this.cur_flag) : false;
	    });
		// 初始化页面表单
		if (options.url) {
			$.ajax({
				type : 'get',
				url : options.url,
				cache : false,
				dataType : 'html',
				success : function(html, textStatus, jqXHR) {
					$("#dev_dialog_"+$this.cur_flag).find('.dev_dialog_context').html("").html(html);
					if (options.init) {
						options.init();
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
				}
			});
		} else {
			if (options.init) {
				options.init();
			}
		}
	},
	undialog: function(cur_flag_) {
		setTimeout(function() {
			$("#dev_dialog_"+cur_flag_).remove();
			$("#dev_dialog_backdrop"+cur_flag_).remove();
		}, 200);
	},
	callback_event: function() {
		if (MyDev.btn_param.buttons.confirm.callback == "function") {
			MyDev.btn_param.buttons.confirm.callback();
		}
	},
	resetsize: function(cur_flag_, css_) {
		//
		$("#dev_dialog_"+cur_flag_).css(css_);
		$("#dev_dialog_"+cur_flag_).show();
		//
		$("#dev_dialog_backdrop"+cur_flag_).show();
		setTimeout(function() {
			$("#dev_dialog_backdrop"+cur_flag_).css("height", (parseInt($(document).height())+100)+"px");
		}, 500);
		// 添加拖动事件
		$this.mousemove_($this.cur_flag);
	},
	mousemove_: function(moveDiv) {
		$("#dev_dialog_header_" + moveDiv).mousedown(function(e) {
            var isMove = true;
            var div_x = e.pageX - $("#dev_dialog_" + moveDiv).offset().left;
            var div_y = e.pageY - $("#dev_dialog_" + moveDiv).offset().top;
            //
            var max_y = $(document).height();
            var max_x = $(window).width();
            var dialog_h = $("#dev_dialog_" + moveDiv).height();
            var dialog_w = $("#dev_dialog_" + moveDiv).width();
            $(document).mousemove(function (e) {
                if (isMove) {
                	var y_ = e.pageY - div_y;
                	var x_ = e.pageX - div_x;
                	if (y_ > max_y - dialog_h) {
                		y_ = max_y - dialog_h;
                	}
                	if (x_ > max_x - dialog_w) {
                		x_ = max_x - dialog_w;
                	}
                	if (y_ < 0) {
                		y_ == 0;
                	}
                	if (x_ < 0) {
                		x_ == 0;
                	}
                	$("#dev_dialog_" + moveDiv).css({"left": x_, "top": y_});
                	$("#dev_dialog_header_" + moveDiv).css({"cursor":"move"});
                }
            }).mouseup(function () {
                isMove = false;
                $("#dev_dialog_header_" + moveDiv).css({"cursor":"default"});
            });
		});
	},
	loading: function() {
		setTimeout(function() {
			$('body').append('<div class="dev_loading" id="dev_loading"><i class="fa fa-spin fa-spinner"></i> Loading...</div>');
		}, 10);
	},
	unloading: function() {
		setTimeout(function() {
			$("#dev_loading").remove();
		}, 200);
	},
	//注册验证表单，支持json格式
	commonAddEvent : function(json_) {
		for (var key in json_) {
			this.commonEvent(key, json_[key]);
		}
	},
	//注册验证表单
	commonEvent: function(id_, span_, callback, callback1) {
		var $this = this;
		var id_type_ = "";
		var id_type_cur_ = "";
		// 判断元素类型
		try {
			id_type_ = $("input[id='" + id_ + "']")[0].tagName;
			id_type_cur_ = $("input[id='" + id_ + "']").attr("type");
		} catch (e) {
		}
		try {
			id_type_ = $("select[id='" + id_ + "']")[0].tagName;
		} catch (e) {
		}
		try {
			id_type_ = $("textarea[id='" + id_ + "']")[0].tagName;
		} catch (e) {
		}
		id_type_cur_ = id_type_cur_.toLowerCase();
		id_type_ = id_type_.toLowerCase();
		if (id_type_ == "input") {
			//if (id_type_cur_ && id_type_cur_ == "text") {
				$("input[id='" + id_ + "']").bind("focus", function(){
					if (callback1) {
						callback1();
					}
				});
				/* 备用不要删除// 判断浏览器，火狐
				var explorer =navigator.userAgent;
				var explorerInfo = "";
				//ie 
				if (explorer.indexOf("MSIE") >= 0) {
					explorerInfo = "ie";
				}
				//firefox 
				else if (explorer.indexOf("Firefox") >= 0) {
					explorerInfo = "Firefox";
				}
				//Chrome
				else if(explorer.indexOf("Chrome") >= 0){
					explorerInfo = "Chrome";
				}
				//Opera
				else if(explorer.indexOf("Opera") >= 0){
					explorerInfo = "Opera";
				}
				//Safari
				else if(explorer.indexOf("Safari") >= 0){
					explorerInfo = "Safari";
				} 
				//Netscape
				else if(explorer.indexOf("Netscape")>= 0) { 
					explorerInfo = "Netscape"; 
				}*/ 
				$("input[id='" + id_ + "']").bind("blur change", function(){
					if (callback) {
						callback();
					}
					$this.checkValFunc($(this).val(), span_);
					//alert($(this).val());
					return false;
				});
			//}
		} else if (id_type_ == "select") {
			$("select[id='" + id_ + "']").bind("change", function() {
				if (callback) {
					callback();
				}
				$this.checkValFunc($(this).val(), span_);
				return false;
			});
		} else if (id_type_ == "textarea") {
			$("textarea[id='" + id_ + "']").bind("focus", function() {
				// 支持html5浏览器
				//if (window.applicationCache) { 
				//} else {
				//	if ($(this).attr("placeholder") && $(this).val() == $(this).attr("placeholder")) {
				//		$(this).val("");
				//	}
				//}
			});
			$("textarea[id='" + id_ + "']").bind('blur', function() {
				if (callback) {
					callback();
				}
				// 支持html5浏览器
				//if (window.applicationCache) { 
				//} else {
				//	if ($(this).attr("placeholder") && $(this).val() == "") {
				//		$(this).val($(this).attr("placeholder"));
				//	}
				//}
				$this.checkValFunc($(this).val(), span_);
				return false;
			});
		}
		return false;
	},
	checkValFunc: function(val_, span_) {
		if (val_ == "") {
			$("span[id='" + span_ + "']").show();
		} else {
			$("span[id='" + span_ + "']").hide();
		}
	},
	//验证表单
	validateFunc: function(form_id_) {
		var isPass = true;
		try {
			// 提交表单调用
			$("#" + form_id_).find("input").each(function() {
				if ($("span[id='" + $(this).attr("id") + "Span']").attr("id")) {
					if (!$("span[id='" + $(this).attr("id") + "Span']").is(":hidden") && $(this).val() == "") {
						//alert($(this).attr("id") + "----" + $("span[id='" + $(this).attr("id") + "Span']").attr("id"));
						$("span[id='" + $(this).attr("id") + "Span']").show();
						isPass = false;
					}
				}
			});
			$("#" + form_id_).find("select").each(function() {
				if ($("span[id='" + $(this).attr("id") + "Span']").attr("id")) {
					if (!$("span[id='" + $(this).attr("id") + "Span']").is(":hidden") && $(this).val() == "") {
						//alert($(this).attr("id") + "----" + $("span[id='" + $(this).attr("id") + "Span']").attr("id"));
						$("span[id='" + $(this).attr("id") + "Span']").show();
						isPass = false;
					}
				}
			});
			$("#" + form_id_).find("textarea").each(function() {
				if ($("span[id='" + $(this).attr("id") + "Span']").attr("id")) {
					// alert($(this).attr("id") + "--" + document.getElementById($(this).attr("id")).value);
					if (!$("span[id='" + $(this).attr("id") + "Span']").is(":hidden") && $(this).val() == "") {
						//alert($(this).attr("id") + "----" + $("span[id='" + $(this).attr("id") + "Span']").attr("id"));
						$("span[id='" + $(this).attr("id") + "Span']").show();
						isPass = false;
					}
				}
			});
		} catch (e) {
			isPass = false;
			alert("error:" + e.name + "---" + e.message);
		}
		return isPass; 
	}
}

/**
 * 年报dialog
 */
