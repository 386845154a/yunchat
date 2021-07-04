package com.casic.flatform.service.impl;

import com.casic.flatform.mapper.MessageMapper;
import com.casic.flatform.mapper.UserMapper;
import com.casic.flatform.model.*;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.MessageService;
import com.casic.flatform.util.ConfigParameterUtil;
import com.casic.flatform.util.HttpUtil;
import com.casic.flatform.util.MyUUID;
import com.casic.flatform.vo.message.ToMsgInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.Map.Entry;

/**
 * 消息处理service
 * 
 * @author hanxu
 */
@Service
@Transactional
public class MessageServiceImpl implements MessageService {

	private Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);
	private final Integer reserveNotReadCount = Integer
			.valueOf(ConfigParameterUtil.getConfigByName("saveNotRead", "10"));

	@Value("${node.ip}")
	private String nodeServerIp;
	
	@Autowired
	private UserMapper userMapper;
	@Autowired
	private MessageMapper messageMapper;

	/**
	 * 移动当天消息都历史列表 首先会移动所有已读消息到历史表中，然后ru表中保存最多10条未读消息，多余的在移动到历史表中
	 */
	@Override
	public void moveRuToHi() {
		//20190109
//		// 移动私聊消息
//		this.movePrivateMsg();
//		// 移动讨论组消息
//		this.moveGroupMsg();
	}

	/**
	 * 移动私聊消息到历史表
	 */
	private void movePrivateMsg() {
		// 先移动所有已读信息到历史表中
		int i = messageMapper.movePrivateMsg(null);// 移动消息都历史表
		int j = messageMapper.removeRuPrivateMsg(null);// 删除ru表中已经移动的数据
		logger.info("移动私聊已读消息：" + i + "条；删除ru表数据：" + j + "条。");
		// ru表中未读多余10条的未读移动到历史表中
		List<PrivateMsgModel> privateList = messageMapper.findRuPrivateRedundant(reserveNotReadCount);// 使用is_read字段存储未读的总数

		if (privateList != null && privateList.size() > 0) {
			Map<String, Object> parameter = new HashMap<>();
			for (PrivateMsgModel chat : privateList) {
				if (chat == null || chat.getIsRead() == null) {
					continue;
				}

				parameter.clear();
				parameter.put("msgSender", chat.getMsgSender());
				parameter.put("msgReceiver", chat.getMsgReceiver());
				parameter.put("endPage", Integer.valueOf(chat.getIsRead()) - reserveNotReadCount);
				// i = messageMapper.movePrivateMsg(parameter);
				j = messageMapper.removeRuPrivateMsg(parameter);
				logger.info("移动超过10条的未读消息：" + i + "条；删除：" + j + "条。");
			}
		}

	}

	/**
	 * 移动讨论组消息到历史表
	 */
	private void moveGroupMsg() {
		// 移动讨论组中已读的到历史表中
		int i = messageMapper.moveGroupMsg();
		int j = messageMapper.removeGroupMsg();
		logger.info("移动讨论组中已读消息：" + i + "条；删除ru表数据：" + j + "条。");

		// 移动讨论组中未读超过10条的数据
		List<GroupMsgModel> groupMsgList = messageMapper.findRuGroupRedundant(reserveNotReadCount);// 使用msg保存未读总数
		if (groupMsgList != null && groupMsgList.size() > 0) {
			Map<String, Object> parameter = new HashMap<>();
			for (GroupMsgModel chat : groupMsgList) {
				if (chat == null || chat.getMsg() == null) {
					continue;
				}
				parameter.clear();
				parameter.put("msgReceiver", chat.getMsgReceiver());
				parameter.put("endPage", Integer.valueOf(chat.getMsg()) - reserveNotReadCount);
				// i = messageMapper.moveGroupMsgMore10(parameter);
				j = messageMapper.removeGroupMsgMore10(parameter);
				logger.info("移动讨论组超过10条的未读消息：" + i + "条；删除ru表：" + j + "条。");
			}
		}
	}

	/**
	 * 分页查询系统通知
	 * 
	 * @param startTime
	 *            ：时间范围开始时间
	 * @param endTime
	 *            ：时间范围结束时间
	 * @param title
	 *            ：title查询信息
	 * @param page
	 *            ：页码
	 * @return
	 */
	@Override
	public PageObject querySystemNotification(String isRead, Date startTime, Date endTime, String title, Integer page, String userId) {
		page = page < 1 ? 1 : page;
		Integer row = 10;

		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		pageObject.setObjectList(messageMapper.querySystemNotification(isRead,startTime, endTime, title, (row * (page - 1)+1), page*row));
		pageObject.setTotal(messageMapper.querySystemNotificationCount(isRead,startTime, endTime, title, userId));
		return pageObject;
	}

	/**
	 * 获得最近聊天信息
	 * 
	 * @param userId
	 *            :用户id
	 * @param chatUserId
	 *            ：聊天对象id
	 * @param chatType
	 *            :聊天对象类型（user,group,system）
	 * @return
	 */
	@Override
	public List<?> queryLatelyMsg(String userId, String chatUserId, String chatType) {

		return this.queryMoreMsg(userId, chatUserId, 0, chatType);
	}
	
	/**
	 * 获取全部组信息
	 * @param msg
	 * @param groupId
	 * @return
	 */
	@Override
	public List<?> queryAllHisGroupMsg(String msg, String groupId) {
		return messageMapper.queryAllHisGroupMsg(msg, groupId);
	}


	/**
	 * 获得最近聊天信息
	 * 
	 * @param userId
	 *            ：用户id
	 * @param chatUserId
	 *            ：聊天对象id
	 * @param start
	 *            ：加载更多消息的起始位置
	 * @param chatType
	 *            ：聊天对象类型（user,group,system）
	 * @return
	 */
	@Override
	public List<?> queryMoreMsg(String userId, String chatUserId, int start, String chatType) {
		if (chatType.equals("group")) {// 组消息
			List<GroupMsgModel> groupMsgList = messageMapper.groupRuMsg(chatUserId, start, 10);
			for (GroupMsgModel msg : groupMsgList) {
				if ("text".equals(msg.getMsgType()))
					msg.setMsg(this.filterSensitiveWord(msg.getMsg()));
			}
			return groupMsgList;
		} else {// 私聊消息
			List<PrivateMsgModel> privaeMsgList = messageMapper.privateRuMsg(userId, chatUserId, start, 10);
			for (PrivateMsgModel msg : privaeMsgList) {
				if ("text".equals(msg.getMsgType()))
					msg.setMsg(this.filterSensitiveWord(msg.getMsg()));
			}
			return privaeMsgList;
		}
	}

	/**
	 * 标记消息为已读
	 * 
	 * @param msgId
	 *            :消息id
	 * @param userId
	 *            ：用户id
	 * @param chatId
	 *            ：聊天对象id
	 * @param type
	 *            ：聊天类型
	 */
	@Override
	public void readMsg(String msgId, String userId, String chatId, String type) {
		if (type.equals("system")) {// 系统消息
			// 暂时不需要实现
		} else if (type.equals("group")) {// 讨论组消息
			messageMapper.updateEndTime(msgId, userId, chatId);
		} else {// 私聊消息
			messageMapper.updateIsRead(chatId, userId);
		}
	}

	/**
	 * 获得最近联系人的未读消息
	 * 
	 * @param type
	 *            ：列表类型
	 * @param userId：用户id
	 * @return
	 */
	@Override
	public Map<String, String> notReadCount(String type, String userId) {
		List<Map<String, Object>> list = null;
		if (type.equals("lately")) {// 最近联系人列表中未读消息数量
			list = messageMapper.latelyNotRead(userId);
		} else if (type.equals("group")) {// 讨论组列表未读消息
			list = messageMapper.groupNotRead(userId);
		} else {// 私聊消息未读消息
			list = messageMapper.userNotRead(userId);
		}

		Map<String, String> countMap = new HashMap<>();
		if (list != null && list.size() > 0) {
			for (Map<String, Object> map : list) {
				countMap.put(String.valueOf(map.get("ID")), String.valueOf(map.get("COUNT")));
			}
		}
		return countMap;
	}

	/**
	 * 获得最近联系人的未读消息-忠
	 *
	 * @param senderid
	 *            ：列表类型
	 * @param userId：用户id
	 * @return
	 */
	@Override
	public int notReadCountZ(String userId,String senderid) {
		List<Map<String, Object>> listGroup = null;
		List<Map<String, Object>> listPra = null;


		listGroup = messageMapper.groupNotRead(userId);

		listPra = messageMapper.userNotRead(userId);


		Map<String, String> countMap = new HashMap<>();
		if (listGroup != null && listGroup.size() > 0) {
			for (Map<String, Object> map : listGroup) {
				countMap.put(String.valueOf(map.get("ID")), String.valueOf(map.get("COUNT")));
			}
		}
		if (listPra != null && listPra.size() > 0) {
			for (Map<String, Object> map : listPra) {
				countMap.put(String.valueOf(map.get("ID")), String.valueOf(map.get("COUNT")));
			}
		}
//		System.out.println(countMap.get(senderid));
		if (countMap.get(senderid)==null){
			return 0;
		}
		else {
		return Integer.parseInt(countMap.get(senderid));}
//		return countMap;

	}

	/**
	 * 保存聊天文件
	 * 
	 * @param chatFile
	 *            ：聊天文件对象
	 * @return
	 */
	@Override
	public Boolean saveFile(ChatFileModel chatFile) {

		int count = messageMapper.saveFile(chatFile);
		if (count > 0) {
			return true;
		}

		return false;
	}

	/**
	 * 更新聊天文件
	 * 
	 * @param chatFile
	 *            :聊天文件对象
	 * @return
	 */
	@Override
	public Boolean updateChatFile(String readPath, String fileId, Long updator) {
		int count = messageMapper.updateChatFile(readPath, fileId, updator);
		if (count > 0) {
			return true;
		}

		return false;
	}

	/**
	 * 查询历史消息记录
	 * 
	 * @param content
	 *            ：消息内容
	 * @param chatType
	 *            ：聊天类型
	 * @param chatId
	 *            ：聊天对象
	 * @param userId
	 *            ：当前用户id
	 * @param start
	 *            ：开始位置（翻页起始）
	 * @param row
	 *            ：显示行数
	 * @param startDate
	 *            ：开始时间
	 * @param endDate
	 *            ：结束时间
	 * @return
	 */
	@Override
	public PageObject queryHiMsg(String content, String chatType, String chatId, String userId, int start, int row,
			Date startDate, Date endDate) {

		PageObject pageObject = new PageObject();
		if (start < 1) {
			start = 0;
		}
		if (row < 1) {
			row = 10;
		}

		if (chatType.equals("group")) {
			pageObject.setObjectList(messageMapper.groupHiMsg(content, chatId, start, row, startDate, endDate));
			pageObject.setTotal(messageMapper.groupHiMsgCount(content, chatId, startDate, endDate));
		} else if (chatType.equals("user")) {
			pageObject.setObjectList(
					messageMapper.privateHiMsg(content, chatId, userId, start, row, startDate, endDate));
			pageObject.setTotal(messageMapper.privateHiMsgCount(content, chatId, userId, startDate, endDate));
		}

		return pageObject;
	}

	/**
	 * 向指定用户、讨论组发送消息
	 * 
	 * @param userId
	 *            ：发送者id
	 * @param receiverUserId
	 *            ：接收者id
	 * @param content
	 *            ：消息内容
	 * @param chatType
	 *            ：聊天类型（system， group， user）
	 * @param msgType
	 *            ：消息类型（text,image,）
	 * @return
	 */
	@Override
	public String sendMsgToUser(String userId, String receiverUserId, String content, String msgType, String chatType) {
		// 保存消息到数据库
		Map<String, Object> param = new HashMap<>();

		String msgId = MyUUID.getUUID();
		Date sendTime = new Date();
		int count = 0;
		if (chatType.equals("group")) {
			count = messageMapper.saveGroupMsg(msgId, userId, receiverUserId, sendTime, content, msgType);
		} else if (chatType.equals("user")) {
			count = messageMapper.savePrivateMsg(msgId, userId, receiverUserId, sendTime, content, msgType);
		}

		// 调用接口，向noje服务发送消息
		if (count > 0) {// 保存成功
			String sendMsgUrl = ConfigParameterUtil.getConfigByName("sendMsgUrl",
					nodeServerIp +"/interface/msg/sendMsgToUser");
//			String sendMsgUrl = ConfigParameterUtil.getConfigByName("sendMsgUrl",
//					"http://10.12.97.30:8082/interface/msg/sendMsgToUser");
			return HttpUtil.sendPost(sendMsgUrl, param);
		}

		return null;
	}

	/**
	 * 保存系统通知
	 * 
	 * @param sender
	 *            :消息发送人
	 * @param title
	 *            :消息title
	 * @param type
	 *            ：消息类型
	 * @param content
	 *            ：消息内容
	 */
	@Override
	public void saveSystemNotification(String sender, String title, String type, String content, String isRead, String receiver) {
		messageMapper.saveSystemNotification(MyUUID.getUUID(), sender, title, type, content, isRead, receiver);
	}

	/**
	 * 通过文件id获得聊天文件
	 * 
	 * @param fileId
	 *            ：文件id
	 * @return
	 */
	@Override
	public String queryFileById(String fileId) {
		return messageMapper.queryFileById(fileId);
	}
	
	/**
	 * 获得聊天文件
	 * 
	 * @param fileId
	 *            ：文件id
	 * @return
	 */
	@Override
	public String queryFile(String fileId) {
		return messageMapper.queryFile(fileId);
	}
	
	/**
	 * 获得聊天文件(组)
	 * 
	 * @param fileId
	 *            ：文件id
	 * @return
	 */
	@Override
	public String qgFlie(String fileId) {
		return messageMapper.qgFlie(fileId);
	}

	/**
	 * 过滤敏感词
	 * 
	 * @return
	 */
	@Override
	public String filterSensitiveWord(String msg) {
		if (StringUtils.isEmpty(msg)) {
			return "";
		}
		if (ConfigParameterUtil.sensitiveWordMap != null) {
			for (Entry<String, String> entry : ConfigParameterUtil.sensitiveWordMap.entrySet()) {
				msg = msg.replace(entry.getKey(), entry.getValue());
			}
		}
		return msg;
	}

	
	/**
	 * 上传网络工具
	 */
	@Override
	public Boolean saveTools(ToolsModel tools) {
		int count = messageMapper.saveTools(tools);
		if (count > 0) {
			return true;
		}
		return false;
	}
	
	/**
	 * 更新工具
	 */
	@Override
	public Boolean updateTools(ToolsModel tools) {
		int count = messageMapper.updateTools(tools);
		if (count > 0) {
			return true;
		}
		return false;
	}

	/**
	 * 获得树形结构的组织架构
	 * @return
	 */
	@Override
	public List<TreeModel> queryTreeList() {
		List<TreeModel> treeList = messageMapper.queryAllOrgTree();
		
		for (TreeModel model : treeList) {
			model.setIconOpen(ConfigParameterUtil.ORG_ICON_OPEN);
			model.setIconClose(ConfigParameterUtil.ORG_ICON_CLOSE);
			model.setIsParent(true);
		}
		
		return treeList;
	}

	/**
	 * 分页获得讨论组信息
	 * @return
	 */
	@Override
	public PageObject queryFilePage(String fileId, int page, int rows, String fileName) {
		PageObject pageObject = new PageObject();
		List<String> fileList = new ArrayList<> ();
		fileList.add(fileId);
		pageObject.setObjectList(messageMapper.queryFilePage(fileList, fileName, (rows * (page - 1)+1), page*rows));
		pageObject.setTotal(messageMapper.queryFilePageCount(fileName));
		
		return pageObject;
	}

	/**
	 * 保存回复信息
	 */
	@Override
	public void addReMsg(ReModel re) {
		messageMapper.addReMsg(re);
	}

	/**
	 * 获取回复信息
	 */
	@Override
	public List<ReModel> queryReMsg() {
		return messageMapper.queryReMsg();
	}

	@Override
	public int queryPrivateUserMessage(PrivateMsgModel privateMsgModel) {
		return messageMapper.queryPrivateUserMessage(privateMsgModel);
	}

	/**
	 * 获取用户文件列表
	 * @param request
	 * @param response
	 * @param session
	 * @return 
	 */
	@Override
	public PageObject getUserFileList(Integer page, String fileName, String sendUser, String fileLevels) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		//获取个人文件信息
		pageObject.setObjectList(messageMapper.queryUList((row * (page - 1)+1), page*row, fileName, sendUser, fileLevels));
		//获取个人文件数量
		pageObject.setTotal(messageMapper.queryUCount(fileName, sendUser, fileLevels));
		return pageObject;
	}
	
	/**
	 * 获取群组文件列表
	 * @param request
	 * @param response
	 * @param session
	 * @return 
	 */
	@Override
	public PageObject getGroupFileList(Integer page, String fileName, String sendUser, String fileLevels) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		//获取群组文件信息
		pageObject.setObjectList(messageMapper.queryGList((row * (page - 1)+1), page*row, fileName, sendUser, fileLevels));
		//获取群组文件数量
		pageObject.setTotal(messageMapper.queryGCount(fileName, sendUser, fileLevels));
		return pageObject;
	}

	/**
	 * 姓名转编码
	 * @param fileName
	 * @return
	 */
	@Override
	public UserModel turnNameToId(String fileName) {
		return userMapper.turnNameToId(fileName);
	}

	/**
	 * 获取被@人员
	 * @param groupId
	 * @param userId
	 * @return
	 */
	@Override
	public List<ATModel> getAtUser(String groupId, String userId) {
		return messageMapper.getAtUser(groupId, userId);
	}

	/**
	 * 插入被@人员
	 * @param groupId
	 * @param userId
	 */
	@Override
	public void addAtUser(ATModel atm) {
		messageMapper.addAtUser(atm);
	}
	
	/**
	 * 删除被@人员
	 * @param groupId
	 * @param userId
	 */
	@Override
	public void delAtUser(String groupId, String userId) {
		messageMapper.delAtUser(groupId, userId);
		
	}

	/**
	 * 获取最近聊天历史消息
	 * @param userId
	 * @param chatUserId
	 * @param chatType
	 * @param page
	 * @return
	 */
	@Override
	public PageObject queryHisMsgs(String chatUserId, String chatType, int page, int rowStart) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		PageObject pageObject = new PageObject();
		pageObject.setPage(page);
		if (chatType.equals("group")) {
			pageObject.setObjectList(messageMapper.queryGroupHisMsgs((rowStart > 10 ? rowStart + 1 : 1), page*row, chatUserId));
			pageObject.setTotal(messageMapper.queryGroupHisMsgsCount(chatUserId));
		} else {
			pageObject.setObjectList(messageMapper.queryPrivateHisMsgs((rowStart > 10 ? rowStart + 1 : 1), page*row, chatUserId));
			pageObject.setTotal(messageMapper.queryPrivateHisMsgsCount(chatUserId));
		}
		return pageObject;
	}

	@Override
	public List<?> loadMsg(String chatUserId, String chatType, int page, Integer rowStart) {
		page = page < 1 ? 1 : page;
		Integer row = 10;
		if (chatType.equals("group")) {
			List<GroupMsgModel> groupMsgModel = messageMapper.queryGroupHisMsgs(rowStart + 1, page*row, chatUserId);
			return groupMsgModel;
		} else {
			List<PrivateMsgModel> privateMsgModel = messageMapper.queryPrivateHisMsgs(rowStart + 1, page*row, chatUserId);
			return privateMsgModel;
		}
	}

	 /**
     * 2019.4.3
     * 根据ID获取群组、私聊文件信息
     * @param fileId     :文件id
     * @return
     */
	@Override
	public GroupFileModel qGroupFlieInfo(String fileId) {
		return messageMapper.qGroupFlieInfo(fileId);
	}

	@Override
	public ChatFileModel qPrivateFileInfo(String fileId) {
		return messageMapper.qPrivateFileInfo(fileId);
	}

	/**
	 * 查询私人聊天记录
	 * @param curren_user 当前人id
	 * @param chat_user 跟谁聊天id
	 * @return
	 */
	public List<ToMsgInfo> getPrivateMsgHistory(String curren_user, String chat_user){
		return  this.messageMapper.getPrivateMsgHistory(curren_user,chat_user);
	}
	/**
	 * 查询群聊天记录
	 * @param chat_user 跟谁聊天id
	 * @return
	 */
	public List<ToMsgInfo> getGroupMsgHistory(String chat_user){
		return  this.messageMapper.getGroupMsgHistory(chat_user);
	}

	/**
	 * 新增群消息
	 * @param params
	 * @return
	 */
	public  boolean addGroupMsg(GroupMsgModel params){
       if(params.getIsDelete()==null || "".equals(params.getIsDelete())){
          params.setIsDelete("0");
	   }
		if(params.getMsgId()==null || "".equals(params.getMsgId())){
			params.setIsDelete("0");
		}
		if(params.getSendTime()==null){
			params.setSendTime(new Date());
		}
	   this.messageMapper.addGroupMsg(params);
	   return  true;
	}
}
