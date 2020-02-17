package com.casic.flatform.vo.message;

/**
 * 信息vo
 */

public class CommonVo {
    //0表示成功，其它表示失败
    private String code = "0";
    //失败信息
    private String msg = "成功";
    //成员列表
    private Object data;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
