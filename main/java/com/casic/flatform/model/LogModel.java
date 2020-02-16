package com.casic.flatform.model;

import java.util.Date;

/**
 * 日志文件
 * 
 * @author zouct
 */
public class LogModel {

	private String logId; // 日志Id
	private String type; // 日志类型
	private String content; // 日志内容
	private Date createTime; // 记录时间
	private String creater; // 创建人
	private String address; // 创建人ip
	private String fullName; // 姓名
	private String toolid; // 工具ID

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getLogId() {
		return logId;
	}

	public void setLogId(String logId) {
		this.logId = logId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getCreater() {
		return creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	public String getToolid() {
		return toolid;
	}

	public void setToolid(String toolid) {
		this.toolid = toolid;
	}

}
