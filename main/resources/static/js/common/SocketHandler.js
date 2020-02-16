var SocketHandler = function () {
    this.onopen = function (event, ws) {
        // ws.send('hello 连上了哦')
        // document.getElementById('contentId').innerHTML += 'hello 连上了哦<br>';
        console.log('hello 连上了哦');
    };

    /**
     * 收到服务器发来的消息
     * @param {*} event
     * @param {*} ws
     */
    this.onmessage = function (event, ws) {
        var res = event.data;
        res = JSON.parse(res);
        if(res.type === 'chatMessage'){
            layim.getMessage(res.data); //res.data即你发送消息传递的数据（阅读：监听发送的消息）
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