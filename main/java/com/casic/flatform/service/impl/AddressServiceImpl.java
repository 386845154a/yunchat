package com.casic.flatform.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.AddressMapper;
import com.casic.flatform.model.OrgModel;
import com.casic.flatform.model.TreeModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.pageModel.UserInfoPageModel;
import com.casic.flatform.service.AddressService;
import com.casic.flatform.util.ConfigParameterUtil;

/**
 * 组织架构
 * @author hanxu
 */
@Service
@Transactional
public class AddressServiceImpl implements AddressService{

	private AddressMapper addressMapper;
	
	@Autowired
	public AddressServiceImpl(AddressMapper addressMapper) {
		this.addressMapper = addressMapper;
	}
	
	/**
	 * 获得树形结构的组织架构
	 * @return
	 */
	@Override
	public List<TreeModel> queryTreeList() {
		List<TreeModel> treeList = addressMapper.queryAllOrgTree();
		
		for (TreeModel model : treeList) {
			model.setIconOpen(ConfigParameterUtil.ORG_ICON_OPEN);
			model.setIconClose(ConfigParameterUtil.ORG_ICON_CLOSE);
			model.setIsParent(true);
		}
		
		return treeList;
	}
	
	/**
	 * 分页获得单位下的用户
	 * @return
	 */
	@Override
	public PageObject queryOrgUser(int page, String orgId) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(addressMapper.queryOrgUser((row * (page - 1)+1), page*row, orgId));
		pageObject.setTotal(addressMapper.queryOrgUserTotal(orgId));
		return pageObject;
	}

	private List<UserInfoPageModel> changeModel(List<UserModel> userModelList) {
		List<UserInfoPageModel> userPageModel = new ArrayList<UserInfoPageModel> ();
		if (userModelList != null) {
			for (UserModel userInfo : userModelList) {
				UserInfoPageModel model = new UserInfoPageModel();
				BeanUtils.copyProperties(userInfo, model);
				userPageModel.add(model);
			}
		}
		return userPageModel;
	}
	
	/**
	 * 获得单位用户总数
	 * @return
	 */
//	@Override
//	public Long queryOrgUserTotal(Long orgId) {
//		List<Long> orgList = new ArrayList<> ();
//		orgList.add(orgId);
//		
//		return addressMapper.queryOrgUserTotal(orgList);
//	}
	
	/**
	 * 创建新用户
	 * @param userId
	 * @param name
	 * @param deptCode
	 * @param endFlag
	 * @param isonline
	 * @param level
	 */
	@Override
	public void createUser(String userId, String name, String deptCode, String endFlag, String isonline, String level, Integer picture) {
		UserModel user = new UserModel();
		user.setUserId(userId);
		user.setFullname(name);
		user.setAccount(userId);
		user.setPassword("7c4a8d09ca3762af61e59520943dc26494f8941b");
		user.setOrgId(deptCode);
		user.setEndFlag(endFlag);
		user.setIsonline(isonline);
		user.setLevels(level);
		user.setPicture(picture);
		user.setHead("/headFile/moren.jpg");
		addressMapper.saveUserInfo(user);
	}

	/**
	 * 创建新部门
	 * @param orgId
	 * @param orgName
	 * @param orgSupId
	 * @return
	 */
	@Override
	public void createOrg(String orgId, String orgName, Long orgSupId) {
		OrgModel orgInfo = new OrgModel();
		orgInfo.setOrgId(orgId);
		orgInfo.setOrgName(orgName);
		orgInfo.setOrgSupId(orgSupId);
		addressMapper.saveOrgInfo(orgInfo);
		
	}

	/**
	 * 更新用户信息
	 * @param userId
	 * @param name
	 * @param deptCode
	 * @param endFlag
	 * @param string
	 * @param string2
	 */
	@Override
	public void updateUser(String userId, String name, String deptCode, String endFlag, String isonline, String level, Integer picture) {
		UserModel user = new UserModel();
		user.setUserId(userId);
		user.setFullname(name);
		user.setAccount(userId);
		user.setPassword("7c4a8d09ca3762af61e59520943dc26494f8941b");
		user.setOrgId(deptCode);
		user.setEndFlag(endFlag);
		user.setIsonline(isonline);
		user.setLevels(level);
		user.setPicture(picture);
		user.setHead("/headFile/moren.jpg");
		addressMapper.updateUser(user);
	}

	/**
	 * 更新部门信息
	 * @param orgId
	 * @param orgName
	 * @param orgSupId
	 */
	@Override
	public void updateOrg(String orgId, String orgName, Long orgSupId) {
		OrgModel orgInfo = new OrgModel();
		orgInfo.setOrgId(orgId);
		orgInfo.setOrgName(orgName);
		orgInfo.setOrgSupId(orgSupId);
		addressMapper.updateOrg(orgInfo);
	}

	/**
	 * 通过科室ID获取科室信息
	 * @param orgId
	 */
	@Override
	public OrgModel getOrgById(String orgId) {
		// TODO Auto-generated method stub
		return addressMapper.getOrgById(orgId);
	}

	/**
	 * 删除离职人员
	 */
	@Override
	public void delUser(String userId) {
		addressMapper.delUser(userId);
	}

	@Override
	public void updateUserHrcode(String userId, String hrPsnCode) {
		addressMapper.updateUserHrcode(userId,hrPsnCode);
	}
	
}
