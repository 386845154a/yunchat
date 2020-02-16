package com.casic.flatform.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.FeedbackMapper;
import com.casic.flatform.model.FeedBackModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.FeedbackService;

@Service
@Transactional
public class FeedbackServiceImpl implements FeedbackService{
	
	@Autowired
	private FeedbackMapper feedbackMapper;
	

	/**
	 * 保存反馈信息
	 */
	@Override
	public void saveFeedback(FeedBackModel fback) {
		feedbackMapper.saveFback(fback);
	}

	/**
	 * 修改反馈信息
	 * @param fbackId
	 */
	@Override
	public void updatefeedback(String fbackId) {
		feedbackMapper.updatefeedback(fbackId);
	}

	/**
	 * 获取反馈信息
	 */
	@Override
	public PageObject queryFeedBackInfo(Integer page, String context, String user, String state, String startTime,
			String endTime) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(feedbackMapper.queryFeedBackInfo((row * (page - 1)+1), page*row, context, user, state, startTime, endTime));
		pageObject.setTotal(feedbackMapper.queryFeedBackInfoCount(context, user, state, startTime, endTime));
		return pageObject;
	}

	/**
	 * 删除反馈信息
	 */
	@Override
	public void delfeedback(String fbackId) {
		feedbackMapper.delfeedback(fbackId);
	}

	/**
	 * 为反馈添加回复
	 * @param fbackId
	 * @param replyContext
	 */
	@Override
	public void updateReply(String fbackId, String replyContext) {
		feedbackMapper.updateReply(fbackId, replyContext);
	}

	
	/**
	 * 反馈数据导出
	 */
	@Override
	public List<FeedBackModel> queryfeedBackInfo() {
		return feedbackMapper.queryfeedBackInfo();
	}
	
	
	
}
