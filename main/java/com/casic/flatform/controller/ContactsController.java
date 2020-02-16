package com.casic.flatform.controller;

import com.casic.flatform.model.PrivateMsgModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.GroupService;
import com.casic.flatform.service.HomeService;
import com.casic.flatform.service.MessageService;
import com.casic.flatform.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 联系人
 */
@RestController
@RequestMapping("/contacts")
public class ContactsController {

    @Autowired
    private HomeService homeService;
    @Autowired
    private MessageService messageService;
    @Autowired
    private GroupService groupService;

    /**
     * 查询最近联系人或组并查询消息数
     */
    @RequestMapping("/queryLastlyMessageByUserId")
    public Map queryLastlyMessageByUserId(HttpSession session, String page, String rows) {
        HashMap result = new HashMap();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        List<Map<String, Object>> list = homeService.latelyUser(user.getUserId(), page, rows);
        list.forEach(m -> {
            m.put("LINK_TIME", DateUtil.dateFormat((Date) m.get("LINK_TIME"), "yyyy-MM-dd"));
            if ("group".equals(m.get("TYPE"))) {
                // 组消息
                m.put("HEAD", "/img/group.png");
            } else {
                // 用户私人未读消息
                m.put("HEAD", "/userHeadController/showHead?path=" + m.get("HEAD"));
                m.put("count", messageService.queryPrivateUserMessage(new PrivateMsgModel(m.get("LINK_ID").toString(), user.getUserId(), "0")));
            }
        });
        result.put("recentlyMessage", list);
        return result;
    }

    /**
     * 加载科室员工
     *
     * @return
     */
    @RequestMapping("/queryDepartmentUser")
    public List<UserModel> loadClassUser(String orgId) {
        return homeService.queryClassUser(orgId);
    }

    /**
     * 获取群组
     *
     * @param session
     * @return
     */
    @RequestMapping("/queryGroup")
    public List<Map<String, Object>> queryGroup(HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        String level = "4";
        return homeService.groupByUserId(user.getUserId(), level);
    }

    /**
     * 关键字过滤
     * @param msg
     * @return
     */
    @RequestMapping("/keywordFilter")
    public String messageFilter(String msg) {
        return messageService.filterSensitiveWord(msg);
    }

    /**
     * 模糊查询组、最近联系人、联系人
     * @param keyword
     * @param session
     * @return
     */
    @RequestMapping("/queryUserByKeyword")
    public Map queryUserByKeyword(String keyword, HttpSession session) {
        Map result = new HashMap();
        UserModel user = (UserModel) session.getAttribute("userSessionItems");
        //群组
        List<Map<String, Object>> group = groupService.queryGroupByUserAndGroupName(user.getUserId(), keyword);
        //最近
        List<Map<String, Object>> lastUserAndGroup = homeService.latelyUser(user.getUserId(), "1", "2");
        //联系人
        List<UserModel> contacts =  homeService.getUserByName(keyword);
        result.put("contacts", contacts);
        result.put("lastUserAndGroup", lastUserAndGroup);
        result.put("group", group);
        return result;
    }

}
