package com.casic.flatform.controller;

import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.model.RoleModel;
import com.casic.flatform.model.RolePermissionModel;
import com.casic.flatform.service.*;
import com.casic.flatform.util.ConfigParameterUtil;
import com.casic.flatform.util.HttpUtil;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 外部接口
 *
 * @author hanxu
 */
@RestController
@RequestMapping("/interfaces")
public class InterfacesController {

    private Logger logger = LoggerFactory.getLogger(InterfacesController.class);

    @Autowired
    private PermissionService permissionService;
    @Autowired
    private GroupService groupService;
    @Autowired
    private MessageService messageService;
    @Autowired
    private AddressService addressService;


    @Value("${node.ip}")
    private String nodeServerIp;

    /**
     * 获得权限列表
     *
     * @return
     */
    @RequestMapping("/permissionList")
    public List<RolePermissionModel> permissionList() {
        return permissionService.findAllPermission();
    }

    /**
     * 获得角色的权限
     *
     * @param roleId
     * @return
     */
    @RequestMapping("/rolePermission")
    public List<RolePermissionModel> rolePermission(String roleId) {
        return permissionService.rolePermission(roleId);
    }

    /**
     * 获得用户角色
     *
     * @param userId
     * @return
     */
    @RequestMapping("/userRole")
    public List<RoleModel> userRole(String userId) {
        return permissionService.userRole(userId);
    }

    /**
     * 修改用户角色
     *
     * @param userId      :用户id
     * @param roleIdArray ：角色id列表（多个id逗号分隔）
     * @return
     */
    @RequestMapping("/updateUserRole")
    public Map<String, Object> updateUserRole(String userId, String roleIdArray) {
        Map<String, Object> map = new HashMap<>();
        try {
            permissionService.updateUserRole(userId, roleIdArray.split(","));
            map.put("ok", true);
            map.put("msg", "更新完成！");
        } catch (NullPointerException ex) {
            map.put("ok", false);
            map.put("msg", "更新失败！error:传入数据为空！");
        } catch (Exception ex) {
            map.put("ok", false);
            map.put("msg", "更新失败！error:" + ex.getMessage());
        }
        return map;
    }

    /**
     * 更新角色权限
     *
     * @param roleId            :角色id
     * @param PermissionIdArray :权限id（多个id用逗号分隔）
     * @return
     */
    @RequestMapping("/updataRolePermission")
    public Map<String, Object> updataRolePermission(String roleId, String PermissionIdArray) {
        Map<String, Object> map = new HashMap<>();
        try {
            permissionService.updateRolePermission(roleId, PermissionIdArray.split(","));
            map.put("ok", true);
            map.put("msg", "更新完成！");
        } catch (NullPointerException ex) {
            map.put("ok", false);
            map.put("msg", "更新失败！error:" + ex.getMessage());
        } catch (Exception ex) {
            map.put("ok", false);
            map.put("msg", "更新失败！error:" + ex.getMessage());
        }
        return map;
    }

    /**
     * 获取任务系统信息
     *
     * @param msg : 信息
     * @return
     */
    @RequestMapping("/gainSystemMsg")
    public Object gainSystemMsg(String msg) {
        Map<String, Object> map = new HashMap<>();
        String senderId = "";
        String receiver = "";
        String message = "";
        String type = "";
        JSONObject myJson = JSONObject.parseObject(msg);
        if (myJson.size() > 0) {
            senderId = myJson.get("senderId").toString();
            receiver = myJson.get("receiver").toString();
            message = myJson.get("message").toString();
            type = myJson.get("type").toString();
        }
        Long sender = (long) -1;
        try {
            messageService.saveSystemNotification(senderId, "system", "href", message, "1", receiver);
            map.put("ok", true);
        } catch (Exception e) {
            map.put("ok", false);
        }
        return map;
    }

