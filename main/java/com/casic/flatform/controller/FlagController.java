package com.casic.flatform.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.FlagService;

/**
 * 标识控制类
 * 
 * @author zouct
 */
@RestController
@RequestMapping("/flagController")
public class FlagController {

	@Autowired
	private FlagService flagService;

	/**
	 * 根据报表ID获取报表数据
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/getFlagByUserId")
	public Object getFlagByUserId(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		return flagService.getFlagByUserId(user.getUserId());
	}

	/**
	 * 根据报表ID修改年报数据
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/updateFlagByUserId")
	public Object updateFlagByUserId(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String report = request.getParameter("report");
		try {
			flagService.updateFlagByUserId(user.getUserId(), report);
			map.put("success", true);
		} catch (Exception e) {
			e.printStackTrace();
			map.put("success", false);
		}
		return map;

	}
	
	/**
	 * 根据报表ID修改欢迎页面
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/updateWelcomeByUserId")
	public Object updateWelcomeByUserId(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String welcome = request.getParameter("welcome");
		try {
			flagService.updateWelcomeByUserId(user.getUserId(), welcome);
			map.put("success", true);
		} catch (Exception e) {
			e.printStackTrace();
			map.put("success", false);
		}
		return map;

	}

}
