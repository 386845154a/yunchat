package com.casic.flatform.mapper;

import com.casic.flatform.model.ChildModel;
import com.casic.flatform.model.DetailsModel;
import com.casic.flatform.model.DownApporModel;
import com.casic.flatform.model.FeedBackModel;
import com.casic.flatform.model.ToolsModel;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ToolsMapper {

	/**
	 * 网络工具
	 * @param start
	 * @param row
	 * @param tab_name
	 * @param tab_id
	 * @param type
	 * @return
	 */
	public List<ToolsModel> queryTools(@Param("start") Integer start, @Param("row") Integer row,
			@Param("tab_name") String tab_name, @Param("tab_id") String tab_id, @Param("type") String type);
	
	/**
	 * 网络工具数量
	 * @param tab_name
	 * @param tab_id
	 * @param type
	 * @return
	 */
	public int queryToolsCount(@Param("tab_name") String tab_name, @Param("tab_id") String tab_id, 
			@Param("type") String type);
	
	/**
	 * 获取最新上传/热门推荐工具信息
	 * @return
	 */
	 List<ToolsModel> queryDetailsInfo(@Param("toolId") String toolId);

	/**
	 * 上传子文件
	 * @param childs
	 * @return
	 */
	int saveChild(ChildModel childs);

	/**
	 * 查询公告
	 * @return
	 */
	 List<ChildModel> queryAffiche(@Param("start") int start, @Param("end") int end);

	/**
	 * 保存评论信息
	 * @param details
	 */
	 void saveDetails(DetailsModel details);

	/**
	 * 修改下载次数
	 */
	int updateDownc(@Param("downc") Integer downc, @Param("fileId") String fileId);

	/**
	 * 查询工具信息
	 * @param start		：分页开始位置
	 * @param row		：每页显示数量
	 * @return	:List<LogModel>
	 */
	List<ToolsModel> query_Tools(@Param("start") Integer start, @Param("row") Integer row, 
			@Param("fileName") String fileName, @Param("sendUser") String sendUser, @Param("fileLevels") String fileLevels);

	/**
	 * 查询工具信息总数
	 * @return
	 */
	 int query_Tools_count(@Param("fileName") String fileName, @Param("sendUser") String sendUser, @Param("fileLevels") String fileLevels);

	/**
	 * 审批工具
	 * @param fileId
	 * @return
	 */
	int approve_tool(@Param("fileId") String fileId, @Param("isregister") String isregister, @Param("grade") String grade);

	/**
	 * 删除工具
	 * @param fileId
	 * @return
	 */
	int del_tool(String fileId);

	/**
	 * 获取讨论区信息
	 * @param fileId 
	 * @return
	 */
	List<DetailsModel> queryDetails(String fileId);

	/**
	 * 工具图片
	 * @param path
	 */
	void titleImg(@Param("toolid") String toolid, @Param("path") String path);

	List<DetailsModel> queryComment(DetailsModel detailsModel);

	int countChildFile();

    List<ChildModel> queryAfficheList();
    
    /**
     * 根据Id删除公告
     * @param afficheId
     */
	void delAfficheById(String afficheId);

	/**
	 * 全部平均评分
	 * @param toolId
	 * @return
	 */
	public int commentAll(String toolId);

	/**
	 * 全部平均评分总数
	 * @param toolId
	 * @return
	 */
	public int commentAllCount(String toolId);

	/**
	 * 我的评分
	 * @param userId
	 * @param toolId
	 * @return
	 */
	List<DetailsModel> Mycomment(@Param("userId") String userId, @Param("toolId") String toolId);

	/**
	 * 根据ID获取工具信息
	 * @param toolId
	 * @return
	 */
	public ToolsModel getToolById(String toolId);

	/**
	 * 评论信息条数
	 * @param toolId
	 * @return
	 */
	public int myPLCount(String toolId);

	/**
	 * 我的上传、我的审批
	 * @param userId
	 * @return
	 */
	public List<ToolsModel> upAndApprove(@Param("userId") String userId, @Param("approve") String approve);

	/**
	 * 二级审批提交
	 * @param fileId
	 * @param approver
	 * @param state
	 */
	public void apporChange(@Param("fileId") String fileId, @Param("approver") String approver, @Param("state") String state);

	/**
	 * 审批意见变更
	 * @param fileId
	 * @param approver
	 */
	public void approvalChange(@Param("fileId") String fileId, @Param("approval") String approval);

	/**
	 * 下载审批
	 * @param daname
	 * @param userId
	 * @return
	 */
	public List<DownApporModel> datablelist(@Param("daname") String daname, @Param("userId") String userId);

	/**
	 * 根据ID获取工具审核状态
	 * @param tid
	 * @return
	 */
	public Object getDownState(String tid);
	
	/**
	 * 当前用户是否提交下载申请
	 * @param tid 工具ID
	 * @param userId 当前用户ID
	 * @return
	 */
	public Object isSubmit(@Param("tid") String tid, @Param("userId") String userId);

	/**
	 * 提交工具下载申请
	 * @param downApporModel
	 */
	public void downApporSubmit(DownApporModel downApporModel);

	/**
	 * 下载审核通过/驳回
	 * @param id
	 * @return
	 */
	public void agreeDown(@Param("id") String id, @Param("flag") String flag);

	/**
	 * 删除已存在记录
	 * @param dafileid
	 * @param userId
	 */
	public void delDownApporSubmit(@Param("dafileid") String dafileid, @Param("userId") String userId);
	
}



