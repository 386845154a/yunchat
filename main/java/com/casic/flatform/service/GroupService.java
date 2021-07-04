package com.casic.flatform.service;

import com.casic.flatform.model.*;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.vo.message.CommonVo;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface GroupService {
	/**
	 * 获得讨论组成员
	 * 
	 * @param groupId
	 *            :讨论组id
	 * @return
	 */
	public List<UserModel> queryGroupUser(String groupId);
	
	/**
	 * 获得重要信息
	 * 
	 * @return
	 */
	public List<GroupMsgModel> queryImportantInfo(String groupId);
	
	/**
	 * 导出讨论组聊天信息
	 * @return
	 */
	public List<GroupMsgModel> queryGInfo(String groupId);


	/**
	 * 获得讨论组信息
	 * 
	 * @return
	 */
	public List<GroupModel> queryGroup();

	/**
	 * 查询讨论组信息
	 * 
	 * @param groupId
	 *            :讨论组id
	 * @return
	 */
	public GroupInfoModel queryGroupInfo(String groupId);

	/**
	 * 分页查询讨论组文件
	 * 
	 * @param fileName
	 *            ：文件名称
	 * @param groupId
	 *            ：讨论组id
	 * @param page
	 *            ：页面
	 * @param pageRow
	 *            ：每页显示数量
	 * @return
	 */
	public PageObject queryGroupFile(String fileName, String groupId, int page, int pageRow);

	/**
	 * 保存讨论组文件到数据库
	 * 
	 * @param groupFile
	 *            :文件对象
	 * @return
	 */
	public int saveGroupFile(GroupFileModel groupFile);

	/**
	 * 创建讨论组
	 * 
	 * @param groupName
	 *            ：讨论组名称
	 * @param groupDescribe
	 *            ：讨论组描述
	 * @param userArray
	 *            ：讨论组成员列表
	 * @param userId
	 *            ：创建者
	 * @param choose_name 
	 */
	String createGroup(String groupName, String groupDescribe, String[] userArray, String userId, String choose_name, String scop, String ispublic, String levels);

	/**
	 * 更新讨论组
	 * 
	 * @param groupId
	 *            :讨论组id
	 * @param groupName
	 *            ：讨论组名称
	 * @param groupDescribe
	 *            ：讨论组描述
	 * @param userIdArray
	 *            ：讨论组人员
	 * @param userId
	 *            ：当前用户
	 */
	void updateGroup(String groupId, String groupName, String groupDescribe, String[] userIdArray, String userId);
	
	/**
	 * 添加为重要信息
	 */
	void updateImportantFlag(String meg);
	
	/**
	 * 更新系统信息已读\未读标识
	 */
	void updateSysMsgFlag(String notificationId);

	/**
	 * 删除讨论组文件
	 * 
	 * @param groupId
	 *            :讨论组id
	 * @param fileId
	 *            ：文件id
	 * @param path
	 *            ：文件路径
	 * @param readPath
	 *            ：转码后的文件路径
	 */
	void deleteGroupFile(String groupId, String fileId, String path, String readPath);
	
	/**
	 * 移除重要信息标记
	* 
	 * @param megId
	 *            :信息Id
	 * @param msg
	 *            ：信息内容
	 */
	void removeImportantInfo(String msgId, String msg);

	/**
	 * 逻辑删除讨论组
	 * 
	 * @param groupId
	 *            :讨论组id
	 * @param userId
	 *            ：用户id
	 */
	void deleteGroup(String groupId, String userId);

	/**
	 * 通过讨论组文件id获得文件读取路径
	 * 
	 * @param fileId
	 *            :文件id
	 * @return
	 */
	String queryReadPathById(String fileId);

	/**
	 * 更新讨论组上传文件转码路径信息，转码线程调用，更新转码路径信息
	 * 
	 * @param readPath
	 *            ：转码后文件路径
	 * @param fileId
	 *            ：文件id
	 * @param updator
	 *            ：更新人
	 */
	Boolean updateGroupFile(String readPath, String fileId, String updator);

	/**
	 * 获得所有讨论组（不包含已删除的）
	 * 
	 * @return
	 */
	List<GroupInfoModel> queryAllGroup();

	/**
	 * 分页查询讨论组消息
	 * 
	 * @param groupId
	 *            :讨论组id
	 * @param msg
	 *            ：查找消息内容
	 * @param page
	 *            ：页码
	 * @param rows
	 *            ：每页显示行数
	 * @param startDate
	 *            :开始时间
	 * @param endDate
	 *            :结束时间
	 * @return
	 */
	List<GroupMsgModel> queryGroupMsg(String groupId, String msg, int page, int rows, Date startDate, Date endDate);

	/**
	 * 分页查询时获得总数
	 * 
	 * @param groupId
	 *            :讨论组id
	 * @param msg
	 *            ：查找消息内容
	 * @param startDate
	 *            :开始时间
	 * @param endDate
	 *            :结束时间
	 * @return
	 */
	int queryGroupMsgCount(String groupId, String msg, Date startDate, Date endDate);

	/**
	 * 分页获得讨论组信息
	 * 
	 * @return
	 */
	PageObject queryGroupPage(int page, int rows, String name, String isDelete, Date startTime, Date endTime);

	void addGroupPerson(String groupId, String userId);

	/**
	 * 退出群组
	 * @param userId
	 * @param groupId
	 */
	void outGroup(String userId, String groupId);

	/**
	 * 根据groupID获得讨论组名称
	 * @param receiver
	 * @return
	 */
	public GroupModel queryGroupInfoById(String receiver);


	/**
	 * 根据groupID获得讨论组密级
	 * @param groupid
	 * @return
	 */
	public String queryGroupLevelsByGroupId(String groupid);
	/**
	 * 关闭讨论组
	 * @param receiver
	 * @return
	 */
	void closedGroup(String groupId);

	/**
	 * 根据用户名和组名模糊查询组
	 * @param parm
	 * @return
	 */
	List<Map<String, Object>> queryGroupByUserAndGroupName(String userId, String groupName);

    void getBestTeams(String userId);

    /**
     * 全部群组消息
     * @param page
     * @param msgName
     * @param sendUser
     * @param msgLevels
     * @return
     */
	public Object groupMsgsList(int page, String msgName, String sendUser, String msgLevels);

	/**
	 * 创建MPM组
	 * @param groupInfo
	 */
	public void createMpm(GroupInfoModel groupInfo);

	/**
	 * 创建MPM组成员
	 * @param groupInfo
	 */
	public void saveGroupUser(String groupId, String parameter);
	
	/**
     * 批量删除服务器文件
     * @param inputTime
     * @return
     */
	public List<?> del_more_file(Date inputTime, String type);
	List<GroupEidtOrgVo> getGroupEditOrgInf(String groupId ,String userName);
	//查询群用户列表
	CommonVo getGroupUserList(String groupId);
}
