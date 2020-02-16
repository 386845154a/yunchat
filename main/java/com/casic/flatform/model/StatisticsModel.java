package com.casic.flatform.model;

import java.util.Date;

/**
 * @author 忠
 * @Description 后台数据统计
 * @date 2018-11-27 19:14
 */
public class StatisticsModel {

    private String content;  //数据
    private Integer num; //数量

    public String getLogdate() {
        return content;
    }

    public void setLogdate(String logdate) {
        this.content = logdate;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }






}
