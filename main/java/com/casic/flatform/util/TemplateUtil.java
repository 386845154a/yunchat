package com.casic.flatform.util;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;

public class TemplateUtil {

	/**
	 * 读取模板内容
	 *
	 * @param request
	 * @param templateName
	 * @return
	 */
	public static String readTemplate(HttpServletRequest request, String templateName) {
		String tplPath = "";
		if (ResourceUtil.getConfigValueByKey("is_dev").equals("false")) {
			String path = ResourceUtil.getConfigValueByKey("uploadFilePath") + "/";
			tplPath = path + "template/tpl/" + templateName + ".tpl";
		} else {
			tplPath = request.getSession().getServletContext().getRealPath("/template/") + "tpl/" + templateName + ".tpl";
		}
		return readTemplate(tplPath);
	}

	public static String readTemplate(String tplPath) {
		String context = "";
		try {
			context = ReadFromFile.readFileByLines(tplPath);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return context;
	}

	public static String readTemplate(File file) {
		String context = "";
		try {
			context = ReadFromFile.readFileByLines(file);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return context;
	}

	/**
	 * 读取模板内容并替换key
	 *
	 * @param request
	 * @param templateName
	 * @param list
	 *            替换字段对应内容 map / list
	 * @return
	 */
	public static String readTemplate(HttpServletRequest request, String templateName, Map<String, Object> map) {
		String context = readTemplate(request, templateName);
		return replaceTemplate(request, context, map);
	}

	public static String replaceTemplate(String context, Map<String, Object> map) {
		return replaceTemplate(null, context, map);
	}

	public static String replaceTemplate(HttpServletRequest request, String context, Map<String, Object> map) {
		if (!map.isEmpty() && map.size() > 0) {
			// 替换模板内容
			for (Entry<String, Object> entry : map.entrySet()) {
				context = context.replaceAll("@" + entry.getKey() + "@", String.valueOf(entry.getValue()));
			}
		}
		return context;
	}

	public static String readTemplate(HttpServletRequest request, String templateName, List<Map<String, Object>> list) {
		String context = readTemplate(request, templateName);
		return replaceTemplate(request, context, list);
	}

	public static String replaceTemplate(HttpServletRequest request, String context, List<Map<String, Object>> list) {
		try {
			if (list != null && list.size() > 0) {
				for (Map<String, Object> map : list) {
					// 替换模板内容
					for (Entry<String, Object> entry : map.entrySet()) {
						context = context.replaceAll("@" + entry.getKey() + "@", String.valueOf(entry.getValue()));
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return context;
	}
}
