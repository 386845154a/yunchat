package com.casic.flatform.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.FeedBackModel;

public interface FeedbackMapper {
	
	/**
	 * 保存反馈信息
	 * @param fback
	 */
	public void saveFback(FeedBackModel fback);
	
	/**
	 * 刷新反馈信息
	 * @return
	 */
	public List<FeedBackModel> getFback(@Param("start") Integer start, @Param("row") Integer row, 
			@Param("feedBack_context") String feedBack_context,@Param("feedBack_user") String feedBack_user,
			@Param("feedBack_state") String feedBack_state,@Param("startTime") String startTime, 
			@Param("endTime") String endTime);

	/**
	 * 查询反馈信息详情
	 * @param start
	 * @param row
	 * @param context
	 * @param user
	 * @param state
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public List<FeedBackModel> queryFeedBackInfo(@Param("start") Integer start, @Param("row") Integer row,
			@Param("context") String context, @Param("user") String user,  @Param("state") String state, 
			@Param("startTime") String startTime, @Param("endTime") String endTime);

	/**
	 * 查询反馈信息总数
	 * @param context
	 * @param user
	 * @param state
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public int queryFeedBackInfoCount(@Param("context") String context, @Param("user") String user, 
			@Param("state") String state, @Param("startTime") String startTime, @Param("endTime") String endTime);

	/**
	 * 修改反馈信息状态
	 * @param fbackId
	 */
	public void updatefeedback(String fbackId);

	/**
	 * 删除反馈信息
	 * @param fbackId
	 */
	public void delfeedback(String fbackId);

	/**
	 * 为反馈添加回复
	 * @param fbackId
	 * @param replyContext
	 */
	public void updateReply(@Param("fbackId") String fbackId, @Param("replyContext") String replyContext);

	/**
	 * 反馈数据导出
	 * @return
	 */
	public List<FeedBackModel> queryfeedBackInfo();

}
