package com.casic.flatform.service;

import java.util.List;

import com.casic.flatform.model.FeedBackModel;
import com.casic.flatform.pageModel.PageObject;

public interface FeedbackService {

	/**
	 * 保存反馈信息
	 * @param fback
	 */
	void saveFeedback(FeedBackModel fback);

	/**
	 * 修改反馈信息状态
	 * @param fbackId
	 */
	void updatefeedback(String fbackId);

	/**
	 * 反馈查询
	 * @param page
	 * @param feedBackContext
	 * @param feedBackUser
	 * @param feedBackState
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	PageObject queryFeedBackInfo(Integer page, String context, String user, String state, String startTime, String endTime);

	/**
	 * 删除反馈信息
	 * @param fbackId
	 */
	void delfeedback(String fbackId);

	/**
	 * 为反馈添加回复
	 * @param fbackId
	 * @param replyContext
	 */
	void updateReply(String fbackId, String replyContext);

	/**
	 * 反馈数据导出
	 * @return
	 */
	public List<FeedBackModel> queryfeedBackInfo();

}
