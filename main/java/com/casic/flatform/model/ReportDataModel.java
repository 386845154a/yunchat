package com.casic.flatform.model;

import java.util.Date;

/**
 * @author 忠
 * @Description
 * @date 2018-12-26 13:47
 */
public class ReportDataModel {
    private Integer personalDiscuss; //个人研讨数
    private Integer groupDiscuss; // 群组研讨数
    private Integer creatDiscuss; // 创建群组数
    private Integer uploadfile;  // 上传文档数
    private Integer downloadfile;    //下载文档数
    private Integer personalDiscussSum; //个人研讨数 总
    private Integer groupDiscussSum; //群组研讨数 总
    private Integer creatDiscussSum; //创建群组数 总
    private Integer uploadfileSum;//上传文档数 总
    private Integer downloadfileSum; // 下载文档数 总
    private Date firstBlood; // 初次登陆云雀时间
    private String head; // 初次登陆云雀时间

    public Integer getPersonalDiscuss() {
        return personalDiscuss;
    }

    public void setPersonalDiscuss(Integer personalDiscuss) {
        this.personalDiscuss = personalDiscuss;
    }

    public Integer getGroupDiscuss() {
        return groupDiscuss;
    }

    public void setGroupDiscuss(Integer groupDiscuss) {
        this.groupDiscuss = groupDiscuss;
    }

    public Integer getCreatDiscuss() {
        return creatDiscuss;
    }

    public void setCreatDiscuss(Integer creatDiscuss) {
        this.creatDiscuss = creatDiscuss;
    }

    public Integer getUploadfile() {
        return uploadfile;
    }

    public void setUploadfile(Integer uploadfile) {
        this.uploadfile = uploadfile;
    }

    public Integer getDownloadfile() {
        return downloadfile;
    }

    public void setDownloadfile(Integer downloadfile) {
        this.downloadfile = downloadfile;
    }

    public Integer getPersonalDiscussSum() {
        return personalDiscussSum;
    }

    public void setPersonalDiscussSum(Integer personalDiscussSum) {
        this.personalDiscussSum = personalDiscussSum;
    }

    public Integer getGroupDiscussSum() {
        return groupDiscussSum;
    }

    public void setGroupDiscussSum(Integer groupDiscussSum) {
        this.groupDiscussSum = groupDiscussSum;
    }

    public Integer getCreatDiscussSum() {
        return creatDiscussSum;
    }

    public void setCreatDiscussSum(Integer creatDiscussSum) {
        this.creatDiscussSum = creatDiscussSum;
    }

    public Integer getUploadfileSum() {
        return uploadfileSum;
    }

    public void setUploadfileSum(Integer uploadfileSum) {
        this.uploadfileSum = uploadfileSum;
    }

    public Integer getDownloadfileSum() {
        return downloadfileSum;
    }

    public void setDownloadfileSum(Integer downloadfileSum) {
        this.downloadfileSum = downloadfileSum;
    }

    public Date getFirstBlood() {
        return firstBlood;
    }

    public void setFirstBlood(Date firstBlood) {
        this.firstBlood = firstBlood;
    }

    public String getHead() {
        return head;
    }

    public void setHead(String head) {
        this.head = head;
    }
}
