package com.casic.flatform.model;

import java.util.Date;

/**
 * 讨论组成员关联表
 * 
 * @author hanxu
 */
public class GroupUserRefModel {

	private String userId;
	private String userIdArray;// 表中没有
	private String groupId;
	private Date enterTime;
	private Date endTime;
	private String creator;
	private String role;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserIdArray() {
		return userIdArray;
	}

	public void setUserIdArray(String userIdArray) {
		this.userIdArray = userIdArray;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public Date getEnterTime() {
		return enterTime;
	}

	public void setEnterTime(Date enterTime) {
		this.enterTime = enterTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

}
