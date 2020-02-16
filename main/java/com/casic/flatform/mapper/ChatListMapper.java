package com.casic.flatform.mapper;

import java.util.List;
import java.util.Map;

import com.casic.flatform.model.GroupInfo;
import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.GroupModel;
import com.casic.flatform.pageModel.OrgUserPageModel;

/**
 * 聊天列表Mapper
 *
 * @author hanxu
 */
public interface ChatListMapper {

	/**
	 * 获得最近联系人，包含讨论组
	 *
	 * @param userId
	 *            :当前用户id
	 * @return
	 */
	List<Map<String, Object>> latelyUser(Map parm);

	/**
	 * 获得全部单位的人员(不包含当前用户)
	 *
	 * @param userId
	 *            :当前用户id
	 * @return
	 */
	List<OrgUserPageModel> allOrgUserNoLogUser(@Param("userId") String userId, @Param("level") String level,
			@Param("inputValue") String inputValue);

	/**
	 * 根据密级获取用户
	 * 
	 * @param userId
	 * @param levels
	 * @return
	 */
	public List<OrgUserPageModel> queryOrgUserBylevels(@Param("userId") String userId, @Param("levels") String levels);

	public List<OrgUserPageModel> queryOrgUserBylevelsOrgID(@Param("userId") String userId, @Param("levels") String levels, @Param("orgid") String orgid);

	/**
	 * 获得全部单位的人员(不包含当前用户)
	 *
	 * @param userId
	 *            :当前用户id
	 * @return
	 */
	List<OrgUserPageModel> allOrgUser();

	/**
	 * 获得当前用户所在讨论组
	 *
	 * @param userId
	 *            :当前用户id
	 * @return
	 */
	List<Map<String, Object>> groupByUserId(Map parm);
	List<GroupInfo> groupByUserIdNew(String userId);

	/**
	 * queryGandP
	 * @param name
	 * @return
	 */
	List<GroupModel> queryGandP(String pname);

}
