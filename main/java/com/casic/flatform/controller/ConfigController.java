package com.casic.flatform.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.ConfigModel;
import com.casic.flatform.service.ConfigService;

@RestController
@RequestMapping("/configController")
public class ConfigController {
	
	@Autowired
    private ConfigService configService;
	
	/**
	 * 获取客户端版本
	 * @param request
	 * @param response
	 * @return
	 * @throws ParseException 
	 */
	@RequestMapping("/getVersionVal")
	@ResponseBody
	public Object getVersionVal(HttpServletRequest request, HttpServletResponse response) throws ParseException {
		Map<String, Object> map = new HashMap<>();
		ConfigModel configModel = configService.getVersionVal(request.getParameter("configName"));
		if (configModel.getConfigName().equals("wh")) {
			String startOrEnd = configModel.getConfigValue();
			String startTime = startOrEnd.split(",")[0];
			String endTime = startOrEnd.split(",")[1];
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date sTime = sdf.parse(startTime);
			Date eTime = sdf.parse(endTime);
			map.put("isIn", isEffectiveDate(new Date(),sTime,eTime));
		}
		map.put("model", configModel);
		return map;
	}
	
	/**
	 * 获取客户端版本
	 * @param request
	 * @param response
	 * @return
	 * @throws ParseException 
	 */
	@RequestMapping("/getLink")
	@ResponseBody
	public Object getLink(HttpServletRequest request, HttpServletResponse response) throws ParseException {
		return configService.getLink(request.getParameter("type"));
	}

	private boolean isEffectiveDate(Date nTime, Date sTime, Date eTime) {
		if (nTime.getTime() == sTime.getTime() || nTime.getTime() == eTime.getTime()) {
			return true;
		}
		Calendar date = Calendar.getInstance();
		date.setTime(nTime);
		Calendar begin = Calendar.getInstance();
		begin.setTime(sTime);
		Calendar end = Calendar.getInstance();
		end.setTime(eTime);
		if (date.after(begin) && date.before(end)) {
			return true;
		} else {
			return false;
		}
	}

}
