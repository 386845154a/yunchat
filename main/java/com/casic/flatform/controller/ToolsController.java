package com.casic.flatform.controller;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.casic.flatform.model.DetailsModel;
import com.casic.flatform.model.DownApporModel;
import com.casic.flatform.model.LogModel;
import com.casic.flatform.model.ToolsModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.LogService;
import com.casic.flatform.service.ToolsService;
import com.casic.flatform.util.ConfigParameterUtil;
import com.casic.flatform.util.ImageUtilCrop;
import com.casic.flatform.util.MyUUID;
import com.casic.flatform.util.UploadUtil;

/**
 * 讨论组控制类
 *
 * @author zouct
 */
@RestController
@RequestMapping("/toolsController")
public class ToolsController {

	@Value("${imgSize:150}")
	private String imgSize;
    @Autowired
    private ToolsService toolsService;
    @Autowired
    private LogService logService;

    /**
     * 获取网络工具信息
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/queryTools")
    public Object queryTools(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
//      返回值增加，是否具备下载权限
        String pageStr = request.getParameter("page");
        String tab_name = request.getParameter("tab_name");
        String tab_id = request.getParameter("tab_id");
        String type = request.getParameter("type");
        int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
        return toolsService.queryTools(page, tab_name, tab_id, type);
    }

    /**
     * 获取最新上传/热门推荐工具信息
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/queryDetailsInfo")
    public Object queryDetailsInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String toolId = request.getParameter("toolId");
        return toolsService.queryDetailsInfo(toolId);
    }

    /**
     * 获取讨论区信息
     * @param session
     * @param detailsModel
     * @return
     */
    @RequestMapping("/queryDetails")
    public Object queryDetails(HttpSession session, DetailsModel detailsModel) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        Map<String, Object> map = new HashMap<>(2);
        map.put("toolsList", toolsService.queryDetails(detailsModel.getPid()));
        // 我的评论信息
        detailsModel.setWriter(user.getUserId());
        map.put("myComment", toolsService.queryDetailsByPojo(detailsModel));
        return map;
    }
    
    /**
     * 等级填写
     * @param session
     * @param detailsModel
     * @return
     */
    @RequestMapping("/levelWrite")
    public Object levelWrite(HttpSession session, DetailsModel detailsModel, HttpServletRequest request) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
    	String toolId = request.getParameter("toolId");
    	try {
    		map.put("commentAll", toolsService.commentAll(toolId));
    		map.put("commentAllCount", toolsService.commentAllCount(toolId));
    		map.put("Mycomment", toolsService.Mycomment(user.getUserId(), toolId));
		} catch (Exception e) {
			// TODO: handle exception
		}
    	return map;
    }

    /**
     * 打开本地软件
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/openTool")
    public Object openTool(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        try {
//        	String aa = "D:\\搜狗高速下载\\AcroRd32.exe";
            String path = request.getParameter("path");
            String strPath = path.replaceAll("\\\\", "/");
            Runtime rt = Runtime.getRuntime();
            Process pr = rt.exec("cmd /c " + strPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return map;
    }

    /**
     * 保存评论信息
     * @param detailsModel
     * @param session
     * @return
     */
    @RequestMapping("/saveDetails")
    public Object saveDetails(DetailsModel detailsModel, HttpSession session, HttpServletRequest request) throws UnknownHostException {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        Map<String, Object> map = new HashMap<>(2);
        DetailsModel d = new DetailsModel();
        d.setPid(detailsModel.getPid());
        d.setWriter(user.getUserId());
        // 查询已提交过的评论
        List<DetailsModel> detailsModelsList = toolsService.queryDetailsByPojo(d);
        if (detailsModelsList.size() > 0) {
            detailsModel.setTalkLeve(detailsModelsList.get(0).getTalkLeve());
        }

        // 保存评论
        detailsModel.setDetaileId(MyUUID.getUUID());
        detailsModel.setWriter(user.getUserId());
        detailsModel.setCreatetime(new Date());
        toolsService.saveDetails(detailsModel);
        LogModel log = new LogModel();
        String local_ip = InetAddress.getLocalHost().getHostAddress();
        log.setLogId(MyUUID.getUUID());
        log.setType("upload");
        log.setContent("提交了评论,评论等级" + detailsModel.getTalkLeve());
        log.setAddress(local_ip);
        log.setCreater(user.getUserId());
        log.setFullName(user.getFullname());
        logService.saveLog(log);
        map.put("success", true);
        return map;
    }

    /**
     * 修改下载次数
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/updateDownc")
    public Object updateDownc(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        String fileId = request.getParameter("fileId");
        String downcS = request.getParameter("downc");
        Integer downc = Integer.valueOf(downcS);
        toolsService.updateDownc(downc, fileId);
        map.put("success", true);
        return map;
    }

    /**
     * 查询工具信息
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/query_Tools")
    public Object query_Tools(HttpServletRequest request, HttpServletResponse response,
                              HttpSession session) {
        String pageStr = request.getParameter("page");
        int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
        String fileName = request.getParameter("fileName");
        String sendUser = request.getParameter("sendUser");
        String fileLevels = request.getParameter("fileLevels");
        return toolsService.query_Tools(page, fileName, sendUser, fileLevels);
    }

    /**
     * 审批工具
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/approve_tool")
    public Object approve_tool(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        String fileId = request.getParameter("fileId");
        String isregister = request.getParameter("isregister");
        String grade = request.getParameter("grade");
        toolsService.approve_tool(fileId, isregister, grade);
        map.put("success", true);
        return map;
    }

    /**
     * 删除工具
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/del_tool")
    public Object del_tool(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        String fileId = request.getParameter("fileId");
        String headPath = request.getParameter("headPath");
        String filePath = request.getParameter("filePath");
        delSystemFiles(headPath, filePath);
        toolsService.del_tool(fileId);
        map.put("success", true);
        return map;
    }

    /**
     * 删除服务器文件
     * @param request
     * @param response
     * @param session
     * @return
     */
    public static boolean delSystemFiles(String headPath, String filePath) {
        String path = headPath + filePath;
        boolean delete_flag = false;
        File file = new File(path);
        if (file.exists() && file.isFile() && file.delete()) {
            delete_flag = true;
        } else {
            delete_flag = false;
            return delete_flag;
        }
        return delete_flag;
    }

    /**
     * 工具图片
     * @param request
     * @param file
     * @param session
     * @return
     */
    @RequestMapping("/titleImg")
    public Object titleImg(HttpServletRequest request, @RequestParam("file") MultipartFile file,
                           HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String use = user.getUserId();
        String fileId = request.getParameter("fileId");
        String headPath = request.getParameter("up_path");
        String toolid = request.getParameter("toolid");
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
            String path = null;
            String fileType = file.getContentType().split("/")[0];
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
            toolsService.titleImg(toolid, nPath);
        } catch (IOException e) {

            e.printStackTrace();
        }

        return null;
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
     * 根据ID获取工具信息
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/getToolById")
    public Object getToolById(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String toolId = request.getParameter("toolId");
        ToolsModel toolsModel = toolsService.getToolById(toolId);
        return toolsModel;
    }
    
    /**
     * 评论信息条数
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/myPLCount")
    public Object myPLCount(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String toolId = request.getParameter("toolId");
        int count = toolsService.myPLCount(toolId);
        return count;
    }
    
    /**
     * 我的上传、上传审批
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/upAndApprove")
    public Object upAndApprove(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
    	String userId = user.getUserId(); 
    	String approve = request.getParameter("approve");
//    	String approve = "";
//    	if (approves.equals("我的审批")) {
//    		approve = approves;
//    	}
    	map.put("list", toolsService.upAndApprove(userId, approve));
    	map.put("loginId", userId);
    	map.put("loginOrg", user.getOrgId());
    	map.put("loginUId", user.getUserId());
        return map;
    }
    
    /**
     * 下载审批
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/datablelist")
    public Object datablelist(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
    	String daname = request.getParameter("daname");
    	String userId = user.getUserId(); 
    	map.put("list", toolsService.datablelist(daname, userId));
    	map.put("loginId", userId);
    	map.put("loginOrg", user.getOrgId());
    	return map;
    }
    
    /**
     * 下载审核通过/驳回
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/agreeDown")
    public Object agreeDown(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	String id = request.getParameter("id");
    	String flag = request.getParameter("flag");
    	toolsService.agreeDown(id, flag);
    	return true;
    }
    
    /**
     * 根据ID获取工具审核状态
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/getDownState")
    public Object getDownState(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
//    	Map<String, Object> map = new HashMap<>();
//    	String tid = request.getParameter("tid");
//    	map.put("list", toolsService.getDownState(tid));
//    	return map;
    	Map<String, Object> map = new HashMap<>();
    	String tid = request.getParameter("tid");
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
    	map.put("list", toolsService.isSubmit(tid, user.getUserId()));
    	return map;
    }
    
    /**
     * 当前用户是否提交下载申请
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/isSubmit")
    public Object isSubmit(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	String tid = request.getParameter("tid");
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
    	map.put("list", toolsService.isSubmit(tid, user.getUserId()));
    	return map;
    }
    
    /**
     * 提交工具下载申请
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/downApporSubmit")
    public Object downApporSubmit(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
    	String dafileid = request.getParameter("dafileid");
    	String dafilename = request.getParameter("dafilename");
    	String dafilelevel = request.getParameter("dafilelevel");
    	String dauser = request.getParameter("dauser");
    	String datext = request.getParameter("datext");
    	Integer loginLevel = Integer.parseInt(user.getLevels());
    	Integer pageLevel = Integer.parseInt(dafilelevel);
    	if (dauser.equals("") || dauser.equals(null)) {
    		map.put("success", false);
    		map.put("text", "审批人不能为空！");
    	} else if (datext.equals("") || datext.equals(null)) {
    		map.put("success", false);
    		map.put("text", "申请原因不能为空！");
    	} else if (loginLevel < pageLevel) {
    		map.put("success", false);
    		map.put("text", "您的等级不足，无法提交申请！");
    	} else {
    		Object downApporModel = toolsService.isSubmit(dafileid, user.getUserId());
    		if (downApporModel != null) {
    			toolsService.delDownApporSubmit(dafileid,user.getUserId());
    		}
    		toolsService.downApporSubmit(dafileid,dafilename,dafilelevel,dauser,datext,user.getUserId(),user.getFullname());
    		map.put("success", true);
    		map.put("text", "提交成功！");
    	}
    	return map;
    }
    
    /**
     * 二级审批提交
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/apporChange")
    public Object apporChange(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	try {
    		String fileId = request.getParameter("fileId");
    		String approver = request.getParameter("approver");
    		String state = request.getParameter("state");
    		if (approver == null) {
    			approver = "3";
    		}
    		toolsService.apporChange(fileId, approver, state);
    		map.put("return", true);
		} catch (Exception e) {
			map.put("return", false);
		}
        return map;
    }
    
    /**
     * 审批意见变更
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/approvalChange")
    public Object approvalChange(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	try {
    		String fileId = request.getParameter("fileId");
    		String approval = request.getParameter("approval");
    		toolsService.approvalChange(fileId, approval);
    		map.put("return", true);
		} catch (Exception e) {
			map.put("return", false);
		}
        return map;
    }
    
    /**
     * downUser-详情查询
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/DQInfo")
    public Object DQInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String toolId = request.getParameter("toolId");
        return logService.DQInfo(toolId);
    }
    

}
