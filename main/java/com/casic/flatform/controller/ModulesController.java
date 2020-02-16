package com.casic.flatform.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * modules控制类
 */
@Controller
@RequestMapping("/modules")
public class ModulesController {

	@RequestMapping("/openPath")
	public ModelAndView openPath(HttpServletRequest request, HttpServletResponse resp) {
		String path = request.getParameter("path");
		try {
			return new ModelAndView("manager/" + path);
		}catch(Exception ex) {
			System.out.println("跳转页面出错：" + ex.getMessage());
		}
		return new ModelAndView("manager/error");
	}

	
}
