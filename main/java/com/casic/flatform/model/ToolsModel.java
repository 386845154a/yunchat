package com.casic.flatform.model;

import java.util.Date;

/**
 * 工具文件
 * 
 * @author zouct
 */
public class ToolsModel {

	private String fileId;
	private String fileName;
	private String path;
	private String readPath;
	private Date sendTime;
	private String sender;
	private String classification;
	private String fileFalg;
	private String version;
	private String use;
	private String note;
	private String isApprove;
	private Integer downc;
	private String leves;
	private String roomid;
	private String grade;
	private String isregister;
	private String state; // 状态( 0-新上传，1-待审批，2-已审批)
	private String approval; // 审批意见
	private String approver; // 审批人
	private String updater; // 修改人

	public String getFileId() {
		return fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getReadPath() {
		return readPath;
	}

	public void setReadPath(String readPath) {
		this.readPath = readPath;
	}

	public Date getSendTime() {
		return sendTime;
	}

	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getClassification() {
		return classification;
	}

	public void setClassification(String classification) {
		this.classification = classification;
	}

	public String getFileFalg() {
		return fileFalg;
	}

	public void setFileFalg(String fileFalg) {
		this.fileFalg = fileFalg;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getUse() {
		return use;
	}

	public void setUse(String use) {
		this.use = use;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getIsApprove() {
		return isApprove;
	}

	public void setIsApprove(String isApprove) {
		this.isApprove = isApprove;
	}

	public Integer getDownc() {
		return downc;
	}

	public void setDownc(Integer downc) {
		this.downc = downc;
	}

	public String getLeves() {
		return leves;
	}

	public void setLeves(String leves) {
		this.leves = leves;
	}

	public String getRoomid() {
		return roomid;
	}

	public void setRoomid(String roomid) {
		this.roomid = roomid;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public String getIsregister() {
		return isregister;
	}

	public void setIsregister(String isregister) {
		this.isregister = isregister;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getApproval() {
		return approval;
	}

	public void setApproval(String approval) {
		this.approval = approval;
	}

	public String getApprover() {
		return approver;
	}

	public void setApprover(String approver) {
		this.approver = approver;
	}

	public String getUpdater() {
		return updater;
	}

	public void setUpdater(String updater) {
		this.updater = updater;
	}

}
