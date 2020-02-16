package com.casic.flatform.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.OrgModel;
import com.casic.flatform.model.TreeModel;
import com.casic.flatform.model.UserModel;

/**
 * 聊天列表Mapper
 * @author hanxu
 */
public interface AddressMapper {

	/**
	 * 获得组织架构的树形结构
	 * @return
	 */
	public List<TreeModel> queryAllOrgTree();
	
	/**
	 * 分页获得单位下的全部用户
	 * @return
	 */
	public List<UserModel> queryOrgUser(@Param("start") int start, @Param("rows") int rows, @Param("orgId") String orgId);
	
	/**
	 * 获得单位用户用户总数
	 * @return
	 */
	public int queryOrgUserTotal(@Param("orgId") String orgId);
	
	/**
	 * 创建新用户
	 * @param user
	 */
	public void saveUserInfo(UserModel user);

	/**
	 * 创建新部门
	 * @param orgInfo 
	 * @return
	 */
	public void saveOrgInfo(OrgModel orgInfo);

	/**
	 * 更新用户信息
	 * @param user
	 */
	public void updateUser(UserModel user);

	/**
	 * 更新部门信息
	 * @param orgInfo 
	 * @return
	 */
	public void updateOrg(OrgModel orgInfo);

	
	/**
	 * 通过科室ID获取科室信息
	 * @param orgId
	 * @return
	 */
	public OrgModel getOrgById(@Param("orgId")String orgId);

	/**
	 * 删除离职人员
	 * @param userId
	 * @return
	 */
	public void delUser(String userId);

	public void updateUserHrcode(String userId, String hrPsnCode);


}
