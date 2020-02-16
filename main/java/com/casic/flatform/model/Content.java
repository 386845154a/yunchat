package com.casic.flatform.model;

import java.util.Date;

/**
 * @author 忠
 * @Description 返回内容信息实体类
 * @date 2018-12-14 11:16
 */
public class Content {
    private String type; //内容ID
    private String content; //具体内容
    private Date date; //内容产生时间

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }



    public void setContent(String content) {
        this.content = content;
    }

    public String getContent() {
            return content;
        }
}
