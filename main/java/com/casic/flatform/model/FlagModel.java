package com.casic.flatform.model;

/**
 * pf_flag
 * 
 * @author zouct
 */
public class FlagModel {

	private String id; // 报表ID
	private String userId; // 用户ID
	private String report; // 年报标识
	private String welcome; // 欢迎页面 1 已读 5 停用 其他状态未读 (默认为0)

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

	public String getReport() {
		return report;
	}

	public void setReport(String report) {
		this.report = report;
	}

	public String getWelcome() {
		return welcome;
	}

	public void setWelcome(String welcome) {
		this.welcome = welcome;
	}

}
