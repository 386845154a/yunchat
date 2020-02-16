$(function(){


    var orgdata = "";

//
//     layui.config({
//         base: '/ui/lay/mymodules/'
//     }).use(['form', 'layedit', 'laydate','transfer', 'layer', 'util', 'eleTree','step'], function()
//     {
//         var form = layui.form
//             ,layer = layui.layer
//             ,layedit = layui.layedit
//             ,laydate = layui.laydate
//             ,transfer = layui.transfer
//             ,util = layui.util
//             ,eleTree = layui.eleTree
//             ,step = layui.step;
//
//
//         $.ajax({
//             type: 'post',
//             url: '/homeController/getOrgDataByPid',
//             data: {'pid': '0000'},
//             async: false,
//             cache: false,
//             success: function (data) {
//                 console.log(data);
//                 orgdata = data;
//             }
//         });
//
//
//         let protocol = {
//             _tpl: `
//                  <div class="layui-form-item">
//                     <label class="layui-form-label">群组名称</label>
//                     <div class="layui-input-block">
//                         <input type="text" id="groupName" lay-verify="title" autocomplete="off" placeholder="请输入群组名称" class="layui-input">
//                     </div>
//                 </div>
//                 <div class="layui-form-item layui-form-text">
//                     <label class="layui-form-label">备注</label>
//                     <div class="layui-input-block">
//                         <textarea placeholder="请输入内容" class="layui-textarea" id="groupDescribe"></textarea>
//                     </div>
//                 </div>
//                  <div style="margin: 0 auto;width: 35px">
// <!--                    <button id="agree" class="layui-btn next layui-btn-sm layui-btn-normal">下一步</button>-->
//                     <button id="agree" type="button" class="layui-btn">下一步</button>
//
//                  </div>
//                  <div style="margin: 0 auto;width: 500px"> <i class="layui-icon layui-icon-about" style="margin: 0 auto;font-size: 15px; color: #ff0007;">群组密级为公开，请不要在里面讨论涉密信息</i> </div>
//                         {{#
//                             d.init()
//                         }}
//                 `,
//             ctx: {
//                 init: () => {
//                     console.log('content:1')
//                     setTimeout(() => {
//                         $('#agree').on('click', e => {
//                             console.log(document.getElementById("groupName").value)
//                             // console.log(document.getElementById("levels").value)
//                             console.log(document.getElementById("groupDescribe").value)
//                             // console.log(document.getElementById("zzz").value)
//
//                             if (document.getElementById("groupName").value == ''){
//                                 layer.msg("请确认项目名称不为空");
//                             }
//                             else {
//                                 step.next()
//                             }
//                         })
//                     })
//                 }
//             }
//         }
//
//         let information = {
//             _tpl: `
//                     <div class="content_wrap">
//                         <div class="zTreeDemoBackground left">
//                             <div class="input-search">
//                                 <input type="text" placeholder="输入关键字查询" id="filter-text" class="empty" /><span style="color:red;font-size:12px;position:absolute;left:0;right:0;top:40px;display:none;" class="no-data">查找不到结果~</span>
//                             </div>
//                             <div class="tree-content">
//                                 <ul id="treeDemo" class="ztree"></ul>
//                             </div>
//                         </div>
//                         <div class="right">
//                             <ul class="choose-content">
//                             </ul>
//                         </div>
//                     </div>
//                     <br/>
//                     <button id="btn-reset">重置数据项</button>&nbsp;<button id="btn-confirm-id">获取选中数据(id)</button>&nbsp;<button id="btn-confirm-obj">获取选中数据(obj)</button>
//                     <div class="choose-data">
//                         <div class="choose-data">
//                             <span>当前选中数据为:</span><br/>
//                             <div class="data">暂无数据</div>
//                         </div>
//                     </div>
//                         {{#
//                             d.init()
//                         }}
//                 `,
//             ctx: {
//                 init: () => {
//                     console.log('content:2')
//                     form.on('submit(btn-reset)', data => {
//                         // userIdList = transfer.getData('chooseUser');
//                         // console.log(JSON.stringify(userIdList))
//                         step.next()
//                         return false
//                     }),
//                         form.on('submit(prevSubmit)', data => {
//                             step.prev()
//                             return false
//                         })
//                 }
//             }
//         }
//
//         let result = {
//             _tpl: `
//                     <div style="text-align: center">
//                         <div>
//                             <i class="layui-icon layui-icon-ok" style="font-size: 50px; color: #5FB878;"></i>
//                         </div>
//                         <button id="again" class="layui-btn layui-btn-normal">再来一次</button>
//                         {{#
//                             d.init()
//                         }}
//                     </div>
//                 `,
//             ctx: {
//                 init: () => {
//                     setTimeout(() => {
//                         $('#again').on('click', e => {
//                             step.next()
//                         })
//                     })
//                     console.log('content:3')
//                 }
//             }
//         }
//
//
//         step.run({
//             // 参数配置...
//             elem: '#StepWrapper_wrapper',
//             stepWidth: '1000px',
//             contentWidth: '990px',
//             contentHeight: '600px',
//             nodes: [
//                 {
//                     tip: '群组信息',
//                 },
//                 {
//                     tip: '人员信息',
//                 },
//                 {
//                     tip: '创建结果',
//                 }
//             ],
//             contents: [protocol, information, result]
//         })
//
//                //模拟数据2
//         function getUserInfo() {
//             var userInfo = "";
//             $.ajax({
//                 type: 'post',
//                 url: '/homeController/loginUserInfo',
//                 async: false,
//                 dataType: "json",
//                 success: function (data) {
//                     console.log(data);
//                     userInfo = data;
//                 },
//                 error: function (e) {
//                     console.log(e)
//                 }
//             });
//             return userInfo;
//         }
//         getUserInfo();
//         var data3 = [
//             {
//             title: '早餐'
//             ,id: 1
//             ,children: [{
//                 title: '油条'
//                 ,id: 5
//             },{
//                 title: '包子'
//                 ,id: 6
//             },{
//                 title: '豆浆'
//                 ,id: 7
//             }]
//         },{
//             title: '午餐'
//             ,id: 2
//             ,checked: true
//             ,children: [{
//                 title: '藜蒿炒腊肉'
//                 ,id: 8
//             },{
//                 title: '西湖醋鱼'
//                 ,id: 9
//             },{
//                 title: '小白菜'
//                 ,id: 10
//             },{
//                 title: '海带排骨汤'
//                 ,id: 11
//             }]
//         },{
//             title: '晚餐'
//             ,id: 3
//             ,children: [{
//                 title: '红烧肉'
//                 ,id: 12
//                 ,fixed: true
//             },{
//                 title: '番茄炒蛋'
//                 ,id: 13
//             }]
//         },{
//             title: '夜宵'
//             ,id: 4
//             ,children: [{
//                 title: '小龙虾'
//                 ,id: 14
//                 ,checked: true
//             },{
//                 title: '香辣蟹'
//                 ,id: 15
//                 ,disabled: true
//             },{
//                 title: '烤鱿鱼'
//                 ,id: 16
//             }]
//         }];
//         // 显示搜索框
//         transfer.render({
//             elem: '#test4'
//             // ,data: data1
//             ,title: ['用户', '已选择']
//             ,showSearch: true
//             ,id:'chooseUser'
//         });
//
//         // eleTree.render({
//         //     elem: '#test5'
//         //     ,data: data3
//         //     ,onlyIconControl: true  //是否仅允许节点左侧图标控制展开收缩
//         //     ,click: function(obj){
//         //         layer.msg(JSON.stringify(obj.data));
//         //         transfer.reload('chooseUser',{data:data1,
//         //             showSearch: true})
//         //     }
//         // });
//
//         eleTree.render({
//             elem: '#test5',
//             data: orgdata,
//             // showCheckbox: true,
//             defaultExpandAll: true,
//             // defaultCheckedKeys: [23,24],
//             // accordion: false,
//             highlightCurrent:true,
//             showLine:true,
//             async:false,
//             lazy: true,
//             load: function(data,callback){
//                 console.log('jiazai')
//                 console.log(data);
//                 console.log(data.children.length);
//
//                 var userIdListTemp = JSON.stringify(transfer.getData('chooseUser'));
//                 console.log(userIdListTemp)
//                 let newData;
//                 if (data.leaf == 0)
//                 {
//                     $.ajax({
//                         type : 'post',
//                         url : '/homeController/getOrgDataByPid',
//                         data: {'pid' : data.id},
//                         async:false,
//                         cache: false,
//                         success:function (res) {
//                             // console.log(res)
//                             newData =res
//                         }
//                     })
//                     // setTimeout(function() {
//                     callback(newData);
//                     // },500);
//                 }
//                 else {
//                     debugger;
//                     $.ajax({
//                         type : 'post',
//                         url : '/homeController/getUserDataByPid',
//                         data: {'pid' : data.id},
//                         async:false,
//                         cache: false,
//                         success:function (res) {
//                             transfer.reload('chooseUser',{
//                                 data:res
//                                 ,showSearch: true
//                                 ,value:userIdListTemp
//                                 ,parseData: function(res){
//                                 return {
//                                     "value": res.id //数据值
//                                     ,"title": res.label //数据标题
//                                 }
//
//                             }})
//                             console.log(res)
//                             // newData =res
//                         }
//                     })
//                 }
//
//                 //
//             },
//             searchNodeMethod: function(value,data) {
//                 if (!value) return true;
//                 return data.label.indexOf(value) !== -1;
//             }
//         });
//
//         //日期
//         laydate.render({
//             elem: '#date'
//         });
//         laydate.render({
//             elem: '#date1'
//         });
//
//         //创建一个编辑器
//         var editIndex = layedit.build('LAY_demo_editor');
//
//         //自定义验证规则
//         form.verify({
//             title: function(value){
//                 if(value.length < 5){
//                     return '标题至少得5个字符啊';
//                 }
//             }
//             ,pass: [
//                 /^[\S]{6,12}$/
//                 ,'密码必须6到12位，且不能出现空格'
//             ]
//             ,content: function(value){
//                 layedit.sync(editIndex);
//             }
//         });
//
//         //监听指定开关
//         form.on('switch(switchTest)', function(data){
//             layer.msg('开关checked：'+ (this.checked ? 'true' : 'false'), {
//                 offset: '6px'
//             });
//             layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
//         });
//
//         // //监听提交
//         // form.on('submit(demo1)', function(data){
//         //     layer.alert(JSON.stringify(data.field), {
//         //         title: '最终的提交信息'
//         //     })
//         //     return false;
//         // });
//
//         //表单赋值
//         layui.$('#LAY-component-form-setval').on('click', function(){
//             form.val('example', {
//                 "username": "贤心" // "name": "value"
//                 ,"password": "123456"
//                 ,"interest": 1
//                 ,"like[write]": true //复选框选中状态
//                 ,"close": true //开关状态
//                 ,"sex": "女"
//                 ,"desc": "我爱 layui"
//             });
//         });
//
//         //表单取值
//         layui.$('#LAY-component-form-getval').on('click', function(){
//             var data = form.val('example');
//             alert(JSON.stringify(data));
//         });
//
//         // //监听提交
//         // form.on('submit(demo1)', function(data){
//         //     layer.msg(JSON.stringify(data.field));
//         //     return false;
//         // });
//     });
//
//


});

