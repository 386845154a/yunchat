var ws_protocol = 'ws'; // ws 或 wss
var ip = '127.0.0.1';
var port = 9326;
var heartbeatTimeout = 5000; // 心跳超时时间，单位：毫秒
var reconnInterval = 1000; // 重连间隔时间，单位：毫秒

var binaryType = 'blob'; // 'blob' or 'arraybuffer';//arraybuffer是字节
var handler = new clienthandler();

var tiows;

var userdata;

function initWs () {
    // session.getAttribute("user");
    $.ajax({
        type : 'post',
        url : '/homeController/getNewPersonName',
        async : false,
        success : function(data) {
            // console.log(JSON.stringify(data));
            userdata = data;
            initsocket(data.fullName,1,data.Id);
        },
        error : function(err) {
            console.log(err);
        }
    });
}

function initsocket(name,userid,type) {
// debugger;
    var queryString = 'name='+name+'&type='+type+'&id='+userid;
    var param = null;
    tiows = new tio.ws(ws_protocol, ip, port, queryString, param, handler, heartbeatTimeout, reconnInterval, binaryType);
    tiows.connect()
}
function send () {
   var aa =  JSInteraction.getLastTools();
    console.log(aa);
    console.log(JSON.stringify(tiows));
         // alert(editor.txt.text());
    var a = document.getElementById("msg_title").innerHTML;
    alert(a);

    tiows.param = '1111';
    // debugger;
     // tiows.add("recipient",'232');
    // tiows.setRequestHeader("recipient",'232');
        tiows.send(editor.txt.html());
        // editor.
}

function clearMsg () {
     document.getElementById('editor').innerHTML = '';
}
initWs();
