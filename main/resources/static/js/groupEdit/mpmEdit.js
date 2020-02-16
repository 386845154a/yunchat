var groupUser;
var lsUser = new Array();
//创建MPM组
function create_mpm(){
    JqdeBox.dialog_({
        title: '创建项目组',
        url: '/js/groupEdit/mpmEdit.html',
        init: function () {
        	var projectJSON = "";
//        	$('#gdecribe-textarea').removeAttr("disabled");
//    		$.ajax({
//    			  url: 'http://iport/services/synchrodata?wsdl',
//    			  type: 'GET',
//    			  dataType: 'jsonp',
//    			  jsonp:"callback",
//    			  success: function (data) {
//    				  projectJSON = data;
//    			  },
//    			  error: function(err){
//    			  }
//			});
        	projectJSON = [
                {"projectId":"p01","projectName":"一级项目"},
				{"projectId":"p02","projectName":"二级项目"},
				{"projectId":"p03","projectName":"三级项目"}];
    		 $('#gProject').empty();
             $('#gProject').append('<option  value="0" selected>请选择项目</option>');
             $(projectJSON).each(function(i) {
                 $('#gProject').append('<option value="'+this.projectId+'">'+this.projectName+'</option>');
             });
        },
        confirm: function () {
            var group_name = $('#gname-input').val();
            if (!group_name || group_name.trim() == '' ){
                alert('请输入讨论组名称！');return false;
            }
            $.ajax({
                type : 'post',
                url : '/groupController/createMpm',
                data: {
                	'groupName': $("#proName").val(), 
                	'groupDescribe': $('#gdecribe-textarea').val(), 
                	'choose_name' : "MPM",
                	'scop' : "",
                	'levels' : $("#level_input").val(),
                	'userIdList': JSON.stringify(groupUser)
                },
                async:true,
                cache: false,
                success:function(data){
                	if (data && data.ok){
                    	JqdeBox.message('success', '创建成功！');
                        saveLog("createGroup", "创建项目组"+group_name);
//                        sendIntegral("3", "qiushi", "talk_2", "");
                    	show_group();
                    	// location.reload();
                	}else {
                		JqdeBox.message('error', '创建失败，请稍后再试！');
                	}
                },
                error:function(data){
                	JqdeBox.message('error', '创建失败，请稍后再试！');
                }
            });
            return false;
        }
    });
}


function aaaaa(sdfa) {
	 $('#userList').empty();
	 $(groupUser).each(function(i) {
		 if (this.userId == sdfa) {
			 if (i == 0) {
				 groupUser.shift(); 
			 } else {
				 groupUser.splice(i, i);
			 }
		 } else {
			 $('#userList').append('<div style="width: 60px; height: 60px; float: left; margin-left: 10px;"><div class="uf">'+this.name.substring(0,1)+'</div><div style="text-align: center;">'+this.name+'</div><img class="du" src="/img/minus.png" onclick="aaaaa('+this.userId+')"></div>');
		 }
     });
}
