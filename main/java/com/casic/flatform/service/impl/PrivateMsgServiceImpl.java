package com.casic.flatform.service.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.casic.flatform.model.PrivateMsgInfoModel;
import com.casic.flatform.util.MyUUID;
import com.casic.flatform.vo.message.MsgInfoModel;
import com.casic.flatform.vo.message.ToMsgInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.MessageMapper;
import com.casic.flatform.mapper.PrivateMsgMapper;
import com.casic.flatform.model.PrivateMsgModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.PrivateMsgService;

/**
 * 私聊消息service
 * 
 * @author hanxu
 */
@Service
@Transactional
public class PrivateMsgServiceImpl implements PrivateMsgService {

	@Autowired
	private MessageMapper messageMapper;
	@Autowired
	private PrivateMsgMapper privateMsgMapper;

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
	@Override
	public List<PrivateMsgModel> queryPrivateMsg(String msg, Date startTime, Date endTime, String sendUser,
			String receiverUser, int start, int rows) {
		return messageMapper.queryPrivateMsg(msg, startTime, endTime, sendUser, receiverUser, start, rows);
	}

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
	@Override
	public int queryPrivateMsgCount(String msg, Date startTime, Date endTime, String sendUser, String receiverUser) {
		return messageMapper.queryPrivateMsgCount(msg, startTime, endTime, sendUser, receiverUser);
	}
	
	/**
     * 全部私聊消息
     * @param page
     * @param msgName
     * @param sendUser
     * @param msgLevels
     * @return
     */
	@Override
	public Object privateMsgsList(int page, String msgName, String sendUser, String msgLevels) {
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		//获取群组消息
		pageObject.setObjectList(privateMsgMapper.privateMsgsList((row * (page - 1)+1), page*row, msgName, sendUser, msgLevels));
		//获取群组消息数量
		pageObject.setTotal(privateMsgMapper.privateMsgsListCount(msgName, sendUser, msgLevels));
		return pageObject;
	}

	@Override
	public ToMsgInfo savePrivateMsg(MsgInfoModel msgInfoModel) {
		PrivateMsgInfoModel privateMsgModel = new PrivateMsgInfoModel();
		privateMsgModel.setMsgId(String.valueOf(MyUUID.getUUID()));
		privateMsgModel.setMsg(msgInfoModel.getData().getMine().getContent());
		privateMsgModel.setIsDelete(String.valueOf(0));
		privateMsgModel.setIsRead(String.valueOf(0));
		privateMsgModel.setSendTime(new Date());
		privateMsgModel.setLevels(String.valueOf(1));
		privateMsgModel.setMsgType("text");
		privateMsgModel.setMsgReceiver(msgInfoModel.getData().getTo().getId());
		privateMsgModel.setMsgSender(msgInfoModel.getData().getMine().getId());
		privateMsgMapper.savePrivateMsg(privateMsgModel);

		ToMsgInfo toMsgInfo = new ToMsgInfo();
		toMsgInfo.setCid(privateMsgModel.getMsgId());
		toMsgInfo.setContent(privateMsgModel.getMsg());
		toMsgInfo.setFromid(privateMsgModel.getMsgSender());
		toMsgInfo.setMine(false);
		toMsgInfo.setId(msgInfoModel.getData().getMine().getId());
		toMsgInfo.setTimestamp(privateMsgModel.getSendTime().getTime());
		toMsgInfo.setType(msgInfoModel.getData().getTo().getType());
		toMsgInfo.setUsername(msgInfoModel.getData().getMine().getUsername());
		toMsgInfo.setAvatar(msgInfoModel.getData().getMine().getAvatar());

		return toMsgInfo;
	}


}
