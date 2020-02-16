package com.casic.flatform.model;

import java.util.Date;

/**
 * pf_downappor
 * 
 * @author zouct
 */
public class DownApporModel {

	private String id; // 主键id
	private String daid; // 资源id（工具id）
	private String daname; // 资源名称（工具名称）
	private String datext; // 申请内容
	private String dacreater; // 申请人（当前登录人）
	private String dacreatername; // 申请人名称（当前登录人名称）
	private String dalevel; // 密级（工具密级）
	private String dastate; // 状态
	private String daappor; // 审核人（当前登录人部门领导）
	private Date dacreatertime; // 创建时间

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDaid() {
		return daid;
	}

	public void setDaid(String daid) {
		this.daid = daid;
	}

	public String getDaname() {
		return daname;
	}

	public void setDaname(String daname) {
		this.daname = daname;
	}

	public String getDatext() {
		return datext;
	}

	public void setDatext(String datext) {
		this.datext = datext;
	}

	public String getDacreater() {
		return dacreater;
	}

	public void setDacreater(String dacreater) {
		this.dacreater = dacreater;
	}

	public String getDacreatername() {
		return dacreatername;
	}

	public void setDacreatername(String dacreatername) {
		this.dacreatername = dacreatername;
	}

	public String getDalevel() {
		return dalevel;
	}

	public void setDalevel(String dalevel) {
		this.dalevel = dalevel;
	}

	public String getDastate() {
		return dastate;
	}

	public void setDastate(String dastate) {
		this.dastate = dastate;
	}

	public String getDaappor() {
		return daappor;
	}

	public void setDaappor(String daappor) {
		this.daappor = daappor;
	}

	public Date getDacreatertime() {
		return dacreatertime;
	}

	public void setDacreatertime(Date dacreatertime) {
		this.dacreatertime = dacreatertime;
	}

}
