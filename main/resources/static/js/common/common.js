$(function(){
    var orgdata = "";
    layui.config({
        base: '/ui/lay/mymodules/'
    }).use(['layim', 'eleTree'], function () {
        var user = getUserInfo();
        var layim = layui.layim;
        var eleTree = layui.eleTree;

        // 初始化网络
        var ws_protocol = 'ws'; // ws 或 wss
        var ip = '127.0.0.1';
        var port = 9327;

        var heartbeatTimeout = 5000; // 心跳超时时间，单位：毫秒
        var reconnInterval = 1000; // 重连间隔时间，单位：毫秒

        var binaryType = 'blob'; // 'blob' or 'arraybuffer';//arraybuffer是字节
        var handler = new socketHandler();
        var queryString = "userId=" + user.userId;;
        var param = "";
        tiows = new tio.ws(ws_protocol, ip, port, queryString, param, handler, heartbeatTimeout, reconnInterval, binaryType);
        tiows.connect();
        function getUserInfo() {
            var userInfo = "";
            $.ajax({
                type: 'post',
                url: '/homeController/loginUserInfo',
                async: false,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    userInfo = data;
                }
            });
            return userInfo;
        }

        function socketHandler(){
            this.onopen = function (event, ws) {
                // ws.send('hello 连上了哦')
                // document.getElementById('contentId').innerHTML += 'hello 连上了哦<br>';
                console.log('hello 连上了send哦');
            };

            /**
             * 收到服务器发来的消息
             * @param {*} event
             * @param {*} ws
             */
            this.onmessage = function (event, ws) {
                var res = event.data;
                res = JSON.parse(res);
                if(res.type === 'friend'){
                    layim.getMessage(res); //res.data即你发送消息传递的数据（阅读：监听发送的消息）
                }
            };

            this.onclose = function (e, ws) {
                // error(e, ws)
            };

            this.onerror = function (e, ws) {
                // error(e, ws)
            };

            /**
             * 发送心跳，本框架会自动定时调用该方法，请在该方法中发送心跳
             * @param {*} ws
             */
            this.ping = function (ws) {
                // log("发心跳了")
                ws.send('心跳内容')
            }
        }


        function getGroup () {
            var grouplist = "";
            $.ajax({
                type: 'post',
                url: '/homeController/queryGroupForNew',
                async: false,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    grouplist = data;
                }
            });
            return grouplist;
        }
        //基础配置
        layim.config({
            init: {
                mine: {
                    "username": user.fullname
                    , "id": user.userId
                    , "status": "online"
                    , "sign": "云雀-我就是云雀"
                    , "avatar": user.avatar
                }
                , friend: []
                , group: getGroup ()
            } //获取主面板列表信息，下文会做进一步介绍

            //获取群员接口（返回的数据格式见下文）
            , members: {
                url: '' //接口地址（返回的数据格式见下文）
                , type: 'get' //默认get，一般可不填
                , data: {} //额外参数
            }
            , brief: false //是否简约模式（如果true则不显示主面板）
            //上传图片接口（返回的数据格式见下文），若不开启图片上传，剔除该项即可
            , uploadImage: {
                url: '' //接口地址
                , type: 'post' //默认post
            }

            //上传文件接口（返回的数据格式见下文），若不开启文件上传，剔除该项即可
            , uploadFile: {
                url: '' //接口地址
                , type: 'post' //默认post
            }
            //扩展工具栏，下文会做进一步介绍（如果无需扩展，剔除该项即可）
            // , tool: [{
            //     alias: 'code' //工具别名
            //     , title: '代码' //工具名称
            //     , icon: '&#xe64e;' //工具图标，参考图标文档
            // }]
            , msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
            , find: layui.cache.dir + 'css/modules/groupEdit/groupEdit.html' //发现页面地址，若不开启，剔除该项即可
            , chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html' //聊天记录页面地址，若不开启，剔除该项即可
        });
        // 监听在线状态切换
        layim.on('online', function (status) {
            console.log(status); //获得online或者hide

            //此时，你就可以通过Ajax将这个状态值记录到数据库中了。
            //服务端接口需自写。
        });
        // 监听修改签名
        layim.on('sign', function (value) {
            console.log(value); //获得新的签名

            //此时，你就可以通过Ajax将新的签名同步到数据库中了。
        });

        $(".eleTree-search").on("change", function () {
            console.log("搜索了");
            if ($(this).val()){
                $.ajax({
                    type : 'post',
                    url : '/homeController/getOrgDataByUserName',
                    data: {'noLogUser' : "true",
                        'userName':$(this).val()},
                    async:false,
                    cache: false,
                    success:function (res) {
                        let eles=eleTree.render({
                            elem: '#layui-contacts',
                            // data: data,
                            // showCheckbox: true,
                            defaultExpandAll: true,
                            defaultCheckedKeys: [23,24],
                            accordion: false
                        });
                        console.log(res);
                        eles.reload({data:res});
                    }
                });
            }else {
                console.log("mmbv");
                showTree();
            }
        });


        $.ajax({
            type: 'post',
            url: '/homeController/getOrgDataByPid',
            data: {'pid': '0000'},
            async: false,
            cache: false,
            success: function (data) {
                console.log(data);
                orgdata = data;
            }
        });

        showTree();
        // 节点点击事件
        eleTree.on("nodeClick(treeEven)",function(d) {
            console.log(d.data);    // 点击节点对应的数据
            // debugger
            if (d.data.currentData.isLeaf){
                // change_chat(d.data.currentData.id,d.data.currentData.label,"user",this);
                addFriendChat(d.data.currentData.label, d.data.currentData.id);
            }else {
                // console.log("23123")
            }

        });

        function showTree() {
            let el6=eleTree.render({
                elem: '#layui-contacts',
                data: orgdata,
                // showCheckbox: true,
                defaultExpandAll: true,
                // defaultCheckedKeys: [23,24],
                // accordion: false,
                highlightCurrent:true,
                showLine:true,
                async:false,
                lazy: true,
                load: function(data,callback){
                    console.log('jiazai')
                    console.log(data);
                    console.log(data.children.length);
                    let newData;
                    if (data.leaf == 0)
                    {
                        $.ajax({
                            type : 'post',
                            url : '/homeController/getOrgDataByPid',
                            data: {'pid' : data.id},
                            async:false,
                            cache: false,
                            success:function (res) {
                                // console.log(res)
                                newData =res
                            }
                        })
                        // setTimeout(function() {

                        // },500);
                    }
                    else {
                        $.ajax({
                            type : 'post',
                            url : '/homeController/getUserDataByPid',
                            data: {'pid' : data.id},
                            async:false,
                            cache: false,
                            success:function (res) {
                                // console.log(res)
                                newData =res
                            }
                        })
                    }

                    callback(newData);
                },
                searchNodeMethod: function(value,data) {
                    if (!value) return true;
                    return data.label.indexOf(value) !== -1;
                }
            });
        }
        //手风琴模式

        layim.on('sendMessage', function (res) {
            var mine = res.mine; //包含我发送的消息及我的信息
            var to = res.to; //对方的信息

            //监听到上述消息后，就可以轻松地发送socket了，如：
            tiows.send(JSON.stringify({
                type: 'friend' //随便定义，用于在服务端区分消息类型
                , data: res
            }));
        });

        // addFriendChat("系统通知",10086);

        function addFriendChat(name, id) {
            layim.chat({
                name: name //名称
                , type: 'friend' //聊天类型
                , avatar: 'http://tp1.sinaimg.cn/5619439268/180/40030060651/1' //头像
                , id: id //好友id
            })
        }
    });
});



