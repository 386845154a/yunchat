package com.casic.flatform.model;

import java.util.Date;

public class MeetingModel {
	private String meetid; // 会议ID
	private String meetname; // 会议名称
	private String meettype; // 会议类型
	private Date stime; // 开始时间
	private String meettime; // 会议时长
	private String meetaddress; // 会议地点
	private String meetu; // 主持人
	private String meetclub; // 会务
	private String state; // 状态
	private String creater; // 创建人
	private String suser; // 发起人

	public String getMeetid() {
		return meetid;
	}

	public void setMeetid(String meetid) {
		this.meetid = meetid;
	}

	public String getMeetname() {
		return meetname;
	}

	public void setMeetname(String meetname) {
		this.meetname = meetname;
	}

	public String getMeettype() {
		return meettype;
	}

	public void setMeettype(String meettype) {
		this.meettype = meettype;
	}

	public Date getStime() {
		return stime;
	}

	public void setStime(Date stime) {
		this.stime = stime;
	}

	public String getMeettime() {
		return meettime;
	}

	public void setMeettime(String meettime) {
		this.meettime = meettime;
	}

	public String getMeetaddress() {
		return meetaddress;
	}

	public void setMeetaddress(String meetaddress) {
		this.meetaddress = meetaddress;
	}

	public String getMeetu() {
		return meetu;
	}

	public void setMeetu(String meetu) {
		this.meetu = meetu;
	}

	public String getMeetclub() {
		return meetclub;
	}

	public void setMeetclub(String meetclub) {
		this.meetclub = meetclub;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCreater() {
		return creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	public String getSuser() {
		return suser;
	}

	public void setSuser(String suser) {
		this.suser = suser;
	}

}
