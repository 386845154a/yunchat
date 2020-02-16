package com.casic.flatform.service.impl;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.casic.flatform.mapper.PermissionMapper;
import com.casic.flatform.mapper.UserMapper;
import com.casic.flatform.model.SystemUserModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.LoginService;
import com.casic.flatform.util.MyUUID;
import com.casic.flatform.util.SHA1Util;

/**
 * 用户登录
 * @author hanxu
 */
@Service
@Transactional
public class LoginServiceImpl implements LoginService{

	@Autowired
	private UserMapper userMapper;
	@Autowired
	private PermissionMapper permissionMapper;
	
	/**
	 * 用户登录
	 * @param request	:请求
	 * @param name	:登录名
	 * @param password	：密码
	 * @return
	 * @throws Exception 
	 */
	@Override
	public Boolean login(HttpServletRequest request, HttpServletResponse response, String account, String password) throws Exception {
		/*
		if (StringUtils.isEmpty(account) || StringUtils.isEmpty(password)){
			throw new Exception("用户名和密码不能为空！");
		}*/
		
		if (StringUtils.isEmpty(account)){
			throw new Exception("用户名不能为空！");
		}
		UserModel user = null;
		if (StringUtils.isEmpty(password)){
			user = userMapper.queryUserInfoByAccount(account);
		}else {
//			user = userMapper.checkNamePassword(account, SHA1Util.encode(password));
		}
		
		
		if (user != null){
			if ("1".equals(String.valueOf(user.getIsLock()))){
				throw new Exception("该用户已被锁定！");
			}
			request.getSession().setAttribute("userSessionItems", user);
			
			//生成token
			String token = this.createToken(user.getUserId());
			request.getSession().setAttribute("token", token);
			/*
			Cookie cookie = new Cookie("token", token);
			cookie.setMaxAge(7 * 24 * 60 * 60);//cookie有效时间为7天
			response.addCookie(cookie);
			*/
			return true;
		}
		
		return false;
	}
	
	/**
	 * 为用户创建对应的token
	 * @param userId	：用户id
	 * @return
	 */
	@Override
	public String createToken(String userId){
		String token = MyUUID.getUUID();
		permissionMapper.deleteToken(userId);
		String uId = String.valueOf(userId);
		permissionMapper.saveToken(token,uId );
		return token;
	}
	
	
	/**
	 * 退出登录
	 * @param session
	 */
	@Override
	public void logout(HttpSession session) {
		session.setAttribute("userSessionItems", null);
	}
	
	/**
	 * 管理员登录
	 * @return
	 * @throws Exception 
	 */
	@Override
	public Boolean managerLogin(HttpServletRequest request, HttpServletResponse response, String account, String password) 
			throws Exception {
		if (StringUtils.isEmpty(account)){
			throw new Exception("用户名不能为空！");
		}
		SystemUserModel user = null;
		if (StringUtils.isEmpty(password)){
			//user = userMapper.queryUserInfoByAccount(account);
		}else {
			user = userMapper.checkAdminNamePassword(account, SHA1Util.encode(password));
		}
		
		
		if (user != null){
			request.getSession().setAttribute("userSessionItems", user);
			
			//生成token
			String token = this.createToken(user.getId());
			request.getSession().setAttribute("token", token);
			/*
			Cookie cookie = new Cookie("token", token);
			cookie.setMaxAge(7 * 24 * 60 * 60);//cookie有效时间为7天
			response.addCookie(cookie);
			*/
			return true;
		}
		
		return false;
	}
	
	/**
	 * 通过用户名密码获得用户
	 * @return
	 */
	@Override
	public UserModel queryUserInfoByAccount(String account, String password){
		HashMap m = new HashMap<>();
		m.put("account", account);
		m.put("password", SHA1Util.encode(password));
		return userMapper.checkNamePassword(m);
		//		return userMapper.checkNamePassword(account, SHA1Util.encode(password));
	}

	/**
	 * 获取消息发送者姓名
	 * @return
	 */
	@Override
	public UserModel querySender(String userId) {
		return userMapper.queryUserInfo(userId);
	}

	/**
	 * 获取用户保密等级
	 * @param account
	 * @return
	 */
	@Override
	public UserModel queryUserLevel(String account) {
		// TODO Auto-generated method stub
		return userMapper.queryUserInfoByAccount(account);
	}
}
