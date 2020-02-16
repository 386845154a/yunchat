package com.casic.flatform.service;

import java.util.List;
import com.casic.flatform.model.TreeModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.PageObject;

public interface UserService {

	/**
	 * 查询所有在线人员
	 * 
	 * @param fileName
	 * @param page
	 * @return
	 */
	PageObject getUserByOnline(int page, String fileName);

	/**
	 * 一键下线
	 */
	public void allUnline();

	/**
	 * 会议、日程成员获取
	 * 
	 * @return
	 */
	List<UserModel> GetMeUser(String orgId);

	/**
	 * 审批执行人
	 * @param orgId
	 * @return
	 */
	Object selectDown(String orgId);

}
