package com.casic.flatform.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.model.OrgModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.AddressService;
import com.casic.flatform.service.HomeService;
import com.casic.flatform.util.Xml2Json;

/**
 * 用户和科室信息上传
 * @author zouct
 */
@RestController
@RequestMapping("/xmlController")
public class XmlController {

    @Autowired
    private HomeService homeService;
	@Autowired
	private AddressService addressService;

	/**
	 * 用户和科室信息上传
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/addXml")
	public Object addXml(HttpServletRequest request, HttpServletResponse response, HttpSession session)
			throws Exception {
		Map<String, Object> map = new HashMap<>();
		String trueOrFalse = "";
//		String xmlFile = request.getParameter("xmlFile");
		 String xmlFile = "D:/temp/imp/终端维保-模拟测试包11111/123.xml";
		// 解析xml获取文件内容，并转换为json格式
		String xmlStr = Xml2Json.readFile(xmlFile);
		Document doc = DocumentHelper.parseText(xmlStr);
		JSONObject json = new JSONObject();
		json = Xml2Json.xml2Json(xmlStr);
		String saveType = (String) json.get("mdtype");
		System.out.println(saveType);
		if (saveType.equals("User")) {
			System.err.println("用户表");
			JSONObject userJson = new JSONObject();
			userJson = (JSONObject) json.get("data");
			System.out.println(userJson.get("User"));
			JSONObject infoJson = new JSONObject();
			infoJson = (JSONObject) userJson.get("User");
			String userId = (String) infoJson.get("identityNo");//用户ID
			String name = (String) infoJson.get("name");//用户姓名
			String deptCode = (String) infoJson.get("deptCode");//部门ID
			String endFlag = (String) infoJson.get("endFlag");//是否离职
			String level = (String) infoJson.get("psnSecretLevelCode");//用户等级
			String pictures = (String) infoJson.get("xh");//用户排序
			Integer picture = Integer.valueOf(pictures);
			String levels = "1";
			switch (level) {
			case "60":
				levels = "1";
				break;
			case "65":
				levels = "2";
				break;
			case "70":
				levels = "3";
				break;
			case "80":
				levels = "4";
				break;
			case "90":
				levels = "4";
				break;
			default:
				levels = "1";
				break;
			}
			try {
				UserModel user = homeService.queryUserInfo(userId);
				if (user == null) {
					if (endFlag.equals("0")) {
						addressService.createUser(userId, name, deptCode, endFlag, "0", levels, picture);
						System.out.println("增加人员"+name);
					} else {
						trueOrFalse = "true";
					}
				} else {
//					if (endFlag.equals("0")) {
						addressService.updateUser(userId, name, deptCode, endFlag, "0", levels, picture);
						System.out.println("更新人员"+name);
//					} else {
//						addressService.delUser(userId);
//						System.out.println("删除人员"+user.getFullname());
//						trueOrFalse = "true";
//					}
				}
				trueOrFalse = "true";
				map.put("ok", true);
			} catch (Exception ex) {
				ex.printStackTrace();
				trueOrFalse = "false";
				map.put("ok", false);
			}
		} else if (saveType.equals("Organization")) {
			System.err.println("群组表");
			JSONObject orgJson = new JSONObject();
			orgJson = (JSONObject) json.get("data");
			System.out.println(orgJson.get("Organization"));
			JSONObject infoJson = new JSONObject();
			infoJson = (JSONObject) orgJson.get("Organization");
			System.err.println(infoJson.get("orgName"));
			String orgId = (String) infoJson.get("orgCode");
			String orgName = (String) infoJson.get("orgName");
			Long orgSupId = (long) 1000;
			try {
				OrgModel orgInfo = addressService.getOrgById(orgId);
				if (orgInfo == null) {
					addressService.createOrg(orgId, orgName, orgSupId);
				} else {
					addressService.updateOrg(orgId, orgName, orgSupId);
				}
				trueOrFalse = "true";
				map.put("ok", true);
			} catch (Exception ex) {
				ex.printStackTrace();
				trueOrFalse = "false";
				map.put("ok", false);
			}
		}
		return trueOrFalse;
	}
}
