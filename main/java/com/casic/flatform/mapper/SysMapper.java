package com.casic.flatform.mapper;

import java.util.List;

import com.casic.flatform.model.SystemNotificationModel;

public interface SysMapper {

	/**
	 * 获取系統消息
	 * @return
	 */
	List<SystemNotificationModel> qSysMsg(String userId);

	/**
	 * 刪除系統消息
	 * @return
	 */
	void delSysInfo(String sysId);

	/**
	 * 获取系统消息条数
	 * @return
	 */
	int qSysMsgCount(String userId);
	
}



