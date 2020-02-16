package com.casic.flatform.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.SystemNotificationModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.MessageService;
import com.casic.flatform.service.SysService;

/**
 * @author zouct
 */
@RestController
@RequestMapping("/sysController")
public class SysController {

    @Autowired
    private SysService sysService;
    @Autowired
    private MessageService messageService;

    /**
     * 获取系統消息
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/qSysMsg")
    public Object qSysMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        //获取系统消息
        List<SystemNotificationModel> sysModel = sysService.qSysMsg(user.getUserId());
        //获取系统消息条数
        int count = sysService.qSysMsgCount(user.getUserId());
        map.put("sysInfo", sysModel);
        map.put("loginId", user.getUserId());
        map.put("count", count);
        return map;
    }
    
    /**
     * 刪除系統消息
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/delSysInfo")
    public Object delSysInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	String sysId = request.getParameter("sysId");
    	try {
    		sysService.delSysInfo(sysId);
    		map.put("success", true);
		} catch (Exception e) {
			map.put("success", false);
		}
    	return map;
    }
    
    /**
     * 添加系統消息
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/addSysInfo")
    public Object addSysInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
    	String message = request.getParameter("context");
    	String title = request.getParameter("title");
    	Long sender = (long) -1;
    	try {
            messageService.saveSystemNotification(user.getUserId(), title, "all", message, "1", user.getUserId());
            map.put("success", true);
        } catch (Exception e) {
            map.put("success", false);
        }
    	return map;
    }
    
}
