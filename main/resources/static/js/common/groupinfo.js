$(function(){


    var orgdata = "";
});

function createGroupIm (task){
    var gid ="";
    layer.open({
        type: 2
        ,content: ['http://127.0.0.1:8888/ui/css/modules/group/groupFrom.html','no'] //这里content是一个普通的String
        ,area: ['1000px', '660px']
        ,title:"群组信息"
        ,btn: ['创建群组', '取消创建']
        ,yes: function(index, layero){
            //按钮【按钮一】的回调
            var iframeWin = window[layero.find('iframe')[0]['name']];
            if (task == 1){
                gid = document.getElementById('sbxiaotian').innerText;
            }
            var res = iframeWin.GroupTask(task,gid);
            layer.alert(res);
            layer.close(index);
        }
        ,no: function(index, layero){
            //按钮【按钮二】的回调

            //return false 开启该代码可禁止点击该按钮关闭
        }
        ,cancel: function(){
            //右上角关闭回调

            //return false 开启该代码可禁止点击该按钮关闭
        }
        ,success:function (layero, index) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            if (task == 1){
                gid = document.getElementById('sbxiaotian').innerText;
            }
            iframeWin.groupinfo(task,gid);
            if (task == 1){
                iframeWin.document.getElementById('groupName').value='213213';
                var body = layer.getChildFrame('body', index);
                console.log(body.html())
            }
            // var iframeWin = window[layero.find('iframe')[0]['name']];

        }
    });
}


function groupinfo(task,groupId) {
    var Nodesd = getGroupUserTree(groupId,"");
    // console.log(Nodesd);

    var zztree = $("#treeDemo").TransferTree({
        zNodes: Nodesd
    });
    //重置选择项
    $("#btn-reset").on("click", function () {
        //按照zTree数据格式
        var resetzNodes = [
            { id: 1, pId: 0, name: "集团", open: true, checked: false, searchdata: "1111" },
            { id: 11, pId: 1, name: "一汽", open: true, checked: false, searchdata: '2222' },
            { id: 111, pId: 11, name: "一汽子成员1", checked: true, searchdata: '3333' },
            { id: 112, pId: 11, name: "一汽子成员2", checked: true, searchdata: '4444' },
            { id: 12, pId: 1, name: "二汽", open: true, checked: false, searchdata: '5555' },
            { id: 121, pId: 12, name: "二汽子成员1", checked: false, searchdata: '6666' },
            { id: 122, pId: 12, name: "二汽子成员2", checked: false, searchdata: '7777' },
            { id: 2, pId: 0, name: "集团 2", checked: true, open: true, searchdata: '888' },
            { id: 21, pId: 2, name: "一汽", checked: true, searchdata: '99' },
            { id: 22, pId: 2, name: "二汽", open: true, checked: false, searchdata: '4154' },
            { id: 221, pId: 22, name: "二汽1", checked: false, searchdata: '245' },
            { id: 222, pId: 22, name: "二汽2", checked: false, searchdata: '321321' },
            { id: 23, pId: 2, name: "三汽", checked: false, searchdata: '444' }
        ];
        zztree.resetData(resetzNodes);
    });
    // //获取选中项by id
    // $("#btn-confirm-id").on("click", function () {
    //
    //     $(".data").html(userIdList);
    // });
    // //获取选中项by obj
    // $("#btn-confirm-obj").on("click", function () {
    //     var getData2 = zztree.getCheckData('obj');
    //     $(".data").html(JSON.stringify(getData2));
    // });
}


function getUserIdList() {

    var treeObj  = $.fn.zTree.getZTreeObj("treeDemo");
    var Liarr = treeObj.getCheckedNodes();
    var Liid=[];
    $.each(Liarr, function (i, item) {
        Liid.push(item.id);
    });
    return Liid.toString();
}
// 搜索用户
function searchUser(groupId,userName) {
    var treeObj  = $.fn.zTree.getZTreeObj("treeDemo");
    var res = getGroupUserTree()
    treeObj.resetData()
}
//群组创建0，群组编辑1，群组关闭2
//群组创建 groupId = 0
function GroupTask(task,groupId){
    var groupName = document.getElementById("groupName").value;
    var groupDescribe = document.getElementById("groupDescribe").value;
    var userIdList = getUserIdList();//选中人员ID
    var res = '';
    if (groupName == ''){
        return "请填写群组名称"
    }
    if (userIdList == ''){
        return "请选择人员";
    }
    console.log(userIdList);
    if (task == 0){
        $.ajax({
            type: 'post',
            url: '/groupController/createGroup',
            data: {'groupId': groupId
                ,'task':task
                ,'groupName':groupName
                ,'userIdList':userIdList
                ,'levels':1
                ,'groupDescribe':groupDescribe},
            async: false,
            cache: false,
            success: function (data) {
                res = '创建成功';
            },
            error: function () {
                res = '创建失败请重试！';
            }
        });
    }
    else if(task == 1)
    {
        $.ajax({
            type: 'post',
            url: '/groupController/updateGroup',
            data: {'groupId': groupId
                ,'groupName':groupName
                ,'userIdList':userIdList
                ,'groupDescribe':groupDescribe},
            async: false,
            cache: false,
            success: function () {
                res = '更新成功';
            },
            error: function () {
                res = '更新失败请重试！';
            }
        });
    }
    else {
        res = task;
    }
    return res;
}

function getGroupUserTree(groupId,userName) {
    var res = "";
    $.ajax({
        type: 'post',
        url: '/groupController/getGroupEditOrgInf',
        data: {'groupId': groupId
        ,'userName':userName},
        async: false,
        cache: false,
        success: function (data) {
            console.log(data);
            res = data;
        },
        error: function () {
            res = '';
        }
    });
    return res;
}