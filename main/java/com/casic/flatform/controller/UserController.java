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

import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.UserService;

/**
 * 用户表
 * @author zouct
 */
@RestController
@RequestMapping("/userController")
public class UserController extends BaseController{

	@Autowired
	private UserService userService;
	
	/**
	 * 查询所有在线人员
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/getUserByOnline")
	public Object getUserByOnline(HttpServletRequest request, HttpServletResponse response) {
		String pageStr = request.getParameter("page");
		String fileName = request.getParameter("fileName");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return userService.getUserByOnline(page, fileName);
	}
	
	/**
	 * 一键下线
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/allUnline")
	public Object allUnline(HttpServletRequest request, HttpServletResponse response) {
		userService.allUnline();
		return true;
	}
	
	/**
	 * 会议、日程成员获取
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/GetMeUser")
	public Object GetMeUser(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> map = new HashMap<> (); 
		String orgId = request.getParameter("orgId");
		map.put("list", userService.GetMeUser(orgId));
		return map;
	}
	
	/**
	 * 审批执行人
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
    @RequestMapping("/selectDown")
    public Object selectDown(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String orgId = request.getParameter("orgId");
        if (StringUtils.isEmpty(orgId)) {
            return false;
        }
        map.put("classUser", userService.selectDown(orgId));
        map.put("loginUserId", user.getUserId());
        return map;
    }
    
    /**
	 * 工具下载审批执行人显示
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
    @RequestMapping("/selectDownChose")
    public Object selectDownChose(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
    	String orgId = request.getParameter("orgId");
        map.put("classUser", userService.selectDown(orgId));
        map.put("loginUserId", user.getUserId());
        return map;
    }
	
}
