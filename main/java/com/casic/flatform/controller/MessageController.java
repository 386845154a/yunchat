package com.casic.flatform.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.ChatFileModel;
import com.casic.flatform.model.GroupFileModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.MessageService;

@RestController
@RequestMapping("/messageController")
public class MessageController {

	@Autowired
	private MessageService messageService;

	/**
	 * 获取最近聊天历史消息
	 * 
	 * @return
	 */
	@RequestMapping("/queryHisMsgs")
	public Object queryHisMsgs(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String chatUserId = request.getParameter("id");
		String chatType = request.getParameter("type");
		String pageStr = request.getParameter("page");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		map.put("msgList", messageService.queryHisMsgs(chatUserId, chatType, page, 0));
		map.put("userId", user.getUserId());
		map.put("headPath", user.getHead());
		return map;
	}
	
	
    /**
     * 加载更多
     *
     * @return
     */
    @RequestMapping("/loadMsg")
    public Object loadMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String chatUserId = request.getParameter("id");
		String chatType = request.getParameter("type");
		String pageStr = request.getParameter("page");
		String nowMsgNum = request.getParameter("nowMsgNum");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		map.put("msgList", messageService.loadMsg(chatUserId, chatType, page, Integer.valueOf(nowMsgNum)));
		map.put("userId", user.getUserId());
		return map;
    }
    
    /**
     * 2019.4.3
     * 根据ID获取群组、私聊文件信息
     * @param fileId     :文件id
     * @param uploadType ：文件类型：group，chat
     * @return
     */
    @RequestMapping("/queryGandUFile")
    public Object queryFile(String fileId, String uploadType, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        GroupFileModel groupFileModel = new GroupFileModel();
        ChatFileModel chatFileModel = new ChatFileModel();
        try {
        	if (uploadType.contentEquals("group")) {
            	groupFileModel = messageService.qGroupFlieInfo(fileId);
            	if (groupFileModel != null) {
            		map.put("levels", groupFileModel.getLevels());
            	} 
            } else {
            	chatFileModel = messageService.qPrivateFileInfo(fileId);
            	if (chatFileModel != null) {
            		map.put("levels", chatFileModel.getLevels());
            	}
            }
            map.put("loginName", user.getFullname());
		} catch (Exception e) {
			e.printStackTrace();
		}
        return map;
    }
}
