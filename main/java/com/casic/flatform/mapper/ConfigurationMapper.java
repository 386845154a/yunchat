package com.casic.flatform.mapper;

import java.util.List;

import com.casic.flatform.model.ConfigModel;

public interface ConfigurationMapper {

	/**
	 * 获得数据库中全部配置
	 * @return
	 */
	List<ConfigModel> findAllConfig();
	
	/**
	 * 通过配置名称获得配置值
	 * @param name :配置名称
	 * @return
	 */
	ConfigModel findConfigByName(String name);
	
	/**
	 * 获得数据库中的所有配置参数
	 * @return
	 */
	List<ConfigModel> queryAllConfig();

	List<ConfigModel> getLink(String type);
}
