package com.casic.flatform.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.SysMapper;
import com.casic.flatform.model.SystemNotificationModel;
import com.casic.flatform.service.SysService;

@Service
@Transactional
public class SysServiceImpl implements SysService {

	
    @Autowired
    private SysMapper sysMapper;

    /**
     * 获取系統消息
     */
	@Override
	public List<SystemNotificationModel> qSysMsg(String userId) {
		return sysMapper.qSysMsg(userId);
	}

	/**
	 * 刪除系統消息
	 * @return 
	 */
	@Override
	public void delSysInfo(String sysId) {
		sysMapper.delSysInfo(sysId);
	}

	/**
	 * 获取系统消息条数
	 */
	@Override
	public int qSysMsgCount(String userId) {
		return sysMapper.qSysMsgCount(userId);
	}



}
