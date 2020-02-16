package com.casic.flatform.service;

import java.util.List;

import com.casic.flatform.model.UserModel;

public interface UserHeadService {
	/**
	 * 上传头像
	 * @param use
	 * @param head
	 */
	void uploadHead(String use, String readPath);
	 
	/**
	 * 获取头像
	 * @return
	 */
	public List<UserModel> queryHead(String use);


}
