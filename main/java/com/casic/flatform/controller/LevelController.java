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
import com.casic.flatform.service.LevelService;
/**
 * 讨论组控制类
 * 
 * @author zouct
 */
@RestController
@RequestMapping("/levelController")
public class LevelController {

	@Autowired
	private LevelService levelService;

	/**
	 * 获得讨论组人员信息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryLevel")
	public Object queryLevel(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		map.put("levelList", levelService.queryLevel());
		map.put("loginLevel", user.getLevels());
		return map;
	}
	
	/**
	 * 通过ID获取等级信息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/getLevelInfoById")
	public String getLevelInfoById(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String levelId = request.getParameter("levelId");
		String aa = "";
		if (levelId != null) {
			aa =  levelService.getLevelInfoById(levelId);
			return aa;
		}
		return "未定义";
	}
	
	/**
	 * 通过名称获取等级信息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/getLevelInfoByName")
	public String getLevelInfoByName(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String levelName = request.getParameter("levelName");
		if (levelName != null) {
			return levelService.getLevelInfoByName(levelName);
		}
		return "未定义";
	}

	
}
