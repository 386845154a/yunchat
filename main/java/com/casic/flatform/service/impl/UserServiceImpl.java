package com.casic.flatform.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.UserMapper;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.UserService;

/**
 * 组织架构
 * @author hanxu
 */
@Service
@Transactional
public class UserServiceImpl implements UserService{

	@Autowired
	private UserMapper userMapper;
	
	/**
	 * 查询所有在线人员
	 * @return
	 */
	@Override
	public PageObject getUserByOnline(int page, String fileName) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(userMapper.userList((row * (page - 1)+1), page*row, fileName));
		pageObject.setTotal(userMapper.userCount(fileName));
		return pageObject;
	}

	/**
	 * 一键下线
	 */
	@Override
	public void allUnline() {
		userMapper.allUnline();
	}

	/**
	 * 会议、日程成员获取
	 */
	@Override
	public List<UserModel> GetMeUser(String orgId) {
		return userMapper.GetMeUser(orgId);
	}

    /**
	 * 审批执行人
	 * @param orgId
	 * @return
	 */
	@Override
	public List<UserModel> selectDown(String orgId) {
		return userMapper.selectDown(orgId);
	}

}
