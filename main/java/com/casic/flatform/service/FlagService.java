package com.casic.flatform.service;

import com.casic.flatform.model.FlagModel;

public interface FlagService {

	/**
	 * 根据报表ID获取报表数据
	 * 
	 * @param userId
	 * @return
	 */
	FlagModel getFlagByUserId(String userId);

	/**
	 * 根据报表ID修改年报数据
	 * 
	 * @param userId
	 */
	void updateFlagByUserId(String userId, String report);

	/**
	 * 根据报表ID修改欢迎页面
	 * @param userId
	 * @param welcome
	 */
	void updateWelcomeByUserId(String userId, String welcome);

}
