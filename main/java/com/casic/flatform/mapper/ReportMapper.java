package com.casic.flatform.mapper;

import java.util.List;

import com.casic.flatform.model.OrgModel;

public interface ReportMapper {

	/**
	 * 获得科室信息
	 * @return
	 */
	List<OrgModel> queryOrg();

	/**
	 * 根据科室ID获取科室名称
	 * @param orgId
	 * @return
	 */
	List<OrgModel> queryOrgNameById(String orgId);

}



