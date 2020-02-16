package com.casic.flatform.controller;

import com.casic.flatform.model.LogModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.HomeService;
import com.casic.flatform.service.LogService;
import com.casic.flatform.service.LoginService;
import com.casic.flatform.service.PermissionService;
import com.casic.flatform.util.ConfigParameterUtil;
import com.casic.flatform.util.MyUUID;
import org.apache.commons.io.IOUtils;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * 启动页面
 *
 * @author hanxu
 */
@Controller
@RequestMapping("/indexController")
public class IndexController {

    private Logger logger = LoggerFactory.getLogger(UpDownLoadController.class);

    @Autowired
    private LoginService loginService;
    @Autowired
    private PermissionService permissionService;
    @Autowired
    private HomeService homeService;
    @Autowired
    private LogService logService;
    @Value("${node.ip}")
    private String nodeServerIp;

    @GetMapping("/home")
    public String home(HttpServletRequest request,Model model,HttpSession session) {
        String userId = request.getParameter("PID");
        UserModel user = homeService.queryUserInfo(userId);
        model.addAttribute("userid", userId);
        model.addAttribute("user", user);
        session.setAttribute("userSessionItems", user);
        return "/home1";
    }

    /**
     * 登录页
     *
     * @return
     */
    @RequestMapping("/login")
    public String login(Model model) throws URISyntaxException, IOException {
        model.addAttribute("msg", "");
        return "login";
    }

    /**
     * 管理页面
     *
     * @return
     */
    @RequestMapping("/managerHome")
    public String managerHome(HttpSession session, Model model) {
        return "manager/index";
    }

    /**
     * 日志页面
     *
     * @return
     */
    @RequestMapping("/logHome")
    public String logHome(HttpSession session, Model model) {
        return "log/index";
    }

    /**
     * 安全页面
     *
     * @return
     */
    @RequestMapping("/secHome")
    public String secHome(HttpSession session, Model model) {
        return "secadm/index";
    }
   
