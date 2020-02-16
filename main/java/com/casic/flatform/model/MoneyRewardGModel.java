package com.casic.flatform.model;

import java.util.Date;

/**
 * 赏金发起
 * 
 * @author zouct
 */
public class MoneyRewardGModel {

	private String gid; // 主键id
	private String senderid; // 发起人id
	private String sendername; // 发起人姓名
	private String projectg; // 项目
	private String totalmoney; // 总金额
	private Date sendtime; // 发钱时间

	public String getGid() {
		return gid;
	}

	public void setGid(String gid) {
		this.gid = gid;
	}

	public String getSenderid() {
		return senderid;
	}

	public void setSenderid(String senderid) {
		this.senderid = senderid;
	}

	public String getSendername() {
		return sendername;
	}

	public void setSendername(String sendername) {
		this.sendername = sendername;
	}

	public String getProjectg() {
		return projectg;
	}

	public void setProjectg(String projectg) {
		this.projectg = projectg;
	}

	public String getTotalmoney() {
		return totalmoney;
	}

	public void setTotalmoney(String totalmoney) {
		this.totalmoney = totalmoney;
	}

	public Date getSendtime() {
		return sendtime;
	}

	public void setSendtime(Date sendtime) {
		this.sendtime = sendtime;
	}

}
