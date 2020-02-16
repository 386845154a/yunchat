package com.casic.flatform.service;

import java.util.Date;
import java.util.List;

import com.casic.flatform.model.PrivateMsgModel;
import com.casic.flatform.vo.message.MsgInfoModel;
import com.casic.flatform.vo.message.ToMsgInfo;

/**
 * 私聊消息
 * 
 * @author hanxu
 */
public interface PrivateMsgService {
	/**
	 * 分页查询获得私聊消息
	 * 
	 * @param msg
	 *            ：消息
	 * @param startTime
	 *            ：时间范围
	 * @param endTime
	 *            ：时间范围
	 * @param sendUser
	 *            ：消息发送人
	 * @param receiverUser
	 *            ：消息接收人
	 * @param start
	 *            ：分页开始位置
	 * @param rows
	 *            ：显示行数
	 * @return
	 */
	List<PrivateMsgModel> queryPrivateMsg(String msg, Date startTime, Date endTime, String sendUser,
			String receiverUser, int start, int rows);

	/**
	 * 分页查询私聊消息时获得总数
	 * 
	 * @param msg
	 *            ：消息
	 * @param startTime
	 *            ：时间范围
	 * @param endTime
	 *            ：时间范围
	 * @param sendUser
	 *            ：消息发送人
	 * @param receiverUser
	 *            ：消息接收人
	 * @return
	 */
	int queryPrivateMsgCount(String msg, Date startTime, Date endTime, String sendUser, String receiverUser);

	/**
     * 全部私聊消息
     * @param page
     * @param msgName
     * @param sendUser
     * @param msgLevels
     * @return
     */
	public Object privateMsgsList(int page, String msgName, String sendUser, String msgLevels);


	public ToMsgInfo savePrivateMsg(MsgInfoModel msgInfoModel);

}
