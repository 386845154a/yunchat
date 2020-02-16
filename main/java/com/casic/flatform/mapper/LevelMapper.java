package com.casic.flatform.mapper;

import java.util.List;

import com.casic.flatform.model.LevelModel;

public interface LevelMapper {

	/**
	 * 获取保密等级
	 * @return
	 */
	public List<LevelModel> queryLevel();

	/**
	 * 通过ID获取等级信息
	 * @param levelId
	 * @return
	 */
	public String getLevelInfoById(String levelId);

	/**
	 * 通过名称获取等级信息
	 * @param levelName
	 * @return
	 */
	public String getLevelInfoByName(String levelName);
}



