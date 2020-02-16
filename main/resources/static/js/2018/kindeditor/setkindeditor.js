/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2013 kindsoft.net
* @version 4.1.10 (2013-11-23)
*******************************************************************************/
function setKindEditor(o) {
	var K = KindEditor;
	// 编辑器初始化
	kindEditor = K.create(o, {
//		cssPath : '/js/kindeditor/plugins/code/prettify.css',
		uploadJson : uploadUrl + "?flag=ke",
		fileManagerJson : '/jsp/file_manager_json.jsp',
		allowFileManager : false,
		themeType : 'simple',
		minWidth : '750px',
		minheight: '300px',
		resizeType:0,
		items : [
           		'source', '|', 'justifyleft', 'justifycenter', 'justifyright', '|', 
           		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
           		'italic', 'underline', 'strikethrough','table'
        ],
		afterCreate : function() {
			//设置编辑器创建后执行的回调函数						            
			var self = this;						            
			var $txt = $("iframe").contents().find("body");						            
			$txt.keydown(function(event) {
				var tempVal = kindEditor.html();
				if (kindEditor.html() && kindEditor.html().indexOf('img') == -1) {
					//console.log("keydown==1=" + tempVal);
					tempVal=tempVal.replace(/<\/?.+?>/g,"");
					tempVal=tempVal.replace(/ /g,"");//去掉html标签的内容
					tempVal=tempVal.replace(/\t+/g,"");//\t
					tempVal=tempVal.replace(/\ +/g,"");//去掉空格
					tempVal=tempVal.replace(/[ ]/g,"");//去掉空格
					tempVal=tempVal.replace(/[\r\n]/g,"");//去掉回车换行
					//console.log("keydown==2=" + tempVal);
					if (!tempVal) {
						kindEditor.html("");
					}
				}
				if (event.keyCode == 13 && !event.ctrlKey) {   
					if (tempVal) {
						self.sync();
						//console.log("1==" + kindEditor.html());
						sendMsg();
						//console.log("2==" + kindEditor.html());
						return false;
//							alert("回车事件");
//							K.blur();
//							setTimeout(function(){
//								kindEditor.html('');
//							}, 50);
					} else {
						console.log("内容不能为空");
					}
				} else if (event.keyCode == 13 && event.ctrlKey) {
					K.insertHtml('textarea[name="msg-content"]', '<br /><p><br /></p>');
				}
			});                                    
			K.ctrl($txt[0], 13, function(e) {
				K.insertHtml('textarea[name="msg-content"]', '<br /><p><br /></p>');    
			}); 						            
			//Ctrl+Enter提交表单						            
			/*K.ctrl(document, 13, function() {
				this.sync();
				document.forms['example'].submit();
			});
			K.ctrl(this.edit.doc, 13, function() {
				this.sync();
				document.forms['example'].submit();
			});*/
		},
		afterBlur: function(){
			this.sync();
		}
	});
	prettyPrint();
    setTimeout(function(){
        $(".ke-statusbar").hide();
        $(".ke-button-outer").css({"display":"none"});
        $(".ke-container").css({"width":"99.8%","height":"113px","border-right":"1px solid #797979"});
    },10);
}

function kindEditorChat(o) {
	// 编辑器初始化
	KindEditor.ready(function(K) {
		kindEditorC = K.create(o, {
			cssPath : 'plugins/code/prettify.css',
			uploadJson : '/uploadAction!upload.action?immediate=3',
			fileManagerJson : 'jsp/file_manager_json.jsp',
			allowFileManager : true,
			themeType : 'simple',
			minWidth : '750px',
			minheight: '250px',
			resizeType:0,
			items : [
					'formatblock', 'fontname', 'fontsize','forecolor',  'bold',
					'italic', 'underline',  'emoticons'
		        ],
	        afterCreate : function() {
				K.ctrl(document, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
				K.ctrl(this.edit.doc, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
			},
			afterBlur: function(){
				this.sync();
			}
		});
		prettyPrint();
	});
	setTimeout(function(){$(".ke-statusbar").hide();},100);
}

function setKindEditor1(o) {
	// 编辑器初始化
	KindEditor.ready(function(K) {
		kindEditor1 = K.create(o, {
			cssPath : 'plugins/code/prettify.css',
			uploadJson : '/uploadAction!upload.action?immediate=3',
			fileManagerJson : 'jsp/file_manager_json.jsp',
			allowFileManager : true,
			themeType : 'simple',
			minWidth : '450px',
			minheight: '250px',
			items : [
		           		'source', '|', 'preview', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright', '|', 
		           		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		           		'italic', 'underline', 'strikethrough'
		        ],
			afterCreate : function() {
				K.ctrl(document, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
				K.ctrl(this.edit.doc, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
			},
			afterBlur: function(){
				this.sync();
			}
		});
		prettyPrint();
	});
}

function setKindEditor2(o) {
	// 编辑器初始化
	KindEditor.ready(function(K) {
		kindEditor2 = K.create(o, {
			cssPath : 'plugins/code/prettify.css',
			uploadJson : '/uploadAction!upload.action?immediate=3',
			fileManagerJson : 'jsp/file_manager_json.jsp',
			allowFileManager : true,
			themeType : 'simple',
			items : [
		           		'source', '|', 'preview', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright', '|', 
		           		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		           		'italic', 'underline', 'strikethrough', 'image'
		        ],
			afterCreate : function() {
				K.ctrl(document, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
				K.ctrl(this.edit.doc, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
			},
			afterBlur: function(){
				this.sync();
			}
		});
		prettyPrint();
	});
}

function setKindEditor3(o) {
	// 编辑器初始化
	KindEditor.ready(function(K) {
		kindEditor3 = K.create(o, {
			cssPath : 'plugins/code/prettify.css',
			uploadJson : '/uploadAction!upload.action?immediate=3',
			fileManagerJson : 'jsp/file_manager_json.jsp',
			allowFileManager : true,
			themeType : 'simple',
			afterCreate : function() {
				K.ctrl(document, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
				K.ctrl(this.edit.doc, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
			},
			afterBlur: function(){
				this.sync();
			}
		});
		prettyPrint();
	});
}

function setKindEditor4(o) {
	// 编辑器初始化
	KindEditor.ready(function(K) {
		kindEditor4 = K.create(o, {
			cssPath : 'plugins/code/prettify.css',
			uploadJson : '/uploadAction!upload.action?immediate=3',
			fileManagerJson : 'jsp/file_manager_json.jsp',
			allowFileManager : true,
			themeType : 'simple',
			minWidth : '750px',
			minheight: '250px',
			items : [
		           		'source', '|', 'preview', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright', '|', 
		           		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		           		'italic', 'underline', 'strikethrough'
		        ],
			afterCreate : function() {
				K.ctrl(document, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
				K.ctrl(this.edit.doc, 13, function() {
					this.sync();
					document.forms['example'].submit();
				});
			},
			afterBlur: function(){
				this.sync();
			}
		});
		prettyPrint();
	});
}