package com.casic.flatform.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.util.StringUtils;

import com.casic.flatform.mapper.ConfigurationMapper;
import com.casic.flatform.model.ConfigModel;
import com.casic.flatform.service.SensitiveWordsService;

public class ConfigParameterUtil {
	public static final String ORG_ICON_OPEN = ResourceUtil.getMessageByConfig("tree.icon.open");
	public static final String ORG_ICON_CLOSE = ResourceUtil.getMessageByConfig("tree.icon.close");
	public static final String PEOPLE_ICON = ResourceUtil.getMessageByConfig("tree.icon.people");

	public static final DateFormat DAY_SDF = new SimpleDateFormat("yyyy-MM-dd");
	public static final DateFormat TIME_SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	// 保存敏感词和替换字段Map<"敏感词", "替换字段">
	public static ConcurrentHashMap<String, String> sensitiveWordMap = null;
	//存放数据库初始化的配置参数
	private static ConcurrentHashMap<String, String> parameter = new ConcurrentHashMap<> ();
	
	
	/**
	 * 程序启动时加载配置参数
	 */
	public static void init() {
		//敏感词
		SensitiveWordsService sensitiveWordsService = SpringUtil.getBean(SensitiveWordsService.class);
		ConfigParameterUtil.sensitiveWordMap = sensitiveWordsService.getSensitiveWordMap();
		//数据库配置
		ConfigurationMapper configMapper = SpringUtil.getBean(ConfigurationMapper.class);
		List<ConfigModel> configList = configMapper.findAllConfig();	
		for (ConfigModel config : configList){
			if (config != null && config.getConfigName() != null) {
				parameter.put(config.getConfigName(), config.getConfigValue());
			}
		}
	}
	
	/**
	 * 通过名称获取配置值
	 * @param name
	 * @param defValue
	 * @return
	 */
	public static String getConfigByName (String name, String defValue){
		try{
			if (StringUtils.isEmpty(name)){
				return defValue;
			}
			if (parameter.size() == 0){
				return defValue;
			}
			if (parameter.containsKey(name)){
				return parameter.get(name);
			}else {
				return defValue;
			}
		}catch (Exception ex){
			return defValue;
		}
	}
}
