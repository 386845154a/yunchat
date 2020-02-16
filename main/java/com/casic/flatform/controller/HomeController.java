package com.casic.flatform.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.model.*;
import com.casic.flatform.pageModel.OrgUserPageModel;
import com.casic.flatform.pageModel.PageObject;
import com.casic.flatform.service.*;
import com.casic.flatform.util.DateUtil;
import com.casic.flatform.util.MyUUID;
import com.casic.flatform.util.SpringUtil;
import com.casic.flatform.util.TemplateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.*;

/**
 * home页面调用的方法，主要是ajax调用
 *
 * @author hanxu
 */
@RestController
@RequestMapping("/homeController")
public class HomeController {

    @Autowired
    private LoginService loginService;
    @Autowired
    private HomeService homeService;
    @Autowired
    private MessageService messageService;
    @Autowired
    private GroupService groupService;
    @Autowired
    private PermissionService permissionService;


    /**
     * 用户登录
     *
     * @return
     */
    @RequestMapping("/loginAction")
    public Object login(HttpServletRequest request, HttpServletResponse response, HttpSession session)
            throws IOException {
        Map<String, Object> map = new HashMap<>();

        String account = request.getParameter("account");
        String password = request.getParameter("password");

        if (StringUtils.isEmpty(account)) {
            map.put("errMsg", "用户名不能为空！");
            return map;
        }
        if (StringUtils.isEmpty(password)) {
            map.put("errMsg", "密码不能为空！");
            return map;
        }
        try {
            UserModel user = loginService.queryUserInfoByAccount(account, password);
            if (user != null) {
                if ("1".equals(String.valueOf(user.getIsLock()))) {
                    throw new Exception("该用户已被锁定！");
                }
                String roleArray = permissionService.userRoleStr(user.getUserId());
                session.setAttribute("userSessionItems", user);
                session.setAttribute("roleArray", roleArray);

                // 生成token
//				System.out.println("UserID===" + user.getUserId());
                String token = loginService.createToken(user.getUserId());
                request.getSession().setAttribute("token", token);

                map.put("success", true);
                // 是否是管理员
                if (roleArray.contains("系统管理员")) {
                    map.put("isAdmin", true);
                } else if (roleArray.contains("日志管理员")) {
                    map.put("isLog", true);
                } else if (roleArray.contains("安全管理员")) {
                    map.put("isSecadm", true);
                }
            } else {
                map.put("errMsg", "用户名和密码不匹配！");
            }
        } catch (Exception e) {
            e.printStackTrace();
            map.put("errMsg", e.getMessage());
        }

        return map;
    }

    /**
     * 获取消息发送者姓名
     * @param request
     * @param response
     * @param session
     */
    @RequestMapping("/querySender")
    public Object querySender(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        String userId = String.valueOf(request.getParameter("sender"));
        UserModel userM = loginService.querySender(userId);
        map.put("userInfo", userM);
        return map;

    }

