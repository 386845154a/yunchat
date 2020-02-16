package com.casic.flatform.model;

import java.util.Date;

/**
 * pf_event_meeting_user
 * 
 * @author zouct
 *
 */
public class EventMeetModel {

	private String id; // ID
	private String userId; // 成员ID
	private String eventid; // 事件ID
	private String meetid; // 会议ID
	private String type;// 类型(1-时间，2-会议)
	private Date savetime; // 存储时间
	private String name; // 事件、会议类型

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getEventid() {
		return eventid;
	}

	public void setEventid(String eventid) {
		this.eventid = eventid;
	}

	public String getMeetid() {
		return meetid;
	}

	public void setMeetid(String meetid) {
		this.meetid = meetid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Date getSavetime() {
		return savetime;
	}

	public void setSavetime(Date savetime) {
		this.savetime = savetime;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
