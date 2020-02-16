package com.casic.flatform.vo.message;

public class ToMsgInfo {
//    username: "纸飞机" //消息来源用户名
//            ,avatar: "http://tp1.sinaimg.cn/1571889140/180/40030060651/1" //消息来源用户头像
//            ,id: "100000" //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
//            ,type: "friend" //聊天窗口来源类型，从发送消息传递的to里面获取
//            ,content: "嗨，你好！本消息系离线消息。" //消息内容
//            ,cid: 0 //消息id，可不传。除非你要对消息进行一些操作（如撤回）
//            ,mine: false //是否我发送的消息，如果为true，则会显示在右方
//            ,fromid: "100000" //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
//            ,timestamp: 1467475443306 //服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
    private String username;
    private String avatar;
    private String id;
    private String type;
    private String content;
    private String cid;
    private boolean mine;
    private String fromid;
    private long timestamp;
    public void setUsername(String username) {
        this.username = username;
    }
    public String getUsername() {
        return username;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    public String getAvatar() {
        return avatar;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getId() {
        return id;
    }

    public void setType(String type) {
        this.type = type;
    }
    public String getType() {
        return type;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public String getContent() {
        return content;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }
    public String getCid() {
        return cid;
    }

    public void setMine(boolean mine) {
        this.mine = mine;
    }
    public boolean getMine() {
        return mine;
    }

    public void setFromid(String fromid) {
        this.fromid = fromid;
    }
    public String getFromid() {
        return fromid;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
    public long getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return "{" +
                "username='" + username + '\'' +
                ", avatar='" + avatar + '\'' +
                ", id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", content='" + content + '\'' +
                ", cid='" + cid + '\'' +
                ", mine=" + mine +
                ", fromid='" + fromid + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
