package com.casic.flatform.model;

import java.util.Date;

/**
 * 工具详情
 * 
 * @author zouct
 */
public class DetailsModel {

	private String detaileId;
	private String pid;
	private String talkLeve;
	private String talkContent;
	private String isApprove;
	private String writer;
	private Date createtime;
	private String sender;

	public String getDetaileId() {
		return detaileId;
	}

	public void setDetaileId(String detaileId) {
		this.detaileId = detaileId;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getTalkLeve() {
		return talkLeve;
	}

	public void setTalkLeve(String talkLeve) {
		this.talkLeve = talkLeve;
	}

	public String getTalkContent() {
		return talkContent;
	}

	public void setTalkContent(String talkContent) {
		this.talkContent = talkContent;
	}

	public String getIsApprove() {
		return isApprove;
	}

	public void setIsApprove(String isApprove) {
		this.isApprove = isApprove;
	}

	public String getWriter() {
		return writer;
	}

	public void setWriter(String writer) {
		this.writer = writer;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

}
