package com.casic.flatform.controller;

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

import com.alibaba.fastjson.JSONArray;
import com.casic.flatform.model.MoneyRewardCModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.MoneyRewardService;

/**
 * 赏金控制类
 * 
 * @author zouct
 */
@RestController
@RequestMapping("/moneyRewardController")
public class MoneyRewardController {

	@Autowired
	private MoneyRewardService moneyRewardService;

	/**
	 * 获取我的全部金额
	 * @param request
	 * @param response
	 * @param session
	 * @return	
	 */
	@RequestMapping("/gotMygold")
	public Object gotMygold(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String pageStr = request.getParameter("page");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return moneyRewardService.getMygold(page, user.getUserId());
	}
	
	/**
	 * 删除我的金额记录
	 * @param request
	 * @param response
	 * @param session
	 * @return	
	 */
	@RequestMapping("/delMyGoldMsgs")
	public void delMyGoldMsgs(String userId, String projectName) {
		 moneyRewardService.delMyGoldMsgs(userId, projectName);
	}
	
	/**
	 * 查询我的未读金额
	 * @param userId
	 * @return	
	 */
	@RequestMapping("/getMyNoRead")
	public void getMyNoRead(HttpSession session, String userId) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		 moneyRewardService.getMyNoRead(user.getUserId());
	}
	
	/**
	 * 更改我的金额是否读取状态
	 * @param userId
	 * @return	
	 */
	@RequestMapping("/updateMyRead")
	public void updateMyRead(String userId) {
		 moneyRewardService.updateMyRead(userId);
	}


}