function createGroupIm (task,groupId){
    layer.open({
        type: 2
        ,content: ['http://127.0.0.1:8888/ui/css/modules/group/groupFrom.html','no'] //这里content是一个普通的String
        ,area: ['1000px', '660px']
        ,title:groupId
        ,btn: ['创建群组', '取消创建']
        ,yes: function(index, layero){
            //按钮【按钮一】的回调
            var iframeWin = window[layero.find('iframe')[0]['name']];

            var res = iframeWin.GroupTask(task,groupId);
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
            iframeWin.groupinfo(task,groupId);
            if (task == 1){

                // debugger
                iframeWin.document.getElementById('groupName').value='213213';
                var body = layer.getChildFrame('body', index);
                console.log(body.html())

            }
            // var iframeWin = window[layero.find('iframe')[0]['name']];

        }
    });
}


function groupinfo(task,groupId) {

    // var Nodesd = [
    //     { id: 1, pId: 0, name: "集团", checked: false },
    //     { id: 11, pId: 1, name: "一汽", checked: false},
    //     { id: 111, pId: 11, name: "一汽子成员1", checked: true },
    //     { id: 112, pId: 11, name: "一汽子成员2", checked: true},
    //     { id: 12, pId: 1, name: "二汽",checked: false },
    //     { id: 121, pId: 12, name: "二汽子成员1", checked: false },
    //     { id: 122, pId: 12, name: "二汽子成员2", checked: false },
    //     { id: 2, pId: 0, name: "集团 2", checked: true },
    //     { id: 21, pId: 2, name: "一汽", checked: true },
    //     { id: 22, pId: 2, name: "二汽", open: true },
    //     { id: 221, pId: 22, name: "二汽1", checked: false },
    //     { id: 222, pId: 22, name: "二汽2", checked: false },
    //     { id: 23, pId: 2, name: "三汽", checked: false }
    // ];
     var Nodesd1 =[{name:"测试部门264", id:"6776", pId:"0000", checked:false},{name:"测试部门24", id:"9", pId:"0000", checked:false},{name:"测试用户111", id:"1", pId:"9", checked:false},{name:"测试用户13", id:"100000256000031", pId:"9", checked:false},
         {name:"测试用户711", id:"100000256000073", pId:"9", checked:false},{name:"测试用户11", id:"2110221998090971654", pId:"9", checked:false},{name:"测试用户15", id:"923", pId:"9", checked:false},{name:"测试用户12", id:"userTest111111", pId:"9", checked:false},
         {name:"测试用户811", id:"100000256000082", pId:"9", checked:false},{name:"测试用户211", id:"2", pId:"9", checked:false},{name:"测试用户611", id:"100000256000054", pId:"9", checked:false},{name:"测试用户111", id:"100000256000091", pId:"9", checked:false},
         {name:"测试用户4111", id:"100000256000011", pId:"9", checked:false},{name:"测试用户10", id:"100000256000101", pId:"9", checked:false},{name:"测试用户5111", id:"100000256000022", pId:"9", checked:false},{name:"测试部门13", id:"10002", pId:"0000", checked:false},
         {name:"测试部门15", id:"10003", pId:"0000", checked:false},{name:"测试部门16", id:"10004", pId:"0000", checked:false},{name:"测试部门17", id:"10005", pId:"0000", checked:false},{name:"测试部门18", id:"10006", pId:"0000", checked:false},
         {name:"测试部门19", id:"10007", pId:"0000", checked:false},{name:"测试部门20", id:"10008", pId:"0000", checked:false},{name:"测试部门21", id:"10009", pId:"0000", checked:false},{name:"测试部门165", id:"1212", pId:"0000", checked:false},
         {name:"测试部门166", id:"1313", pId:"0000", checked:false},{name:"测试部门1667", id:"1414", pId:"0000", checked:false},{name:"测试部门168", id:"1515", pId:"0000", checked:false},{name:"测试部门169", id:"1662", pId:"0000", checked:false},
         {name:"测试部门163", id:"221", pId:"0000", checked:false},{name:"测试部门260", id:"5454", pId:"0000", checked:false},{name:"测试部门261", id:"5656", pId:"0000", checked:false}];
    // [{name:"测试部门264", id:"6776", pId:"0000", checked:false},{name:"测试部门24", id:"9", pId:"0000", checked:false},{name:"测试用户111", id:"1", pId:"9", checked:false},{name:"测试用户13", id:"100000256000031", pId:"9", checked:false},
    //     {name:"测试用户711", id:"100000256000073", pId:"9", checked:false},{name:"测试用户11", id:"2110221998090971654", pId:"9", checked:false}];
    //  var Nodesd =
    // [{name:"测试部门264", id:"6776a", pId:"0000a", checked:false},
    //     {name:"测试部门24", id:"9a", pId:"0000a", checked:false},
    //     {name:"测试用户111", id:"1", pId:"9a", checked:false}]
    //     {name:"测试用户13", id:"100000256000031", pId:"9", checked:"false"},
    //     {name:"测试用户711", id:"100000256000073", pId:"9", checked:"false"},{name:"测试用户11", id:"2110221998090971654", pId:"9", checked:"false"},{name:"测试用户15", id:"923", pId:"9", checked:"false"},{name:"测试用户12", id:"userTest111111", pId:"9", checked:"false"},
    //     {name:"测试用户811", id:"100000256000082", pId:"9", checked:"false"},{name:"测试用户211", id:"2", pId:"9", checked:"false"},{name:"测试用户611", id:"100000256000054", pId:"9", checked:"false"},{name:"测试用户111", id:"100000256000091", pId:"9", checked:"false"},
    //     {name:"测试用户4111", id:"100000256000011", pId:"9", checked:"false"},{name:"测试用户10", id:"100000256000101", pId:"9", checked:"false"},{name:"测试用户5111", id:"100000256000022", pId:"9", checked:"false"},{name:"测试部门13", id:"10002", pId:"0000", checked:"false"},
    //     {name:"测试部门15", id:"10003", pId:"0000", checked:"false"},{name:"测试部门16", id:"10004", pId:"0000", checked:"false"},{name:"测试部门17", id:"10005", pId:"0000", checked:"false"},{name:"测试部门18", id:"10006", pId:"0000", checked:"false"},
    //     {name:"测试部门19", id:"10007", pId:"0000", checked:"false"},{name:"测试部门20", id:"10008", pId:"0000", checked:"false"},{name:"测试部门21", id:"10009", pId:"0000", checked:"false"},{name:"测试部门165", id:"1212", pId:"0000", checked:"false"},
    //     {name:"测试部门166", id:"1313", pId:"0000", checked:"false"},{name:"测试部门1667", id:"1414", pId:"0000", checked:"false"},{name:"测试部门168", id:"1515", pId:"0000", checked:"false"},
    //     {name:"测试部门169", id:"1662", pId:"0000", checked:"false"},{name:"测试部门163", id:"221", pId:"0000", checked:"false"},{name:"测试部门260", id:"5454", pId:"0000", checked:"false"},{name:"测试部门261", id:"5656", pId:"0000", checked:"false"}]
    var Nodesd = getGroupUserTree(groupId);
    console.log(Nodesd);

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
    // debugger
    return Liid.toString();
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
    return res;
}

function getGroupUserTree(groupId) {

    var res = "";
    $.ajax({
        type: 'post',
        url: '/groupController/getGroupEditOrgInf',
        data: {'groupId': groupId},
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