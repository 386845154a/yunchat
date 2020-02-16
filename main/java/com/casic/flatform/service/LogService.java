package com.casic.flatform.service;

import java.util.List;

import com.casic.flatform.model.LogModel;
import com.casic.flatform.model.StatisticsModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.PageObject;

public interface LogService {

	/**
	 * 日志查询
	 * @param page
	 * @param endTime 
	 * @param startTime 
	 * @param logContext 
	 * @return
	 */
	PageObject queryLog(Integer page, String content, String startTime, String endTime, String fullName);
	
	/**
	 * 安全日志查询
	 * @param page
	 * @param endTime 
	 * @param startTime 
	 * @param logContext 
	 * @return
	 */
	PageObject querySecadm(Integer page, String content, String startTime, String endTime, String fullName);

	/**
	 * 查询日志创建人
	 * @param userId
	 * @return
	 */
	UserModel queryUserInfo(String userId);
	

	/**
	 * 导出日志
	 * @return
	 */
	public List<LogModel> query_LogInfo();

	/**
	 * 保存日志
	 * @param log
	 */
	void saveLog(LogModel log);
	
	/**
	 * 工具保存日志
	 */
	void saveToolLog(LogModel log);

	/**
	 * 操作统计
	 */
	public List<StatisticsModel> countLog(String logdate, String logtype);

	/**
	 * 月部门登录次数
	 */
	public List<StatisticsModel> orgLogin(String logdate, String logtype);

	/**
	 * downUser-详情查询
	 * @param toolId
	 * @return
	 */
	List<LogModel> DQInfo(String toolId);

	

}
