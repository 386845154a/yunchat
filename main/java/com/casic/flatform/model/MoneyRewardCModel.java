package com.casic.flatform.model;

import java.util.Date;

/**
 * 赏金接收
 * 
 * @author zouct
 */
public class MoneyRewardCModel {

	private String cid; // 主键id
	private String collectid; // 收钱人id
	private String collectname; // 收钱人姓名
	private String projectc; // 项目
	private String linkid; // 关联id
	private String money; // 金额
	private Date collecttime; // 收钱时间
	private String isread; // 是否已读（1、是，2、否）

	public String getCid() {
		return cid;
	}

	public void setCid(String cid) {
		this.cid = cid;
	}

	public String getCollectid() {
		return collectid;
	}

	public void setCollectid(String collectid) {
		this.collectid = collectid;
	}

	public String getCollectname() {
		return collectname;
	}

	public void setCollectname(String collectname) {
		this.collectname = collectname;
	}

	public String getProjectc() {
		return projectc;
	}

	public void setProjectc(String projectc) {
		this.projectc = projectc;
	}

	public String getLinkid() {
		return linkid;
	}

	public void setLinkid(String linkid) {
		this.linkid = linkid;
	}

	public String getMoney() {
		return money;
	}

	public void setMoney(String money) {
		this.money = money;
	}

	public Date getCollecttime() {
		return collecttime;
	}

	public void setCollecttime(Date collecttime) {
		this.collecttime = collecttime;
	}

	public String getIsread() {
		return isread;
	}

	public void setIsread(String isread) {
		this.isread = isread;
	}

}
