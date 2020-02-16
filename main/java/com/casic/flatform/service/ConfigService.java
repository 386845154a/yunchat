package com.casic.flatform.service;

import java.util.List;

import com.casic.flatform.model.ConfigModel;

public interface ConfigService {

	ConfigModel getVersionVal(String versionName);

	List<ConfigModel> getLink(String type);

	

}
