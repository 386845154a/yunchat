package com.casic.flatform.controller;

import com.casic.flatform.model.ChatFileModel;
import com.casic.flatform.model.GroupFileModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.MessageService;
import com.casic.flatform.vo.message.ToMsgInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

	/**
	 * 获取聊天记录 type 0 私聊 1群聊
	 * curren_user 当期人id
	 * chat_user 和谁聊天的id 或者 哪个群id
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/getMsgHistory")
	public Object getMsgHistory(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();

		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String current_user = user.getUserId();
		//String current_user =  "10000019431705";
		String chat_user = request.getParameter("chat_user");
		//chat_user="7";
		String type = request.getParameter("type");
		if ("friend".equals(type)) {
			type = "0";
		}
		else if ("group".equals(type)){
			type = "1";
		}
		else {
			type = "0";
		}
//		if(type == null || "".equals(type)){
//			type = "0";
//		}
		List<ToMsgInfo> msgList = null;
		if(type.equals("1")){//群聊
			msgList = this.messageService.getGroupMsgHistory(chat_user);
		}else if(type.equals("0")){//私聊
			msgList = this.messageService.getPrivateMsgHistory(current_user,chat_user);
		}
		map.put("msgList", msgList);
		return map;
	}
}
