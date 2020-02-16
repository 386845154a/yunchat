package com.casic.flatform.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.MoneyRewardCModel;
import com.casic.flatform.model.MoneyRewardGModel;
import com.casic.flatform.model.UserModel;

public interface MoneyRewardMapper {

	/**
	 * 根据用户姓名和部门名称
	 * @param userName
	 * @param orgName
	 * @return
	 */
	UserModel getIdbyUOName(String hrId);

	/**
	 * 获取我的全部金额
	 * @param userId
	 * @return
	 */
	public List<MoneyRewardCModel> getMygold(@Param("start") Integer start, @Param("row") Integer row, @Param("userId") String userId);
	
	/**
	 * 获取我的全部金额条数
	 * @param userId
	 * @return
	 */
	public int getMygoldCount(@Param("userId") String userId);

	/**
	 * 插入我的金额记录(主表)
	 * @param MoneyRewardGModel
	 */
	void addMyGoldMainMsgs(MoneyRewardGModel moneyRewardGModel);
	
	/**
	 * 插入我的金额记录(关联表)
	 * @param MoneyRewardCModel
	 */
	void addMyGoldMsgs(MoneyRewardCModel moneyRewardCModel);

	/**
	 * 删除我的金额记录
	 * @param userId
	 * @param projectName
	 */
	void delMyGoldMsgs(@Param("userId") String userId, @Param("projectName") String projectName);

	/**
	 * 查询我的未读金额
	 * @param userId
	 */
	List<MoneyRewardCModel> getMyNoRead(String userId);

	/**
	 * 更改我的金额是否读取状态
	 * @param userId
	 */
	void updateMyRead(String userId);

}



