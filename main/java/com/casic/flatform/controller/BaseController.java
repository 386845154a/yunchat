package com.casic.flatform.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.util.StringUtils;

public class BaseController {

	
	protected String getStringParameter(HttpServletRequest request, String name) {
		return request.getParameter(name);
	}
	
	protected Long getLongParameter(HttpServletRequest request, String name) {
		String value = this.getStringParameter(request, name);
		if (StringUtils.isEmpty(value)) {
			return null;
		}else {
			return Long.valueOf(value);
		}
	}
	
	protected Long getLongParameter(HttpServletRequest request, String name, Long def) {
		String value = this.getStringParameter(request, name);
		if (StringUtils.isEmpty(value)) {
			return def;
		}else {
			return Long.valueOf(value);
		}
	}
	
	
	protected Integer getIntegerParameter(HttpServletRequest request, String name) {
		String value = this.getStringParameter(request, name);
		if (StringUtils.isEmpty(value)) {
			return null;
		}else {
			return Integer.valueOf(value);
		}
	}
	
	protected Integer getIntegerParameter(HttpServletRequest request, String name, Integer def) {
		String value = this.getStringParameter(request, name);
		if (StringUtils.isEmpty(value)) {
			return def;
		}else {
			return Integer.valueOf(value);
		}
	}
}
