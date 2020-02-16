package com.casic.flatform.service.impl;

import java.util.List;

import com.casic.flatform.model.OrgModelNew;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.OrgMapper;
import com.casic.flatform.model.OrgModel;
import com.casic.flatform.service.OrgService;

/**
 * 保密等级功能服务类
 * 
 * @author zouct
 */
@Service
@Transactional
public class OrgServiceImpl implements OrgService {

	@Autowired
	private OrgMapper orgMapper;

	/**
	 * 获得科室信息
	 */
	@Override
	public List<OrgModel> queryOrg() {
		// TODO Auto-generated method stub
		return orgMapper.queryOrg();
	}
	/**
	 * 获得科室信息
	 */
	@Override
	public List<OrgModelNew> queryOrgNew(String orgsupid) {
		// TODO Auto-generated method stub
		return orgMapper.queryOrgNew( orgsupid);
	}
	/**
	 * 根据科室ID获取科室名称
	 */
	@Override
	public List<OrgModel> queryOrgNameById(String orgId) {
		return orgMapper.queryOrgNameById(orgId);
	}

	/**
	 * 获取人员的父节点
	 * @param userId
	 * @return
	 */
	@Override
	public String queryUserSuperOrgCode(String userId){
		return this.queryUserSuperOrgCode(userId);
	}
}




