package com.casic.flatform.model;

/**
 * AT人员 pf_at
 * 
 * @author zouct
 */
public class ATModel {

	private String id; // id
	private String groupid; // 群组id
	private String receiverid; // 被@人id

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getGroupid() {
		return groupid;
	}

	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}

	public String getReceiverid() {
		return receiverid;
	}

	public void setReceiverid(String receiverid) {
		this.receiverid = receiverid;
	}

}
