package com.casic.flatform.controller;

import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.ReportaService;
import com.sun.scenario.effect.impl.sw.sse.SSEBlend_SRC_OUTPeer;
import org.nutz.lang.Encoding;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.*;
import java.net.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static com.casic.flatform.controller.LogController.interfaceUtil;

/**
 * @author 忠
 * @Description
 * @date 2018-12-20 09:03
 */
@RestController
@CrossOrigin
@RequestMapping("/ReportController")
public class ReportController {

    @Autowired
    private ReportaService reportaService;

    @Autowired
    private LogController logController;

    @Value("${report.python}")
    private String python;

    /**
     * h获取星好友信息
     *
     * @param userid ：用户id
     * @return
     */
    @RequestMapping("/starfriends")
    public Object starfriends(String userid) {

        return reportaService.getStarfriends(userid);
    }


    /**
     * 获取最佳团队
     *
     * @param userid ：用户id
     * @return
     */
    @RequestMapping("/getBestTeams")
    public Object getBestTeams(String userid) {

        return reportaService.getStarfriends(userid);
    }

    /**
     * 获取年报
     *
     * @param session ：获取用户id
     * @return
     */
    @RequestMapping("/getReport")
    public Object getReport(HttpSession session) throws IOException {
    	Map<String, Object> map = new HashMap<>();
    	try {
            UserModel user = (UserModel) session.getAttribute("userSessionItems");
            String userid = user.getUserId();
            if (reportaService.getReport(userid).getString("success").equals("error")) {
                System.out.println(userid+"报告生成失败-------->");
                map.put("success", "error");
            }
            else{
                String a = reportaService.getReport(userid).toString();
//                a = URLEncoder.encode(a, "UTF-8").replaceAll("\\+", "%20").replaceAll("%28", "\\(").replaceAll("%29", "\\)").replaceAll("%3B", ";").replaceAll("%40", "@").replaceAll("%23", "\\#").replaceAll("%26", "\\&");
//                String res1 =  reportaService.getReport(userid).toString();
                String res = LogController.interfaceUtil1(python, reportaService.getReport(userid).toString());
                if (res.equals("error")) {
                    System.out.println(userid+"报告生成失败-------->");
                    map.put("success", "error");
                }
                else {
                    System.out.println(userid+"报告生成成功-------->");
                    map.put("success", "success");
                    map.put("userid", userid);
                }
            }
        } catch (Exception e){
            map.put("success", "error");
        }
        return map;
    }
}
