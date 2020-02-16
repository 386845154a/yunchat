
/**
 * bootbox 弹出框
 *
 * @type {{alert: JqdeBox.alert, confirm: JqdeBox.confirm, prompt:
 *       JqdeBox.prompt, dialog: JqdeBox.dialog, loading: JqdeBox.loading,
 *       unloading: JqdeBox.unloading}}
 */
var JqdeBox = {
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

		$(function() {
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
	dialog_ : function(options) {
		var message = '<p><i class="fa fa-spin fa-spinner"></i> Loading...</p>';
		if (options.message) {
			message = options.message;
		}

		var dialog = bootbox.dialog({
			title : "<span class='bigger-130'>" + options.title + "</span>",
			message : message,
			buttons : {
				cancel : {
					label : '<i class="' + (options.cencel_i_class ? options.cencel_i_class : "fa fa-times") + '"></i> ' + (options.cancel_btn ? options.cancel_btn : "退出"),
					className : options.cencel_class ? options.cencel_class : "btn-sm",
					callback : function() {
						if (options.cancel)
							return options.cancel();
						return true;
					}
				},
				confirm : {
					label : '<i class="' + (options.confirm_i_class ? options.confirm_i_class : "fa fa-check") + '"></i> ' + (options.confirm_btn ? options.confirm_btn : "完成"),
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

		$(function() {
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
			time : 5000,
			text : '<a onclick="">'+message+'</a>',
			class_name : 'gritter-' + type + ' gritter-light'
		});
	}
}