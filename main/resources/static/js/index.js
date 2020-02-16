

var tiows;

$(function(){
    socketinit();
    $(".sidebar-menu").on("click", "li", function(){
        var sId = $(this).data("id"); //获取data-id的值
        window.location.hash = sId; //设置锚点
        loadInner(sId);
    });
    function loadInner(sId){
        var sId = window.location.hash;
        var pathn, i;
        // alert(sId);
        switch(sId){
            case "#center": pathn = "score.html"; i = 0; break;
            case "#message": pathn = "message.html"; i = 1; break;
            case "#tools": pathn = "tools.html"; i = 2; break;
            case "#calendar": pathn = "calendar.html"; i = 3; break;
            default: pathn = "home.html"; i = 0; break;
        }
        $("#content").load(pathn); //加载相对应的内容
        $(".sidebar-menu li").eq(i).addClass("current").siblings().removeClass("current"); //当前列表高亮
    }
    var sId = window.location.hash;
    loadInner(sId);
});

function socketinit() {
    // 初始化网络
    var ws_protocol = 'ws'; // ws 或 wss
    var ip = '127.0.0.1';
    var port = 9326;

    var heartbeatTimeout = 5000; // 心跳超时时间，单位：毫秒
    var reconnInterval = 1000; // 重连间隔时间，单位：毫秒

    var binaryType = 'blob'; // 'blob' or 'arraybuffer';//arraybuffer是字节
    var handler = new SocketHandler();
    debugger;
    var queryString = 'name=kebi';
    var param = "token=11&userid=adfadsf";
    tiows = new tio.ws(ws_protocol, ip, port, queryString, param, handler, heartbeatTimeout, reconnInterval, binaryType);
    tiows.connect();
}

function send() {
    var msg = document.getElementById('messagetext');
    msgStyle(msg.value);
    tiows.send(msg.value);
}

function clearMsg() {
    document.getElementById('contentId').innerHTML = '';
}

function msgStyle(content) {
    document.getElementById('contentId').innerHTML += '' +
        '                        <div class="direct-chat-msg right">\n' +
        '                            <div class="direct-chat-info clearfix">\n' +
        '                                <span class="direct-chat-name pull-right">Sarah Bullock</span>\n' +
        '                                <span class="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span>\n' +
        '                            </div><!-- /.direct-chat-info -->\n' +
        '                            <img class="direct-chat-img" src="/AdminLTE/dist/img/user3-128x128.jpg" alt="message user image"/><!-- /.direct-chat-img -->\n' +
        '                            <div class="direct-chat-text">\n' +
        content +
        '                            </div>\n' +
        '                        </div>';
}
