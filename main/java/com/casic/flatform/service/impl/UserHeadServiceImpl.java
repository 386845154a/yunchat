package com.casic.flatform.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.UserMapper;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.UserHeadService;
/**
 * 用户头像
 *
 */
@Service
@Transactional
public class UserHeadServiceImpl implements UserHeadService {
	
	@Autowired
	private UserMapper userMapper;
	
	/**
	 * 上传头像
	 */
	@Override
	public void uploadHead(String use, String readPath) {
		userMapper.uploadHead(use, readPath);
	}
	
	/**
	 * 获取头像
	 */
	@Override
	public List<UserModel> queryHead(String use) {
		return userMapper.queryHead(use);
	}

}
