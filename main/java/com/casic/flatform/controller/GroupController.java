package com.casic.flatform.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.casic.flatform.model.*;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.service.GroupService;
import com.casic.flatform.service.HomeService;
import com.casic.flatform.service.LogService;
import com.casic.flatform.util.CatalogExcelUtil;
import com.casic.flatform.util.ConfigParameterUtil;
import com.casic.flatform.util.MyUUID;

/**
 * 讨论组控制类
 * 
 * @author hanxu
 */
@RestController
@RequestMapping("/groupController")
public class GroupController {

	private Logger logger = LoggerFactory.getLogger(GroupController.class);

	@Autowired
	private GroupService groupService;
	@Autowired
	private LogService logService;
	@Autowired
    private HomeService homeService;

	/**
	 * 获得讨论组人员信息
	 * 
	 * @return
	 */
	@RequestMapping("/queryGroupUser")
	public Object queryGroupUser(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String groupId = request.getParameter("groupId");

		map.put("userList", groupService.queryGroupUser(groupId));

		return map;
	}

	/**
	 * 获得重要信息
	 * 
	 * @return
	 */
	@RequestMapping("/queryImportantInfo")
	public Object queryImportantInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String groupId = request.getParameter("groupId");
		map.put("importantList", groupService.queryImportantInfo(groupId));
		map.put("loginId", user.getUserId());
		return map;
	}

	/**
	 * 获得讨论组信息
	 * 
	 * @return
	 */
	@RequestMapping("/queryGroup")
	public Object queryGroup(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		map.put("groupList", groupService.queryGroup());
		return map;
	}
	
	/**
	 * 根据groupID获得讨论组名称
	 * @return
	 */
	@RequestMapping("/queryGroupInfoById")
	public Object queryGroupInfoById(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String receiver = request.getParameter("receiver");
		String type = request.getParameter("type");
		if (type.equals("group")) {
			GroupModel groupModel = groupService.queryGroupInfoById(receiver);
			map.put("groupCreater", groupModel.getCreator());
			map.put("groupName", groupModel.getGroupName());
			map.put("levels", groupModel.getLevels());
		} else {
			UserModel userModel = homeService.queryUserInfo(receiver);
			map.put("levels", userModel.getLevels());
		}
		return map;
	}

	/**
	 * 根据groupID获得讨论组名称
	 * @return
	 */
	@RequestMapping("/queryGroupLevelsByGroupId")
	public Object queryGroupLevelsByGroupId(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String groupid = request.getParameter("groupid");
		try {
			GroupModel groupModel = groupService.queryGroupInfoById(groupid);
			if (groupModel != null) {
				map.put("groupName", groupModel.getGroupName());
				map.put("groupLevels", groupModel.getLevels());
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		return map;
	}

	/**
	 * 查询讨论组信息
	 * 
	 * @return
	 */
	@RequestMapping("/queryGroupInfo")
	public Object queryGroupInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String groupId = request.getParameter("groupId");
		return groupService.queryGroupInfo(groupId);
	}

	/**
	 * 查询讨论组文件（分页）
	 * 
	 * @return
	 */
	@RequestMapping("/queryGroupFile")
	public Object queryGroupFile(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String groupId = request.getParameter("groupId");
		String fileName = request.getParameter("fileName");
		int page = StringUtils.isEmpty(request.getParameter("page")) ? 0
				: Integer.valueOf(request.getParameter("page"));
		int pageRow = StringUtils.isEmpty(request.getParameter("pageRow")) ? 10
				: Integer.valueOf(request.getParameter("pageRow"));
		map.put("data", groupService.queryGroupFile(fileName, groupId, page, pageRow));
		map.put("loginId", user.getUserId());
		return map;
	}
	

	/**
	 * 创建讨论组
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/createGroup")
	public Object createGroup(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String groupName = request.getParameter("groupName");
		String groupDescribe = request.getParameter("groupDescribe");
		String userIdList = request.getParameter("userIdList");
		String choose_name = request.getParameter("choose_name");
		String scop = request.getParameter("scop");
		String levels = request.getParameter("levels");
		String ispublic = "0";
		try {
			groupService.createGroup(groupName, groupDescribe, userIdList.split(","), user.getUserId(), choose_name, scop, ispublic,levels);
			map.put("ok", true);
		} catch (Exception ex) {
			ex.printStackTrace();
			map.put("ok", false);
		}
		return map;
	}
	
	/**
	 * 创建MPM组
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/createMpm")
	public Object createMpm(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		try {
			String groupId = String.valueOf((int) (Math.random() * 10000)) + String.valueOf(new Date().getTime());
			GroupInfoModel groupInfo = new GroupInfoModel();
			groupInfo.setGroupId(groupId);
			groupInfo.setGroupName(request.getParameter("groupName"));
			groupInfo.setGroupDescribe(request.getParameter("groupDescribe"));
			groupInfo.setCreator(user.getUserId());
			groupInfo.setIsdelete("0");
			groupInfo.setIsclose("0");
			groupInfo.setPname(request.getParameter("choose_name"));
			groupInfo.setIspublic("0");
			groupInfo.setLevels(request.getParameter("levels"));
			groupService.createMpm(groupInfo);
			groupService.saveGroupUser(groupInfo.getGroupId(), request.getParameter("userIdList"));
			map.put("ok", true);
		} catch (Exception ex) {
			ex.printStackTrace();
			map.put("ok", false);
		}
		return map;
	}

	/**
	 * 标记为重要信息addImportantFlag
	 * 
	 * @return
	 */
	@RequestMapping("/addImportantFlag")
	public void addImportantFlag(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		// groupService.addImportantFlag();
		String meg = request.getParameter("meg");
		groupService.updateImportantFlag(meg);
	}
	
	/**
	 * 更新系统信息已读\未读标识
	 * @return
	 */
	@RequestMapping("/updateMsgFlag")
	public void updateMsgFlag(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String notificationId = request.getParameter("notificationId");
		groupService.updateSysMsgFlag(notificationId);
	}

	/**
	 * 获得讨论组信息，包含讨论组成员
	 * 
	 * @return
	 */
	@RequestMapping("/queryGroupAllInfo")
	public Object queryGroupAllInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String groupId = request.getParameter("groupId");

		map.put("groupInfo", groupService.queryGroupInfo(groupId));
		map.put("userList", groupService.queryGroupUser(groupId));
		map.put("ok", true);

		return map;

	}

	/**
	 * 更新讨论组
	 * 
	 * @return
	 */
	@RequestMapping("/updateGroup")
	public Object updateGroup(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<> ();
		UserModel user = (UserModel)session.getAttribute("userSessionItems");
		String groupId = request.getParameter("groupId");
		String groupName = request.getParameter("groupName");
		String groupDescribe = request.getParameter("groupDescribe");
		String userIdList = request.getParameter("userIdList");
		
		try{
			groupService.updateGroup(groupId, groupName, groupDescribe, userIdList.split(","), user.getUserId());
			map.put("ok", true);
		}catch(Exception ex) {
			ex.printStackTrace();
			map.put("ok", false);
		}
		
		return map;
	}
	
	/**
	 * 新增讨论组人员
	 * 
	 * @return
	 */
	@RequestMapping("/addGroupPerson")
	public Object addGroupPerson(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<> ();
		UserModel user = (UserModel)session.getAttribute("userSessionItems");
		String groupId = request.getParameter("groupId");
		String userId = request.getParameter("userIdList");
		groupService.addGroupPerson(groupId, userId);
		return map;
	}
	
	/**
	 * 退出群组
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/outGroup")
	public Object outGroup(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws UnknownHostException {
		UserModel user = (UserModel)session.getAttribute("userSessionItems");
		Map<String, Object> map = new HashMap<> ();
		String userId = request.getParameter("nowId");
		String groupId = request.getParameter("groupId");
		groupService.outGroup(userId, groupId);
		map.put("success", true);
		//添加日志
		GroupInfoModel groupInfoModel = groupService.queryGroupInfo(groupId);
		String local_ip = InetAddress.getLocalHost().getHostAddress();
		LogModel log = new LogModel();
		log.setLogId(MyUUID.getUUID());
		log.setType("outgroup");
		log.setContent("退出群组" + groupInfoModel.getGroupName());
		log.setAddress(local_ip);
		log.setCreater(user.getUserId());
		log.setFullName(user.getFullname());
		logService.saveLog(log);
		return map;
	}	
	
	/**
	 * 删除讨论组文件
	 * 
	 * @return
	 */
	@RequestMapping("/deleteGroupFile")
	public Object deleteGroupFile(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String groupId = request.getParameter("groupId");
		String fileId = request.getParameter("fileId");
		String filePath = request.getParameter("filePath");
		String readPath = request.getParameter("readPath");

		if (StringUtils.isEmpty(groupId) || StringUtils.isEmpty(fileId)) {
			logger.error("删除讨论组文件出错，传入文件id或者讨论组id为空！");
			throw new NullPointerException();
		}
		groupService.deleteGroupFile(groupId, fileId, filePath, readPath);

		logger.info("删除文件：" + fileId);
		return true;
	}

	/**
	 * 删除重要信息
	 * 
	 * @return
	 */
	@RequestMapping("/removeImportantInfo")
	public Object removeImportantInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String msgId = request.getParameter("msgId");
		String msg = request.getParameter("msg");
		groupService.removeImportantInfo(msgId, msg);
		return true;
	}

	/**
	 * 删除讨论组
	 * 
	 * @return
	 */
	@RequestMapping("/deleteGroup")
	public Object deleteGroup(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String groupId = request.getParameter("groupId");
		String type = request.getParameter("type");
		GroupInfoModel ginfo = groupService.queryGroupInfo(groupId);
		if (type.equals("true")) {
			if (user.getUserId().equals(ginfo.getCreator())) {
				groupService.deleteGroup(groupId, user.getUserId());
			}
		} else {
			groupService.deleteGroup(groupId, user.getUserId());
		}
		logger.info("用户：" + user.getFullname() + "删除讨论组：" + groupId);
		return true;
	}

	/**
	 * 批量删除讨论组
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/deleteGroupBatch")
	public Object deleteGroupBatch(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String groupIdArray = request.getParameter("groupIdArray");
		if (!StringUtils.isEmpty(groupIdArray)) {
			String[] idArray = groupIdArray.split(",");
			for (String groupId : idArray) {
				groupService.deleteGroup(groupId, user.getUserId());
				logger.info("用户：" + user.getFullname() + "删除讨论组：" + groupId);
			}
		}
		return true;
	}

	/**
	 * 获得所有讨论组
	 * 
	 * @return
	 */
	@RequestMapping("/queryAllGroup")
	public Object queryAllGroup() {
		return groupService.queryAllGroup();
	}

	/**
	 * 分页查询讨论组消息
	 * 
	 * @return
	 */
	@RequestMapping("/queryGroupMsg")
	public Object queryGroupMsg(int page, int rows, String startTimeStr, String endTimeStr, String msg,
			String groupId) {
		Map<String, Object> resultMap = new HashMap<>();

		Date startTime = null;
		Date endTime = null;
		try {
			if (!StringUtils.isEmpty(startTimeStr))
				startTime = ConfigParameterUtil.TIME_SDF.parse(startTimeStr + " 00:00:00");
			if (!StringUtils.isEmpty(endTimeStr))
				endTime = ConfigParameterUtil.TIME_SDF.parse(endTimeStr + " 23:59:59");
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		resultMap.put("dataList", groupService.queryGroupMsg(groupId, msg, page, rows, startTime, endTime));
		resultMap.put("count", groupService.queryGroupMsgCount(groupId, msg, startTime, endTime));

		return resultMap;
	}

	/**
	 * 分页获得讨论组信息
	 * 
	 * @return
	 */
	@RequestMapping("/queryGroupPage")
	public Object queryGroupPage(int page, int rows, String startTimeStr, String endTimeStr, String name,
			String isDelete) {

		Date startTime = null;
		Date endTime = null;
		try {
			if (!StringUtils.isEmpty(startTimeStr))
				startTime = ConfigParameterUtil.TIME_SDF.parse(startTimeStr + " 00:00:00");
			if (!StringUtils.isEmpty(endTimeStr))
				endTime = ConfigParameterUtil.TIME_SDF.parse(endTimeStr + " 23:59:59");
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		return groupService.queryGroupPage(page, rows, name, isDelete, startTime, endTime);
	}

	// 库存数据导出
	@RequestMapping("/groupExcelData")
	@ResponseBody
	public Object groupExcelData(HttpServletRequest request, HttpServletResponse response, String ajaxParams) {
		JSONObject json = JSONObject.parseObject(ajaxParams.replace("&quot;", "\""));
		String groupId = json.getString("groupId");
		List<GroupMsgModel> gMList = new ArrayList<GroupMsgModel>();
		gMList = groupService.queryGInfo(groupId);
		// 导出excle表格
		Workbook wb = new HSSFWorkbook();
		//2、在workbook中添加一个sheet，对应Excel文件中的sheet
		String sheetName = "聊天记录";
		Sheet sheet = wb.createSheet(sheetName);
		//3、在sheet中添加表头第0行，注意老版本poi对Excel的行数列数yo
		Row row = sheet.createRow(0);
		CellStyle style = CatalogExcelUtil.getHeadStyle(wb);
		//Excel标题
		String[] title = {"信息Id","消息发出者","消息接收者","消息发出时间","消息内容","消息类型","图片或文档路径","是否删除","是否为重要信息"};
		// 循环追加表头
		for (int i = 0; i < title.length; i++) {
			CatalogExcelUtil.initCell(row.createCell(i), style, title[i]);
		}
		// 判断字段ID是否在查出的对应数据中
		for (int j = 0; j < gMList.size(); j++) {
			row = sheet.createRow(j + 1);
			GroupMsgModel stock = gMList.get(j);
			CatalogExcelUtil.initCell(row.createCell(0), style, stock.getMsgId());
			CatalogExcelUtil.initCell(row.createCell(1), style, stock.getMsgSender());
			CatalogExcelUtil.initCell(row.createCell(2), style, stock.getMsgReceiver());
			if (stock.getSendTime() != null) {
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
				CatalogExcelUtil.initCell(row.createCell(3), style, df.format(stock.getSendTime()));
			} else {
				CatalogExcelUtil.initCell(row.createCell(3), style, "");
			}
			CatalogExcelUtil.initCell(row.createCell(4), style, stock.getMsg());
			CatalogExcelUtil.initCell(row.createCell(5), style, stock.getMsgType());
			CatalogExcelUtil.initCell(row.createCell(6), style, stock.getMsgPath());
			CatalogExcelUtil.initCell(row.createCell(7), style, stock.getIsDelete());
			CatalogExcelUtil.initCell(row.createCell(8), style, stock.getIsImportant());
		}

		try {
			String filedisplay = "聊天记录.xls";
			// 输出Excel文件
			OutputStream output = response.getOutputStream();
			response.reset();
			String agent = request.getHeader("USER-AGENT");
			if (agent != null && agent.toLowerCase().indexOf("firefox") > 0) {
				filedisplay = new String(filedisplay.getBytes("UTF-8"), "ISO-8859-1");
			} else {
				filedisplay = URLEncoder.encode(filedisplay, "UTF-8");
			}
			response.setContentType("application/msexcel;");
			response.setHeader("Content-disposition", "attachment; filename=" + filedisplay);
			
			wb.write(output);

			output.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return true;
	}
	
	/**
	 * 关闭讨论组
	 * @param request
	 * @param response
	 * @param session
	 */
	@RequestMapping("/closedGroup")
	public Object closedGroup(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String groupId = request.getParameter("groupId");
		GroupInfoModel groupInfoModel = groupService.queryGroupInfo(groupId);
		if (groupInfoModel.getCreator().equals(user.getUserId())) {
			try {
				groupService.closedGroup(groupId);
				map.put("success", true);
			} catch (Exception e) {
				// TODO: handle exception
				map.put("success", false);
			}
		} else {
			map.put("success", false);
		}
		return map;
	}
	
	/**
	 * 全部群组消息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/groupMsgsList")
	public Object groupMsgsList(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<> ();
		UserModel user = (UserModel)session.getAttribute("userSessionItems");
		String pageStr = request.getParameter("page");
		String msgName = request.getParameter("msgName");
		String sendUser = request.getParameter("sendUser");
		String msgLevels = request.getParameter("msgLevels");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return groupService.groupMsgsList(page, msgName, sendUser, msgLevels);
	}
	
    /**
     * 批量删除服务器文件
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/del_more_file")
    public void del_more_file(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String inTime = request.getParameter("inputTime");
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd", java.util.Locale.ENGLISH);
			Date inputTime = format.parse(inTime);
			List<?> list = groupService.del_more_file(inputTime, request.getParameter("type"));
			for (int i = 0; i < list.size(); i++) {
				ToolsController toolsController = new ToolsController();
				String path = list.get(i).toString();
				System.out.println(path.replace("{PATH=", "").replace("}", ""));
				toolsController.delSystemFiles("D:/toolsupload", path.replace("{PATH=", "").replace("}", ""));
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
    }

	//编辑群获取组织机构信息
	@RequestMapping("/getGroupEditOrgInf")
	public List<GroupEidtOrgModel> getGroupEditOrgInf(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String groupId = request.getParameter("groupId");
		if(groupId==null){
			groupId = "";
		}
		return groupService.getGroupEditOrgInf(groupId);
	}

}
