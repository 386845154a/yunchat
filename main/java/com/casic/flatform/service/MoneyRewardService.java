package com.casic.flatform.service;

import java.util.List;

import com.casic.flatform.model.MoneyRewardCModel;
import com.casic.flatform.model.MoneyRewardGModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.PageObject;

public interface MoneyRewardService {

	/**
	 * 根据用hrid
	 * @param hrId
	 * @return
	 */
	public UserModel getIdbyUOName(String hrId);
	
	/**
	 * 获取我的全部金额
	 * @param userId
	 * @return
	 */
	PageObject getMygold(Integer page, String userId);

	/**
	 * 插入我的金额记录(主表)
	 * @param moneyRewardGModel
	 */
	public void addMyGoldMainMsgs(MoneyRewardGModel moneyRewardGModel);
	
	/**
	 * 插入我的金额记录(关联表)
	 * @param moneyRewardCModel
	 */
	public void addMyGoldMsgs(MoneyRewardCModel moneyRewardCModel);
	
	/**
	 * 删除我的金额记录
	 * @param userId
	 * @param projectName
	 */
	public void delMyGoldMsgs(String userId, String projectName);
	
	/**
	 * 查询我的未读金额
	 * @param userId
	 */
	public List<MoneyRewardCModel> getMyNoRead(String userId);
	
	/**
	 * 更改我的金额是否读取状态
	 * @param userId
	 */
	public void updateMyRead(String userId);

	


}
