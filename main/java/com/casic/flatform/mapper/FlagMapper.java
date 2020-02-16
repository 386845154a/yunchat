package com.casic.flatform.mapper;

import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.FlagModel;

public interface FlagMapper {

	/**
	 * 根据报表ID获取报表数据
	 * 
	 * @param userId
	 * @return
	 */
	FlagModel getFlagByUserId(String userId);

	/**
	 * 根据报表ID修改报表数据
	 * 
	 * @param userId
	 */
	void updateFlagByUserId(@Param("userId") String userId, @Param("report") String report);

	/**
	 * 根据报表ID修改欢迎页面
	 * @param userId
	 * @param welcome
	 */
	void updateWelcomeByUserId(@Param("userId") String userId, @Param("welcome") String welcome);

}



