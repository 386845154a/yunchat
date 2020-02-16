package com.casic.flatform.mapper;

import java.util.List;

import com.casic.flatform.model.PrivateMsgInfoModel;
import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.PrivateMsgModel;

public interface PrivateMsgMapper {

	/**
	 * 全部私聊消息
	 * @param start		：分页开始位置
	 * @param row		：每页显示数量
	 * @param msgName
	 * @param sendUser
	 * @param msgLevels
	 * @return	:List<GroupMsgModel>
	 */
	public List<PrivateMsgModel> privateMsgsList(@Param("start") Integer start, @Param("row") Integer row, 
			@Param("msgName") String msgName, @Param("sendUser") String sendUser, @Param("msgLevels") String msgLevels);
	
	/**
	 * 获取私聊消息数量
	 * @param msgName
	 * @param sendUser
	 * @param msgLevels
	 * @return
	 */
	int privateMsgsListCount(@Param("msgName") String msgName, @Param("sendUser") String sendUser, @Param("msgLevels") String msgLevels);
//	void savePrivateMsg (@Param("msgName") String msgName, @Param("sendUser") String sendUser, @Param("msgLevels") String msgLevels);
	int savePrivateMsg(PrivateMsgInfoModel record);
}



