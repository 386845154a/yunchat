package com.casic.flatform.service.impl;

import java.util.List;

import com.casic.flatform.model.StatisticsModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.LogMapper;
import com.casic.flatform.mapper.UserMapper;
import com.casic.flatform.model.LogModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.LogService;

@Service
@Transactional
public class LogServiceImpl implements LogService{
	
	@Autowired
	private LogMapper logMapper;
	@Autowired
	private UserMapper userMapper;

	/**
	 * 日志查询
	 */
	@Override
	public PageObject queryLog(Integer page, String content, String startTime, String endTime, String fullName) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(logMapper.queryLogInfo((row * (page - 1)+1), page*row, content, startTime, endTime, fullName));
		pageObject.setTotal(logMapper.queryLogcount(content, startTime, endTime, fullName));
		return pageObject;
	}
	
	/**
	 * 安全日志查询
	 */
	@Override
	public PageObject querySecadm(Integer page, String content, String startTime, String endTime, String fullName) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(logMapper.querySecadmInfo((row * (page - 1)+1), page*row, content, startTime, endTime, fullName));
		pageObject.setTotal(logMapper.querySecadmcount(content, startTime, endTime, fullName));
		return pageObject;
	}

	/**
	 * 日志创建人查询
	 */
	@Override
	public UserModel queryUserInfo(String userId) {
		return userMapper.queryUserInfoByAccount(userId);
	}

	/**
	 * 导出日志
	 */
	@Override
	public List<LogModel> query_LogInfo() {
		return logMapper.query_LogInfo();
	}

	/**
	 * 保存日志
	 */
	@Override
	public void saveLog(LogModel log) {
		logMapper.saveLog(log);
	}
	
	/**
	 * 工具保存日志
	 */
	@Override
	public void saveToolLog(LogModel log) {
		logMapper.saveToolLog(log);
	}

	/**
	 * 操作统计
	 */
	@Override
	public List<StatisticsModel> countLog(String logdate, String logtype) {
		return logMapper.countLog(logdate,logtype);
	}

	@Override
	public List<StatisticsModel> orgLogin(String logdate, String logtype) {
		return logMapper.orgLogin(logdate,logtype);
	}
	
	/**
	 * downUser-详情查询
	 * @param toolId
	 * @return
	 */
	@Override
	public List<LogModel> DQInfo(String toolId) {
		return logMapper.DQInfo(toolId);
	}

}
