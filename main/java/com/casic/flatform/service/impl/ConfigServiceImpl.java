package com.casic.flatform.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.ConfigurationMapper;
import com.casic.flatform.model.ConfigModel;
import com.casic.flatform.service.ConfigService;

@Service
@Transactional
public class ConfigServiceImpl implements ConfigService{
	@Autowired
	private ConfigurationMapper configurationMapper;

	@Override
	public ConfigModel getVersionVal(String versionName) {
		return configurationMapper.findConfigByName(versionName);
	}

	@Override
	public List<ConfigModel> getLink(String type) {
		return configurationMapper.getLink(type);
	}

	
	
}
