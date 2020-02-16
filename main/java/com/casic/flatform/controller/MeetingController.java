package com.casic.flatform.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.EventMeetModel;
import com.casic.flatform.model.MeetingModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.MeetingService;
import com.casic.flatform.util.MyUUID;

@RestController
@RequestMapping("/meetingController")
public class MeetingController {

	@Autowired
	private MeetingService meetingService;
	
	/**
	 * 添加会议
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping("/addMeeting")
	public Object addMeeting(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws ParseException {
		Map<String, Object> map = new HashMap<>();
	    UserModel login_user = (UserModel) session.getAttribute("userSessionItems");
	    MeetingModel meetingModel = new MeetingModel();
	    meetingModel.setMeetname(request.getParameter("meeting_name"));
	    meetingModel.setMeettype(request.getParameter("meeting_type"));
	    meetingModel.setMeettime(request.getParameter("meeting_time"));
	    meetingModel.setMeetaddress(request.getParameter("meeting_address"));
	    meetingModel.setMeetu(request.getParameter("meeting_u"));
	    meetingModel.setState(request.getParameter("state"));
	    meetingModel.setMeetid(MyUUID.getUUID());
    	meetingModel.setCreater(login_user.getUserId());
    	meetingModel.setSuser(login_user.getUserId());
	    String start = request.getParameter("start");
	    start = start.replace("GMT", "").replaceAll("\\(.*\\)", "");
	    SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd hh:mm", java.util.Locale.ENGLISH);
	    Date stime = format.parse(request.getParameter("start"));
	    if (!StringUtils.isEmpty(start)) {
	        meetingModel.setStime(stime);
	    } 
	    if (StringUtils.isEmpty(request.getParameter("meeting_club"))) {
	    	meetingModel.setMeetclub(login_user.getUserId());
	    } else {
	    	meetingModel.setMeetclub(request.getParameter("meeting_club"));
	    }
	    meetingService.addMeeting(meetingModel);
	    String meet_U = request.getParameter("meet_U");
	    String[] meet_Us = meet_U.split(",");
	    for (int i = 0; i < meet_Us.length; i++) {
	    	EventMeetModel emModel = new EventMeetModel();
	    	emModel.setId(MyUUID.getUUID());
	    	emModel.setUserId(meet_Us[i]);
	    	emModel.setEventid("");
	    	emModel.setMeetid(meetingModel.getMeetid());
	    	emModel.setType("2");
	    	emModel.setSavetime(stime);
	    	emModel.setName(request.getParameter("meeting_name"));
	    	meetingService.addGL(emModel);
		}
	    map.put("success", true);
	    return map;
	}
	
    /**
     * 查询日程、会议信息
     * @param session
     * @param page
     * @param startTime
     * @param pageRow
     * @return
     */
    @RequestMapping("/queryMeetingInfo")
    public Object queryMeetingInfo(HttpSession session, String page, String startTime, String pageRow) {
    	List list = new ArrayList();
        UserModel login_user = (UserModel) session.getAttribute("userSessionItems");
        String userId = login_user.getUserId();
        if (StringUtils.isEmpty(startTime)) {
            // 今日日程
            Date today = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
            startTime = sdf.format(today);
        }
        return meetingService.listInfo(Integer.parseInt(page), Integer.parseInt(pageRow), userId, startTime);
    }
    
    /**
     * 根据会议ID获取会议信息
     * @param request
     * @param response
     * @param session
     * @return
     * @throws ParseException 
     */
    @RequestMapping("/getMeetingById")
    public Object getMeetingById(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws ParseException {
    	Map<String, Object> map = new HashMap<>();
    	UserModel login_user = (UserModel) session.getAttribute("userSessionItems");
    	String meetid = request.getParameter("id");
    	String title = request.getParameter("title");
    	String stime = request.getParameter("startTime");
    	SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
    	map.put("info", meetingService.getMeetingById(meetid));
    	map.put("user", meetingService.getMeetingUser(meetid));
    	return map;
    }
    
    /**
     * 删除会议信息
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/delMeeting")
    public Object delMeeting(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel login_user = (UserModel) session.getAttribute("userSessionItems");
        String meetId = request.getParameter("id");
        String userId = meetingService.getCreater(meetId);
        String logUId = login_user.getUserId();
        if (userId.equals(logUId)) {
        	meetingService.delMeeting(meetId);
        	meetingService.delMeetingUser(meetId);
        	map.put("success", true);
        } else {
        	map.put("success", false);
        }
        return map;
    }
    
    /**
     * 加载会议已选中人员
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/rightUser")
    public Object rightUser(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	String meetid = request.getParameter("rcId");
    	return meetingService.getMeetingUser(meetid);
    }
    
    /**
	 * 会议修改
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping("/updateMeeting")
	public Object updateMeeting(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws ParseException {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String userId = meetingService.getCreater(request.getParameter("rcId"));
        if (user.getUserId().equals(userId)) {
        	String start = request.getParameter("start");
        	start = start.replace("GMT", "").replaceAll("\\(.*\\)", "");
        	SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd hh:mm", java.util.Locale.ENGLISH);
        	Date stime = format.parse(request.getParameter("start"));
        	meetingService.updateMeeting(request.getParameter("rcId"), request.getParameter("state"), stime);
        	meetingService.delMeetingUser(request.getParameter("rcId"));
        	String meet_U = request.getParameter("meet_U");
        	String[] meet_Us = meet_U.split(",");
        	for (int i = 0; i < meet_Us.length; i++) {
        		EventMeetModel emModel = new EventMeetModel();
        		emModel.setId(MyUUID.getUUID());
        		emModel.setUserId(meet_Us[i]);
        		emModel.setEventid("");
        		emModel.setMeetid(request.getParameter("rcId"));
        		emModel.setType("2");
        		emModel.setSavetime(stime);
        		emModel.setName(request.getParameter("name"));
        		meetingService.addGL(emModel);
        	}
        	map.put("success", true);
        } else {
        	map.put("success", false);
        }
	    return map;
	}

}
