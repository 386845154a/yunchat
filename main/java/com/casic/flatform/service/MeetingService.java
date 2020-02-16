package com.casic.flatform.service;

import java.util.Date;
import java.util.List;

import com.casic.flatform.model.CalendarModel;
import com.casic.flatform.model.EventMeetModel;
import com.casic.flatform.model.MeetingModel;
import com.casic.flatform.pageModel.PageObject;

public interface MeetingService {

	/**
	 * 添加会议信息
	 * @param meetingModel
	 */
	void addMeeting(MeetingModel meetingModel);
	
	/**
	 * 查询日程、会议信息
	 * @param page
	 * @param pageRow
	 * @param user
	 * @param startTime
	 * @return
	 */
	PageObject listInfo(int page, int pageRow, String userId, String startTime);

	/**
	 * 根据会议ID获取会议信息
	 * @param id
	 * @return
	 */
	List<MeetingModel> getMeetingById(String id);

	/**
	 * 删除会议信息
	 * @param meetId
	 */
	void delMeeting(String meetId);
	
	/**
	 * 删除会议信息成员
	 * @param meetId
	 */
	void delMeetingUser(String meetId);

	/**
	 * 获取会议成员
	 * @param title
	 * @param startTime
	 * @return
	 */
	List<?> getMeetingUser(String meetid);

	/**
	 * 事件、会议、成员关联表添加
	 * @param emModel
	 */
	void addGL(EventMeetModel emModel);

	/**
	 * 会议创建人
	 * @return
	 */
	String getCreater(String meetId);

	/**
	 * 会议修改
	 * @param meetingModel
	 */
	void updateMeeting(String meetId, String state, Date stime);
	

}