    /**
     * 通过ID登录
     *
     * @return
     */
    @RequestMapping("/loginById")
    public String loginById(HttpServletRequest request, HttpSession session, Model model) throws UnknownHostException {
//		//用户身份证
        String userId = "10000025190000";
		String dnname = ((HttpServletRequest) request).getHeader("dnname");
		String url = request.getParameter("url");

		// 模拟CA
//		System.out.println("<-----");
		// dnname==null 则没有通过CA来进行登录
		if (dnname == null) {
			return "error";
		} else {

			try {
				dnname = new String(dnname.getBytes("iso8859-1"), "gbk");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			String dnsplit[] = dnname.trim().split(",", 0);
			String cn, dc, t = null;
			for (String val : dnsplit) {
				val = val.trim();
				// cn dc t
				if (val.indexOf("t=") > -1 || val.indexOf("T=") > -1) {
					t = val.substring(2, val.length());
				}
			}
			userId = t;
	        // 获得当前登录人信息
	        UserModel user = homeService.queryUserInfo(userId);
            model.addAttribute("userid", userId);
	        model.addAttribute("user", user);
	        String roleArray = permissionService.userRoleStr(userId);
	        session.setAttribute("userSessionItems", user);
	        session.setAttribute("roleArray", roleArray);
	        String token = loginService.createToken(userId);
	        request.getSession().setAttribute("token", token);
	        // 获得用户权限信息
	        // 权限列表Map<权限code， 是否拥有权限，true or false>
	        Map<String, Boolean> permissionMap = permissionService.queryUserPermission(user.getUserId());
	        model.addAttribute("permission", permissionMap);
	        LogModel log = new LogModel();
			log.setLogId(MyUUID.getUUID());
			log.setType("login");
			log.setContent(user.getFullname() + "通过网关登录！");
			log.setAddress(request.getHeader("clientip"));
			log.setCreater(user.getUserId());
			log.setFullName(user.getFullname());
			logService.saveLog(log);

			return "modules/discussion/discussion"; 
		}
    }

    @RequestMapping("/loginCA")
    public String loginCA(HttpServletRequest request, HttpSession session, Model model, String type){
    	// 获得当前登录人信息
    	String userId = request.getParameter("PID");
//    	String userId = "10000019431705";
    	//验证修改begin
        /*String userID = request.getParameter("userID");
        String userName= request.getParameter("userName");
        String PID  = request.getParameter("PID");
        String sessionID= request.getParameter("sessionID");
        String WSUrl= request.getParameter("WSUrl");
        String verifySSO= request.getParameter("verifySSO");
        Service service=new Service();
        Call call= null;
        try {
            call = (Call)service.createCall();
        } catch (ServiceException e) {
            logger.error("验证出错：(Call)service.createCall()");
            e.printStackTrace();
        }
        call.setTargetEndpointAddress(WSUrl);
        call.setOperationName("runBiz");//设置操作名

        *//*设置入口参数*//*
        call.addParameter("packageName", XMLType.XSD_STRING, ParameterMode.IN);
        call.addParameter("unitId", XMLType.XSD_STRING, ParameterMode.IN);
        call.addParameter("processName", XMLType.XSD_STRING, ParameterMode.IN);
        call.addParameter("bizDataXML", XMLType.XSD_STRING, ParameterMode.IN);
        call.setReturnType(XMLType.XSD_STRING);
        String projectDetails="<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
                "<root>" +
                "<data>" +
                "<sessionID>"+sessionID+"</sessionID>" +
                "<userID>"+userID+"</userID>" +
                "<PID>"+PID+"</PID>" +
                "<verifySSO>"+verifySSO+"</verifySSO>" +
                "</data>" +
                "</root>";
        *//*调用门户系统WebService服务，返回结果*//*
        String[] param={"common","0","biz.bizCheckSSO",projectDetails};
        Object obj = null;
        try {
             obj=call.invoke(param);//obj是代表返回一个XML格式的串
        } catch (RemoteException e) {
            logger.error("验证出错：call.invoke" );
            e.printStackTrace();
        }
        String msg =  parseXmlInf(obj.toString());
        if(!"1".equals(msg)){
            logger.info("验证不通过："+userID);
            return null;
        }*/
        //验证修改end
        UserModel user = homeService.queryUserInfo(userId);
        model.addAttribute("userid", userId);
        model.addAttribute("user", user);
        String roleArray = permissionService.userRoleStr(userId);
        session.setAttribute("userSessionItems", user);
        session.setAttribute("roleArray", roleArray);
        String token = loginService.createToken(userId);
        request.getSession().setAttribute("token", token);
        // 获得用户权限信息
        // 权限列表Map<权限code， 是否拥有权限，true or false>
        Map<String, Boolean> permissionMap = permissionService.queryUserPermission(user.getUserId());
        model.addAttribute("permission", permissionMap);
		return "modules/discussion/discussion"; 
    }
    
    /**
     * 获得socket起动配置
     *
     * @return
     */
    @ResponseBody
    @RequestMapping("/soceketConfig")
    public Object soceketConfig(HttpSession session) {
        Map<String, Object> paraMap = new HashMap<String, Object>();
        // 获得当前登录人信息
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        paraMap.put("socketService", ConfigParameterUtil.getConfigByName("socketService", nodeServerIp));
//		paraMap.put("socketService", ConfigParameterUtil.getConfigByName("socketService", "http://10.12.97.30:8082"));
        paraMap.put("userId", user.getUserId());
        paraMap.put("token", session.getAttribute("token"));
        return paraMap;
    }

    /**
     * 显示pdf文件的展示页面，正常此页面是嵌入到iframe中
     *
     * @return
     */
    @RequestMapping("/showPdf")
    public Object showPdf(HttpServletRequest request, HttpServletResponse response, Model model) {

        model.addAttribute("fileName", request.getParameter("name"));
        model.addAttribute("pdfPath", request.getParameter("path"));
        return "pdfViewer";
    }

    /**
     * 下载文件
     *
     * @param request
     * @param response
     * @param session
     * @return 
     */
    @RequestMapping("/fileHave")
    @ResponseBody
    public boolean fileHave(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String realpath = request.getParameter("path");
        String filedisplay = request.getParameter("fileName");// 下载文件时显示的文件保存名称
        String downPath = request.getParameter("downPath");
        String path = downPath + realpath;
        if (StringUtils.isEmpty(path)) {
            logger.error("文件路径为空！");
        }
        File file = new File(path);
        if (!file.exists()) {
            logger.error("下载出错，文件不存在！路径：" + file.getPath());
            return false;
        } else {
        	return true;
        }
        
    }

    /**
     * 下载文件
     *
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/downloadByPath")
    @ResponseBody
    public void downloadByPath(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String realpath = request.getParameter("path");
        String filedisplay = request.getParameter("fileName");// 下载文件时显示的文件保存名称
        String downPath = request.getParameter("downPath");
        String path = downPath + realpath;
        if (StringUtils.isEmpty(path)) {
            logger.error("文件路径为空！");
        }

        // File file = new File (UploadUtil.FILE_PATH + path);
        File file = new File(path);
        if (!file.exists()) {
            logger.error("下载出错，文件不存在！路径：" + file.getPath());
        } else {
        	ServletOutputStream out = null;
        	FileInputStream in = null;
        	try {
        		response.setContentType("application/x-download");// 设置为下载application/x-download
        		String agent = request.getHeader("USER-AGENT");
        		if (agent != null && agent.toLowerCase().indexOf("firefox") > 0) {
        			filedisplay = new String(filedisplay.getBytes("UTF-8"), "ISO-8859-1");
        		} else {
        			filedisplay = URLEncoder.encode(filedisplay, "UTF-8").replaceAll("%5B", "\\[")
        					.replaceAll("%5D", "\\]").replaceAll("\\+", "%20")
        					.replaceAll("%28", "\\(").replaceAll("%29", "\\)")
        					.replaceAll("%3B", ";").replaceAll("%40", "@")
        					.replaceAll("%23", "\\#").replaceAll("%26", "\\&")
        					.replaceAll("%7B", "\\{").replaceAll("%7D", "\\}")
        					.replaceAll("%21", "\\!").replaceAll("%24", "\\$")
        					.replaceAll("%21", "\\!").replaceAll("%25", "\\%")
        					.replaceAll("%5E", "\\^").replaceAll("%2B", "\\+");
        		}
        		response.addHeader("Content-Disposition", "attachment;filename=" + filedisplay);
        		out = response.getOutputStream();
        		in = new FileInputStream(file);
        		IOUtils.copy(in, out);
        	} catch (IOException e) {
        		logger.error("下载出错:" + e.getMessage());
        	} finally {
        		IOUtils.closeQuietly(out);
        		IOUtils.closeQuietly(in);
        	}
        }
    }

    /**
     * 打开
     *
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/downloadForOpen")
    @ResponseBody
    public void downloadForOpen(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String realpath = request.getParameter("path");
        String filedisplay = request.getParameter("fileName");// 下载文件时显示的文件保存名称
//        System.out.println(filedisplay);
        String downPath = request.getParameter("downPath");
        String path = downPath + realpath;
        if (StringUtils.isEmpty(path)) {
            logger.error("文件路径为空！");
            return;
        }

        // File file = new File (UploadUtil.FILE_PATH + path);
        File file = new File(path);
        if (!file.exists()) {
            logger.error("下载出错，文件不存在！路径：" + file.getPath());
            return;
        }

        ServletOutputStream out = null;
        FileInputStream in = null;
        try {
            response.setContentType("application/x-download");// 设置为下载application/x-download
            String agent = request.getHeader("USER-AGENT");
            if (agent != null && agent.toLowerCase().indexOf("firefox") > 0) {
                filedisplay = new String(filedisplay.getBytes("UTF-8"), "ISO-8859-1");
            } else {
                filedisplay = URLEncoder.encode(filedisplay, "UTF-8");
            }
            response.addHeader("Content-Disposition", "attachment;filename=" + filedisplay);
            out = response.getOutputStream();
            in = new FileInputStream(file);
            IOUtils.copy(in, out);
        } catch (IOException e) {
            logger.error("下载出错:" + e.getMessage());
        } finally {
            IOUtils.closeQuietly(out);
            IOUtils.closeQuietly(in);
        }
    }

    /**
     * 网络工具下载
     *
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/toolsDownByPath")
    @ResponseBody
    public void toolsDownByPath(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String realpath = request.getParameter("path");
        String filedisplay = request.getParameter("fileName");// 下载文件时显示的文件保存名称
        String configPath = request.getParameter("downPath");
        String path = configPath + realpath;
        if (StringUtils.isEmpty(path)) {
            logger.error("文件路径为空！");
            return;
        }

        // File file = new File (UploadUtil.FILE_PATH + path);
        File file = new File(path);
        if (!file.exists()) {
            logger.error("下载出错，文件不存在！路径：" + file.getPath());
            return;
        }

        ServletOutputStream out = null;
        FileInputStream in = null;
        try {
            response.setContentType("application/x-download");// 设置为下载application/x-download
            String agent = request.getHeader("USER-AGENT");
            if (agent != null && agent.toLowerCase().indexOf("firefox") > 0) {
                filedisplay = new String(filedisplay.getBytes("UTF-8"), "ISO-8859-1");
            } else {
                filedisplay = URLEncoder.encode(filedisplay, "UTF-8");
            }
            response.addHeader("Content-Disposition", "attachment;filename=" + filedisplay);
            out = response.getOutputStream();
            in = new FileInputStream(file);
            IOUtils.copy(in, out);
        } catch (IOException e) {
            logger.error("下载出错:" + e.getMessage());
        } finally {
            IOUtils.closeQuietly(out);
            IOUtils.closeQuietly(in);
        }
    }

    public static void main(String[] args) {
        IndexController indexController = new IndexController();
        String xmlStr = "<root><data><msg>1</msg></data></root>";
        String msg = indexController.parseXmlInf(xmlStr);
        System.out.println("=========="+msg);
    }
    //解析xml数据
    public String parseXmlInf(String xmlStr){
        logger.info("解析数据xml："+xmlStr);
        String msg = "";
        Document doc = null;
        try {
            doc = DocumentHelper.parseText(xmlStr); // 将字符串转为XML
            Element rootElt = doc.getRootElement(); // 获取根节点
            Iterator iter = rootElt.elementIterator("data"); // 获取根节点下的子节点head
            while (iter.hasNext()) {
                Element recordEle = (Element) iter.next();
                //内部名称
                 msg = recordEle.elementTextTrim("msg");
            }
        }catch (Exception e){
            logger.error("解析数据xml出错：");
        }
        return msg;
    }

}
