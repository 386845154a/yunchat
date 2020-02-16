package com.casic.flatform.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.casic.flatform.model.UserModel;

public interface LoginService {
	/**
	 * 用户登录
	 * 
	 * @param request
	 *            :请求
	 * @param name
	 *            :登录名
	 * @param password
	 *            ：密码
	 * @return
	 * @throws Exception
	 */
	public Boolean login(HttpServletRequest request, HttpServletResponse response, String account, String password)
			throws Exception;

	/**
	 * 退出登录
	 * 
	 * @param session
	 */
	void logout(HttpSession session);

	/**
	 * 管理员登录
	 * 
	 * @return
	 * @throws Exception
	 */
	Boolean managerLogin(HttpServletRequest request, HttpServletResponse response, String account, String password)
			throws Exception;

	/**
	 * 通过用户名密码获得用户
	 * 
	 * @return
	 */
	UserModel queryUserInfoByAccount(String account, String password);

	/**
	 * 为用户创建对应的token
	 * 
	 * @param userId
	 *            ：用户id
	 * @return
	 */
	String createToken(String userId);

	/**
	 * 获取消息发送者姓名
	 * @return
	 */
	UserModel querySender(String userId);
	
	/**
	 * 获取用户保密等级
	 * @param account
	 * @return
	 */
	UserModel queryUserLevel(String account);

}
