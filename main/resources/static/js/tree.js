//当前选择单位id
var fileId = "0";
$(document).ready(function(){
	var setting = {
			edit: {
				enable: false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			view: {
				fontCss :{
					'font-size' : '18px',
					'font-weight' : '50%',
					'line-height' : '28px',
					'height' : '28px',
					'min-width' : '120px'
				}
			},
			callback: {
				onClick: onClickTree
			}
	};
	//刷新树行结构
	AjaxMethod.ajax("addressController/queryOrg", null).then(function (treeData){
		for (var i in treeData){
			treeData[i]['pId'] = treeData[i].pid;
			if (treeData[i].pid == '0'){
				treeData[i]['open'] = true;
			}
		}
		$.fn.zTree.init($("#tree1"), setting, treeData);
	});
});

//点击节点
function onClickTree(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	zTree.expandNode(treeNode);
	fileId = treeNode.id
	queryUser(1, fileId);
}

//获得单位下的所有用户，包括子节点
function queryUser(page, orgId) {
	var rows = $('#pageSelect').val();
	AjaxMethod.ajax("addressController/queryUser", {
		'orgId' : orgId,
		'page' : page
	}).then(function (data){
		var page_html = '';
		var userlist = data.objectList;
		for (var i in userlist){
			page_html += '<tr> \
					<td>' + userlist[i].account + '</td> \
					<td>' + userlist[i].fullname + '</td> \
					<td class="center">' + (userlist[i].sex == 1 ? '男': '女') + '</td> \
					<td>' + getOrgNameById(userlist[i].orgId) + '</td> \
				</tr>';
		}
	
		$('#org-user-list').html(page_html);
        // 拼接页码
        if (data.total > 1){
        	var page_html = '<li><a onclick="system_noti_page(\''+ data.priorPage +'\', \''+orgId+'\')">&laquo;</a></li>';
    		for (var i = 1; i <= data.totalPage; i++){
    			if (i == page){
    				page_html += '<li class="active"><a>' + i + '</a></li>';
    			}
    		}
    		page_html += '<li><a onclick="system_noti_page(\''+data.nextPage+'\', \''+orgId+'\')">&raquo;</a></li>';
        	$('#system_noti_page').html(page_html);
        }
	});
}

//下一页
function system_noti_page(page, orgId) {
	queryUser(page, orgId);
}

//OrgId转汉字
function getOrgNameById(groupid) {
	var orgName = "";
	$.ajax({
		type : 'post',
		url : '/addressController/getOrgById',
		data : {
			'orgId' : groupid
		},
		dataType : 'JSON',
		async: false,
		success : function(msg) {
			orgName = msg.orgName;
		},	
		error : function() {
		}
	});
	return orgName;
}