    /**
     * 获得登录用户信息
     *
     * @return
     */
    @RequestMapping("/loginUserInfo")
    public Object loginUserInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        return session.getAttribute("userSessionItems");
    }
    
    /**
     * 八分钟调用
     *
     * @return
     */
    @RequestMapping("/eightTime")
    public Integer eightTime(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        return 1;
    }

    /**
     * 获得最近联系人
     *
     * @return
     */
    @RequestMapping("/queryLatelyUser")
    public Object queryLatelyUser(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        ApplicationContext applicationContext = SpringUtil.getApplicationContext();
        Resource resource = applicationContext.getResource("classpath:template/home.html");

        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String isRead = "1";
        int page = 1;
        Date startTime = null;
        Date endTime = null;
        // 系统通知
        map.put("count", messageService.querySystemNotification(isRead, startTime, endTime, "system", page, ""));
        // 最近联系人
        map.put("latelyUser", homeService.latelyUser(user.getUserId(), "1", "99999999"));
        //当前登录人
        map.put("loginId", user.getUserId());
        return map;
    }

    /**
     * 获得最近联系人，未读消息数量
     *
     * @return
     */
    @RequestMapping("/queryPrivateUserNum")
    public int queryPrivateUserNum(HttpServletRequest request, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");

        String LINKID=request.getParameter("linkid");
        return messageService.queryPrivateUserMessage(new PrivateMsgModel(LINKID, user.getUserId(), "0"));
    }

    /**
     * 查询最近联系人或组并查询消息数
     */
    @RequestMapping("/queryLastlyMessageByUserId")
    public Map queryLastlyMessageByUserId(HttpSession session, HttpServletRequest request, String page, String rows) {
        HashMap result = new HashMap();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String textLi = TemplateUtil.readTemplate(request, "com_home_message_li_list");
        List<Map<String, Object>> list = homeService.latelyUser(user.getUserId(), page, rows);
        StringBuffer strBuff = new StringBuffer();
        Iterator<Map<String, Object>> it = list.iterator();
        while (it.hasNext()) {
        	Map<String, Object> m = it.next();
        	List<ATModel> atm = null;
            m.put("LINK_TIME", DateUtil.dateFormat((Date) m.get("LINK_TIME"), "yyyy-MM-dd"));
            if ("group".equals(m.get("TYPE"))) {
                // 组消息
                m.put("HEAD", "/img/group.png");
                m.put("COUNT", messageService.notReadCountZ(user.getUserId(),m.get("LINK_ID").toString()));
                atm = messageService.getAtUser(m.get("ID").toString(), user.getUserId());
                if (atm.size() > 0 && "group".equals(m.get("TYPE"))) {
                	m.put("AT", "「有人@我」");
                } else {
                	m.put("AT", "");
                }
            } else {
                // 用户私人未读消息
                m.put("HEAD", "/userHeadController/showHead?path=" + m.get("HEAD"));

                m.put("COUNT", messageService.queryPrivateUserMessage(new PrivateMsgModel(m.get("LINK_ID").toString(), user.getUserId(), "0")));
                m.put("AT", "");
            }
            m.put("PARM", "'" + m.get("ID").toString() + "', '" + m.get("NAME").toString() + "','" + m.get("TYPE").toString() + "'");
            strBuff.append(TemplateUtil.replaceTemplate(request, textLi, m));
        }
        result.put("html", strBuff.toString());
        result.put("total", homeService.latelyUser(user.getUserId(), "1", "999999").size());
        return result;
    }

    /**
     * 获得最近联系人
     *
     * @return
     */
    @RequestMapping("/queryOrgUser")
    public Object queryOrgUser(boolean noLogUser, HttpSession session, HttpServletRequest request) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String level = request.getParameter("level");
        String inputValue = request.getParameter("inputValue");
        List<OrgUserPageModel> userList = null;
        if (noLogUser) {
            //不包含当前登录用户
            userList = homeService.orgUser(user.getUserId(), level, inputValue);
        } else {
            //全部用户
            userList = homeService.orgUser();
        }


        Map<String, Object> map = new HashMap<>();
        Map<String, List<OrgUserPageModel>> userMap = new HashMap<>(); // <单位id， 单位人员列表>
        Map<String, String> orgMap = new HashMap<>(); // <单位id， 单位名称>
        String orgMapIdList = "";
        String orgMapList = "";
        for (OrgUserPageModel orgUser : userList) {
            if (userMap.containsKey(orgUser.getOrgId())) {
                userMap.get(orgUser.getOrgId()).add(orgUser);
            } else {
                List<OrgUserPageModel> list = new ArrayList<>();
                list.add(orgUser);
                userMap.put(orgUser.getOrgId(), list);
            }
//            if (!orgMap.containsKey(orgUser.getOrgId())) {
//                orgMap.put(orgUser.getOrgId(), orgUser.getOrgName());
//            }
            if (orgMapList.indexOf(orgUser.getOrgName()) == -1) {
            	orgMapIdList += orgUser.getOrgId() + ",";
            	orgMapList += orgUser.getOrgName() + ",";
            }
        }
        
        orgMapIdList = orgMapIdList + "@@";
        orgMapList = orgMapList + "@@";
        map.put("orgUser", userMap);
        map.put("orgMapId", orgMapIdList.replace(",@@", "").replace("@@", ""));
        map.put("orgMap", orgMapList.replace(",@@", "").replace("@@", ""));
        map.put("user", user);
        return map;
    }

    /**
     * 根据密级获取用户
     *
     * @return
     */
    @RequestMapping("/queryOrgUserBylevels")
    public Object queryOrgUserBylevels(boolean noLogUser,String levels, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        List<OrgUserPageModel> userList = null;
        if (noLogUser) {
            //不包含当前登录用户
            userList = homeService.queryOrgUserBylevels(user.getUserId(),levels);
        } else {
            //全部用户
            userList = homeService.orgUser();
        }

        Map<String, Object> map = new HashMap<>();
        Map<String, List<OrgUserPageModel>> userMap = new HashMap<>(); // <单位id， 单位人员列表>
        Map<String, String> orgMap = new HashMap<>(); // <单位id， 单位名称>
        String orgMapIdList = "";
        String orgMapList = "";
        for (OrgUserPageModel orgUser : userList) {
            if (userMap.containsKey(orgUser.getOrgId())) {
                userMap.get(orgUser.getOrgId()).add(orgUser);
            } else {
                List<OrgUserPageModel> list = new ArrayList<>();
                list.add(orgUser);
                userMap.put(orgUser.getOrgId(), list);
            }
//            if (!orgMap.containsKey(orgUser.getOrgId())) {
//                orgMap.put(orgUser.getOrgId(), orgUser.getOrgName());
//            }
            if (orgMapList.indexOf(orgUser.getOrgName()) == -1) {
            	orgMapIdList += orgUser.getOrgId() + ",";
            	orgMapList += orgUser.getOrgName() + ",";
            }
        }
        orgMapIdList = orgMapIdList + "@@";
        orgMapList = orgMapList + "@@";
        map.put("orgUser", userMap);
        map.put("orgMapId", orgMapIdList.replace(",@@", "").replace("@@", ""));
        map.put("orgMap", orgMapList.replace(",@@", "").replace("@@", ""));
        map.put("user", user);
        return map;
    }

    /**
     * 根据密级获取用户
     *
     * @return
     */
    @RequestMapping("/queryOrgUserBylevelsOrgID")
    public Object queryOrgUserBylevelsOrgID(boolean noLogUser,String levels,String orgid, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        List<OrgUserPageModel> userList = null;
        if (noLogUser) {
            //不包含当前登录用户
            userList = homeService.queryOrgUserBylevelsOrgID(user.getUserId(),levels,orgid);
        } else {
            //全部用户
            userList = homeService.orgUser();
        }

        Map<String, Object> map = new HashMap<>();
        Map<String, List<OrgUserPageModel>> userMap = new HashMap<>(); // <单位id， 单位人员列表>
        Map<String, String> orgMap = new HashMap<>(); // <单位id， 单位名称>
        String orgMapIdList = "";
        String orgMapList = "";
        for (OrgUserPageModel orgUser : userList) {
            if (userMap.containsKey(orgUser.getOrgId())) {
                userMap.get(orgUser.getOrgId()).add(orgUser);
            } else {
                List<OrgUserPageModel> list = new ArrayList<>();
                list.add(orgUser);
                userMap.put(orgUser.getOrgId(), list);
            }
//            if (!orgMap.containsKey(orgUser.getOrgId())) {
//                orgMap.put(orgUser.getOrgId(), orgUser.getOrgName());
//            }
            if (orgMapList.indexOf(orgUser.getOrgName()) == -1) {
            	orgMapIdList += orgUser.getOrgId() + ",";
            	orgMapList += orgUser.getOrgName() + ",";
            }
        }
        orgMapIdList = orgMapIdList + "@@";
        orgMapList = orgMapList + "@@";
        map.put("orgUser", userMap);
        map.put("orgMapId", orgMapIdList.replace(",@@", "").replace("@@", ""));
        map.put("orgMap", orgMapList.replace(",@@", "").replace("@@", ""));
        map.put("user", user);
        return map;
    }
    /**
     * 查询树结构
     *
     * @return
     */
    @RequestMapping("/getOrgData")
    public Object getOrgData(HttpServletRequest request,HttpSession session) {
        String noLogUser = request.getParameter("noLogUser");
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String excludeUserId = "";
        if(noLogUser!=null && "true".equals(noLogUser)){
            excludeUserId = user.getUserId();
        }
        List<OrgTreeNodeModel> datas = this.homeService.getOrgData(excludeUserId);
        return datas;
    }
    /**
     * 查询树结构
     *
     * @return
     */
    @RequestMapping("/getOrgDataByUserName")
    public Object getOrgDataByUserName(HttpServletRequest request,HttpSession session) {
        String noLogUser = request.getParameter("noLogUser");
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String excludeUserId = "";
        if(noLogUser!=null && "true".equals(noLogUser)){
            excludeUserId = user.getUserId();
        }
        String userName = request.getParameter("userName");
        List<OrgTreeNodeModel> datas = this.homeService.getOrgDataByUserName(excludeUserId,userName);
        return datas;
    }
    @RequestMapping("/getUserDataByPid")
    public Object getUserDataByPid(HttpServletRequest request,HttpSession session) {
        String noLogUser = request.getParameter("noLogUser");
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String excludeUserId = "";
        if(noLogUser!=null && "true".equals(noLogUser)){
            excludeUserId = user.getUserId();
        }
        String pid = request.getParameter("pid");
        List<OrgTreeNodeModel> datas = this.homeService.getUserDataByPid(pid,excludeUserId);
        for(OrgTreeNodeModel node:datas){
            node.setIsLeaf(true);
        }
        return datas;
    }
    @RequestMapping("/getOrgDataByPid")
    public Object getOrgDataByPid(HttpServletRequest request,HttpSession session) {
        String pid = request.getParameter("pid");
        if(pid == null || "".equals(pid)){
            pid = "0000";
        }
        List<OrgTreeNodeModel> datas = this.homeService.getOrgDataByPid(pid);
        for(OrgTreeNodeModel node:datas){
            node.setIsLeaf(false);
        }
        return datas;
    }

    /**
     * 根据密级和部门获取用户
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/getALLUserByOrg")
    public Object getALLUserByOrg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String orgId = request.getParameter("orgId");
        String levels = request.getParameter("levels");
        return homeService.getALLUserByOrg(user.getUserId(), orgId, levels);
    }


    /**
     * 获得用户所在所有讨论组
     *
     * @return
     */
    @RequestMapping("/queryGroup")
    public Object queryGroup(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String level = user.getLevels();
        return homeService.groupByUserId(user.getUserId(), level);
    }

    /**
     * 获得用户所在所有讨论组
     *
     * @return
     */
    @RequestMapping("/queryGroupForNew")
    public Object queryGroupForNew(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        return homeService.groupByUserIdNew(user.getUserId());
    }
    
    /**
     * queryGandPp
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/queryGandP")
    public Object queryGandP(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	return homeService.queryGandP(request.getParameter("name"));
    }

    /**
     * 查询近期系统通知
     *
     * @return
     */
    @RequestMapping("/querySystemNotification")
    public Object querySystemNotification(HttpServletRequest request, HttpServletResponse response,
                                          HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        //String title = request.getParameter("title");
        //String startTimeStr = request.getParameter("startTime");
        //String endTimeStr = request.getParameter("endTime");
        String pageStr = request.getParameter("page");
        int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);

        Date startTime = null;
        Date endTime = null;
        String isRead = "1";
        String userId = user.getUserId();
        map.put("value", messageService.querySystemNotification(isRead, startTime, endTime, "system", page, userId));
        map.put("loginId", userId);
        return map;
    }

    /**
     * 获取当前登录人
     *
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/getNewPersonName")
    public Object getNewPersonName(HttpServletRequest request, HttpServletResponse response,
                                   HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        map.put("userId", user.getAccount());
        map.put("Id", user.getUserId());
        map.put("fullName", user.getFullname());
        map.put("userLevel", user.getLevels());
        map.put("headPath", user.getHead());
        return map;
    }

    /**
     * 获得近期消息
     *
     * @return
     */
    @RequestMapping("/queryLatelyMsg")
    public Object queryLatelyMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String chatUserId = request.getParameter("id");
        String chatType = request.getParameter("type");

        map.put("msgList", messageService.queryLatelyMsg(user.getUserId(), chatUserId, chatType));
        map.put("userId", user.getUserId());
        return map;
    }

    /**
     * 获取全部组信息
     *
     * @return
     */
    @RequestMapping("/queryAllHisGroupMsg")
    public Object queryAllHisGroupMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String msg = request.getParameter("msg");
        String groupId = request.getParameter("groupId");

        map.put("msgList", messageService.queryAllHisGroupMsg(msg, groupId));
        map.put("userId", user.getUserId());
        return map;
    }

    /**
     * 保存回复信息
     *
     * @return
     */
    @RequestMapping("/addReMsg")
    public Object addReMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String remsg = request.getParameter("remsg");
        String pid = request.getParameter("pid");
        String msgReceiver = request.getParameter("msgReceiver");
        ReModel re = new ReModel();
        re.setReId(MyUUID.getUUID());
        re.setReMsg(remsg);
        re.setRePerson(user.getUserId());
        re.setPid(pid);
        re.setMsgReceiver(msgReceiver);
        messageService.addReMsg(re);
        map.put("success", true);
        return map;
    }

    /**
     * 保存回复信息
     *
     * @return
     */
    @RequestMapping("/queryReMsg")
    public Object queryReMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        map.put("reMsgList", messageService.queryReMsg());
        return map;
    }

    /**
     * 加载更多
     *
     * @return
     */
    @RequestMapping("/loadMsg")
    public Object loadMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String chatUserId = request.getParameter("receiverId");
        String chatType = request.getParameter("chatType");
        String nowMsgNum = request.getParameter("nowMsgNum");

        map.put("msgList", messageService.queryMoreMsg(user.getUserId(), chatUserId,
                Integer.valueOf(StringUtils.isEmpty(nowMsgNum) ? "0" : nowMsgNum), chatType));
        map.put("userId", user.getUserId());
        return map;
    }

    /**
     * 获得用户信息
     *
     * @return
     */
    @RequestMapping("/queryUserInfo")
    public Object queryUserInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String userIdStr = request.getParameter("userId");
        if (StringUtils.isEmpty(userIdStr)) {
            return false;
        }
        return homeService.queryUserInfo(String.valueOf(userIdStr));
    }

    /**
     * 加载科室员工
     *
     * @return
     */
    @RequestMapping("/queryClassUser")
    public Object loadClassUser(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String orgId = request.getParameter("orgId");
        if (StringUtils.isEmpty(orgId)) {
            return false;
        }
        map.put("classUser", homeService.queryClassUser(orgId));
        map.put("loginUserId", user.getUserId());
        return map;
    }

    /**
     * 查询联系人
     *
     * @return
     */
    @RequestMapping("/getUserByName")
    public Object getUserByName(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
    	Map<String, Object> map = new HashMap<>();
    	UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String name = request.getParameter("name");
        if (StringUtils.isEmpty(name)) {
            return false;
        }
        map.put("userList", homeService.getUserByName(name));
        map.put("groupList", homeService.getGroupByName(user.getUserId(), name));
        return map;
    }
    
    /**
     * 标记消息为已读
     */
    @RequestMapping("/readMsg")
    public Object readMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String type = request.getParameter("type");
        String msgId = request.getParameter("msgId");
        String chatId = request.getParameter("chatId");
        messageService.readMsg(msgId, user.getUserId(), chatId, type);
        return true;
    }

    /**
     * 获得未读消息数量
     *
     * @return
     */
    @RequestMapping("/notReadCount")
    public Object notReadCount(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String type = request.getParameter("type");
//		System.out.println("messageService.notReadCount(type, user.getUserId())====" + messageService.notReadCount(type, user.getUserId()));
        return messageService.notReadCount(type, user.getUserId());
    }

    /**
     * 获得未读消息数量-忠
     *
     * @return
     */
    @RequestMapping("/notReadCountZ")
    public int notReadCountZ(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String senderid = request.getParameter("senderid");
//        System.out.println("messageService.notReadCount(type, user.getUserId())====" + messageService.notReadCountZ(user.getUserId(),senderid));
        return messageService.notReadCountZ(user.getUserId(),senderid);
    }

    /**
     * 查询历史消息记录
     *
     * @return
     */
    @RequestMapping("/queryHiMsg")
    public Object queryHiMsg(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String content = request.getParameter("content");
        String chatType = request.getParameter("chatType");
        String chatId = request.getParameter("chatId");
        String page = request.getParameter("page");
        // String startDateStr = request.getParameter("startDate");
        // String endDateStr = request.getParameter("endDate");

        int startPage = StringUtils.isEmpty(page) ? 1 : Integer.valueOf(page);
        int row = 8;
        Date startDate = null;
        Date endDate = null;
        PageObject pageObject = messageService.queryHiMsg(content, chatType, chatId, user.getUserId(),
                (row * (startPage - 1) + 1), startPage * row, startDate, endDate);
        pageObject.setPage(startPage);

        map.put("pageObject", pageObject);
        map.put("userId", user.getUserId());
        map.put("userName", user.getFullname());
        return map;
    }

    /**
     * 通过文件id获得文件信息
     *
     * @param fileId     :文件id
     * @param uploadType ：文件类型：group，chat
     * @return
     */
    @RequestMapping("/queryFileById")
    public Object queryFileById(String fileId, String uploadType, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        if ("group".contentEquals(uploadType)) {
            map.put("readPath", groupService.queryReadPathById(fileId));
        } else {
            map.put("readPath", messageService.queryFileById(fileId));
        }
        map.put("loginName", user.getFullname());
        return map;
    }

    /**
     * 获得文件信息
     *
     * @param fileId     :文件id
     * @param uploadType ：文件类型：group，chat
     * @return
     */
    @RequestMapping("/queryFile")
    public Object queryFile(String fileId, String uploadType) {
        Map<String, Object> map = new HashMap<>();
        if (uploadType.contentEquals("group")) {
            map.put("path", messageService.qgFlie(fileId));
        } else {
        	map.put("path", messageService.queryFile(fileId));
        }
        return map;
    }

    /**
     * 敏感词过滤
     *
     * @return
     */
    @RequestMapping("/filterSensitiveWord")
    public Map filterSensitiveWord(String msg, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        Map result = new HashMap();
        result.put("msg", messageService.filterSensitiveWord(msg));
        result.put("user", user);
        return result;
    }

    /**
     * 获取项目信息名称和任务名称
     *
     * @param request
     * @param response
     * @param session
     * @throws IOException
     */
    @RequestMapping("/saveProjectJson")
    public void saveProjectJson(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws IOException {
        String fileName = "SavePath";
        String headPath = request.getParameter("headPath");
        String path = request.getParameter("path");
        BufferedWriter writer = null;
        File file = new File(headPath + fileName + ".json");
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
            writer.write(path);
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
     * 接口测试
     * @return
     */
    @RequestMapping("/createTask")
    public Object createTask(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        String taskName = request.getParameter("taskName");
        String taskState = request.getParameter("taskState");
        String taskType = request.getParameter("taskType");
        String path = request.getParameter("path");
        String taskDes = request.getParameter("taskDes");
        String projectName = request.getParameter("projectName");
        String taskId = request.getParameter("taskId");
        String projectId = request.getParameter("projectId");
        String remark = request.getParameter("remark");
        String taskNum = request.getParameter("taskNum");
        Map<String, String> taskMap = new HashMap<String, String>();
        taskMap.put("taskId", taskId);
        taskMap.put("taskName", taskName);
        taskMap.put("taskDes", taskDes);
        taskMap.put("taskState", taskState);
        taskMap.put("taskType", taskType);
        taskMap.put("path", path);
        taskMap.put("attr1", "");
        JSONArray array_test = new JSONArray();
        array_test.add(taskMap);
        JSONObject jsonObject = array_test.getJSONObject(0);
        //获取存放路径
        String fileName = "SavePath";
        String Path = "C:\\path\\" + fileName + ".json";
        String laststr = ReadFile(Path);
        //创建目录
        String paojectPath = laststr + "//" + projectName;
        JSONObject pJson = new JSONObject();
        if (!projectId.isEmpty()) {
            pJson.put("projectId", projectId);
            pJson.put("projectName", projectName);
            pJson.put("remark", remark);
            pJson.put("taskNum", taskNum);
            pJson.put("tasks", array_test);
        } else {
            String proPath = paojectPath.replaceAll("/", "\\\\") + "\\" + projectName + ".json";
            String josnStr = ReadFile(proPath);
            pJson = JSONObject.parseObject(josnStr);
            JSONArray child_array = (JSONArray) pJson.get("tasks");
            child_array.add(jsonObject);
        }
        map.put("projec_tName", projectName);
        map.put("pJson", pJson);
        return map;
    }

    /**
     * 读取本地数据
     * @param path
     * @return
     */
    public String ReadFile(String path) {
        String josnStr = "";
        File file = new File(path);// 打开文件
        BufferedReader reader = null;
        try {
            FileInputStream in = new FileInputStream(file);
            reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));// 读取文件
            String tempString = null;
            while ((tempString = reader.readLine()) != null) {
                josnStr = josnStr + tempString;
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException el) {
                }
            }
        }
        return josnStr;
    }

    /**
     * 删除最近联系人\讨论组
     * @param session
     * @return
     */
    @RequestMapping("/delLink")
    public Object delLink(HttpSession session, String link_id, String type) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        homeService.delLink(user.getUserId(), link_id, type);
        map.put("success", true);
        return map;
    }

    /**
     * 修改用户信息
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/updataUserInfo")
    public Object updataUserInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String phone = request.getParameter("phone");
        String roomid = request.getParameter("roomid");
        homeService.updataUserInfo(user.getUserId(), phone, roomid);
        map.put("success", true);
        return map;
    }
    
    /**
     * 插入被@人员
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/addAtUser")
    public void addAtUser(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        String groupId = request.getParameter("groupId");
        String receiverId = request.getParameter("receiverId");
        ATModel atm = new ATModel();
        atm.setId(MyUUID.getUUID());
        atm.setGroupid(groupId);
        atm.setReceiverid(receiverId);
        messageService.addAtUser(atm);
    }
    
    /**
     * 删除被@人员
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/delAtUser")
    public void delAtUser(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String groupId = request.getParameter("groupId");
        messageService.delAtUser(groupId, user.getUserId());
    }
}
