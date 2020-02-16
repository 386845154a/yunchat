package com.casic.flatform.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.PrivateMsgService;

/**
 * 私聊消息
 * 
 * @author hanxu
 */
@RestController
@RequestMapping("/privateMsgController")
public class PrivateMsgController {

	@Autowired
	private PrivateMsgService privateMsgService;

	/**
	 * 查询获得私聊消息
	 * 
	 * @param page
	 *            :页码
	 * @param rows
	 *            ：每页显示行数
	 * @param startTimeStr
	 *            ：开始时间
	 * @param endTimeStr
	 *            ：结束时间
	 * @param msg
	 *            ：消息内容
	 * @param sendUserId
	 *            ：消息发出者
	 * @param toUserId
	 *            ：消息接收者
	 * @return
	 */
	@RequestMapping("/queryPrivateMsg")
	private Object queryPrivateMsg(int page, int rows, String startTimeStr, String endTimeStr, String msg,
			String sendUser, String receiverUser) {
		Map<String, Object> resultMap = new HashMap<>();
		Date startTime = null;
		Date endTime = null;

		resultMap.put("dataList", privateMsgService.queryPrivateMsg(msg, startTime, endTime, sendUser, receiverUser,
				(rows * (page - 1)+1), page*rows));
		resultMap.put("count", privateMsgService.queryPrivateMsgCount(msg, startTime, endTime, sendUser, receiverUser));

		return resultMap;
	}
	
	/**
	 * 全部私聊消息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/privateMsgsList")
	public Object privateMsgsList(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<> ();
		UserModel user = (UserModel)session.getAttribute("userSessionItems");
		String pageStr = request.getParameter("page");
		String msgName = request.getParameter("msgName");
		String sendUser = request.getParameter("sendUser");
		String msgLevels = request.getParameter("msgLevels");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return privateMsgService.privateMsgsList(page, msgName, sendUser, msgLevels);
	}

}
