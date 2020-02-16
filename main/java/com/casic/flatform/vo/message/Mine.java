package com.casic.flatform.vo.message;

public class Mine {
    private String username;
    private String id;
    private boolean mine;
    private String content;
    private String avatar;

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public String getUsername() {
        return username;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getId() {
        return id;
    }

    public void setMine(boolean mine) {
        this.mine = mine;
    }
    public boolean getMine() {
        return mine;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public String getContent() {
        return content;
    }
}
