package com.casic.flatform.service;

import com.casic.flatform.model.GroupInfo;
import com.casic.flatform.model.GroupModel;
import com.casic.flatform.model.OrgTreeNodeModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.OrgUserPageModel;

import java.util.List;
import java.util.Map;

public interface HomeService {
	/**
	 * 获得用户信息
	 * 
	 * @param userId
	 *            :用户id
	 * @return
	 */
	public UserModel queryUserInfo(String userId);

	/**
	 * 获得最近联系人
	 * 
	 * @param userId
	 *            :用户id
	 * @return
	 */
	List<Map<String, Object>> latelyUser(String userId, String page, String rows);

	/**
	 * 获得单位用户(不包含当前用户)
	 * 
	 * @param userId
	 *            :当前登录用户id
	 * @return
	 */
	List<OrgUserPageModel> orgUser(String userId, String level, String inputValue);

	/**
	 * 获得单位用户
	 * 
	 * @param userId
	 *            :用户id
	 * @return
	 */
	List<OrgUserPageModel> orgUser();

	/**
	 * 获得用户所在的所有讨论组
	 * 
	 * @param userId
	 *            ：用户id
	 * @return
	 */
	List<Map<String, Object>> groupByUserId(String userId, String level);
	List<GroupInfo> groupByUserIdNew(String userId);
	/**
	 * 加载科员
	 * 
	 * @param orgId
	 *            :部门id
	 * @return
	 */
	List<UserModel> queryClassUser(String orgId);

	/**
	 * 删除最近联系人\讨论组
	 * @param userId
	 * @param id
	 * @param type
	 */
	void delLink(String userId, String id, String type);
	
	/**
	 * 模糊查询联系人
	 * 
	 * @param name
	 *            :姓名
	 * @return
	 */
	List<UserModel> getUserByName(String name);
	
	/**
	 * 修改用户信息
	 * @param userId
	 * @param phone
	 * @param roomid
	 * @return
	 */
	void updataUserInfo(String userId, String phone, String roomid);


	/**
	 * 根据密级获取用户
	 * @param userId
	 * @param levels
	 * @return
	 */
	List<OrgUserPageModel> queryOrgUserBylevels(String userId, String levels);

	/**
	 * 根据密级获取用户
	 * @param userId
	 * @param levels
	 * @return
	 */
	List<OrgUserPageModel> queryOrgUserBylevelsOrgID(String userId, String levels,String orgid);

	/**
	 * 根据密级和部门获取用户
	 * @param userId
	 * @param orgId
	 * @param levels
	 * @return
	 */
	List<UserModel> getALLUserByOrg(String userId, String orgId, String levels);

	/**
	 * 获取树结构
	 * @return
	 */
	List<OrgTreeNodeModel> getOrgData(String excludeUserId);
	/**
	 * 获取树结构
	 * @return
	 */
	List<OrgTreeNodeModel> getOrgDataByUserName(String excludeUserId,String userName);

	/**
	 * queryGandP
	 * @param name
	 * @return
	 */
	List<GroupModel> queryGandP(String name);

	/**
	 * 根据名称模糊获取研讨组-20190129
	 * @param userId
	 * @param name
	 * @return
	 */
	List<GroupModel> getGroupByName(String userId, String name);
	List<OrgTreeNodeModel> getOrgDataByPid(String pid);
	List<OrgTreeNodeModel> getUserDataByPid(String pid,String excludeUserId);
}
