package com.casic.flatform.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.casic.flatform.util.TemplateUtil;

/**
 * 启动页面
 * 
 * @author hanxu
 */
@Controller
@RequestMapping("/comDataController")
public class ComDataController {

	private Logger logger = LoggerFactory.getLogger(ComDataController.class);

	/**
	 * 获取首页工具信息
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/getIndexTaskData")
	@ResponseBody
	public String getIndexTaskData(HttpServletRequest request, HttpServletResponse response) {
		String textLi = TemplateUtil.readTemplate(request, "com_home_tools_li_list");
		
		StringBuffer buffer = new StringBuffer();
		Map<String, Object> map = new HashMap<>();
//		map.put("id", nav.getId());
//		map.put("title", nav.getTitle());
		buffer.append(TemplateUtil.replaceTemplate(request, textLi, map));
		
		return buffer.toString();
	}
	
}
