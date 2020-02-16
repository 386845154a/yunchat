package com.casic.flatform.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.service.LogService;

@RestController
@RequestMapping("/StatisticsController")
public class StatisticsController {
    @Autowired
    private LogService logService;

    /**
     * 查询日志信息
     * @param request
     * @param response
     * @param session
     * @return
     */
    @RequestMapping("/queryLogin")
    public Object queryLog(HttpServletRequest request, HttpServletResponse response,
                           HttpSession session) {
//        登录信息统计表
        String logdate = request.getParameter("logdate");
        String logtype = request.getParameter("logtype");
        return logService.countLog(logdate,logtype);
    }


    @RequestMapping("/queryToolupload")
    public Object queryToolupload(HttpServletRequest request, HttpServletResponse response,
                           HttpSession session) {
//        工具商城统计表
        String logdate = request.getParameter("logdate");
        String logtype = request.getParameter("logtype");
        return logService.countLog("201811","login");
    }


    @RequestMapping("/queryCreateDiscuss")
    public Object queryCreateDiscuss(HttpServletRequest request, HttpServletResponse response,
                                  HttpSession session) {
//        研讨组创建数据统计
        String logdate = request.getParameter("logdate");
        String logtype = request.getParameter("logtype");
        return logService.countLog("201811","login");
    }

    @RequestMapping("/queryDiscussfile")
    public Object queryDiscussfile(HttpServletRequest request, HttpServletResponse response,
                                     HttpSession session) {
//        研讨组文件交互记录
        String logdate = request.getParameter("logdate");
        String logtype = request.getParameter("logtype");
        return logService.countLog("201811","login");
    }

    @RequestMapping("/orgLogin")
    public Object orgLogin(HttpServletRequest request, HttpServletResponse response,
                                   HttpSession session) {

        String logdate = request.getParameter("logdate");
        String logtype = request.getParameter("logtype");
        return logService.orgLogin(logdate,logtype);
    }


}
