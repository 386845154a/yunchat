package com.casic.flatform.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.casic.flatform.model.ChatFileModel;
import com.casic.flatform.model.GroupFileModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.GroupService;
import com.casic.flatform.service.LogService;
import com.casic.flatform.service.LoginService;
import com.casic.flatform.service.MessageService;
import com.casic.flatform.util.MyUUID;
import com.casic.flatform.util.UploadUtil;


/**
 * 上传下载控制
 *
 * @author hanxu
 */
@RestController
@RequestMapping("/upDownLoadController")
public class UpDownLoadController {

    private Logger logger = LoggerFactory.getLogger(UpDownLoadController.class);

    @Autowired
    private GroupService groupService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private LoginService loginService;

    @Autowired
    private LogService logService;

    /**
     * 上传讨论组文件
     * @param request
     * @param file
     * @param session
     * @return
     */
    @RequestMapping("/uploadGroupFile")
    public Object uploadGroupFile(HttpServletRequest request, @RequestParam("file") MultipartFile file,
                                  HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String groupId = request.getParameter("groupId");
        String levels = request.getParameter("levels");
        String up_path = request.getParameter("up_path");
        try {
            // 保存文件到服务器
//			String configPath = ConfigParameterUtil.getConfigByName("uploadPath", up_path);
            String configPath = up_path;
            String relativePath = "/groupFile/" + groupId + "/" + user.getUserId();
            String realPath = configPath + relativePath;
            String originalName = file.getOriginalFilename();
            String ext = originalName.substring(originalName.lastIndexOf("."));
            String fileId = MyUUID.getUUID();
            String fileName = fileId;
            UploadUtil.saveFile(file.getInputStream(), realPath, fileName);
            String readPath = null;
            String fileType = file.getContentType().split("/")[0];
            if (fileType != null && fileType.equals("video")) {
                readPath = relativePath + "/" + fileName;
            }
            if (!StringUtils.isEmpty(ext)) {
                if (".doc.docx.xls.xlsx.ppt.pptx".contains(ext)) {
                    readPath = "convering";
                    fileType = "office";
                } else if (".pdf".equals(ext)) {
                    readPath = relativePath + "/" + fileName;
                    fileType = "pdf";
                } else if (file.getContentType().contains("image")) {
                    readPath = relativePath + "/" + fileName;
                    fileType = "image";
                }
            }

            // 保存文件到数据库
            GroupFileModel fileModel = new GroupFileModel();
            fileModel.setFileId(fileId);
            fileModel.setFileName(originalName);
            fileModel.setGroupId(groupId);
            fileModel.setPath(relativePath + "/" + fileName);
            fileModel.setReadPath(readPath);
            fileModel.setSizes(file.getSize());
            fileModel.setFileType(fileType);
            fileModel.setFileExt(ext.substring(1));
            fileModel.setCreateTime(new Date());
            fileModel.setCreator(user.getUserId());
            fileModel.setLevels(levels);
            groupService.saveGroupFile(fileModel);
            
            String sourceFile = realPath + "/" + fileName;
            String destFile = realPath + "/" + fileId + ".pdf";
//            TurnPDF.office2PDF(sourceFile, destFile);
            return fileModel;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 上传聊天文件
     * @param request
     * @param file
     * @param session
     * @return
     */
    @RequestMapping("/uploadChatFlie")
    public Object uploadFlie(HttpServletRequest request, @RequestParam("file") MultipartFile file,
                             HttpSession session) {

        UserModel user = (UserModel) session.getAttribute("userSessionItems");//文件发出者
        String receiver = request.getParameter("chatId");    //文件接收者
        String chatType = request.getParameter("chatType");    //聊天类型（user、group）
        String fileId = request.getParameter("fileId");
        String levels = request.getParameter("levels");
        String up_path = request.getParameter("up_path");

        try {
            //String fileId = MyUUID.getUUID();
            // 保存文件到服务器
//			String configPath = ConfigParameterUtil.getConfigByName("uploadPath", up_path);
            String configPath = up_path;
            String relativePath = "/chatFile/" + user.getUserId();
            String realPath = configPath + relativePath;
            String originalName = file.getOriginalFilename();
            String ext = originalName.substring(originalName.lastIndexOf("."));
            String fileName = fileId;
            UploadUtil.saveFile(file.getInputStream(), realPath, fileName);
            String readPath = null;
            String fileType = file.getContentType().split("/")[0];
            if (fileType != null && fileType.equals("video")) {
                readPath = relativePath + "/" + fileName;
            }
            if (!StringUtils.isEmpty(ext)) {
                if (".doc.docx.xls.xlsx.ppt.pptx".contains(ext)) {
                    readPath = "convering";
                    fileType = "office";
                } else if (".pdf".equals(ext)) {
                    readPath = relativePath + "/" + fileName;
                    fileType = "pdf";
                } else if (file.getContentType().contains("image")) {
                    readPath = relativePath + "/" + fileName;
                    fileType = "image";
                }
            }

            // 保存文件到数据库
            ChatFileModel chatFile = new ChatFileModel();
            chatFile.setFileId(fileId);
            chatFile.setFileName(originalName);
            chatFile.setFileType(fileType);
            chatFile.setFileExt(ext.substring(1));
            chatFile.setPath(relativePath + "/" + fileName);
            chatFile.setReadPath(readPath);
            chatFile.setSendTime(new Date());
            chatFile.setSender(user.getUserId());
            chatFile.setReceiver(receiver);
            chatFile.setChatType(chatType);
            chatFile.setReceiverStr(receiver);
            chatFile.setLevels(levels);
            messageService.saveFile(chatFile);
            
            String sourceFile = realPath + "/" + fileName;
            String destFile = realPath + "/" + fileId + ".pdf";
//            TurnPDF.office2PDF(sourceFile, destFile);
            return chatFile;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }


    /**
     * 读取硬盘上绝对路径下的文件
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/readFile")
    public void readFile(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String configPath = "D:/toolsupload";
        String path = request.getParameter("path");
        ServletOutputStream output = null;
        FileInputStream fileInput = null;
        try {
            File file = new File(configPath + "/" + path);
            if (!file.exists()) {
                throw new NullPointerException("读取的文件不存在！路径：" + path);
            }

            output = response.getOutputStream();
            fileInput = new FileInputStream(file);
            IOUtils.copy(fileInput, output);
        } catch (Exception e) {
            logger.error(e.getMessage());
        } finally {
            IOUtils.closeQuietly(output);
            IOUtils.closeQuietly(fileInput);
        }
    }

    /**
     * 获取用户保密等级
     * @param session
     */
    @RequestMapping("/queryUserLevel")
    public Object queryUserLevel(HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel userOne = (UserModel) session.getAttribute("userSessionItems");//文件发出者
        UserModel user = loginService.queryUserLevel(userOne.getAccount());
        map.put("levels", user.getLevels());
        return map;
    }
    
	/**
	 * 获取用户文件列表
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/getUserFileList")
	public Object getUserFileList(HttpServletRequest request, HttpServletResponse response,
			HttpSession session) {
		String pageStr = request.getParameter("page");
		String fileName = request.getParameter("fileName");
		String sendUser = request.getParameter("sendUser");
		String fileLevels = request.getParameter("fileLevels");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return messageService.getUserFileList(page, fileName, sendUser, fileLevels);
	}
	
	/**
	 * 获取群组文件列表
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/getGroupFileList")
	public Object getGroupFileList(HttpServletRequest request, HttpServletResponse response,
			HttpSession session) {
		String pageStr = request.getParameter("page");
		String fileName = request.getParameter("fileName");
		String sendUser = request.getParameter("sendUser");
		String fileLevels = request.getParameter("fileLevels");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return messageService.getGroupFileList(page, fileName, sendUser, fileLevels);
	}
	
	/**
	 * 姓名转编码
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/turnNameToId")
	public Object turnNameToId(HttpServletRequest request, HttpServletResponse response,
			HttpSession session) {
		String fileName = request.getParameter("fileName");
		UserModel user = messageService.turnNameToId(fileName);
		return user;
	}

}
