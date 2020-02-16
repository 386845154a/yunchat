package com.casic.flatform.mapper;

import com.casic.flatform.model.OrgModel;
import com.casic.flatform.model.OrgModelNew;
import com.casic.flatform.model.OrgTreeNodeModel;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OrgMapper {

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
	/**
	 * 获得科室信息
	 * @return
	 */
	List<OrgModelNew> queryOrgNew(@Param("orgsupid") String orgsupid);

    /**
     * 当前人节点的父节点id
     * @param userId
     * @return
     */
    String queryUserSuperOrgCode(@Param("userId") String userId);

	/**
	 * 查询树结构
	 * @return
	 */
	List<OrgTreeNodeModel> getOrgData(@Param("excludeUserId") String excludeUserId);
	List<OrgTreeNodeModel> getOrgDataByUserName(@Param("excludeUserId") String excludeUserId,@Param("userName") String userName);
	List<OrgTreeNodeModel> getOrgDataByPid(@Param("pid") String pid);
	List<OrgTreeNodeModel> getUserDataByPid(@Param("pid") String pid,@Param("excludeUserId")String excludeUserId);
}



