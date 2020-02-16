package com.casic.flatform.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.MeetingMapper;
import com.casic.flatform.model.CalendarModel;
import com.casic.flatform.model.EventMeetModel;
import com.casic.flatform.model.MeetingModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.MeetingService;

@Service
@Transactional
public class MeetingServiceImpl implements MeetingService {

	@Autowired
	private MeetingMapper meetingMapper;

	/**
	 * 添加会议
	 */
	@Override
	public void addMeeting(MeetingModel meetingModel) {
		meetingMapper.addMeeting(meetingModel);
	}

	/**
	 * 查询日程、会议信息
	 */
	@Override
	public PageObject listInfo(int page, int pageRow, String userId, String startTime) {
		Integer row = pageRow;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(meetingMapper.listInfo((row * (page - 1)+1), page*row, userId, startTime));
		pageObject.setTotal(meetingMapper.listInfoCount(userId, startTime));
		pageObject.setPageRow(row);
		return pageObject;
	}
	
	/**
	 * 根据会议ID获取会议信息
	 * @param id
	 * @return
	 */
	@Override
	public List<MeetingModel> getMeetingById(String id) {
		return meetingMapper.getMeetingById(id);
	}

	/**
	 * 删除会议信息
	 * @param meetId
	 */
	@Override
	public void delMeeting(String meetId) {
		meetingMapper.delMeeting(meetId);
	}
	
	/**
	 * 删除会议信息成员
	 * @param meetId
	 */
	@Override
	public void delMeetingUser(String meetId) {
		meetingMapper.delMeetingUser(meetId);
	}

	/**
	 * 获取会议成员
	 * @param title
	 * @param startTime
	 * @return
	 */
	@Override
	public List<?> getMeetingUser(String meetid) {
		return meetingMapper.getMeetingUser(meetid);
	}

	/**
	 * 事件、会议、成员关联表添加
	 * @param emModel
	 */
	@Override
	public void addGL(EventMeetModel emModel) {
		meetingMapper.addGL(emModel);
		
	}

	/**
	 * 会议创建人
	 */
	@Override
	public String getCreater(String meetId) {
		return meetingMapper.getCreater(meetId);
	}

	/**
	 * 会议修改
	 */
	@Override
	public void updateMeeting(String meetId, String state, Date stime) {
		meetingMapper.updateMeeting(meetId, state, stime);
	}
	

}