    /**
     * 发送系统通知
     *
     * @param msg
     * @return
     */
    @RequestMapping("/sendSystemMsg")
    public Object sendSystemMsg(String title, String type, String content) {
        JSONObject myJson = JSONObject.parseObject(content);
        String projectName = myJson.get("projectName").toString();
        Map<String, Object> map = new HashMap<>();
        type = StringUtils.isEmpty(type) ? "title" : type;
        if (StringUtils.isEmpty(title)) {
            map.put("ok", false);
            map.put("msg", "title不能为空！");
            return map;
        } else if (!type.equals("title") && StringUtils.isEmpty(content)) {
            map.put("ok", false);
            map.put("msg", type + "类型的content不能为空！");
            return map;
        }
        String sendSysMsgUrl = ConfigParameterUtil.getConfigByName("sendSysMsgUrl",
                nodeServerIp + "/interface/msg/sendSystemNotification");
//		String sendSysMsgUrl = ConfigParameterUtil.getConfigByName("sendSysMsgUrl",
//				"http://10.12.97.30:8082/interface/msg/sendSystemNotification");
        map.put("title", title);
        map.put("type", type);
        map.put("content", content);

        //获取存放路径
        String fileName = "SavePath";
        String Path = "C:\\path\\" + fileName + ".json";
        BufferedReader reader = null;
        String laststr = "";
        try {
            FileInputStream fileInputStream = new FileInputStream(Path);
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
            reader = new BufferedReader(inputStreamReader);
            String tempString = null;
            while ((tempString = reader.readLine()) != null) {
                laststr += tempString;
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        //创建目录
        String paojectPath = laststr + projectName;
        InterfacesController.createDir(paojectPath);
        //保存项目json
        try {
            paojectPath = paojectPath + "//";
            InterfacesController.saveJson(content, projectName, paojectPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
        logger.info("发送系统消息：" + map);

        return HttpUtil.sendPost(sendSysMsgUrl, map);
    }

    /**
     * 创建路径
     *
     * @param destDirName
     * @return
     */
    public static boolean createDir(String destDirName) {
        File dir = new File(destDirName);
        if (dir.exists()) {
            System.out.println("创建目录" + destDirName + "失败，目标目录已经存在");
            return false;
        }
        if (!destDirName.endsWith(File.separator)) {
            destDirName = destDirName + File.separator;
        }
        //创建目录
        if (dir.mkdirs()) {
            System.out.println("创建目录" + destDirName + "成功！");
            return true;
        } else {
            System.out.println("创建目录" + destDirName + "失败！");
            return false;
        }
    }

    /**
     * 保存json
     *
     * @param content
     * @param projectName
     * @param paojectPath
     * @throws IOException
     */
    public static void saveJson(String content, String projectName, String paojectPath) throws IOException {
        BufferedWriter writer = null;
        File file = new File(paojectPath + projectName + ".json");
        //如果未见不存在，则新建一个
        if (!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        //写入
        try {
            writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file, false), "UTF-8"));
            writer.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (writer != null) {
                    writer.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        System.out.println("文件写入成功！");
    }

    /**
     * 向指定用户发送消息
     *
     * @param userId         ：发送者id
     * @param receiverUserId ：接收者id
     * @param content        ：消息内容
     * @param chatType       ：聊天类型（system， group， user）
     * @return
     */
    public Object sendMsgToUser(String userId, String receiverUserId, String content, String chatType) {
        Map<String, Object> map = new HashMap<>();
        if (StringUtils.isEmpty(userId)) {
            map.put("ok", false);
            map.put("msg", "userId不能为空！");
            return map;
        } else if (StringUtils.isEmpty(receiverUserId)) {
            map.put("ok", false);
            map.put("msg", "receiverUserId不能为空！");
            return map;
        } else if (StringUtils.isEmpty(content)) {
            map.put("ok", false);
            map.put("msg", "content不能为空！");
            return map;
        } else if (StringUtils.isEmpty(chatType)) {
            map.put("ok", false);
            map.put("msg", "chatType不能为空！");
            return map;
        }
        String sendSysMsgUrl = ConfigParameterUtil.getConfigByName("sendSysMsgUrl",
                nodeServerIp + "/interface/msg/sendMsgToUser");
//		String sendSysMsgUrl = ConfigParameterUtil.getConfigByName("sendSysMsgUrl",
//				"http://10.12.97.30:8082/interface/msg/sendMsgToUser");
        map.put("userId", userId);
        map.put("receiverUserId", receiverUserId);
        map.put("content", content);
        map.put("chatType", chatType);
//		messageService.saveSystemNotification(Long.valueOf(-1), title, type, content, "0");
        logger.info("发送系统消息：" + map);
        return HttpUtil.sendPost(sendSysMsgUrl, map);
    }

    /**
     * 接口调用，创建讨论组
     *
     * @param groupName     :讨论组名称
     * @param groupDescribe ：讨论组描述
     * @return
     */
    @RequestMapping("/createGroup")
    public Object createGroup(String groupName, String groupDescribe, String userId, String Pname, String scop, String ispublic,String levels) {
        Map<String, Object> map = new HashMap<String, Object>();
        if (StringUtils.isEmpty(groupName) || StringUtils.isEmpty(userId)) {
            map.put("ok", false);
            map.put("mag", "讨论组名称和讨论组成员不能为空");
            return map;
        }
        try {
            String[] userIdArray = userId.split(",");
            String groupId = groupService.createGroup(groupName, groupDescribe, userIdArray, String.valueOf("-1"), Pname, scop, ispublic,levels);
            map.put("ok", true);
            map.put("groupId", groupId);
            map.put("msg", "创建讨论组成功！讨论组id=" + groupId);
        } catch (Exception ex) {
            map.put("ok", false);
            map.put("msg", "创建讨论组失败！请检查传入成员id是否存在，格式是否正确。");
            logger.error("接口创建讨论组失败！错误信息：" + ex.getMessage());
        }

        return map;
    }

    /**
     * 查询讨论组信息
     *
     * @param groupId ：讨论组id
     * @return
     */
    @RequestMapping("/queryGroupById")
    public Object queryGroupById(String groupId) {
        Map<String, Object> map = new HashMap<String, Object>();
        if (StringUtils.isEmpty(groupId)) {
            map.put("ok", false);
            map.put("msg", "讨论组id不能为空！");
            return map;
        }

        map.put("ok", true);
        map.put("info", groupService.queryGroupInfo(groupId));
        map.put("userList", groupService.queryGroupUser(groupId));

        return map;
    }

    /**
     * 浏览器下载指定文件
     *
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/pageDown")
    @ResponseBody
    public void pageDown(HttpServletRequest request, HttpServletResponse response, HttpSession session, String filedisplay) {
        String path = "D:/toolsupload/yunque/" + filedisplay;
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
//            logger.error("下载出错:" + e.getMessage());
        } finally {
            IOUtils.closeQuietly(out);
            IOUtils.closeQuietly(in);
        }
    }
}




















