package com.casic.flatform.mapper;

import java.util.List;

import com.casic.flatform.model.ReportDataModel;
import com.casic.flatform.model.StatisticsModel;
import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.LogModel;

/**
 * 日志处理Mapper
 * @author zouct
 */
public interface LogMapper {

	/**
	 * 查询日志信息
	 * @param start		：分页开始位置
	 * @param row		：每页显示数量
	 * @return	:List<LogModel>
	 */
	List<LogModel> queryLogInfo(@Param("start") Integer start, @Param("row") Integer row, 
			@Param("content") String content, @Param("startTime") String startTime, @Param("endTime") String endTime, @Param("fullName") String fullName);
	
	/**
	 * 查询安全日志信息
	 * @param start		：分页开始位置
	 * @param row		：每页显示数量
	 * @return	:List<LogModel>
	 */
	List<LogModel> querySecadmInfo(@Param("start") Integer start, @Param("row") Integer row, 
			@Param("content") String content, @Param("startTime") String startTime, @Param("endTime") String endTime, @Param("fullName") String fullName);
	
	/**
	 * 查询日志总数
	 * @return
	 */
	int queryLogcount(@Param("content") String content, @Param("startTime") String startTime, @Param("endTime") String endTime, @Param("fullName") String fullName);

	/**
	 * 查询安全日志总数
	 * @return
	 */
	int querySecadmcount(@Param("content") String content, @Param("startTime") String startTime, @Param("endTime") String endTime, @Param("fullName") String fullName);

	
	/**
	 * 导出日志
	 * @return
	 */
	public List<LogModel> query_LogInfo();

	/**
	 * 保存日志
	 */
	public void saveLog(LogModel log);
	
	/**
	 * 工具保存日志
	 */
	void saveToolLog(LogModel log);

	/**
	 * 操作统计
	 */
	public List<StatisticsModel> countLog(@Param("logdate")String logdate,@Param("logtype")String logtype);


	public List<StatisticsModel> orgLogin(@Param("logdate")String logdate,@Param("logtype")String logtype);

	/**
	 * downUser-详情查询
	 * @param toolId
	 * @return
	 */
	List<LogModel> DQInfo(String toolId);

}






