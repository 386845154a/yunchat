package com.casic.flatform.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.casic.flatform.model.ChildModel;
import com.casic.flatform.model.LogModel;
import com.casic.flatform.model.ToolsModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.LogService;
import com.casic.flatform.service.MessageService;
import com.casic.flatform.service.ToolsService;
import com.casic.flatform.util.DateUtil;
import com.casic.flatform.util.MyUUID;
import com.casic.flatform.util.TemplateUtil;
import com.casic.flatform.util.UploadUtil;


/**
 * 上传下载控制
 * 
 * @author zouct
 */
@RestController
@RequestMapping("/upDownLoadToolsController")
public class UpDownLoadToolsController {


	@Autowired
	private MessageService messageService;
	@Autowired
	private ToolsService toolsService;
	@Autowired
	private LogService logService;
	

	/**
	 * 上传工具和主文件
	 * @param request
	 * @param file
	 * @param session
	 * @return
	 */
	@RequestMapping("/uploadFlie")
	public Object uploadFlie(HttpServletRequest request, @RequestParam("file") MultipartFile file,
			HttpSession session) {
		
		UserModel user = (UserModel) session.getAttribute("userSessionItems");//文件发出者
		String fileId = request.getParameter("fileId");
		String classification = request.getParameter("classification");
		String fileFalg = request.getParameter("fileFalg");
		String version = request.getParameter("version");
		String use = request.getParameter("use");
		String note = request.getParameter("note");
		String levels = request.getParameter("levels");
		String isregister = request.getParameter("isregister");//是否有软件注册权
		String ischeckbox = request.getParameter("ischeckbox");//是否是二部等级
		try {
			//String fileId = MyUUID.getUUID();
			// 保存文件到服务器
			String configPath = request.getParameter("configPath");
			String relativePath = "/"+classification;
			String realPath = configPath + relativePath;
			String originalName = file.getOriginalFilename();
			String ext = originalName.substring(originalName.lastIndexOf("."));
			String fileName = fileId + ext;
			UploadUtil.saveFile(file.getInputStream(), realPath, fileName);
			// 保存文件到数据库
			ToolsModel tools = new ToolsModel();
			tools.setFileId(fileId);
			tools.setFileName(originalName);
			tools.setPath(relativePath + "/" + fileName);
			tools.setReadPath("convering");
			tools.setSendTime(new Date());
			tools.setSender(user.getUserId());
			tools.setClassification(classification);
			tools.setFileFalg(fileFalg);
			tools.setVersion(version);
			tools.setUse(use);
			tools.setNote(note);
			tools.setLeves(levels);
			tools.setIsApprove("0");
			tools.setDownc(0);
			tools.setState("0");
			tools.setApprover(user.getUserId());
			tools.setIsregister(isregister);
			tools.setGrade(ischeckbox);
			messageService.saveTools(tools);
			LogModel log = new LogModel();
			String local_ip = InetAddress.getLocalHost().getHostAddress();
			log.setLogId(MyUUID.getUUID());
			log.setType("toolsFileUp");
			log.setContent("上传商城文件" + originalName);
			log.setAddress(local_ip);
			log.setCreater(user.getUserId());
			log.setFullName(user.getFullname());
			logService.saveLog(log);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	/**
	 * 工具更新
	 * @param request
	 * @param file
	 * @param session
	 * @return
	 */
	@RequestMapping("/editToolInfo")
	public Object editToolInfo(HttpServletRequest request, @RequestParam("file") MultipartFile file, HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");//文件发出者
		String fileId = request.getParameter("fileId");
		String classification = request.getParameter("classification");
		String teamInfo = request.getParameter("teamInfo");
		String toolsVer = request.getParameter("toolsVer");
		String toolsUse = request.getParameter("toolsUse");
		String level = request.getParameter("levels");
		try {
			//String fileId = MyUUID.getUUID();
			// 保存文件到服务器
			String configPath = request.getParameter("configPath");
			String relativePath = "/"+classification;
			String realPath = configPath + relativePath;
			String originalName = file.getOriginalFilename();
			String ext = originalName.substring(originalName.lastIndexOf("."));
			String fileName = fileId + ext;
			UploadUtil.saveFile(file.getInputStream(), realPath, fileName);
			// 保存文件到数据库
			ToolsModel tools = new ToolsModel();
			tools.setFileId(fileId);
			tools.setFileName(originalName);
			tools.setPath(relativePath + "/" + fileName);
			tools.setReadPath("convering");
			tools.setSendTime(new Date());
			tools.setSender(user.getUserId());
			tools.setClassification(classification);
			tools.setVersion(toolsVer);
			tools.setUse(toolsUse);
			tools.setNote(teamInfo);
			tools.setLeves(level);
			tools.setIsApprove("0");
			tools.setDownc(0);
			tools.setState("0");
			tools.setApprover(user.getUserId());
			messageService.updateTools(tools);
			LogModel log = new LogModel();
			String local_ip = InetAddress.getLocalHost().getHostAddress();
			log.setLogId(MyUUID.getUUID());
			log.setType("toolsFileUp");
			log.setContent("上传商城文件" + originalName);
			log.setAddress(local_ip);
			log.setCreater(user.getUserId());
			log.setFullName(user.getFullname());
			logService.saveLog(log);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	
	
	/**
	 * 保存含附件公告
	 * @param request
	 * @param file
	 * @param session
	 * @return
	 */
	@RequestMapping("/uploadChildFlie")
	public Object uploadChildFlie(HttpServletRequest request, @RequestParam("file") MultipartFile file,
			HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");//文件发出者
		String fileId = request.getParameter("fileId");
		String pid = "save";
		String title = request.getParameter("title");
		String context = request.getParameter("context");
		String up_path = request.getParameter("up_path");
//		System.out.println(context.length());
		if (context.length() > 4000) {
			return false;
		} else {
			try {
				//String fileId = MyUUID.getUUID();
				// 保存文件到服务器
				String configPath = up_path;
				String relativePath = "/"+pid;
				String realPath = configPath + relativePath;
				String originalName = file.getOriginalFilename();
				String ext = originalName.substring(originalName.lastIndexOf("."));
				String fileName = fileId + ext;
				UploadUtil.saveFile(file.getInputStream(), realPath, fileName);
				// 保存文件到数据库
				ChildModel childs = new ChildModel();
				childs.setFileId(fileId);
				childs.setFileName(originalName);
				childs.setPath(relativePath + "/" + fileName);
				childs.setReadPath("convering");
				childs.setSendTime(new Date());
				childs.setSender(user.getUserId());
				childs.setPid(pid);
				childs.setTitle(title);
				childs.setContext(context);
				toolsService.saveChild(childs);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			return true;
		}
	}
	
	/**
	 * 保存无附件公告
	 * @param request
	 * @param response
	 * @param session
	 */
	@RequestMapping("/saveAffiche")
	public Object saveAffiche(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");//文件发出者
		String title = request.getParameter("title");
		String context = request.getParameter("context");
		if (context.length() > 4000) {
			return false;
		} else {
			ChildModel childs = new ChildModel();
			childs.setFileId(MyUUID.getUUID());
			childs.setSendTime(new Date());
			childs.setSender(user.getUserId());
			childs.setTitle(title);
			childs.setContext(context);
			toolsService.saveChild(childs);
			return true;
		}
	}
	
	/**
	 * 查询公告
	 * @param request
	 * @param page
	 * @param rows
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping("/queryAffiche")
	@ResponseBody
	public Map queryAffiche(HttpServletRequest request, String page, String rows) throws UnsupportedEncodingException {
		HashMap result = new HashMap();
		String textLi = TemplateUtil.readTemplate(request, "com_home_notice_li_list");
		List<ChildModel> list = toolsService.queryAffiche(page, rows);
		StringBuffer strBuff = new StringBuffer();
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("title", list.get(i).getTitle() == null ? "" : list.get(i).getTitle());
			map.put("time", DateUtil.dateFormat(list.get(i).getSendTime(), "yyyy/M/dd HH:mm:ss"));
			if (list.get(i).getContext() != null) {
				map.put("context", URLEncoder.encode(list.get(i).getContext(), "utf-8"));
			}
			map.put("fileName", list.get(i).getFileName());
			map.put("path", list.get(i).getPath());
			strBuff.append(TemplateUtil.replaceTemplate(request, textLi, map));
		}
		result.put("html", strBuff.toString());
		result.put("total", toolsService.countChildFile());
		return result;
	}

	/**
	 * 后台管理员获取公告
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryAfficheList")
	public List<ChildModel> queryAfficheList(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		return toolsService.queryAfficheList();
	}
	
	/**
	 * 根据ID删除公告
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/delAfficheById")
	public Object delAfficheById(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String afficheId = request.getParameter("afficheId");
		toolsService.delAfficheById(afficheId);
		return true;
	}

	/**
	 * 获得树形结构的组织架构
	 * @param request
	 * @param response
	 * @param session
	 */
	@RequestMapping("/queryOrg")
	public Object queryOrg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		return messageService.queryTreeList();
	}
	
	/**
	 * 分页获得文件信息
	 * @param fileId
	 * @param page
	 * @param rows
	 * @param fileName
	 * @return
	 */
	@RequestMapping("/queryFilePage")
	public Object queryFilePage(String fileId, int page, int rows, String fileName) {

		return messageService.queryFilePage(fileId, page, rows, fileName);
	}
}
