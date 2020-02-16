package com.casic.flatform.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.casic.flatform.util.ImageUtilCrop;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.casic.flatform.model.LevelModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.LevelService;
import com.casic.flatform.service.UserHeadService;
import com.casic.flatform.util.ConfigParameterUtil;
import com.casic.flatform.util.UploadUtil;

/**
 * 用户头像控制类
 */
@RestController
@RequestMapping("/userHeadController")
public class UserHeadController {

	@Value("${imgSize:150}")
	private String imgSize;

	private Logger logger = LoggerFactory.getLogger(UpDownLoadController.class);

	@Autowired
	private UserHeadService UserHeadService;
	@Autowired
	private LevelService levelService;

	/**
	 * 上传头像
	 * @param request
	 * @param file
	 * @param session
	 * @return
	 */
	@RequestMapping("/uploadHead")
	public String uploadHead(HttpServletRequest request, @RequestParam("file") MultipartFile file,
							 HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String use = user.getUserId();
		String fileId = request.getParameter("fileId");
		String headPath = request.getParameter("up_path");
		//保存图片到服务器
		String configPath = ConfigParameterUtil.getConfigByName("uploadHead", headPath);
		String relativePath = "/headFile/" + user.getUserId();
		String realPath = configPath + relativePath;
		String nPath = "";//真实上传路径
		try {
			String originalName = file.getOriginalFilename();
			String ext = originalName.substring(originalName.lastIndexOf("."));
			String fileName = fileId + ext;
			UploadUtil.saveFile(file.getInputStream(), realPath, fileName);
			String readPath = null;
			//大写字符转小写字符
			ext = exChange(ext);
			if (!StringUtils.isEmpty(ext)) {
				if (".jpg".equals(ext)) {
					readPath = relativePath + "/" + fileName;
				} else if (".png".equals(ext)) {
					readPath = relativePath + "/" + fileName;
				} else if (".gif".equals(ext)) {
					readPath = relativePath + "/" + fileName;
				}
			}
			// 上传成功，图片压缩处理
			String finalReadPath = realPath;
			boolean handle = false;
			try {
				if (exChange(fileName).endsWith(".png") || exChange(fileName).endsWith(".gif") || exChange(fileName).endsWith(".jpg") || exChange(fileName).endsWith(".bmp")) {
					 handle = ImageUtilCrop.handle(finalReadPath, exChange(fileName), imgSize);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			String pre = "";
			if (handle) {// 压缩成功
				pre = "_150_150";
			}
			nPath = readPath.substring(0, readPath.lastIndexOf(".")) + pre + readPath.substring(readPath.lastIndexOf("."), readPath.length());
			UserHeadService.uploadHead(use, nPath);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return nPath;
	}

	/**
	 * 大写字符转小写字符
	 * @param str
	 * @return
	 */
	public static String exChange(String str) {
		StringBuffer sb = new StringBuffer();
		if (str != null) {
			for (int i = 0; i < str.length(); i++) {
				char c = str.charAt(i);
				if (Character.isUpperCase(c)) {
					sb.append(Character.toLowerCase(c));
				} else {
					sb.append(c);
				}
			}
		}
		return sb.toString();
	}

	/**
	 * 获取头像路径
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryHead")
	public Object queryHead(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String userID = "";
		UserModel userM = (UserModel) session.getAttribute("userSessionItems");
		if (request.getParameter("userID") != null) {
			if (request.getParameter("userID").equals("my")) {
				userID = userM.getUserId();
			} else {
				userID = request.getParameter("userID");
			}
			List<UserModel> user = UserHeadService.queryHead(userID);
			for (int i = 0; i < user.size(); i++) {
				if (user.get(i) != null) {
					map.put("head", user.get(i));
				} else {
					map.put("head", null);
				}
			}
			String level = levelService.getLevelInfoById(userM.getLevels());
			map.put("loginUserLevel", level);
		}
		return map;
	}

	/**
	 * 获取上传到服务器上的头像
	 * @param request
	 * @param response
	 * @param session
	 */
	@RequestMapping("/showHead")
	public void showHead(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String configPath = ConfigParameterUtil.getConfigByName("uploadHead", "D:/toolsupload");
		String isme = request.getParameter("isme");
		String path = "";
		if(isme != null && isme.length() != 0){
			UserModel user = (UserModel) session.getAttribute("userSessionItems");
			path = user.getHead();
		}else {
			path = request.getParameter("path");
		}
		ServletOutputStream output = null;
		FileInputStream fileInput = null;
		try {
			File file = new File(configPath + "/" + path);
//			if (!file.exists()) {
//				throw new NullPointerException("读取的文件不存在！路径：" + path);
//			}
			if (file.exists()) {
				output = response.getOutputStream();
				fileInput = new FileInputStream(file);
				IOUtils.copy(fileInput, output);
			}
		} catch (Exception e) {
			e.getMessage();
		} finally {
			IOUtils.closeQuietly(output);
			IOUtils.closeQuietly(fileInput);
		}
	}
}
