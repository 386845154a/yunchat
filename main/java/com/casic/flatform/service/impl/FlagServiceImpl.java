package com.casic.flatform.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.FlagMapper;
import com.casic.flatform.model.FlagModel;
import com.casic.flatform.service.FlagService;

@Service
@Transactional
public class FlagServiceImpl implements FlagService {

	@Autowired
	private FlagMapper flagMapper;

	/**
	 * 根据报表ID获取报表数据
	 * 
	 * @param userId
	 * @return
	 */
	@Override
	public FlagModel getFlagByUserId(String userId) {
		return flagMapper.getFlagByUserId(userId);
	}

	/**
	 * 根据报表ID修改报表数据
	 * 
	 * @param userId
	 */
	@Override
	public void updateFlagByUserId(String userId, String report) {
		flagMapper.updateFlagByUserId(userId, report);
	}

	/**
	 * 根据报表ID修改欢迎页面
	 * @param userId
	 * @param welcome
	 */
	@Override
	public void updateWelcomeByUserId(String userId, String welcome) {
		flagMapper.updateWelcomeByUserId(userId, welcome);
	}

}
