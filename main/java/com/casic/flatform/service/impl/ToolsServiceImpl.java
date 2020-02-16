package com.casic.flatform.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.ToolsMapper;
import com.casic.flatform.model.ChildModel;
import com.casic.flatform.model.DetailsModel;
import com.casic.flatform.model.DownApporModel;
import com.casic.flatform.model.ToolsModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.ToolsService;
import com.casic.flatform.util.MyUUID;

/**
 * 网络工具
 * 
 * @author zouct
 */
@Service
@Transactional
public class ToolsServiceImpl implements ToolsService {

	@Autowired
	private ToolsMapper toolsMapper;
	
	/**
	 * 获取网络工具信息
	 * @param tools_class 
	 * @return
	 */
	@Override
	public PageObject queryTools(Integer page, String tab_name, String tab_id, String type) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		String typeAll = "";
		String typeNew = "";
		String typeHot = "";
		pageObject.setPage(page);
		pageObject.setObjectList(toolsMapper.queryTools((row * (page - 1)+1), page*row, tab_name, tab_id, type));
		pageObject.setTotal(toolsMapper.queryToolsCount(tab_name, tab_id, type));
		return pageObject;
	}
	
	/**
	 * 获取最新上传/热门推荐工具信息
	 * @return
	 */
	@Override
	public List<ToolsModel> queryDetailsInfo(String toolId) {
		return toolsMapper.queryDetailsInfo(toolId);
	}

	/**
	 * 上传网络工具
	 */
	@Override
	public Boolean saveChild(ChildModel childs) {
		int count = toolsMapper.saveChild(childs);
		if (count > 0) {
			return true;
		}
		return false;
	}

	/**
	 * 查询公告
	 */
	@Override
	public List<ChildModel> queryAffiche(String r, String s) {
		int page = Integer.parseInt(r);
		int size = Integer.parseInt(s);
		return toolsMapper.queryAffiche((size * (page - 1)+1), page*size);
	}

	/**
	 * 保存评论信息
	 */
	@Override
	public void saveDetails(DetailsModel details) {
		toolsMapper.saveDetails(details);
	}

	/**
	 * 修改下载次数
	 */
	@Override
	public void updateDownc(Integer downc, String fileId) {
		toolsMapper.updateDownc(downc, fileId);
	}

	/**
	 * 工具查询
	 */
	@Override
	public PageObject query_Tools(Integer page, String fileName, String sendUser, String fileLevels) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(toolsMapper.query_Tools((row * (page - 1)+1), page*row, fileName, sendUser, fileLevels));
		pageObject.setTotal(toolsMapper.query_Tools_count(fileName, sendUser, fileLevels));
		return pageObject;
	}

	/**
	 * 审批工具
	 */
	@Override
	public void approve_tool(String fileId, String isregister, String grade) {
		toolsMapper.approve_tool(fileId, isregister, grade);
	}

	/**
	 * 删除工具
	 */
	@Override
	public void del_tool(String fileId) {
		toolsMapper.del_tool(fileId);
	}

	/**
	 * 获取讨论区信息
	 */
	@Override
	public List<DetailsModel> queryDetails(String fileId) {
		return toolsMapper.queryDetails(fileId);
	}

	/**
	 * 工具图片
	 */
	@Override
	public void titleImg(String toolid, String path) {
		toolsMapper.titleImg(toolid, path);
	}

	@Override
	public List<DetailsModel> queryDetailsByPojo(DetailsModel detailsModel) {
		return toolsMapper.queryComment(detailsModel);
	}

    @Override
    public int countChildFile() {
        return toolsMapper.countChildFile();
    }

	@Override
	public List<ChildModel> queryAfficheList() {
		return toolsMapper.queryAfficheList();
	}
	
	/**
	 * 根据Id删除公告
	 */
	@Override
	public void delAfficheById(String afficheId) {
		toolsMapper.delAfficheById(afficheId);
	}

	/**
	 * 全部平均评分
	 * @param toolId
	 * @return
	 */
	@Override
	public int commentAll(String toolId) {
		return toolsMapper.commentAll(toolId);
	}

	/**
	 * 全部平均评分总数
	 * @param toolId
	 * @return
	 */
	@Override
	public int commentAllCount(String toolId) {
		// TODO Auto-generated method stub
		return toolsMapper.commentAllCount(toolId);
	}
	
	/**
	 * 我的评分
	 * @param userId
	 * @param toolId
	 * @return
	 */
	@Override
	public List<DetailsModel> Mycomment(String userId, String toolId) {
		// TODO Auto-generated method stub
		return toolsMapper.Mycomment(userId, toolId);
	}

	/**
	 * 根据ID获取工具信息
	 */
	@Override
	public ToolsModel getToolById(String toolId) {
		return toolsMapper.getToolById(toolId);
	}

	/**
	 * 评论信息条数
	 */
	@Override
	public int myPLCount(String toolId) {
		// TODO Auto-generated method stub
		return toolsMapper.myPLCount(toolId);
	}

	/**
	 * 我的上传、我的审批
	 * @param userId
	 * @return
	 */
	@Override
	public List<ToolsModel> upAndApprove(String userId, String approve) {
		// TODO Auto-generated method stub
		return toolsMapper.upAndApprove(userId, approve);
	}

	/**
	 * 二级审批提交
	 * @param fileId
	 * @param approver
	 * @param state
	 */
	@Override
	public void apporChange(String fileId, String approver, String state) {
		toolsMapper.apporChange(fileId, approver, state);
	}

	/**
	 * 审批意见变更
	 * @param fileId
	 * @param approver
	 */
	@Override
	public void approvalChange(String fileId, String approval) {
		toolsMapper.approvalChange(fileId, approval);
	}

	/**
	 * 下载审批
	 * @param daname
	 * @param userId
	 * @return
	 */
	@Override
	public List<DownApporModel> datablelist(String daname, String userId) {
		return toolsMapper.datablelist(daname, userId);
	}

	/**
	 * 根据ID获取工具审核状态
	 * @param tid
	 * @return
	 */
	@Override
	public Object getDownState(String tid) {
		return toolsMapper.getDownState(tid);
	}
	
	/**
	 * 当前用户是否提交下载申请
	 * @param tid 工具ID
	 * @param userId 当前用户ID
	 * @return
	 */
	@Override
	public Object isSubmit(String tid, String userId) {
		return toolsMapper.isSubmit(tid, userId);
	}

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
	@Override
	public void downApporSubmit(String dafileid, String dafilename, String dafilelevel, String dauser, String datext,
			String userId, String fullname) {
		DownApporModel downApporModel = new DownApporModel();
		downApporModel.setId(MyUUID.getUUID());
		downApporModel.setDaid(dafileid);
		downApporModel.setDaname(dafilename);
		downApporModel.setDalevel(dafilelevel);
		downApporModel.setDatext(datext);
		downApporModel.setDastate("1");
		downApporModel.setDaappor(dauser);
		downApporModel.setDacreater(userId);
		downApporModel.setDacreatername(fullname);
		toolsMapper.downApporSubmit(downApporModel);
	}

	/**
	 * 下载审核通过/驳回
	 * @param id
	 * @return
	 */
	@Override
	public void agreeDown(String id, String flag) {
		toolsMapper.agreeDown(id, flag);
	}

	/**
	 * 删除已存在记录
	 * @param dafileid
	 * @param userId
	 */
	@Override
	public void delDownApporSubmit(String dafileid, String userId) {
		toolsMapper.delDownApporSubmit(dafileid, userId);
	}
}




