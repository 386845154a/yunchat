package com.casic.flatform.model;

import java.util.Date;

/**
 * 消息对象，包含私聊消息和群组消息
 * @author hanxu
 */
public class ChatMsgModel {

	private String msgId;//消息id
	private String senderId;//消息发送者
	private String receiverId;//消息接收者
	private Date sendTime;//发送时间
	private String content;//聊天内容
	private String msgType;//消息类型
	private String msgPath;//上传文件路径
	private String isDelete;//是否删除
	private String chatType;//聊天类型

	public String getMsgId() {
		return msgId;
	}

	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}

	public String getSenderId() {
		return senderId;
	}

	public void setSenderId(String senderId) {
		this.senderId = senderId;
	}

	public String getReceiverId() {
		return receiverId;
	}

	public void setReceiverId(String receiverId) {
		this.receiverId = receiverId;
	}

	public Date getSendTime() {
		return sendTime;
	}

	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getMsgType() {
		return msgType;
	}

	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}

	public String getMsgPath() {
		return msgPath;
	}

	public void setMsgPath(String msgPath) {
		this.msgPath = msgPath;
	}

	public String getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(String isDelete) {
		this.isDelete = isDelete;
	}

	public String getChatType() {
		return chatType;
	}

	public void setChatType(String chatType) {
		this.chatType = chatType;
	}

}
