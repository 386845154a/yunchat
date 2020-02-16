package com.casic.flatform.service;

import java.util.List;

import com.casic.flatform.model.ChildModel;
import com.casic.flatform.model.DetailsModel;
import com.casic.flatform.model.DownApporModel;
import com.casic.flatform.model.ToolsModel;
import com.casic.flatform.pageModel.PageObject;

public interface ToolsService {

	/**
	 * 获取网络工具信息
	 * @param tools_class 
	 * @return
	 */
	PageObject queryTools(Integer page, String tab_name, String tab_id, String type);
	
	/**
	 * 获取最新上传/热门推荐工具信息
	 * @return
	 */
	List<ToolsModel> queryDetailsInfo(String toolId);

	/**
	 * 上传公告
	 * @param childs
	 * @return
	 */
	Boolean saveChild(ChildModel childs);

	/**
	 * 查询公告
	 * @return
	 */
	List<ChildModel> queryAffiche(String start, String end);

	/**
	 * 保存评论信息
	 * @param details
	 */
	void saveDetails(DetailsModel details);

	/**
	 * 修改下载次数
	 */
	void updateDownc(Integer downc, String fileId);

	/**
	 * 工具查询
	 * @param page
	 * @return
	 */
	PageObject query_Tools(Integer page, String fileName, String sendUser, String fileLevels);

	/**
	 * 审批工具
	 * @param fileId
	 */
	void approve_tool(String fileId, String isregister, String grade);

	/**
	 * 删除工具
	 * @param fileId
	 */
	void del_tool(String fileId);

	/**
	 * 获取网络工具信息
	 * @param fileId 
	 * @return
	 */
	List<DetailsModel> queryDetails(String fileId);

	/**
	 * 工具图片
	 * @param path
	 */
	void titleImg(String toolid, String path);

	/**
	 * 工具查询方法
	 * @param detailsModel
	 * @return
	 */
	List<DetailsModel> queryDetailsByPojo(DetailsModel detailsModel);

    /**
     * 公告总数
     * @return
     */
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
	int commentAll(String toolId);
	
	/**
	 * 全部平均评分总数
	 * @param toolId
	 * @return
	 */
	int commentAllCount(String toolId);
	
	/**
	 * 我的评分
	 * @param userId
	 * @param toolId
	 * @return
	 */
	List<DetailsModel> Mycomment(String userId, String toolId);

	/**
	 * 根据ID获取工具信息
	 * @param toolId
	 * @return
	 */
	ToolsModel getToolById(String toolId);

	/**
	 * 评论信息条数
	 * @param toolId
	 * @return
	 */
	int myPLCount(String toolId);

	/**
	 * 我的上传、我的审批
	 * @param userId
	 * @return
	 */
	List<ToolsModel> upAndApprove(String userId, String approve);

	/**
	 * 二级审批提交
	 * @param fileId
	 * @param approver
	 * @param state
	 */
	void apporChange(String fileId, String approver, String state);
	
	/**
	 * 审批意见变更
	 * @param fileId
	 * @param approver
	 */
	void approvalChange(String fileId, String approval);

	/**
	 * 下载审批
	 * @param daname
	 * @param userId
	 * @return
	 */
	List<DownApporModel> datablelist(String daname, String userId);

	/**
	 * 根据ID获取工具审核状态
	 * @param tid 工具ID
	 * @return
	 */
	Object getDownState(String tid);
	
	/**
	 * 当前用户是否提交下载申请
	 * @param tid 工具ID
	 * @param userId 当前用户ID
	 * @return
	 */
	Object isSubmit(String tid, String userId);

	/**
	 * 提交工具下载申请
	 * @param dafileid 工具ID
	 * @param dafilename 工具名称
	 * @param dafilelevel 工具等级
	 * @param dauser 审批人
	 * @param datext 申请原因
	 * @param userId 申请人ID
	 * @param fullname 申请人名称
	 */
	void downApporSubmit(String dafileid, String dafilename, String dafilelevel, String dauser, String datext,
			String userId, String fullname);

	/**
	 * 下载审核通过/驳回
	 * @param id
	 * @return
	 */
	void agreeDown(String id, String flag);

	/**
	 * 删除已存在记录
	 * @param dafileid
	 * @param userId
	 */
	void delDownApporSubmit(String dafileid, String userId);


	
}
