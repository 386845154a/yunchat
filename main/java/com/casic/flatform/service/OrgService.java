package com.casic.flatform.service;

import com.casic.flatform.model.OrgModel;
import com.casic.flatform.model.OrgModelNew;

import java.util.List;

public interface OrgService {

	/**
	 * 获得科室信息
	 * @return
	 */
	List<OrgModel> queryOrg();
	/**
	 * 获得科室信息
	 * @return
	 */
	List<OrgModelNew> queryOrgNew(String orgsupid);


	/**
	 * 根据科室ID获取科室名称
	 * @param orgId
	 * @return
	 */
	List<OrgModel> queryOrgNameById(String orgId);

	/**
	 * 获取人员的父节点
	 * @param userId
	 * @return
	 */

	String queryUserSuperOrgCode(String userId);
}
