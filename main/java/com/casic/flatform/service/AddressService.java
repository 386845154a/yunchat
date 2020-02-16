package com.casic.flatform.service;

import java.util.List;

import com.casic.flatform.model.OrgModel;
import com.casic.flatform.model.TreeModel;
import com.casic.flatform.pageModel.PageObject;

public interface AddressService {
	/**
	 * 获得树形结构的组织架构
	 * 
	 * @return
	 */
	List<TreeModel> queryTreeList();

	/**
	 * 创建新用户
	 * @param userId
	 * @param name
	 * @param deptCode
	 * @param endFlag
	 * @param isonline
	 * @param level
	 */
	void createUser(String userId, String name, String deptCode, String endFlag, String isonline, String level, Integer picture);


	/**
	 * 创建新部门
	 * @param orgId
	 * @param orgName
	 * @param orgSupId
	 * @return
	 */
	void createOrg(String orgId, String orgName, Long orgSupId);

	/**
	 * 更新用户信息
	 * @param userId
	 * @param name
	 * @param deptCode
	 * @param endFlag
	 * @param string
	 * @param string2
	 */
	void updateUser(String userId, String name, String deptCode, String endFlag, String isonline, String level, Integer picture);

	/**
	 * 更新部门信息
	 * @param orgId
	 * @param orgName
	 * @param orgSupId
	 */
	void updateOrg(String orgId, String orgName, Long orgSupId);

	/**
	 * 通过科室ID获取科室信息
	 * @param orgId
	 * @return
	 */
	public OrgModel getOrgById(String orgId);

	/**
	 * 删除离职人员
	 * @param userId
	 */
	void delUser(String userId);

	/**
	 * 分页获得单位的用户
	 * @param page
	 * @param orgId
	 * @return
	 */
	PageObject queryOrgUser(int page, String orgId);

	/**
	 * 更新用户HR编码
	 * @param userId
	 * @param hrPsnCode
	 * @param
	 * @param
	 * @param
	 * @param
	 */
	 void updateUserHrcode(String userId, String hrPsnCode);

}
