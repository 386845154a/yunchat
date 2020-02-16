package com.casic.flatform.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.MoneyRewardMapper;
import com.casic.flatform.model.MoneyRewardCModel;
import com.casic.flatform.model.MoneyRewardGModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.MoneyRewardService;

@Service
@Transactional
public class MoneyRewardServiceImpl implements MoneyRewardService {

	@Autowired
	private MoneyRewardMapper moneyRewardMapper;

	/**
	 * 根据用户姓名和部门名称
	 * @param userName
	 * @param orgName
	 * @return
	 */
	@Override
	public UserModel getIdbyUOName(String hrId) {
		return moneyRewardMapper.getIdbyUOName(hrId);
	}

	/**
	 * 获取我的全部金额
	 * @param userId
	 * @return
	 */
	@Override
	public PageObject getMygold(Integer page, String userId) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(moneyRewardMapper.getMygold((row * (page - 1)+1), page*row, userId));
		pageObject.setTotal(moneyRewardMapper.getMygoldCount(userId));
		return pageObject;
	}
	
	/**
	 * 插入我的金额记录(主表)
	 * @param moneyRewardGModel
	 */
	@Override
	public void addMyGoldMainMsgs(MoneyRewardGModel moneyRewardGModel) {
		moneyRewardMapper.addMyGoldMainMsgs(moneyRewardGModel);
	}
	
	/**
	 * 插入我的金额记录(关联表)
	 * @param moneyRewardCModel
	 */
	@Override
	public void addMyGoldMsgs(MoneyRewardCModel moneyRewardCModel) {
		moneyRewardMapper.addMyGoldMsgs(moneyRewardCModel);
	}

	/**
	 * 删除我的金额记录
	 * @param userId
	 * @param projectName
	 */
	@Override
	public void delMyGoldMsgs(String userId, String projectName) {
		moneyRewardMapper.delMyGoldMsgs(userId, projectName);
	}

	/**
	 * 查询我的未读金额
	 * @param userId
	 */
	@Override
	public List<MoneyRewardCModel> getMyNoRead(String userId) {
		return moneyRewardMapper.getMyNoRead(userId);
	}

	/**
	 * 更改我的金额是否读取状态
	 * @param userId
	 */
	@Override
	public void updateMyRead(String userId) {
		moneyRewardMapper.updateMyRead(userId);
	}

}
