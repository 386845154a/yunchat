package com.casic.flatform.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.LevelMapper;
import com.casic.flatform.model.LevelModel;
import com.casic.flatform.service.LevelService;

/**
 * 保密等级功能服务类
 * 
 * @author zouct
 */
@Service
@Transactional
public class LevelServiceImpl implements LevelService {

	@Autowired
	private LevelMapper levelMapper;
	
	/**
	 * 获取保密等级
	 * @return
	 */
	@Override
	public List<LevelModel> queryLevel() {
		return levelMapper.queryLevel();
	}

	/**
	 * 通过ID获取等级信息
	 * @param levelId
	 * @return
	 */
	@Override
	public String getLevelInfoById(String levelId) {
		return levelMapper.getLevelInfoById(levelId);
	}

	/**
	 * 通过名称获取等级信息
	 * @param levelName
	 * @return
	 */
	@Override
	public String getLevelInfoByName(String levelName) {
		// TODO Auto-generated method stub
		return levelMapper.getLevelInfoByName(levelName);
	}

}




