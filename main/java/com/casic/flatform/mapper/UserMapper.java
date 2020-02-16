package com.casic.flatform.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.SystemUserModel;
import com.casic.flatform.model.UserModel;

/**
 * 用户操作Mapper
 * @author hanxu
 */
public interface UserMapper {
	
	/**
	 * 验证用户名和密码，如果匹配，返回对应用户信息
	 * @param account	:用户名
	 * @param password	:密码
	 * @return
	 */
	public UserModel checkNamePassword(HashMap m);
	
	/**
	 * 获得用户信息
	 * @param userId	:用户id
	 * @return
	 */
	public UserModel queryUserInfo(@Param("userId")String userId);
	
	/**
	 * 通过登录名获得用户信息
	 * @param account	：用户登录名
	 * @return
	 */
	public UserModel queryUserInfoByAccount(@Param("account") String account);
	/**
	 * 验证管理员用户
	 * @param account	:用户名
	 * @param password	:密码
	 * @return
	 */
	public SystemUserModel checkAdminNamePassword(@Param("account") String account, @Param("password") String password);

//	/**
//	 * 获取消息发送者姓名
//	 * @param userId :用户ID
//	 * @return
//	 */
//	public UserModel queryUserInfoByUserId(@Param("userId") String userId);
	
	/**
	 * 上传头像
	 * @param use
	 * @param head
	 */
	void uploadHead(@Param("use") String use, @Param("readPath") String readPath);

	/**
	 * 获取头像
	 * @return
	 */
	public List<UserModel> queryHead(@Param("use") String use);

	/**
	 * 加载科员
	 * @param	:部门orgId
	 * @return
	 */
	public List<UserModel> queryClassUser(String orgId);

	/**
	 * 删除最近联系人\讨论组
	 * @param userId
	 * @param id
	 * @param type
	 */
	public void delLink(@Param("userId") String userId, @Param("id") String id, @Param("type") String type);

	/**
	 * 查询联系人
	 * @param name	:姓名
	 * @return
	 */
	public List<UserModel> getUserByName(String name);

	/**
	 * 修改用户信息
	 * @param userId
	 * @param phone
	 * @param roomid
	 * @return
	 */
	public void updataUserInfo(@Param("userId") String userId, @Param("phone") String phone, @Param("roomid") String roomid);

	/**
	 * 姓名转编码
	 * @param fileName
	 * @return
	 */
	UserModel turnNameToId(String fileName);

	/**
	 * 查询所有在线人员
	 * @param start
	 * @param row
	 * @param fileName
	 * @return
	 */
	public List<UserModel> userList(@Param("start") Integer start, @Param("row") Integer row,
			@Param("fileName") String fileName);
	
	/**
	 * 查询所有在线人员数量
	 * @param fileName
	 * @return
	 */
	public int userCount(@Param("fileName") String fileName);

	/**
	 * 一键下线
	 */
	public void allUnline();
	
	/**
     * 根据密级和部门获取用户
     * @param userId
     * @param orgId
     * @param levels
     * @return
     */
	List<UserModel> getALLUserByOrg(@Param("userId") String userId, @Param("orgId") String orgId, @Param("levels") String levels);

	/**
	 * 会议、日程成员获取
	 * @return
	 */
	public List<UserModel> GetMeUser(@Param("orgId") String orgId);

	/**
	 * 审批执行人
	 * @param orgId
	 * @return
	 */
	public List<UserModel> selectDown(String orgId);

}
