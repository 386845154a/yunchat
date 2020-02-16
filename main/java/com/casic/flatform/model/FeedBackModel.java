package com.casic.flatform.model;

import java.util.Date;

public class FeedBackModel {
	private String fbackId;
	private String fbackContent;
	private String fbackPerson;
	private String fbackSolve;
	private Date fbackTime;
	private String replyMsg;

	public Date getFbackTime() {
		return fbackTime;
	}

	public void setFbackTime(Date fbackTime) {
		this.fbackTime = fbackTime;
	}

	public String getFbackId() {
		return fbackId;
	}

	public void setFbackId(String fbackId) {
		this.fbackId = fbackId;
	}

	public String getFbackContent() {
		return fbackContent;
	}

	public void setFbackContent(String fbackContent) {
		this.fbackContent = fbackContent;
	}

	public String getFbackPerson() {
		return fbackPerson;
	}

	public void setFbackPerson(String person) {
		this.fbackPerson = person;
	}

	public String getFbackSolve() {
		return fbackSolve;
	}

	public void setFbackSolve(String fbackSolve) {
		this.fbackSolve = fbackSolve;
	}

	public String getReplyMsg() {
		return replyMsg;
	}

	public void setReplyMsg(String replyMsg) {
		this.replyMsg = replyMsg;
	}

}
